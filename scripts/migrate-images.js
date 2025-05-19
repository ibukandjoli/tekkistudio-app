// scripts/migrate-images.js (version corrigée)
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("🚫 Variables d'environnement Supabase manquantes");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
    !process.env.CLOUDINARY_API_KEY || 
    !process.env.CLOUDINARY_API_SECRET) {
  console.error("🚫 Variables d'environnement Cloudinary manquantes");
  process.exit(1);
}

// Créer un dossier temporaire pour stocker les images téléchargées
const tempDir = path.join(process.cwd(), 'temp_migration');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Fonction pour télécharger un fichier depuis une URL
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Échec du téléchargement: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(destination);
      });
    }).on('error', (err) => {
      fs.unlink(destination, () => {}); // Nettoyage en cas d'erreur
      reject(err);
    });
  });
}

// Fonction pour extraire le nom de fichier d'une URL
function getFilenameFromUrl(url) {
  return path.basename(new URL(url).pathname);
}

// Fonction pour déterminer si une URL est déjà sur Cloudinary
function isCloudinaryUrl(url) {
  return url && url.includes('res.cloudinary.com');
}

// Fonction principale de migration
async function migrateImages() {
  console.log("🚀 Démarrage de la migration des images Supabase vers Cloudinary");
  
  let totalBusinesses = 0;
  let totalImages = 0;
  let totalMigrated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  
  try {
    // 1. Récupérer tous les business avec leurs images
    console.log("📊 Récupération des business depuis Supabase...");
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('id, images, name, slug');
      
    if (error) throw new Error(`Erreur Supabase: ${error.message}`);
    if (!businesses || businesses.length === 0) {
      console.log("❌ Aucun business trouvé dans la base de données");
      return;
    }
    
    totalBusinesses = businesses.length;
    console.log(`✅ ${totalBusinesses} business récupérés`);
    
    // 2. Pour chaque business, migrer ses images
    for (const business of businesses) {
      console.log(`\n🔄 Traitement du business: ${business.name || business.id}`);
      
      // Normaliser le format des images
      let images = business.images || [];
      if (!Array.isArray(images)) {
        console.log(`⚠️ Format d'images non valide pour le business ${business.id}, passage...`);
        continue;
      }
      
      // Mapper les images au format uniforme
      const normalizedImages = images.map(img => {
        if (typeof img === 'string') {
          return { src: img };
        } else if (img && typeof img === 'object' && 'src' in img) {
          return img;
        }
        return null;
      }).filter(Boolean);
      
      const newImages = [];
      let businessImageCount = 0;
      let businessMigratedCount = 0;
      
      // Traiter chaque image
      for (let i = 0; i < normalizedImages.length; i++) {
        const image = normalizedImages[i];
        businessImageCount++;
        totalImages++;
        
        // Si l'image n'a pas de source, la sauter
        if (!image.src) {
          console.log(`  ⚠️ Image ${i+1} sans source, passage...`);
          newImages.push(image);
          totalSkipped++;
          continue;
        }
        
        // Si c'est déjà une URL Cloudinary, la conserver
        if (isCloudinaryUrl(image.src)) {
          console.log(`  ✓ Image ${i+1} déjà sur Cloudinary, conservation...`);
          newImages.push(image);
          totalSkipped++;
          continue;
        }
        
        try {
          // Générer un nom unique pour le fichier temporaire
          const filename = getFilenameFromUrl(image.src) || `image_${business.id}_${i}.jpg`;
          const tempFilePath = path.join(tempDir, `${Date.now()}_${filename}`);
          
          // Télécharger l'image depuis Supabase
          console.log(`  📥 Téléchargement de l'image ${i+1}...`);
          await downloadFile(image.src, tempFilePath);
          
          // Uploader vers Cloudinary
          console.log(`  📤 Upload vers Cloudinary...`);
          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
              tempFilePath,
              {
                folder: `tekki-studio/businesses/${business.slug || business.id}`,
                resource_type: 'image',
                // Ne pas spécifier format: 'auto' ici - c'est la cause de l'erreur
                quality: 'auto',
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
          });
          
          // Mettre à jour l'URL
          const newImage = { ...image, src: uploadResult.secure_url };
          if (image.alt) newImage.alt = image.alt;
          
          newImages.push(newImage);
          console.log(`  ✅ Image ${i+1} migrée vers Cloudinary: ${uploadResult.secure_url}`);
          
          // Supprimer le fichier temporaire
          fs.unlinkSync(tempFilePath);
          
          businessMigratedCount++;
          totalMigrated++;
        } catch (err) {
          console.error(`  ❌ Erreur lors de la migration de l'image ${i+1}: ${err.message}`);
          newImages.push(image); // Conserver l'original en cas d'erreur
          totalErrors++;
        }
      }
      
      // Mettre à jour le business avec les nouvelles URLs
      try {
        const { error: updateError } = await supabase
          .from('businesses')
          .update({ images: newImages })
          .eq('id', business.id);
          
        if (updateError) {
          throw new Error(`Erreur lors de la mise à jour du business: ${updateError.message}`);
        }
        
        console.log(`📝 Business "${business.name || business.id}" mis à jour: ${businessMigratedCount}/${businessImageCount} images migrées`);
      } catch (updateErr) {
        console.error(`❌ Erreur lors de la mise à jour du business ${business.id}: ${updateErr.message}`);
      }
    }
  } catch (error) {
    console.error(`🚫 Erreur lors de la migration: ${error.message}`);
  } finally {
    // Nettoyer le dossier temporaire
    try {
      fs.rm(tempDir, { recursive: true }, (err) => {
        if (err) {
          console.error(`⚠️ Impossible de nettoyer le dossier temporaire: ${err.message}`);
        } else {
          console.log("🧹 Dossier temporaire nettoyé");
        }
      });
    } catch (cleanupError) {
      console.error(`⚠️ Impossible de nettoyer le dossier temporaire: ${cleanupError.message}`);
    }
    
    // Afficher le résumé
    console.log("\n📊 RÉSUMÉ DE LA MIGRATION 📊");
    console.log(`Business traités: ${totalBusinesses}`);
    console.log(`Images totales: ${totalImages}`);
    console.log(`Images migrées: ${totalMigrated}`);
    console.log(`Images ignorées: ${totalSkipped}`);
    console.log(`Erreurs: ${totalErrors}`);
    
    if (totalErrors > 0) {
      console.log("\n⚠️ Certaines images n'ont pas pu être migrées. Vérifiez les logs pour plus de détails.");
    } else if (totalMigrated > 0) {
      console.log("\n🎉 Migration terminée avec succès !");
    } else {
      console.log("\n🤔 Aucune image n'a été migrée. Soit elles sont déjà sur Cloudinary, soit il n'y a pas d'images à migrer.");
    }
  }
}

// Exécuter la migration
migrateImages().catch(console.error);