// app/admin/chatbot/config/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Loader2, Plus, Trash, Save, RefreshCw, AlertTriangle, Check, HelpCircle } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Badge } from "@/app/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";

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

// Catégories de questions
const questionCategories = [
  { value: "general", label: "Général" },
  { value: "business", label: "Business" },
  { value: "formation", label: "Formation" },
  { value: "service", label: "Service" },
  { value: "technique", label: "Technique" },
  { value: "prix", label: "Prix & Paiement" }
];

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
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [hasChanges, setHasChanges] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<CommonQuestion | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchConfigAndQuestions();
  }, []);

  // Mettre à jour hasChanges lorsque la configuration change
  useEffect(() => {
    if (!loading) {
      setHasChanges(true);
    }
  }, [config]);

  const fetchConfigAndQuestions = async () => {
    try {
      setLoading(true);
      console.log("Tentative de récupération des données de configuration...");
      
      // Fetch chatbot configuration avec journalisation détaillée
      const configRequest = await supabase
        .from('chatbot_config')
        .select('*');
      
      console.log("Résultat de la requête de configuration:", configRequest);
      
      if (configRequest.error) {
        console.error('Erreur lors du chargement de la configuration:', configRequest.error);
        toast.error('Erreur lors du chargement de la configuration: ' + configRequest.error.message);
      } else if (configRequest.data && configRequest.data.length > 0) {
        console.log("Configuration trouvée:", configRequest.data[0]);
        setConfig(configRequest.data[0]);
      } else {
        console.warn("Aucune configuration trouvée, création d'une configuration par défaut");
        setConfig({
          id: '',
          initial_suggestions: [],
          welcome_message: '',
          human_trigger_phrases: [],
          prompt_boost: '',
          created_at: '',
          updated_at: ''
        });
      }
      
      // Fetch common questions avec journalisation détaillée
      console.log("Tentative de récupération des questions fréquentes...");
      const questionsRequest = await supabase
        .from('chatbot_common_questions')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log("Résultat de la requête des questions:", questionsRequest);
      
      if (questionsRequest.error) {
        console.error('Erreur lors du chargement des questions:', questionsRequest.error);
        toast.error('Erreur lors du chargement des questions fréquentes: ' + questionsRequest.error.message);
      } else if (questionsRequest.data) {
        console.log(`${questionsRequest.data.length} questions fréquentes trouvées`);
        setCommonQuestions(questionsRequest.data);
      }
      
      setHasChanges(false);
    } catch (error) {
      console.error('Erreur générale:', error);
      toast.error('Une erreur est survenue: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    try {
      setSaving(true);
      console.log("Tentative de sauvegarde de la configuration:", config);
      
      // Vérifier que les tableaux sont bien initialisés
      const configToSave = {
        ...config,
        initial_suggestions: Array.isArray(config.initial_suggestions) 
          ? config.initial_suggestions 
          : [],
        human_trigger_phrases: Array.isArray(config.human_trigger_phrases) 
          ? config.human_trigger_phrases 
          : [],
        updated_at: new Date().toISOString()
      };
      
      console.log("Configuration à sauvegarder:", configToSave);
      
      // Mise à jour ou création de la configuration
      let response;
      if (config.id) {
        // Mise à jour
        response = await supabase
          .from('chatbot_config')
          .update({
            initial_suggestions: configToSave.initial_suggestions,
            welcome_message: configToSave.welcome_message,
            human_trigger_phrases: configToSave.human_trigger_phrases,
            prompt_boost: configToSave.prompt_boost,
            updated_at: configToSave.updated_at
          })
          .eq('id', config.id);
      } else {
        // Création
        response = await supabase
          .from('chatbot_config')
          .insert([{
            initial_suggestions: configToSave.initial_suggestions,
            welcome_message: configToSave.welcome_message,
            human_trigger_phrases: configToSave.human_trigger_phrases,
            prompt_boost: configToSave.prompt_boost
          }]);
      }
      
      console.log("Réponse de la sauvegarde:", response);
      
      if (response.error) {
        console.error("Erreur détaillée:", response.error);
        throw response.error;
      }
      
      toast.success('Configuration sauvegardée avec succès');
      setLastSaved(new Date().toLocaleTimeString());
      setHasChanges(false);
      await fetchConfigAndQuestions(); // Rafraîchir les données
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveQuestion = async () => {
    try {
      setSaving(true);
      
      if (!newQuestion.question || !newQuestion.answer) {
        toast.error('La question et la réponse sont requises');
        return;
      }
      
      if (isEditing && questionToEdit) {
        // Mise à jour d'une question existante
        const { error } = await supabase
          .from('chatbot_common_questions')
          .update({
            question: newQuestion.question,
            answer: newQuestion.answer,
            category: newQuestion.category,
            is_active: newQuestion.is_active
          })
          .eq('id', questionToEdit.id);
        
        if (error) throw error;
        
        toast.success('Question mise à jour avec succès');
      } else {
        // Ajout d'une nouvelle question
        const { error } = await supabase
          .from('chatbot_common_questions')
          .insert([newQuestion]);
        
        if (error) throw error;
        
        toast.success('Question ajoutée avec succès');
      }
      
      // Réinitialiser le formulaire
      setNewQuestion({
        question: '',
        answer: '',
        category: 'general',
        is_active: true
      });
      
      setIsEditing(false);
      setQuestionToEdit(null);
      
      await fetchConfigAndQuestions(); // Rafraîchir les questions
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout/mise à jour de la question:', error);
      toast.error('Erreur lors de l\'enregistrement de la question');
    } finally {
      setSaving(false);
    }
  };

  const handleEditQuestion = (question: CommonQuestion) => {
    setIsEditing(true);
    setQuestionToEdit(question);
    setNewQuestion({
      question: question.question,
      answer: question.answer,
      category: question.category,
      is_active: question.is_active
    });
    
    // Faire défiler jusqu'au formulaire d'édition
    setTimeout(() => {
      document.getElementById('question-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setQuestionToEdit(null);
    setNewQuestion({
      question: '',
      answer: '',
      category: 'general',
      is_active: true
    });
  };

  const confirmDeleteQuestion = (id: string) => {
    setQuestionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteQuestion = async () => {
    if (!questionToDelete) return;
    
    try {
      const { error } = await supabase
        .from('chatbot_common_questions')
        .delete()
        .eq('id', questionToDelete);
      
      if (error) throw error;
      
      toast.success('Question supprimée avec succès');
      
      // Mettre à jour localement
      setCommonQuestions(prevQuestions => 
        prevQuestions.filter(q => q.id !== questionToDelete)
      );
      
      // Si la question en cours d'édition est supprimée, réinitialiser le formulaire
      if (questionToEdit && questionToEdit.id === questionToDelete) {
        handleCancelEdit();
      }
      
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    } finally {
      setQuestionToDelete(null);
      setIsDeleteDialogOpen(false);
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

  // Gestionnaire pour les suggestions initiales
  const handleSuggestionChange = (index: number, value: string) => {
    const newSuggestions = [...(Array.isArray(config.initial_suggestions) ? config.initial_suggestions : [])];
    newSuggestions[index] = value;
    setConfig(prev => ({ ...prev, initial_suggestions: newSuggestions }));
  };

  const addSuggestion = () => {
    setConfig(prev => ({ 
      ...prev, 
      initial_suggestions: [...(Array.isArray(prev.initial_suggestions) ? prev.initial_suggestions : []), '']
    }));
  };

  const removeSuggestion = (index: number) => {
    const newSuggestions = [...(Array.isArray(config.initial_suggestions) ? config.initial_suggestions : [])];
    newSuggestions.splice(index, 1);
    setConfig(prev => ({ ...prev, initial_suggestions: newSuggestions }));
  };

  // Gestionnaire pour les phrases déclenchant l'assistance humaine
  const addTriggerPhrase = () => {
    try {
      // Si c'est le premier élément, initialiser un tableau vide
      if (!config.human_trigger_phrases || !Array.isArray(config.human_trigger_phrases)) {
        setConfig(prev => ({ 
          ...prev, 
          human_trigger_phrases: []
        }));
      }
      
      // Ajouter un élément vide au tableau
      setConfig(prev => ({ 
        ...prev, 
        human_trigger_phrases: [...(prev.human_trigger_phrases || []), '']
      }));
      
      // Marquer les changements
      setHasChanges(true);
      
      console.log("Phrase déclencheur ajoutée au tableau:", 
                [...(config.human_trigger_phrases || []), '']);
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une phrase déclencheur:", error);
    }
  };

  const handleTriggerPhraseChange = (index: number, value: string) => {
    try {
      // S'assurer que human_trigger_phrases est un tableau
      const currentPhrases = Array.isArray(config.human_trigger_phrases) 
        ? [...config.human_trigger_phrases] 
        : [];
      
      // Mettre à jour la valeur à l'index spécifié
      currentPhrases[index] = value;
      
      // Mettre à jour le state
      setConfig(prev => ({ 
        ...prev, 
        human_trigger_phrases: currentPhrases
      }));
      
      // Marquer les changements
      setHasChanges(true);
      
      console.log("Phrase déclencheur mise à jour:", currentPhrases);
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'une phrase déclencheur:", error);
    }
  };

  const removeTriggerPhrase = (index: number) => {
    try {
      // S'assurer que human_trigger_phrases est un tableau
      const currentPhrases = Array.isArray(config.human_trigger_phrases) 
        ? [...config.human_trigger_phrases] 
        : [];
      
      // Supprimer l'élément à l'index spécifié
      currentPhrases.splice(index, 1);
      
      // Mettre à jour le state
      setConfig(prev => ({ 
        ...prev, 
        human_trigger_phrases: currentPhrases
      }));
      
      // Marquer les changements
      setHasChanges(true);
      
      console.log("Phrase déclencheur supprimée, nouveau tableau:", currentPhrases);
    } catch (error) {
      console.error("Erreur lors de la suppression d'une phrase déclencheur:", error);
    }
  };

  // Filtrer les questions par catégorie
  const filteredQuestions = categoryFilter === 'all' 
    ? commonQuestions 
    : commonQuestions.filter(q => q.category === categoryFilter);

  // Obtenir le nombre de questions par catégorie
  const getCategoryCount = (category: string) => {
    return commonQuestions.filter(q => q.category === category).length;
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
          {lastSaved && (
            <div className="flex items-center text-sm text-gray-500">
              <Check className="h-4 w-4 text-green-500 mr-1" />
              Dernière sauvegarde: {lastSaved}
            </div>
          )}
          
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
            disabled={saving || !hasChanges} 
            className={`flex items-center gap-2 ${!hasChanges ? 'bg-gray-400' : 'bg-[#ff7f50]'}`}
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
          <TabsTrigger value="questions">
            Questions fréquentes 
            <Badge variant="secondary" className="ml-2 bg-[#0f4c81] text-white">
              {commonQuestions.length}
            </Badge>
          </TabsTrigger>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="welcome_message">Message de bienvenue</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p>Ce message s'affiche lorsqu'un utilisateur ouvre le chatbot pour la première fois.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Textarea
                  id="welcome_message"
                  value={config.welcome_message || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, welcome_message: e.target.value }))}
                  placeholder="Bonjour ! Je suis l'assistant virtuel de TEKKI Studio. Comment puis-je vous aider aujourd'hui ?"
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Si aucun message n'est défini, un message par défaut sera utilisé en fonction de l'heure de la journée.
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-end">
              <Button 
                onClick={saveConfig} 
                disabled={saving || !hasChanges} 
                className={`${!hasChanges ? 'bg-gray-400' : 'bg-[#ff7f50]'}`}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Enregistrer
              </Button>
            </CardFooter>
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
                {!config.initial_suggestions || !Array.isArray(config.initial_suggestions) || config.initial_suggestions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
                    Aucune suggestion initiale. Cliquez sur "Ajouter" pour en créer.
                  </div>
                ) : (
                  config.initial_suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={suggestion || ''}
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
              
              <div className="mt-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3">
                  <div className="text-blue-500 mt-1">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700 mb-1">Bonnes pratiques pour les suggestions</h4>
                    <ul className="text-sm text-blue-600 space-y-1 list-disc pl-4">
                      <li>Gardez les suggestions courtes et claires</li>
                      <li>Posez des questions qui reflètent les besoins courants des utilisateurs</li>
                      <li>Incluez des suggestions qui mènent à la conversion (ex: "Je veux acheter un business")</li>
                      <li>Limitez-vous à 4-5 suggestions maximum pour ne pas surcharger l'interface</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-end">
              <Button 
                onClick={saveConfig} 
                disabled={saving || !hasChanges} 
                className={`${!hasChanges ? 'bg-gray-400' : 'bg-[#ff7f50]'}`}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Enregistrer
              </Button>
            </CardFooter>
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
                {/* Formulaire d'ajout/édition */}
                <div id="question-form" className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium flex items-center">
                    {isEditing ? 'Modifier une question' : 'Ajouter une nouvelle question'}
                    {isEditing && (
                      <Badge className="ml-2 bg-blue-500">Édition</Badge>
                    )}
                  </h3>
                  
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
                      rows={5}
                    />
                    <p className="text-xs text-gray-500">
                      Vous pouvez utiliser le format markdown pour les liens: [texte du lien](URL)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new_category">Catégorie</Label>
                    <Select
                      value={newQuestion.category}
                      onValueChange={(value) => setNewQuestion(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Catégories</SelectLabel>
                          {questionCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={newQuestion.is_active}
                      onCheckedChange={(checked) => setNewQuestion(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="is_active">Question active</Label>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button
                      onClick={handleSaveQuestion}
                      disabled={saving || !newQuestion.question || !newQuestion.answer}
                      className="bg-[#0f4c81]"
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {isEditing ? 'Mettre à jour' : 'Ajouter la question'}
                    </Button>
                    
                    {isEditing && (
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        Annuler l'édition
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Filtres pour les questions existantes */}
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Questions existantes ({filteredQuestions.length})</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Filtrer par catégorie:</span>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Toutes les catégories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        {questionCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label} ({getCategoryCount(category.value)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Liste des questions existantes */}
                <div className="space-y-4">
                  {filteredQuestions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
                      {categoryFilter === 'all' 
                        ? 'Aucune question enregistrée' 
                        : 'Aucune question dans cette catégorie'}
                    </div>
                  ) : (
                    filteredQuestions.map((q) => (
                      <div key={q.id} className="border rounded-lg p-4 space-y-2 transition-all hover:shadow-md">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{q.question}</h4>
                            <Badge className={`${q.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {q.is_active ? 'Actif' : 'Inactif'}
                            </Badge>
                            <Badge variant="outline" className="bg-gray-50">
                              {questionCategories.find(cat => cat.value === q.category)?.label || q.category}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={q.is_active}
                                onCheckedChange={(checked) => updateQuestionStatus(q.id, checked)}
                              />
                              <span className="text-xs">{q.is_active ? 'Actif' : 'Inactif'}</span>
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  ⋯
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleEditQuestion(q)}>
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => confirmDeleteQuestion(q.id)}
                                  className="text-red-600"
                                >
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm whitespace-pre-wrap">{q.answer}</p>
                        <div className="text-xs text-gray-500">
                          Ajoutée: {new Date(q.created_at).toLocaleDateString()}
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="prompt_boost">Amélioration du prompt</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p>Instructions supplémentaires pour l'IA. Ce texte sera ajouté au prompt système pour affiner le comportement du chatbot.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Textarea
                    id="prompt_boost"
                    value={config.prompt_boost || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, prompt_boost: e.target.value }))}
                    placeholder="Instructions supplémentaires pour l'IA..."
                    rows={5}
                  />
                  <div className="p-3 bg-amber-50 rounded border border-amber-100 mt-2">
                    <div className="flex gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-amber-800 font-medium">Utilisation avancée</p>
                        <p className="text-xs text-amber-700 mt-1">
                          Ces instructions seront ajoutées directement au prompt système de l'IA. 
                          Utilisez ce champ avec précaution. Des instructions contradictoires 
                          peuvent dégrader la qualité des réponses.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Phrases déclenchant une assistance humaine</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p>Quand un utilisateur inclut ces phrases dans son message, le chatbot suggérera automatiquement de contacter le service client.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="space-y-3">
                    {!config.human_trigger_phrases || !Array.isArray(config.human_trigger_phrases) || config.human_trigger_phrases.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 border border-dashed rounded-lg">
                        Aucune phrase déclencheur. Cliquez sur "Ajouter une phrase" pour en créer.
                      </div>
                    ) : (
                      config.human_trigger_phrases.map((phrase, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={phrase || ''}
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
                      ))
                    )}
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
                    Exemples: "parler à un humain", "contacter le service client", "parler à un conseiller"
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-end">
              <Button 
                onClick={saveConfig} 
                disabled={saving || !hasChanges} 
                className={`${!hasChanges ? 'bg-gray-400' : 'bg-[#ff7f50]'}`}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Enregistrer
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogue de confirmation pour la suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette question ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La question sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuestion} className="bg-red-500 text-white hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default withAdminAuth(ChatbotConfigPage);