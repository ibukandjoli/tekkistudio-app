// app/lib/pdf-extractor.ts
import * as pdfjs from 'pdfjs-dist';

// Configuration de PDFJS
if (typeof window === 'undefined') {
  // Configuration côté serveur
  const PDFJSGlobal = pdfjs as any;
  PDFJSGlobal.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

export async function extractTextFromPdf(buffer: ArrayBuffer): Promise<string> {
  try {
    // Charger le PDF avec pdfjs
    const data = new Uint8Array(buffer);
    const loadingTask = pdfjs.getDocument({ data });
    const pdf = await loadingTask.promise;
    
    // Extraire le texte de toutes les pages
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map(item => ('str' in item ? item.str : ''))
        .join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Error extracting PDF:', error);
    throw error;
  }
}