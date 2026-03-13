// app/admin/formations/[id]/edit/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Loader2, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';
import type { Formation } from '@/app/types/database';
import { toast } from 'sonner';
import { formatPrice, priceToNumber } from '@/app/lib/utils/price-utils';

// Type de données du formulaire basé sur la structure de Formation
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

// Valeurs par défaut
const defaultFormData: FormationFormData = {
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
  icon: 'ShoppingBag',
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
};

function FormationForm() {
  const params = useParams();
  const router = useRouter();
  const isEditing = params.id !== 'new';
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormationFormData>(defaultFormData);

  useEffect(() => {
    if (isEditing) {
      fetchFormation();
    }
  }, [isEditing]);

  const fetchFormation = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      
      if (data) {
        // Adapter les données de la BD au format du formulaire
        const formationData = data as Formation;
        setFormData({
          slug: formationData.slug || '',
          title: formationData.title || '',
          category: formationData.category || '',
          description: formationData.description || '',
          long_description: formationData.long_description || '',
          duration: formationData.duration || '',
          sessions: formationData.sessions || '',
          level: formationData.level as 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Tous niveaux',
          price: formationData.price || '',
          price_amount: formationData.price_amount || 0,
          icon: formationData.icon || 'ShoppingBag',
          benefits: Array.isArray(formationData.benefits) ? formationData.benefits : [''],
          modules: Array.isArray(formationData.modules) ? formationData.modules : [{ title: '', description: '', lessons: [''] }],
          prerequisites: Array.isArray(formationData.prerequisites) ? formationData.prerequisites : [''],
          formateur: formationData.formateur || { name: '', role: '', bio: '' },
          prochaine_sessions: Array.isArray(formationData.prochaine_sessions) ? formationData.prochaine_sessions : [{ date: '', places: 10 }]
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError('Erreur lors du chargement des données. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      const formationToSave = {
        slug: formData.slug,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        long_description: formData.long_description,
        duration: formData.duration,
        sessions: formData.sessions,
        level: formData.level,
        price: formData.price,
        price_amount: formData.price_amount,
        icon: formData.icon,
        benefits: formData.benefits.filter(b => b.trim() !== ''),
        modules: formData.modules
          .filter(m => m.title.trim() !== '')
          .map(m => ({
            ...m,
            lessons: m.lessons.filter(l => l.trim() !== '')
          })),
        prerequisites: formData.prerequisites.filter(p => p.trim() !== ''),
        formateur: formData.formateur,
        prochaine_sessions: formData.prochaine_sessions
          .filter(s => s.date.trim() !== '')
          .map(s => ({
            ...s,
            places: parseInt(s.places.toString()) || 10
          }))
      };

      if (isEditing) {
        // Mettre à jour une formation existante
        const { error } = await supabase
          .from('formations')
          .update(formationToSave)
          .eq('id', params.id);

        if (error) throw error;
        toast.success('Formation mise à jour avec succès');
      } else {
        // Créer une nouvelle formation
        const { error } = await supabase
          .from('formations')
          .insert([formationToSave]);

        if (error) throw error;
        toast.success('Formation créée avec succès');
      }

      // Rediriger vers la liste des formations
      router.push('/admin/formations');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError('Erreur lors de la sauvegarde. Veuillez réessayer.');
      toast.error('Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      // Mettre à jour à la fois price (chaîne) et price_amount (nombre)
      setFormData(prev => ({
        ...prev,
        price: value,
        price_amount: priceToNumber(value)
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff7f50]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-lg text-red-600">{error}</p>
        <Button 
          onClick={fetchFormation} 
          variant="outline" 
          className="mt-4"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-[#0f4c81]">
          {isEditing ? 'Modifier la formation' : 'Nouvelle formation'}
        </h2>
        <p className="text-gray-500">
          {isEditing ? 'Modifiez les informations de la formation' : 'Créez une nouvelle formation'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Niveau</Label>
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
                <Label htmlFor="price">Prix</Label>
                <Input
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-gray-500">
                  Montant numérique: {formData.price_amount}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durée</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessions">Sessions</Label>
                <Input
                  id="sessions"
                  name="sessions"
                  value={formData.sessions}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icône</Label>
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
              <Label htmlFor="description">Description courte</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="long_description">Description détaillée</Label>
              <Textarea
                id="long_description"
                name="long_description"
                value={formData.long_description}
                onChange={handleChange}
                required
                rows={6}
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
                <Label htmlFor="formateur_name">Nom du formateur</Label>
                <Input
                  id="formateur_name"
                  value={formData.formateur.name}
                  onChange={(e) => handleFormateurChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="formateur_role">Titre/Rôle</Label>
                <Input
                  id="formateur_role"
                  value={formData.formateur.role}
                  onChange={(e) => handleFormateurChange('role', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="formateur_bio">Biographie</Label>
              <Textarea
                id="formateur_bio"
                value={formData.formateur.bio}
                onChange={(e) => handleFormateurChange('bio', e.target.value)}
                required
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Bénéfices */}
        <Card>
          <CardHeader>
            <CardTitle>Ce que vous apprendrez (Bénéfices)</CardTitle>
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
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              onClick={addBenefit}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un bénéfice
            </Button>
          </CardContent>
        </Card>

        {/* Prérequis */}
        <Card>
          <CardHeader>
            <CardTitle>Prérequis</CardTitle>
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
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              onClick={addPrerequisite}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un prérequis
            </Button>
          </CardContent>
        </Card>

        {/* Programme (Modules) */}
        <Card>
          <CardHeader>
            <CardTitle>Programme de la formation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.modules.map((module, moduleIndex) => (
              <div key={`module-${moduleIndex}`} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Module {moduleIndex + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeModule(moduleIndex)}
                    disabled={formData.modules.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`module-title-${moduleIndex}`}>Titre du module</Label>
                  <Input
                    id={`module-title-${moduleIndex}`}
                    value={module.title}
                    onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
                    placeholder="Titre du module"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`module-desc-${moduleIndex}`}>Description</Label>
                  <Textarea
                    id={`module-desc-${moduleIndex}`}
                    value={module.description}
                    onChange={(e) => handleModuleChange(moduleIndex, 'description', e.target.value)}
                    placeholder="Description du module"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Leçons</Label>
                  <div className="space-y-2">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div key={`lesson-${moduleIndex}-${lessonIndex}`} className="flex gap-2">
                        <Input
                          value={lesson}
                          onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, e.target.value)}
                          placeholder="Titre de la leçon"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeLesson(moduleIndex, lessonIndex)}
                          disabled={module.lessons.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addLesson(moduleIndex)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une leçon
                  </Button>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addModule}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un module
            </Button>
          </CardContent>
        </Card>

        {/* Prochaines sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Prochaines sessions</CardTitle>
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
                    variant="outline"
                    size="icon"
                    onClick={() => removeSession(index)}
                    disabled={formData.prochaine_sessions.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addSession}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une session
            </Button>
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
                Enregistrement...
              </>
            ) : (
              isEditing ? 'Mettre à jour' : 'Créer la formation'
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

export default withAdminAuth(FormationForm);