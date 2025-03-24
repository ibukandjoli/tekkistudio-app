// app/components/global/TekkiChatbot/MessageDisplay.tsx
import React from 'react';

interface MessageDisplayProps {
  content: string;
  type: 'assistant' | 'user';
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ content, type }) => {
  // Fonction auxiliaire pour traiter les URLs ordinaires dans un segment de texte
  const parseUrlsInText = (text: string) => {
    if (!text.includes('http')) return text;
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const segments: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    
    // Réinitialiser le regex pour une nouvelle recherche
    urlRegex.lastIndex = 0;
    
    while ((match = urlRegex.exec(text)) !== null) {
      // Ajouter le texte avant l'URL
      if (match.index > lastIndex) {
        segments.push(text.substring(lastIndex, match.index));
      }
      
      // Ajouter l'URL en tant qu'élément cliquable
      segments.push(
        <a 
          key={`url-${match.index}`} 
          href={match[0]} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#FF7F50] hover:underline font-medium"
        >
          {match[0]}
        </a>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Ajouter le reste du texte après la dernière URL
    if (lastIndex < text.length) {
      segments.push(text.substring(lastIndex));
    }
    
    return <>{segments}</>;
  };

  // Fonction pour traiter le formatage du texte (gras, italique)
  const parseTextFormatting = (text: string): React.ReactNode => {
    // Si pas de formatage, retourner tel quel
    if (!text.includes('**') && !text.includes('*')) {
      return text;
    }

    // Traiter le gras (entouré de **)
    const boldSegments = text.split(/(\*\*[^*]+\*\*)/g);
    
    return (
      <>
        {boldSegments.map((segment, index) => {
          // Si c'est un segment en gras
          if (segment.startsWith('**') && segment.endsWith('**')) {
            const boldText = segment.slice(2, -2);
            return <strong key={index}>{boldText}</strong>;
          }
          
          // Traiter l'italique (entouré de * simple) dans les segments non-gras
          if (segment.includes('*')) {
            const italicSegments = segment.split(/(\*[^*]+\*)/g);
            return (
              <React.Fragment key={index}>
                {italicSegments.map((italicSegment, italicIndex) => {
                  if (italicSegment.startsWith('*') && italicSegment.endsWith('*')) {
                    const italicText = italicSegment.slice(1, -1);
                    return <em key={italicIndex}>{italicText}</em>;
                  }
                  return italicSegment;
                })}
              </React.Fragment>
            );
          }
          
          // Segment normal
          return segment;
        })}
      </>
    );
  };

  // Fonction améliorée pour rendre les liens cliquables
  const parseMessageWithLinks = (text: string) => {
    // Regex pour identifier les liens Markdown de la forme [texte](url)
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    
    // Si aucun lien potentiel détecté, appliquer juste le formatage
    if (!text.includes('http') && !text.includes('[')) {
      return parseTextFormatting(text);
    }

    // Traiter les liens Markdown
    if (text.includes('[') && text.includes('](')) {
      // Diviser le texte en segments (texte normal et liens)
      const segments: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;
      
      // Réinitialiser le regex pour une nouvelle recherche
      markdownLinkRegex.lastIndex = 0;
      
      while ((match = markdownLinkRegex.exec(text)) !== null) {
        // Ajouter le texte avant le lien
        if (match.index > lastIndex) {
          // Traiter ce segment pour les URLs ordinaires et le formatage
          const beforeText = text.substring(lastIndex, match.index);
          segments.push(parseTextFormatting(beforeText));
        }
        
        // Ajouter le lien Markdown en tant qu'élément cliquable
        segments.push(
          <a 
            key={`md-${match.index}`} 
            href={match[2]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#FF7F50] hover:underline font-medium"
          >
            {match[1]}
          </a>
        );
        
        lastIndex = match.index + match[0].length;
      }
      
      // Ajouter le reste du texte après le dernier lien
      if (lastIndex < text.length) {
        segments.push(parseTextFormatting(text.substring(lastIndex)));
      }
      
      return <>{segments}</>;
    }
    
    // Si pas de liens Markdown, traiter les URLs ordinaires et le formatage
    const urlSegments = typeof parseUrlsInText(text) === 'string' 
      ? parseTextFormatting(text)
      : parseUrlsInText(text);
    
    return urlSegments;
  };

  // Fonction pour formater le texte avec des paragraphes et de la mise en forme basique
  const formatMessageText = (text: string) => {
    // Prétraiter les balises HTML qui pourraient être dans le texte
    // Convertir <strong>texte</strong> en **texte**
    text = text.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
    // Convertir <em>texte</em> en *texte*
    text = text.replace(/<em>(.*?)<\/em>/g, '*$1*');
    
    // Diviser le texte en paragraphes (séparés par des lignes vides ou simples)
    const paragraphs = text.split(/\n{1,}/g);
    
    // Formater chaque paragraphe individuellement
    return (
      <>
        {paragraphs.map((paragraph, index) => {
          // Détecter si le paragraphe est une liste à puces
          if (paragraph.trim().startsWith('-') || paragraph.trim().startsWith('*') && !paragraph.trim().startsWith('**')) {
            const listItems = paragraph.split(/\n/).filter(item => item.trim());
            return (
              <ul key={index} className={index > 0 ? "mt-3 list-disc pl-5" : "list-disc pl-5"}>
                {listItems.map((item, itemIndex) => (
                  <li key={itemIndex} className="mb-1">
                    {parseMessageWithLinks(item.replace(/^[*-]\s+/, ''))}
                  </li>
                ))}
              </ul>
            );
          }
          
          // Détecter si le paragraphe est une liste numérotée
          else if (/^\d+\./.test(paragraph.trim())) {
            const listItems = paragraph.split(/\n/).filter(item => item.trim());
            return (
              <ol key={index} className={index > 0 ? "mt-3 list-decimal pl-5" : "list-decimal pl-5"}>
                {listItems.map((item, itemIndex) => (
                  <li key={itemIndex} className="mb-1">
                    {parseMessageWithLinks(item.replace(/^\d+\.\s+/, ''))}
                  </li>
                ))}
              </ol>
            );
          }
          
          // Paragraphe normal
          else if (paragraph.trim()) {
            // Vérifier si c'est un titre (commence par # ou ##)
            if (paragraph.trim().startsWith('##')) {
              return (
                <h3 key={index} className={`font-bold text-lg ${index > 0 ? "mt-4" : ""}`}>
                  {parseMessageWithLinks(paragraph.replace(/^##\s+/, ''))}
                </h3>
              );
            } else if (paragraph.trim().startsWith('#')) {
              return (
                <h2 key={index} className={`font-bold text-xl ${index > 0 ? "mt-4" : ""}`}>
                  {parseMessageWithLinks(paragraph.replace(/^#\s+/, ''))}
                </h2>
              );
            }
            
            // Paragraphe normal avec formatage
            return (
              <p key={index} className={index > 0 ? "mt-3" : ""}>
                {parseMessageWithLinks(paragraph)}
              </p>
            );
          }
          
          // Ligne vide (espacement)
          return <div key={index} className="h-2" />;
        })}
      </>
    );
  };

  // Afficher les messages utilisateur tels quels
  if (type === 'user') {
    return <div className="text-sm">{content}</div>;
  }
  
  // Formater les messages de l'assistant
  return <div className="text-sm">{formatMessageText(content)}</div>;
};

export default MessageDisplay;