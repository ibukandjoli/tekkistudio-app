// app/admin/businesses/[id]/edit/page.tsx
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
import type { Business } from '../../../../types/database';
import { toast } from 'sonner';

type BusinessFormData = Omit<Business, 'id' | 'created_at' | 'updated_at'>;

function BusinessForm() {
  const params = useParams();
  const router = useRouter();
  const isEditing = params.id !== 'new';
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<BusinessFormData>({
    slug: '',
    name: '',
    category: '',
    type: 'physical',
    status: 'available',
    price: 0,
    original_price: 0,
    monthly_potential: 0,
    pitch: '',
    description: '',
    images: [],
    market_analysis: {
      size: '',
      growth: '',
      competition: '',
      opportunity: ''
    },
    product_details: {
      type: '',
      margin: '',
      suppliers: '',
      logistics: ''
    },
    marketing_strategy: {
      channels: [],
      targetAudience: '',
      acquisitionCost: '',
      conversionRate: ''
    },
    financials: {
      setupCost: '',
      monthlyExpenses: '',
      breakevenPoint: '',
      roi: ''
    },
    includes: []
  });

  useEffect(() => {
    if (isEditing) {
      fetchBusiness();
    }
  }, [isEditing]);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('businesses')
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
          .from('businesses')
          .update(formData)
          .eq('id', params.id);

        if (error) throw error;
        toast.success('Business mis à jour avec succès');
      } else {
        const { error } = await supabase
          .from('businesses')
          .insert([formData]);

        if (error) throw error;
        toast.success('Business créé avec succès');
      }

      router.push('/admin/businesses');
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
      [name]: name === 'price' || name === 'original_price' || name === 'monthly_potential' 
        ? parseFloat(value) 
        : value
    }));
  };

  const handleNestedChange = (
    category: keyof Pick<BusinessFormData, 'market_analysis' | 'product_details' | 'marketing_strategy' | 'financials'>,
    field: string,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    } as BusinessFormData));
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
          onClick={fetchBusiness} 
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
          {isEditing ? 'Modifier le business' : 'Nouveau business'}
        </h2>
        <p className="text-gray-500">
          {isEditing ? 'Modifiez les informations du business' : 'Créez un nouveau business'}
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
                <Label htmlFor="type">Type</Label>
                <Select
                  name="type"
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as 'physical' | 'digital' }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">Physique</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
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
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="original_price">Prix original</Label>
                <Input
                  id="original_price"
                  name="original_price"
                  type="number"
                  value={formData.original_price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly_potential">Potentiel mensuel</Label>
                <Input
                  id="monthly_potential"
                  name="monthly_potential"
                  type="number"
                  value={formData.monthly_potential}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pitch">Pitch</Label>
              <Textarea
                id="pitch"
                name="pitch"
                value={formData.pitch}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Analyse du marché */}
        <Card>
          <CardHeader>
            <CardTitle>Analyse du marché</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="market_size">Taille du marché</Label>
                <Input
                  id="market_size"
                  value={formData.market_analysis.size}
                  onChange={(e) => handleNestedChange('market_analysis', 'size', e.target.value)}
                  required
                  placeholder="Ex: Marché de 50 milliards FCFA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="market_growth">Croissance</Label>
                <Input
                  id="market_growth"
                  value={formData.market_analysis.growth}
                  onChange={(e) => handleNestedChange('market_analysis', 'growth', e.target.value)}
                  required
                  placeholder="Ex: +12% par an"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="market_competition">Concurrence</Label>
                <Input
                  id="market_competition"
                  value={formData.market_analysis.competition}
                  onChange={(e) => handleNestedChange('market_analysis', 'competition', e.target.value)}
                  required
                  placeholder="Ex: Modérée"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="market_opportunity">Opportunité</Label>
                <Input
                  id="market_opportunity"
                  value={formData.market_analysis.opportunity}
                  onChange={(e) => handleNestedChange('market_analysis', 'opportunity', e.target.value)}
                  required
                  placeholder="Ex: Forte demande pour les produits naturels"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Détails produits */}
        <Card>
          <CardHeader>
            <CardTitle>Détails produits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product_type">Type de produits</Label>
                <Input
                  id="product_type"
                  value={formData.product_details.type}
                  onChange={(e) => handleNestedChange('product_details', 'type', e.target.value)}
                  required
                  placeholder="Ex: Produits de beauté naturels"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product_margin">Marge brute</Label>
                <Input
                  id="product_margin"
                  value={formData.product_details.margin}
                  onChange={(e) => handleNestedChange('product_details', 'margin', e.target.value)}
                  required
                  placeholder="Ex: 65%"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product_suppliers">Fournisseurs</Label>
                <Input
                  id="product_suppliers"
                  value={formData.product_details.suppliers}
                  onChange={(e) => handleNestedChange('product_details', 'suppliers', e.target.value)}
                  required
                  placeholder="Ex: 3 fournisseurs exclusifs identifiés"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product_logistics">Logistique</Label>
                <Input
                  id="product_logistics"
                  value={formData.product_details.logistics}
                  onChange={(e) => handleNestedChange('product_details', 'logistics', e.target.value)}
                  required
                  placeholder="Ex: Livraison sous 48h"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stratégie marketing */}
        <Card>
          <CardHeader>
            <CardTitle>Stratégie marketing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="marketing_channels">Canaux (séparés par des virgules)</Label>
              <Input
                id="marketing_channels"
                value={formData.marketing_strategy.channels.join(', ')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  marketing_strategy: {
                    ...prev.marketing_strategy,
                    channels: e.target.value.split(',').map(channel => channel.trim())
                  }
                }))}
                required
                placeholder="Ex: Instagram, Facebook, Influenceurs locaux"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="marketing_target">Cible</Label>
                <Input
                  id="marketing_target"
                  value={formData.marketing_strategy.targetAudience}
                  onChange={(e) => handleNestedChange('marketing_strategy', 'targetAudience', e.target.value)}
                  required
                  placeholder="Ex: Femmes 25-45 ans, urbaines"/>
              </div>
            <div className="space-y-2">
            <Label htmlFor="marketing_cac">Coût d'acquisition</Label>
            <Input
            id="marketing_cac"
            value={formData.marketing_strategy.acquisitionCost}
            onChange={(e) => handleNestedChange('marketing_strategy', 'acquisitionCost', e.target.value)}
            required
            placeholder="Ex: 3,000 FCFA"
            />
            </div>
            <div className="space-y-2">
            <Label htmlFor="marketing_conversion">Taux de conversion</Label>
            <Input
            id="marketing_conversion"
            value={formData.marketing_strategy.conversionRate}
            onChange={(e) => handleNestedChange('marketing_strategy', 'conversionRate', e.target.value)}
            required
            placeholder="Ex: 2.8%"
            />
            </div>
            </div>
            </CardContent>
            </Card>

            {/* Aspects financiers */}
    <Card>
      <CardHeader>
        <CardTitle>Aspects financiers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="financials_setup">Investissement initial</Label>
            <Input
              id="financials_setup"
              value={formData.financials.setupCost}
              onChange={(e) => handleNestedChange('financials', 'setupCost', e.target.value)}
              required
              placeholder="Ex: 4,500,000 FCFA"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="financials_monthly">Charges mensuelles</Label>
            <Input
              id="financials_monthly"
              value={formData.financials.monthlyExpenses}
              onChange={(e) => handleNestedChange('financials', 'monthlyExpenses', e.target.value)}
              required
              placeholder="Ex: 250,000 FCFA"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="financials_breakeven">Point mort</Label>
            <Input
              id="financials_breakeven"
              value={formData.financials.breakevenPoint}
              onChange={(e) => handleNestedChange('financials', 'breakevenPoint', e.target.value)}
              required
              placeholder="Ex: 4 mois"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="financials_roi">Retour sur investissement</Label>
            <Input
              id="financials_roi"
              value={formData.financials.roi}
              onChange={(e) => handleNestedChange('financials', 'roi', e.target.value)}
              required
              placeholder="Ex: 12 mois"
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
          <Label htmlFor="images">URLs des images (une par ligne)</Label>
          <Textarea
            id="images"
            value={formData.images.map(img => `${img.src}|${img.alt}`).join('\n')}
            onChange={(e) => {
              const imageLines = e.target.value.split('\n').filter(line => line.trim());
              const images = imageLines.map(line => {
                const [src, alt] = line.split('|');
                return { src: src.trim(), alt: alt?.trim() || '' };
              });
              setFormData(prev => ({ ...prev, images }));
            }}
            rows={4}
            required
            placeholder="Format: URL|Description"
          />
          <p className="text-sm text-gray-500">Entrez les URLs des images suivies d'une barre verticale (|) et de leur description</p>
        </div>
      </CardContent>
    </Card>

    {/* Ce qui est inclus */}
    <Card>
      <CardHeader>
        <CardTitle>Ce qui est inclus</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="includes">Éléments inclus (un par ligne)</Label>
          <Textarea
            id="includes"
            value={formData.includes.join('\n')}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              includes: e.target.value.split('\n').filter(item => item.trim() !== '')
            }))}
            rows={6}
            required
            placeholder="Ex: Site e-commerce optimisé&#10;Formation complète&#10;Support 3 mois"
          />
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
          isEditing ? 'Mettre à jour' : 'Créer le business'
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => router.push('/admin/businesses')}
        disabled={saving}
      >
        Annuler
      </Button>
    </div>
  </form>
</div>
);
}
export default withAdminAuth(BusinessForm);