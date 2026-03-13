// app/admin/jobs/[id]/edit/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Plus, 
  Loader2, 
  AlertCircle,
  Globe,
  ExternalLink
} from 'lucide-react';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import { getJobOpeningById, createJobOpening, updateJobOpening, deleteJobOpening } from '@/app/lib/db/jobs';
import type { JobOpening } from '@/app/types/database';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";

function JobEditPage() {
  const params = useParams();
  const router = useRouter();
  const isEditing = params.id !== 'add';
  const jobId = params.id as string;
  
  const [formData, setFormData] = useState<Partial<JobOpening>>({
    title: '',
    slug: '',
    department: '',
    location: '',
    type: '',
    description: '',
    responsibilities: [''],
    requirements: [''],
    benefits: [''],
    is_active: true,
    is_featured: false,
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [debouncedSlug, setDebouncedSlug] = useState('');
  
  // Charger les données si on est en mode édition
  useEffect(() => {
    if (isEditing) {
      fetchJobDetails();
    }
  }, [isEditing, jobId]);
  
  // Générer un slug automatiquement à partir du titre
useEffect(() => {
    if (formData.title && !isEditing) {
      const timeout = setTimeout(() => {
        const generatedSlug = formData.title
          ?.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
          
        if (generatedSlug) { // Ajout d'une vérification de non-undefined
          setFormData(prev => ({ ...prev, slug: generatedSlug }));
          setDebouncedSlug(generatedSlug);
        }
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [formData.title, isEditing]);
  
  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const job = await getJobOpeningById(jobId);
      
      if (!job) {
        setError('L\'offre d\'emploi n\'a pas été trouvée');
        return;
      }
      
      setFormData(job);
      
    } catch (err) {
      console.error('Erreur lors du chargement des détails de l\'offre:', err);
      setError('Une erreur est survenue lors du chargement des détails de l\'offre d\'emploi.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Gestion des tableaux (responsabilités, exigences, avantages)
  const handleArrayItemChange = (
    array: string,
    index: number,
    value: string
  ) => {
    setFormData(prev => {
      const newArray = [...(prev[array as keyof typeof prev] as string[])];
      newArray[index] = value;
      return { ...prev, [array]: newArray };
    });
  };
  
  const addArrayItem = (array: string) => {
    setFormData(prev => {
      const newArray = [...(prev[array as keyof typeof prev] as string[]), ''];
      return { ...prev, [array]: newArray };
    });
  };
  
  const removeArrayItem = (array: string, index: number) => {
    setFormData(prev => {
      const newArray = [...(prev[array as keyof typeof prev] as string[])];
      
      // S'assurer qu'il reste au moins un élément
      if (newArray.length <= 1) {
        newArray[0] = '';
        return { ...prev, [array]: newArray };
      }
      
      newArray.splice(index, 1);
      return { ...prev, [array]: newArray };
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      // Validation
      if (
        !formData.title ||
        !formData.slug ||
        !formData.department ||
        !formData.location ||
        !formData.type ||
        !formData.description
      ) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }
      
      // Nettoyer les tableaux vides
      const cleanedFormData = {
        ...formData,
        responsibilities: (formData.responsibilities || []).filter(item => item.trim() !== ''),
        requirements: (formData.requirements || []).filter(item => item.trim() !== ''),
        benefits: (formData.benefits || []).filter(item => item.trim() !== ''),
      };
      
      if (cleanedFormData.responsibilities.length === 0) {
        throw new Error('Veuillez ajouter au moins une responsabilité');
      }
      
      if (cleanedFormData.requirements.length === 0) {
        throw new Error('Veuillez ajouter au moins une exigence');
      }
      
      if (isEditing) {
        // Mise à jour
        await updateJobOpening(jobId, cleanedFormData);
      } else {
        // Création
        await createJobOpening(cleanedFormData as Omit<JobOpening, 'id' | 'created_at' | 'updated_at'>);
      }
      
      // Redirection vers la liste des offres
      router.push('/admin/jobs');
      
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(err.message || 'Une erreur est survenue lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      setSaving(true);
      await deleteJobOpening(jobId);
      setDeleteDialogOpen(false);
      
      // Redirection
      router.push('/admin/jobs');
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Une erreur est survenue lors de la suppression');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-tekki-coral mb-4" />
        <p className="text-gray-500">Chargement des détails de l'offre...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-tekki-blue">
            {isEditing ? 'Modifier l\'offre d\'emploi' : 'Nouvelle offre d\'emploi'}
          </h2>
          <p className="text-gray-500">
            {isEditing ? 'Modifiez les détails de l\'offre d\'emploi' : 'Créez une nouvelle offre d\'emploi'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Link href="/admin/jobs">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          
          {isEditing && (
            <Link href={`/careers/${formData.slug}`} target="_blank">
              <Button variant="outline" className="flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Voir sur le site
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
            <CardDescription>
              Les informations essentielles concernant l'offre d'emploi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du poste *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                placeholder="ex: Chef de produit"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Slug URL *</Label>
              <div className="flex">
                <div className="bg-gray-100 border-y border-l border-gray-300 px-3 py-2 text-gray-500 rounded-l-md whitespace-nowrap">
                  /careers/
                </div>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug || ''}
                  onChange={handleChange}
                  className="rounded-l-none"
                  placeholder="chef-de-produit"
                  required
                />
              </div>
              <p className="text-sm text-gray-500">
                Identifiant unique pour l'URL de l'offre. Utilisez uniquement des lettres, chiffres et tirets.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Département *</Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleChange}
                  placeholder="ex: Produit"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Localisation *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  placeholder="ex: Dakar, Sénégal"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type de poste *</Label>
                <Input
                  id="type"
                  name="type"
                  value={formData.type || ''}
                  onChange={handleChange}
                  placeholder="ex: Temps plein"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description du poste *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Décrivez le poste, ses objectifs, son contexte..."
                rows={6}
                required
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Responsabilités */}
        <Card>
          <CardHeader>
            <CardTitle>Responsabilités</CardTitle>
            <CardDescription>
              Listez les principales responsabilités du poste.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.responsibilities?.map((responsibility, index) => (
              <div key={`responsibility-${index}`} className="flex gap-2">
                <Input
                  value={responsibility}
                  onChange={(e) => handleArrayItemChange('responsibilities', index, e.target.value)}
                  placeholder={`Responsabilité ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem('responsibilities', index)}
                  disabled={formData.responsibilities?.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('responsibilities')}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une responsabilité
            </Button>
          </CardContent>
        </Card>
        
        {/* Exigences */}
        <Card>
          <CardHeader>
            <CardTitle>Compétences et qualifications</CardTitle>
            <CardDescription>
              Listez les compétences et qualifications requises pour le poste.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.requirements?.map((requirement, index) => (
              <div key={`requirement-${index}`} className="flex gap-2">
                <Input
                  value={requirement}
                  onChange={(e) => handleArrayItemChange('requirements', index, e.target.value)}
                  placeholder={`Exigence ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem('requirements', index)}
                  disabled={formData.requirements?.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('requirements')}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une exigence
            </Button>
          </CardContent>
        </Card>
        
        {/* Avantages */}
        <Card>
          <CardHeader>
            <CardTitle>Avantages</CardTitle>
            <CardDescription>
              Listez les avantages offerts avec ce poste (optionnel).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.benefits?.map((benefit, index) => (
              <div key={`benefit-${index}`} className="flex gap-2">
                <Input
                  value={benefit}
                  onChange={(e) => handleArrayItemChange('benefits', index, e.target.value)}
                  placeholder={`Avantage ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem('benefits', index)}
                  disabled={formData.benefits?.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('benefits')}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un avantage
            </Button>
          </CardContent>
        </Card>
        
        {/* Paramètres */}
        <Card>
          <CardHeader>
            <CardTitle>Paramètres</CardTitle>
            <CardDescription>
              Configurer la visibilité et l'état de l'offre d'emploi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="is_active" className="text-base">Activer l'offre</Label>
                <p className="text-sm text-gray-500">
                  Lorsqu'elle est active, l'offre est visible sur le site et peut recevoir des candidatures.
                </p>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="is_featured" className="text-base">Mettre en vedette</Label>
                <p className="text-sm text-gray-500">
                  Les offres en vedette sont affichées en priorité sur la page des carrières.
                </p>
              </div>
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => handleSwitchChange('is_featured', checked)}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Boutons d'action */}
        <div className="flex justify-between">
          <div>
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={saving}
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Link href="/admin/jobs">
              <Button variant="outline" disabled={saving}>
                Annuler
              </Button>
            </Link>
            
            <Button 
              type="submit" 
              disabled={saving}
              className="bg-tekki-blue hover:bg-tekki-blue/90 flex items-center"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Mettre à jour' : 'Créer l\'offre'}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
      
      {/* Dialog de confirmation de suppression */}
      <AlertDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement l'offre d'emploi
              {formData.title && ` "${formData.title}"`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default withAdminAuth(JobEditPage);