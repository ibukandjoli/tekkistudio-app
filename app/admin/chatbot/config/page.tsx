// app/admin/chatbot/config/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Loader2, Plus, Trash, Save, RefreshCw } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import { toast } from 'sonner';

interface ChatbotConfig {
  id: string;
  initial_suggestions: string[];
  welcome_message: string;
  human_trigger_phrases: string[];
  prompt_boost: string;
  created_at: string;
  updated_at: string;
}

interface CommonQuestion {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  created_at: string;
}

function ChatbotConfigPage() {
  const [config, setConfig] = useState<ChatbotConfig>({
    id: '',
    initial_suggestions: [],
    welcome_message: '',
    human_trigger_phrases: [],
    prompt_boost: '',
    created_at: '',
    updated_at: ''
  });
  
  const [commonQuestions, setCommonQuestions] = useState<CommonQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState<Omit<CommonQuestion, 'id' | 'created_at'>>({
    question: '',
    answer: '',
    category: 'general',
    is_active: true
  });
  
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfigAndQuestions();
  }, []);

  const fetchConfigAndQuestions = async () => {
    try {
      setLoading(true);
      
      // Fetch chatbot configuration
      const { data: configData, error: configError } = await supabase
        .from('chatbot_config')
        .select('*')
        .single();
      
      if (configError && configError.code !== 'PGRST116') {
        // PGRST116 est l'erreur "no rows returned" - si c'est le cas, on va créer une config
        console.error('Erreur lors du chargement de la configuration:', configError);
        toast.error('Erreur lors du chargement de la configuration');
      } else if (configData) {
        setConfig(configData);
      }
      
      // Fetch common questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('chatbot_common_questions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (questionsError) {
        console.error('Erreur lors du chargement des questions:', questionsError);
        toast.error('Erreur lors du chargement des questions fréquentes');
      } else if (questionsData) {
        setCommonQuestions(questionsData);
      }
      
    } catch (error) {
      console.error('Erreur générale:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    try {
      setSaving(true);
      
      // Mise à jour ou création de la configuration
      let response;
      if (config.id) {
        // Mise à jour
        response = await supabase
          .from('chatbot_config')
          .update({
            initial_suggestions: config.initial_suggestions,
            welcome_message: config.welcome_message,
            human_trigger_phrases: config.human_trigger_phrases,
            prompt_boost: config.prompt_boost,
            updated_at: new Date().toISOString()
          })
          .eq('id', config.id);
      } else {
        // Création
        response = await supabase
          .from('chatbot_config')
          .insert([{
            initial_suggestions: config.initial_suggestions,
            welcome_message: config.welcome_message,
            human_trigger_phrases: config.human_trigger_phrases,
            prompt_boost: config.prompt_boost
          }]);
      }
      
      if (response.error) throw response.error;
      
      toast.success('Configuration sauvegardée avec succès');
      await fetchConfigAndQuestions(); // Rafraîchir les données
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const saveNewQuestion = async () => {
    try {
      setSaving(true);
      
      if (!newQuestion.question || !newQuestion.answer) {
        toast.error('La question et la réponse sont requises');
        return;
      }
      
      const { error } = await supabase
        .from('chatbot_common_questions')
        .insert([newQuestion]);
      
      if (error) throw error;
      
      toast.success('Question ajoutée avec succès');
      setNewQuestion({
        question: '',
        answer: '',
        category: 'general',
        is_active: true
      });
      
      await fetchConfigAndQuestions(); // Rafraîchir les questions
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la question:', error);
      toast.error('Erreur lors de l\'ajout de la question');
    } finally {
      setSaving(false);
    }
  };

  const updateQuestionStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('chatbot_common_questions')
        .update({ is_active: isActive })
        .eq('id', id);
      
      if (error) throw error;
      
      // Mettre à jour localement
      setCommonQuestions(prevQuestions => 
        prevQuestions.map(q => 
          q.id === id ? { ...q, is_active: isActive } : q
        )
      );
      
      toast.success('Statut mis à jour');
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('chatbot_common_questions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Mettre à jour localement
      setCommonQuestions(prevQuestions => 
        prevQuestions.filter(q => q.id !== id)
      );
      
      toast.success('Question supprimée');
      
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  // Gestionnaire pour les suggestions initiales
  const handleSuggestionChange = (index: number, value: string) => {
    const newSuggestions = [...config.initial_suggestions];
    newSuggestions[index] = value;
    setConfig(prev => ({ ...prev, initial_suggestions: newSuggestions }));
  };

  const addSuggestion = () => {
    setConfig(prev => ({ 
      ...prev, 
      initial_suggestions: [...prev.initial_suggestions, '']
    }));
  };

  const removeSuggestion = (index: number) => {
    const newSuggestions = [...config.initial_suggestions];
    newSuggestions.splice(index, 1);
    setConfig(prev => ({ ...prev, initial_suggestions: newSuggestions }));
  };

  // Gestionnaire pour les phrases déclenchant l'assistance humaine
  const handleTriggerPhraseChange = (index: number, value: string) => {
    const newPhrases = [...config.human_trigger_phrases];
    newPhrases[index] = value;
    setConfig(prev => ({ ...prev, human_trigger_phrases: newPhrases }));
  };

  const addTriggerPhrase = () => {
    setConfig(prev => ({ 
      ...prev, 
      human_trigger_phrases: [...prev.human_trigger_phrases, '']
    }));
  };

  const removeTriggerPhrase = (index: number) => {
    const newPhrases = [...config.human_trigger_phrases];
    newPhrases.splice(index, 1);
    setConfig(prev => ({ ...prev, human_trigger_phrases: newPhrases }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0f4c81]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#0f4c81]">
            Configuration du chatbot
          </h2>
          <p className="text-gray-500">
            Personnalisez le comportement et les réponses du chatbot
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchConfigAndQuestions} 
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
          <Button 
            onClick={saveConfig} 
            disabled={saving} 
            className="bg-[#ff7f50] flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Enregistrer les modifications
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Paramètres généraux</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="questions">Questions fréquentes</TabsTrigger>
          <TabsTrigger value="advanced">Paramètres avancés</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configurez les paramètres de base du chatbot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="welcome_message">Message de bienvenue</Label>
                <Textarea
                  id="welcome_message"
                  value={config.welcome_message}
                  onChange={(e) => setConfig(prev => ({ ...prev, welcome_message: e.target.value }))}
                  placeholder="Bonjour ! Je suis l'assistant virtuel de TEKKI Studio. Comment puis-je vous aider aujourd'hui ?"
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Ce message s'affiche lorsqu'un utilisateur ouvre le chatbot pour la première fois.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suggestions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Suggestions initiales</CardTitle>
                <CardDescription>
                  Questions suggérées affichées au début de la conversation
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addSuggestion}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {config.initial_suggestions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
                    Aucune suggestion initiale. Cliquez sur "Ajouter" pour en créer.
                  </div>
                ) : (
                  config.initial_suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={suggestion}
                        onChange={(e) => handleSuggestionChange(index, e.target.value)}
                        placeholder="Ex: Comment puis-je vous aider aujourd'hui ?"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSuggestion(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>Questions fréquentes</CardTitle>
              <CardDescription>
                Ajoutez des réponses prédéfinies aux questions courantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Formulaire d'ajout */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium">Ajouter une nouvelle question</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new_question">Question</Label>
                    <Input
                      id="new_question"
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="Ex: Comment fonctionne l'accompagnement de 2 mois ?"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new_answer">Réponse</Label>
                    <Textarea
                      id="new_answer"
                      value={newQuestion.answer}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, answer: e.target.value }))}
                      placeholder="Ex: Notre accompagnement de 2 mois comprend..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new_category">Catégorie</Label>
                    <select
                      id="new_category"
                      value={newQuestion.category}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="general">Général</option>
                      <option value="business">Business</option>
                      <option value="formation">Formation</option>
                      <option value="service">Service</option>
                    </select>
                  </div>
                  
                  <Button
                    onClick={saveNewQuestion}
                    disabled={saving}
                    className="bg-[#0f4c81]"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Ajouter la question
                  </Button>
                </div>
                
                {/* Liste des questions existantes */}
                <div className="space-y-4">
                  <h3 className="font-medium">Questions existantes</h3>
                  
                  {commonQuestions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
                      Aucune question enregistrée
                    </div>
                  ) : (
                    commonQuestions.map((q) => (
                      <div key={q.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{q.question}</h4>
                          <div className="flex space-x-2">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={q.is_active}
                                onCheckedChange={(checked) => updateQuestionStatus(q.id, checked)}
                              />
                              <Label className="text-xs">{q.is_active ? 'Actif' : 'Inactif'}</Label>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteQuestion(q.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{q.answer}</p>
                        <div className="text-xs text-gray-500">
                          Catégorie: <span className="font-medium">{q.category}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres avancés</CardTitle>
              <CardDescription>
                Configuration avancée du comportement du chatbot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt_boost">Amélioration du prompt</Label>
                  <Textarea
                    id="prompt_boost"
                    value={config.prompt_boost}
                    onChange={(e) => setConfig(prev => ({ ...prev, prompt_boost: e.target.value }))}
                    placeholder="Instructions supplémentaires pour l'IA..."
                    rows={5}
                  />
                  <p className="text-xs text-gray-500">
                    Instructions supplémentaires ajoutées au prompt système. Utilisez ce champ pour affiner le comportement de l'IA.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label>Phrases déclenchant une assistance humaine</Label>
                  <div className="space-y-3">
                    {config.human_trigger_phrases.map((phrase, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={phrase}
                          onChange={(e) => handleTriggerPhraseChange(index, e.target.value)}
                          placeholder="Ex: Je veux parler à un humain"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTriggerPhrase(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addTriggerPhrase}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Ajouter une phrase
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Quand un utilisateur inclut ces phrases dans son message, le chatbot suggérera automatiquement de contacter le service client.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withAdminAuth(ChatbotConfigPage);