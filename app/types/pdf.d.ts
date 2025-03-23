// app/types/pdf.d.ts
declare module 'pdfjs-dist/build/pdf' {
    export const getDocument: (source: { data: ArrayBuffer }) => { promise: Promise<PDFDocumentProxy> };
    export interface PDFDocumentProxy {
      numPages: number;
      getPage: (pageNum: number) => Promise<PDFPageProxy>;
    }
    export interface PDFPageProxy {
      getTextContent: () => Promise<PDFTextContent>;
    }
    export interface PDFTextContent {
      items: PDFTextItem[];
      styles?: Record<string, any>;
    }
    export interface PDFTextItem {
      str: string;
      dir?: string;
      transform?: number[];
      width?: number;
      height?: number;
      fontName?: string;
    }
    export const GlobalWorkerOptions: {
      workerSrc: string;
    };
  }
  
  declare module 'pdfjs-dist/build/pdf.worker.entry' {
    const workerSrc: string;
    export default workerSrc;
  }