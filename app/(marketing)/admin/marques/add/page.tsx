// app/admin/marques/add/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Loader2, AlertCircle, ArrowLeft, Plus, Trash } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';
import type { Brand } from '@/app/types/database';
import { toast } from 'sonner';
import { generateSlug } from '@/app/lib/utils/string-utils';

type BrandFormData = Omit<Brand, 'id' | 'created_at' | 'updated_at'>;

function AddBrandPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<BrandFormData>({
    slug: '',
    name: '',
    category: '',
    short_description: '',
    description: '',
    challenge: '',
    solution: '',
    metrics: {
      sales: '',
      revenue: '',
      growth: '',
      rating: '',
      customers: '',
      countries: ''
    },
    timeline: [],
    images: {
      main: '',
      gallery: []
    },
    testimonials: [],
    products: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      // Validation supplémentaire
      if (!formData.name) {
        toast.error('Le nom de la marque est requis');
        setError('Le nom de la marque est requis');
        setSaving(false);
        return;
      }

      // Générer automatiquement le slug s'il est vide
      if (!formData.slug) {
        const newSlug = generateSlug(formData.name);
        setFormData(prev => ({ ...prev, slug: newSlug }));
        formData.slug = newSlug;
      }

      // Créer la marque
      const { data, error: supabaseError } = await supabase
        .from('brands')
        .insert([formData])
        .select();

      if (supabaseError) throw supabaseError;

      // Enregistrer dans les logs d'activité
      await supabase.from('activity_logs').insert([
        {
          type: 'brand_created',
          description: `Nouvelle marque créée: ${formData.name}`,
          metadata: {
            brand_name: formData.name,
            brand_id: data?.[0]?.id
          }
        }
      ]);

      toast.success('Marque créée avec succès');
      router.push('/admin/marques');
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError(error.message || 'Erreur lors de la création de la marque');
      toast.error('Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Si le nom change, suggérer un slug
    if (name === 'name' && !formData.slug) {
      const suggestedSlug = generateSlug(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        slug: suggestedSlug
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMetricsChange = (metric: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [metric]: value
      }
    }));
  };

  // Gestion des images
  const handleMainImageChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      images: {
        ...prev.images,
        main: value
      }
    }));
  };

  const handleGalleryImageChange = (index: number, value: string) => {
    const newGallery = [...formData.images.gallery];
    newGallery[index] = value;
    setFormData(prev => ({
      ...prev,
      images: {
        ...prev.images,
        gallery: newGallery
      }
    }));
  };

  const addGalleryImage = () => {
    setFormData(prev => ({
      ...prev,
      images: {
        ...prev.images,
        gallery: [...prev.images.gallery, '']
      }
    }));
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = [...formData.images.gallery];
    newGallery.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      images: {
        ...prev.images,
        gallery: newGallery
      }
    }));
  };

  // Gestion de timeline, témoignages et produits
  const [timelineJson, setTimelineJson] = useState('[]');
  const [testimonialsJson, setTestimonialsJson] = useState('[]');
  const [productsJson, setProductsJson] = useState('[]');

  const handleTimelineJsonChange = (value: string) => {
    setTimelineJson(value);
    try {
      const parsed = JSON.parse(value);
      setFormData(prev => ({ ...prev, timeline: parsed }));
    } catch (e) {
      // Ignorer les erreurs de parsing pendant la saisie
    }
  };

  const handleTestimonialsJsonChange = (value: string) => {
    setTestimonialsJson(value);
    try {
      const parsed = JSON.parse(value);
      setFormData(prev => ({ ...prev, testimonials: parsed }));
    } catch (e) {
      // Ignorer les erreurs de parsing pendant la saisie
    }
  };

  const handleProductsJsonChange = (value: string) => {
    setProductsJson(value);
    try {
      const parsed = JSON.parse(value);
      setFormData(prev => ({ ...prev, products: parsed }));
    } catch (e) {
      // Ignorer les erreurs de parsing pendant la saisie
    }
  };

  const formatJsonString = (jsonStr: string): string => {
    try {
      const obj = JSON.parse(jsonStr);
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return jsonStr;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#0f4c81]">
            Ajouter une nouvelle marque
          </h2>
          <p className="text-gray-500">
            Créez une nouvelle marque pour votre portfolio
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/admin/marques')}
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
                <Label htmlFor="name">Nom*</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ex: EcoNappy"
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
                  placeholder="Ex: econappy"
                />
                <p className="text-xs text-gray-500">Utilisé dans l'URL: tekkistudio.com/marques/slug</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie*</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="Ex: Produits écologiques pour bébés"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Description courte*</Label>
              <Textarea
                id="short_description"
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                required
                placeholder="Brève description de la marque en 1-2 phrases"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description détaillée*</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Description complète de la marque, sa mission, sa vision..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Challenge et Solution */}
        <Card>
          <CardHeader>
            <CardTitle>Challenge et Solution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="challenge">Le Challenge*</Label>
              <Textarea
                id="challenge"
                name="challenge"
                value={formData.challenge}
                onChange={handleChange}
                required
                placeholder="Décrivez le problème que cette marque cherche à résoudre"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="solution">Notre Solution*</Label>
              <Textarea
                id="solution"
                name="solution"
                value={formData.solution}
                onChange={handleChange}
                required
                placeholder="Expliquez comment la marque résout ce problème"
              />
            </div>
          </CardContent>
        </Card>

        {/* Métriques */}
        <Card>
          <CardHeader>
            <CardTitle>Métriques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="metrics_sales">Ventes*</Label>
                <Input
                  id="metrics_sales"
                  value={formData.metrics.sales}
                  onChange={(e) => handleMetricsChange('sales', e.target.value)}
                  required
                  placeholder="Ex: +8000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metrics_revenue">Revenus*</Label>
                <Input
                  id="metrics_revenue"
                  value={formData.metrics.revenue}
                  onChange={(e) => handleMetricsChange('revenue', e.target.value)}
                  required
                  placeholder="Ex: 112M FCFA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metrics_growth">Croissance*</Label>
                <Input
                  id="metrics_growth"
                  value={formData.metrics.growth}
                  onChange={(e) => handleMetricsChange('growth', e.target.value)}
                  required
                  placeholder="Ex: +127%"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="metrics_rating">Note clients*</Label>
                <Input
                  id="metrics_rating"
                  value={formData.metrics.rating}
                  onChange={(e) => handleMetricsChange('rating', e.target.value)}
                  required
                  placeholder="Ex: 4.8/5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metrics_customers">Clients*</Label>
                <Input
                  id="metrics_customers"
                  value={formData.metrics.customers}
                  onChange={(e) => handleMetricsChange('customers', e.target.value)}
                  required
                  placeholder="Ex: +7,000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metrics_countries">Pays*</Label>
                <Input
                  id="metrics_countries"
                  value={formData.metrics.countries}
                  onChange={(e) => handleMetricsChange('countries', e.target.value)}
                  required
                  placeholder="Ex: 5"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="main_image">Image principale*</Label>
              <Input
                id="main_image"
                value={formData.images.main}
                onChange={(e) => handleMainImageChange(e.target.value)}
                required
                placeholder="URL de l'image principale"
              />
              <p className="text-xs text-gray-500">Utilisée comme image de couverture de la marque</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Galerie d'images</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addGalleryImage}
                  className="flex items-center gap-1"
                >
                  <Plus size={16} />
                  Ajouter une image
                </Button>
              </div>
              
              {formData.images.gallery.length === 0 ? (
                <div className="text-center p-6 border border-dashed rounded-lg text-gray-500">
                  Aucune image ajoutée à la galerie. Cliquez sur "Ajouter une image" pour commencer.
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.images.gallery.map((image, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={image}
                        onChange={(e) => handleGalleryImageChange(index, e.target.value)}
                        placeholder="URL de l'image"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeGalleryImage(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Format JSON*</Label>
              <Textarea
                value={timelineJson}
                onChange={(e) => handleTimelineJsonChange(e.target.value)}
                rows={8}
                required
                className="font-mono"
                placeholder={formatJsonString('[{"date":"Janvier 2023","title":"Lancement","description":"Début des opérations"}]')}
              />
              <p className="text-sm text-gray-500">
                Format requis: Tableau d'objets avec propriétés date, title et description
              </p>
              <div className="bg-gray-50 p-3 rounded border text-sm text-gray-700">
                <p>Exemple:</p>
                <pre className="overflow-x-auto text-xs">
                  {formatJsonString('[{"date":"Janvier 2023","title":"Lancement","description":"Début des opérations"},{"date":"Juin 2023","title":"Expansion","description":"Extension vers 3 nouveaux marchés"}]')}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Témoignages */}
        <Card>
          <CardHeader>
            <CardTitle>Témoignages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Format JSON*</Label>
              <Textarea
                value={testimonialsJson}
                onChange={(e) => handleTestimonialsJsonChange(e.target.value)}
                rows={6}
                required
                className="font-mono"
                placeholder={formatJsonString('[{"name":"John Doe","role":"Client","text":"Excellent produit !"}]')}
              />
              <p className="text-sm text-gray-500">
                Format requis: Tableau d'objets avec propriétés name, role et text
              </p>
              <div className="bg-gray-50 p-3 rounded border text-sm text-gray-700">
                <p>Exemple:</p>
                <pre className="overflow-x-auto text-xs">
                  {formatJsonString('[{"name":"John Doe","role":"Client","text":"Excellent produit !"},{"name":"Jane Smith","role":"Cliente fidèle","text":"Très satisfaite des résultats !"}]')}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Produits */}
        <Card>
          <CardHeader>
            <CardTitle>Produits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Format JSON*</Label>
              <Textarea
                value={productsJson}
                onChange={(e) => handleProductsJsonChange(e.target.value)}
                rows={6}
                required
                className="font-mono"
                placeholder={formatJsonString('[{"name":"Produit A","description":"Description du produit","price":"15,000 FCFA"}]')}
              />
              <p className="text-sm text-gray-500">
                Format requis: Tableau d'objets avec propriétés name, description et price
              </p>
              <div className="bg-gray-50 p-3 rounded border text-sm text-gray-700">
                <p>Exemple:</p>
                <pre className="overflow-x-auto text-xs">
                  {formatJsonString('[{"name":"Couches écologiques","description":"Lot de 50 couches biodégradables","price":"15,000 FCFA","image":"https://exemple.com/image.jpg"}]')}
                </pre>
              </div>
            </div>
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
              'Créer la marque'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/marques')}
            disabled={saving}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}

export default withAdminAuth(AddBrandPage);