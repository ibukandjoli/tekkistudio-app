// app/api/chatbot/extract-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import PdfParse from 'pdf-parse';

// Initialiser le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Taille maximale pour l'extraction de texte (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification de l'administrateur (à implémenter selon votre système d'auth)
    
    // Obtenir le formulaire multipart
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }
    
    // Vérifier le type de fichier
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Seuls les fichiers PDF sont acceptés' },
        { status: 400 }
      );
    }
    
    // Vérifier la taille du fichier
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux. La taille maximale est de 10MB' },
        { status: 400 }
      );
    }
    
    // Convertir le fichier en buffer pour l'analyse
    const buffer = await file.arrayBuffer();
    
    // Analyser le PDF
    const pdfData = await PdfParse(Buffer.from(buffer));
    
    // Nettoyer le texte extrait
    const cleanedText = pdfData.text
      .replace(/\s+/g, ' ')  // Remplacer les espaces multiples par un seul
      .replace(/\n{3,}/g, '\n\n')  // Limiter à 2 sauts de ligne consécutifs
      .trim();
    
    // Télécharger le fichier vers Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `knowledge_base/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('chatbot')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (uploadError) {
      console.error('Erreur lors du téléchargement du fichier:', uploadError);
      return NextResponse.json(
        { error: 'Erreur lors du téléchargement du fichier' },
        { status: 500 }
      );
    }
    
    // Obtenir l'URL publique du fichier
    const { data: urlData } = supabase.storage
      .from('chatbot')
      .getPublicUrl(filePath);
    
    // Mettre à jour la configuration du chatbot
    const { error: configError } = await supabase
      .from('chatbot_config')
      .update({
        knowledge_base_url: urlData.publicUrl,
        knowledge_base_content: cleanedText,
        updated_at: new Date().toISOString()
      })
      .eq('id', formData.get('configId'));
    
    if (configError) {
      console.error('Erreur lors de la mise à jour de la configuration:', configError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de la configuration' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'PDF traité avec succès',
      url: urlData.publicUrl,
      extractedText: cleanedText.substring(0, 1000) + '...',  // Retourne un aperçu
      textLength: cleanedText.length
    });
    
  } catch (error) {
    console.error('Erreur lors du traitement du PDF:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du PDF' },
      { status: 500 }
    );
  }
}