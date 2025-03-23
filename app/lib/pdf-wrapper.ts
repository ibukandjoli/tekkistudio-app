// app/lib/pdf-wrapper.ts
import pdfParse from 'pdf-parse';

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    // Utilisation directe sans accès aux fichiers test
    const pdfData = await pdfParse(buffer, {
      // Options pour éviter l'accès aux fichiers de test
      max: 0, // Pas de limite de pages
    });
    
    return pdfData.text;
  } catch (error) {
    console.error('Erreur lors de l\'extraction du texte PDF:', error);
    throw error;
  }
}