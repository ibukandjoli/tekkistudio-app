// app/admin/formations/[id]/edit/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { withAdminAuth } from '../../../../lib/withAdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Textarea } from '../../../../components/ui/textarea';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import type { Formation } from '../../../../types/database';
import { toast } from 'sonner';
import { formatPrice, priceToNumber } from '../../../../lib/utils/price-utils';

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
        benefits: formData.benefits,
        modules: formData.modules,
        prerequisites: formData.prerequisites,
        formateur: formData.formateur,
        prochaine_sessions: formData.prochaine_sessions
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

  // Le reste du composant reste identique...

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

        {/* Le reste du formulaire reste identique... */}
        
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