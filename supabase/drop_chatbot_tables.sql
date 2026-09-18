-- chatbot_config, chatbot_common_questions, chatbot_cache, chat_conversion_funnel :
-- le widget TekkiChatbot qui les alimentait a été retiré du code en entier
-- (composant, routes API /api/chatbot, pages admin/chatbot/*). Zéro référence
-- restante dans le codebase pour ces 4 tables au moment de cette suppression.
-- Même logique que business_fallbacks / leads_campagne_beaute / formations :
-- suppression plutôt que verrouillage, puisque rien n'en dépend plus.
DROP TABLE IF EXISTS public.chatbot_config CASCADE;
DROP TABLE IF EXISTS public.chatbot_common_questions CASCADE;
DROP TABLE IF EXISTS public.chatbot_cache CASCADE;
DROP TABLE IF EXISTS public.chat_conversion_funnel CASCADE;
