# PROJET : Intégration Webhook pour la Page de Qualification TEKKI

## 1. Objectif
L'interface de chat IA est validée. La dernière étape consiste à capturer les données générées à la fin de l'interview et à les envoyer de manière sécurisée et asynchrone vers un Webhook externe (Make/Integromat).

## 2. Déclencheur (Trigger)
L'envoi des données doit être déclenché **exclusivement** lorsque l'utilisateur a fourni son email et son numéro de téléphone, et que l'Agent IA a généré son message de conclusion. 
Ne pas envoyer de requêtes partielles.

## 3. Nettoyage de la donnée (Crucial)
Avant de construire le JSON, l'application doit :
- Extraire proprement le numéro de téléphone et le formater au format international strict (ex: supprimer les espaces, ajouter le code pays par défaut si omis, type +221 ou +225) car l'API WhatsApp backend plantera si le format est invalide.
- S'assurer que le `pain_point_summary` est une synthèse d'une phrase (via un dernier appel système "caché" à l'API LLM pour résumer la douleur, ou en extrayant un point clé).

## 4. Structure de la Requête POST (Payload JSON)
Faire une requête HTTP POST vers l'URL du Webhook (à configurer en variable d'environnement `NEXT_PUBLIC_MAKE_WEBHOOK_URL`).

```json
{
  "lead_info": {
    "brand_name": "string",
    "niche": "string",
    "contact_email": "string",
    "contact_whatsapp": "string (format: +XXX...)" 
  },
  "business_context": {
    "traction_level": "string",
    "pain_point_hours": "string",
    "pain_point_summary": "string"
  },
  "raw_data": {
    "full_transcript": "array of objects (rôles et messages)",
    "session_duration_seconds": "integer",
    "timestamp": "ISO 8601 string"
  }
}
```

## 5. Gestion de l'UI Post-Envoi
Ne pas recharger la page.

Si le POST est un succès 200 OK, la conversation reste affichée, l'utilisateur peut relire, mais l'input de texte est désactivé (disabled).

Afficher un micro-feedback discret : "Dossier transmis en toute sécurité ✅".



