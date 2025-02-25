// app/admin/marques/[id]/edit/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { withAdminAuth } from '../../../../lib/withAdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Textarea } from '../../../../components/ui/textarea';
import { Label } from '../../../../components/ui/label';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import type { Brand } from '../../../../types/database';
import { toast } from 'sonner';

type BrandFormData = Omit<Brand, 'id' | 'created_at' | 'updated_at'>;

function BrandForm() {
  const params = useParams();
  const router = useRouter();
  const isEditing = params.id !== 'new';
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (isEditing) {
      fetchBrand();
    }
  }, [isEditing]);

  const fetchBrand = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      if (data) setFormData(data);
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

      if (isEditing) {
        const { error } = await supabase
          .from('brands')
          .update(formData)
          .eq('id', params.id);

        if (error) throw error;
        toast.success('Marque mise à jour avec succès');
      } else {
        const { error } = await supabase
          .from('brands')
          .insert([formData]);

        if (error) throw error;
        toast.success('Marque créée avec succès');
      }

      router.push('/admin/marques');
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
          onClick={fetchBrand} 
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
          {isEditing ? 'Modifier la marque' : 'Nouvelle marque'}
        </h2>
        <p className="text-gray-500">
          {isEditing ? 'Modifiez les informations de la marque' : 'Créez une nouvelle marque'}
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
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
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
              <Label htmlFor="short_description">Description courte</Label>
              <Textarea
                id="short_description"
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description détaillée</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
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
              <Label htmlFor="challenge">Le Challenge</Label>
              <Textarea
                id="challenge"
                name="challenge"
                value={formData.challenge}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="solution">Notre Solution</Label>
              <Textarea
                id="solution"
                name="solution"
                value={formData.solution}
                onChange={handleChange}
                required
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
                <Label htmlFor="metrics_sales">Ventes</Label>
                <Input
                  id="metrics_sales"
                  value={formData.metrics.sales}
                  onChange={(e) => handleMetricsChange('sales', e.target.value)}
                  required
                  placeholder="Ex: +8000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metrics_revenue">Revenus</Label>
                <Input
                  id="metrics_revenue"
                  value={formData.metrics.revenue}
                  onChange={(e) => handleMetricsChange('revenue', e.target.value)}
                  required
                  placeholder="Ex: 112M FCFA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metrics_growth">Croissance</Label>
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
                <Label htmlFor="metrics_rating">Note clients</Label>
                <Input
                  id="metrics_rating"
                  value={formData.metrics.rating}
                  onChange={(e) => handleMetricsChange('rating', e.target.value)}
                  required
                  placeholder="Ex: 4.8/5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metrics_customers">Clients</Label>
                <Input
                  id="metrics_customers"
                  value={formData.metrics.customers}
                  onChange={(e) => handleMetricsChange('customers', e.target.value)}
                  required
                  placeholder="Ex: +7,000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metrics_countries">Pays</Label>
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
              <Label htmlFor="main_image">Image principale</Label>
              <Input
                id="main_image"
                value={formData.images.main}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  images: {
                    ...prev.images,
                    main: e.target.value
                  }
                }))}
                required
                placeholder="URL de l'image principale"
              />
            </div>
            <div className="space-y-2">
              <Label>Galerie (une URL par ligne)</Label>
              <Textarea
                value={formData.images.gallery.join('\n')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  images: {
                    ...prev.images,
                    gallery: e.target.value.split('\n').filter(url => url.trim() !== '')
                  }
                }))}
                rows={4}
                required
              />
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
              <Label>Format JSON</Label>
              <Textarea
                value={JSON.stringify(formData.timeline, null, 2)}
                onChange={(e) => {
                  try {
                    const timeline = JSON.parse(e.target.value);
                    setFormData(prev => ({ ...prev, timeline }));
                  } catch (error) {
                    // Ignore parsing errors while typing
                  }
                }}
                rows={6}
                required
                className="font-mono"
              />
              <p className="text-sm text-gray-500">
                Format: {JSON.stringify([
                  {
                    date: "Janvier 2023",
                    title: "Lancement",
                    description: "Début des opérations"
                  }
                ], null, 2)}
              </p>
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
              <Label>Format JSON</Label>
              <Textarea
                value={JSON.stringify(formData.testimonials, null, 2)}
                onChange={(e) => {
                  try {
                    const testimonials = JSON.parse(e.target.value);
                    setFormData(prev => ({ ...prev, testimonials }));
                  } catch (error) {
                    // Ignore parsing errors while typing
                  }
                }}
                rows={6}
                required
                className="font-mono"
              />
              <p className="text-sm text-gray-500">
                Format: {JSON.stringify([
                  {
                    name: "John Doe",
                    role: "Client",
                    text: "Excellent produit !"
                  }
                ], null, 2)}
              </p>
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
              <Label>Format JSON</Label>
              <Textarea
                value={JSON.stringify(formData.products, null, 2)}
                onChange={(e) => {
                  try {
                    const products = JSON.parse(e.target.value);
                    setFormData(prev => ({ ...prev, products }));
                  } catch (error) {
                    // Ignore parsing errors while typing
                  }
                }}
                rows={6}
                required
                className="font-mono"
              />
              <p className="text-sm text-gray-500">
                Format: {JSON.stringify([
                  {
                    name: "Produit A",
                    description: "Description du produit",
                    price: "15,000 FCFA"
                  }
                ], null, 2)}
              </p>
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
                Enregistrement...
              </>
            ) : (
              isEditing ? 'Mettre à jour' : 'Créer la marque'
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

export default withAdminAuth(BrandForm);