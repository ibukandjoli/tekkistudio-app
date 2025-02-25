// app/admin/formations/add/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Loader2, AlertCircle, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';
import type { Formation } from '@/app/types/database';
import { toast } from 'sonner';
import { generateSlug } from '@/app/lib/utils/string-utils';

interface FormationFormData {
  slug: string;
  title: string;
  category: string;
  description: string;
  long_description: string;
  duration: string;
  sessions: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Tous niveaux';
  price: string;
  price_amount: number;
  icon: string;
  benefits: string[];
  modules: {
    title: string;
    description: string;
    lessons: string[];
  }[];
  prerequisites: string[];
  formateur: {
    name: string;
    role: string;
    bio: string;
  };
  prochaine_sessions: {
    date: string;
    places: number;
  }[];
}

const niveaux = ['Débutant', 'Intermédiaire', 'Avancé', 'Tous niveaux'] as const;
const iconOptions = [
  { value: 'ShoppingBag', label: 'Boutique' },
  { value: 'Monitor', label: 'Moniteur' },
  { value: 'TrendingUp', label: 'Croissance' },
  { value: 'BarChart', label: 'Graphique' },
  { value: 'Users', label: 'Utilisateurs' },
  { value: 'BookOpen', label: 'Livre' },
  { value: 'Laptop', label: 'Ordinateur' },
  { value: 'Briefcase', label: 'Mallette' },
  { value: 'Brain', label: 'Cerveau' },
  { value: 'Code', label: 'Code' },
  { value: 'Lightbulb', label: 'Ampoule' },
];

function AddFormationPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialisation avec les valeurs par défaut
  const [formData, setFormData] = useState<FormationFormData>({
    slug: '',
    title: '',
    category: '',
    description: '',
    long_description: '',
    duration: '',
    sessions: '',
    level: 'Débutant',
    price: '',
    price_amount: 0,
    icon: 'BookOpen',
    benefits: [''],
    modules: [
      {
        title: '',
        description: '',
        lessons: ['']
      }
    ],
    prerequisites: [''],
    formateur: {
      name: '',
      role: '',
      bio: ''
    },
    prochaine_sessions: [
      {
        date: '',
        places: 10
      }
    ]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      // Validation supplémentaire
      if (!formData.title) {
        toast.error('Le titre de la formation est requis');
        setError('Le titre de la formation est requis');
        setSaving(false);
        return;
      }

      // Générer automatiquement le slug s'il est vide
      if (!formData.slug) {
        const newSlug = generateSlug(formData.title);
        setFormData(prev => ({ ...prev, slug: newSlug }));
        formData.slug = newSlug;
      }

      // Nettoyer les données avant soumission (supprimer les éléments vides)
      const cleanedFormData = {
        ...formData,
        benefits: formData.benefits.filter(b => b.trim() !== ''),
        modules: formData.modules
          .filter(m => m.title.trim() !== '')
          .map(m => ({
            ...m,
            lessons: m.lessons.filter(l => l.trim() !== '')
          })),
        prerequisites: formData.prerequisites.filter(p => p.trim() !== ''),
        prochaine_sessions: formData.prochaine_sessions
          .filter(s => s.date.trim() !== '')
          .map(s => ({
            ...s,
            places: parseInt(s.places.toString()) || 10
          }))
      };

      // Créer la formation dans la base de données
      const { data, error: supabaseError } = await supabase
        .from('formations')
        .insert([cleanedFormData])
        .select();

      if (supabaseError) throw supabaseError;

      // Enregistrer dans les logs d'activité
      await supabase.from('activity_logs').insert([
        {
          type: 'formation_created',
          description: `Nouvelle formation créée: ${formData.title}`,
          metadata: {
            formation_title: formData.title,
            formation_id: data?.[0]?.id
          }
        }
      ]);

      toast.success('Formation créée avec succès');
      router.push('/admin/formations');
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError(error.message || 'Erreur lors de la création de la formation');
      toast.error('Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Si le titre change, suggérer un slug
    if (name === 'title' && !formData.slug) {
      const suggestedSlug = generateSlug(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        slug: suggestedSlug
      }));
    } else if (name === 'price') {
      // Mettre à jour à la fois price (chaîne) et price_amount (nombre)
      setFormData(prev => ({
        ...prev,
        price: value,
        price_amount: parseFloat(value.replace(/[^\d]/g, '')) || 0
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormateurChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      formateur: { ...prev.formateur, [field]: value }
    }));
  };

  // Gestion des bénéfices (liste simple)
  const handleBenefitChange = (index: number, value: string) => {
    setFormData(prev => {
      const benefits = [...prev.benefits];
      benefits[index] = value;
      return { ...prev, benefits };
    });
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }));
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => {
      const benefits = [...prev.benefits];
      benefits.splice(index, 1);
      if (benefits.length === 0) benefits.push('');
      return { ...prev, benefits };
    });
  };

  // Gestion des prérequis (liste simple)
  const handlePrerequisiteChange = (index: number, value: string) => {
    setFormData(prev => {
      const prerequisites = [...prev.prerequisites];
      prerequisites[index] = value;
      return { ...prev, prerequisites };
    });
  };

  const addPrerequisite = () => {
    setFormData(prev => ({
      ...prev,
      prerequisites: [...prev.prerequisites, '']
    }));
  };

  const removePrerequisite = (index: number) => {
    setFormData(prev => {
      const prerequisites = [...prev.prerequisites];
      prerequisites.splice(index, 1);
      if (prerequisites.length === 0) prerequisites.push('');
      return { ...prev, prerequisites };
    });
  };

  // Gestion des sessions
  const handleSessionChange = (index: number, field: 'date' | 'places', value: string | number) => {
    setFormData(prev => {
      const sessions = [...prev.prochaine_sessions];
      sessions[index] = { ...sessions[index], [field]: value };
      return { ...prev, prochaine_sessions: sessions };
    });
  };

  const addSession = () => {
    setFormData(prev => ({
      ...prev,
      prochaine_sessions: [...prev.prochaine_sessions, { date: '', places: 10 }]
    }));
  };

  const removeSession = (index: number) => {
    setFormData(prev => {
      const sessions = [...prev.prochaine_sessions];
      sessions.splice(index, 1);
      if (sessions.length === 0) sessions.push({ date: '', places: 10 });
      return { ...prev, prochaine_sessions: sessions };
    });
  };

  // Gestion des modules
  const handleModuleChange = (moduleIndex: number, field: 'title' | 'description', value: string) => {
    setFormData(prev => {
      const modules = [...prev.modules];
      modules[moduleIndex] = { ...modules[moduleIndex], [field]: value };
      return { ...prev, modules };
    });
  };

  const handleLessonChange = (moduleIndex: number, lessonIndex: number, value: string) => {
    setFormData(prev => {
      const modules = [...prev.modules];
      modules[moduleIndex].lessons[lessonIndex] = value;
      return { ...prev, modules };
    });
  };

  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, { title: '', description: '', lessons: [''] }]
    }));
  };

  const removeModule = (index: number) => {
    setFormData(prev => {
      const modules = [...prev.modules];
      modules.splice(index, 1);
      if (modules.length === 0) modules.push({ title: '', description: '', lessons: [''] });
      return { ...prev, modules };
    });
  };

  const addLesson = (moduleIndex: number) => {
    setFormData(prev => {
      const modules = [...prev.modules];
      modules[moduleIndex].lessons.push('');
      return { ...prev, modules };
    });
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    setFormData(prev => {
      const modules = [...prev.modules];
      modules[moduleIndex].lessons.splice(lessonIndex, 1);
      if (modules[moduleIndex].lessons.length === 0) modules[moduleIndex].lessons.push('');
      return { ...prev, modules };
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#0f4c81]">
            Ajouter une nouvelle formation
          </h2>
          <p className="text-gray-500">
            Créez une nouvelle formation à commercialiser
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/admin/formations')}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Retour à la liste
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3 text-red-700">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre*</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Formation E-commerce de A à Z"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug*</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  placeholder="Ex: formation-ecommerce-de-a-a-z"
                />
                <p className="text-xs text-gray-500">Utilisé dans l'URL: tekkistudio.com/formations/slug</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie*</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  placeholder="Ex: E-commerce"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Niveau*</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => handleSelectChange('level', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    {niveaux.map(niveau => (
                      <SelectItem key={niveau} value={niveau}>{niveau}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (format texte)*</Label>
                <Input
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="Ex: 150,000 FCFA"
                />
                <p className="text-xs text-gray-500">
                  Montant numérique: {formData.price_amount} FCFA
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durée*</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  placeholder="Ex: 4 semaines"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessions">Sessions*</Label>
                <Input
                  id="sessions"
                  name="sessions"
                  value={formData.sessions}
                  onChange={handleChange}
                  required
                  placeholder="Ex: 8 sessions de 2h"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icône*</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => handleSelectChange('icon', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une icône" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description courte*</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Une description concise de la formation (1-2 phrases)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="long_description">Description détaillée*</Label>
              <Textarea
                id="long_description"
                name="long_description"
                value={formData.long_description}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Description complète de la formation, ses objectifs, ses avantages..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Formateur */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du formateur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="formateur_name">Nom du formateur*</Label>
                <Input
                  id="formateur_name"
                  value={formData.formateur.name}
                  onChange={(e) => handleFormateurChange('name', e.target.value)}
                  required
                  placeholder="Ex: John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="formateur_role">Titre/Rôle*</Label>
                <Input
                  id="formateur_role"
                  value={formData.formateur.role}
                  onChange={(e) => handleFormateurChange('role', e.target.value)}
                  required
                  placeholder="Ex: Expert E-commerce, 10 ans d'expérience"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="formateur_bio">Biographie*</Label>
              <Textarea
                id="formateur_bio"
                value={formData.formateur.bio}
                onChange={(e) => handleFormateurChange('bio', e.target.value)}
                required
                rows={4}
                placeholder="Biographie détaillée du formateur, son parcours, ses réalisations..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Bénéfices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ce que vous apprendrez (Bénéfices)</CardTitle>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addBenefit}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              Ajouter un bénéfice
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.benefits.map((benefit, index) => (
              <div key={`benefit-${index}`} className="flex gap-2">
                <Input
                  value={benefit}
                  onChange={(e) => handleBenefitChange(index, e.target.value)}
                  placeholder="Ex: Maîtrisez les techniques de vente en ligne"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeBenefit(index)}
                  disabled={formData.benefits.length === 1}
                  className={formData.benefits.length === 1 ? "opacity-50 cursor-not-allowed" : ""}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Prérequis */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Prérequis</CardTitle>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addPrerequisite}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              Ajouter un prérequis
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.prerequisites.map((prerequisite, index) => (
              <div key={`prerequisite-${index}`} className="flex gap-2">
                <Input
                  value={prerequisite}
                  onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
                  placeholder="Ex: Connaissances de base en marketing digital"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removePrerequisite(index)}
                  disabled={formData.prerequisites.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Programme (Modules) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Programme de la formation</CardTitle>
            <Button 
              type="button" 
              variant="outline" 
              onClick={addModule}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              Ajouter un module
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.modules.map((module, moduleIndex) => (
              <div key={`module-${moduleIndex}`} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Module {moduleIndex + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeModule(moduleIndex)}
                    disabled={formData.modules.length === 1}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`module-title-${moduleIndex}`}>Titre du module*</Label>
                  <Input
                    id={`module-title-${moduleIndex}`}
                    value={module.title}
                    onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
                    placeholder="Titre du module"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`module-desc-${moduleIndex}`}>Description*</Label>
                  <Textarea
                    id={`module-desc-${moduleIndex}`}
                    value={module.description}
                    onChange={(e) => handleModuleChange(moduleIndex, 'description', e.target.value)}
                    placeholder="Description du module"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="mt-1">Leçons*</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addLesson(moduleIndex)}
                      className="flex items-center gap-1"
                    >
                      <Plus size={14} />
                      Ajouter une leçon
                    </Button>
                  </div>
                  <div className="space-y-2 pl-1">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div key={`lesson-${moduleIndex}-${lessonIndex}`} className="flex gap-2">
                        <Input
                          value={lesson}
                          onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, e.target.value)}
                          placeholder="Titre de la leçon"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLesson(moduleIndex, lessonIndex)}
                          disabled={module.lessons.length === 1}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Prochaines sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Prochaines sessions</CardTitle>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addSession}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              Ajouter une session
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.prochaine_sessions.map((session, index) => (
              <div key={`session-${index}`} className="grid grid-cols-7 gap-4 items-center">
                <div className="col-span-4">
                  <Label htmlFor={`session-date-${index}`} className="sr-only">Date</Label>
                  <Input
                    id={`session-date-${index}`}
                    value={session.date}
                    onChange={(e) => handleSessionChange(index, 'date', e.target.value)}
                    placeholder="Ex: 15 Mars 2025"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor={`session-places-${index}`} className="sr-only">Places</Label>
                  <Input
                    id={`session-places-${index}`}
                    type="number"
                    value={session.places}
                    onChange={(e) => handleSessionChange(index, 'places', parseInt(e.target.value) || 0)}
                    placeholder="Nombre de places"
                    min="1"
                  />
                </div>
                <div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSession(index)}
                    disabled={formData.prochaine_sessions.length === 1}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Boutons de soumission */}
        <div className="flex gap-4">
          <Button
            type="submit"
            className="bg-[#ff7f50] hover:bg-[#ff6b3d]"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Création en cours...
              </>
            ) : (
              'Créer la formation'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/formations')}
            disabled={saving}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}

export default withAdminAuth(AddFormationPage);