// app/admin/businesses/add/page.tsx
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
import { Loader2, AlertCircle, ArrowLeft, Plus, Trash } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';
import type { Business } from '@/app/types/database';
import { toast } from 'sonner';

type BusinessFormData = Omit<Business, 'id' | 'created_at' | 'updated_at'>;

function AddBusinessPage() {
  const router = useRouter();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      // Validation supplémentaire
      if (!formData.name) {
        toast.error('Le nom du business est requis');
        setError('Le nom du business est requis');
        setSaving(false);
        return;
      }

      // Générer automatiquement le slug s'il est vide
      if (!formData.slug) {
        const newSlug = generateSlug(formData.name);
        setFormData(prev => ({ ...prev, slug: newSlug }));
        formData.slug = newSlug;
      }

      // Créer le business
      const { data, error: supabaseError } = await supabase
        .from('businesses')
        .insert([formData])
        .select();

      if (supabaseError) throw supabaseError;

      // Enregistrer dans les logs d'activité
      await supabase.from('activity_logs').insert([
        {
          type: 'business_created',
          description: `Nouveau business créé: ${formData.name}`,
          metadata: {
            business_name: formData.name,
            business_id: data?.[0]?.id
          }
        }
      ]);

      toast.success('Business créé avec succès');
      router.push('/admin/businesses');
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError(error.message || 'Erreur lors de la création du business');
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
        [name]: name === 'price' || name === 'original_price' || name === 'monthly_potential' 
          ? parseFloat(value) || 0
          : value
      }));
    }
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

  // Gestion des éléments inclus
  const handleIncludesChange = (index: number, value: string) => {
    const newIncludes = [...formData.includes];
    newIncludes[index] = value;
    setFormData(prev => ({ ...prev, includes: newIncludes }));
  };

  const addIncludeItem = () => {
    setFormData(prev => ({ ...prev, includes: [...prev.includes, ''] }));
  };

  const removeIncludeItem = (index: number) => {
    const newIncludes = [...formData.includes];
    newIncludes.splice(index, 1);
    setFormData(prev => ({ ...prev, includes: newIncludes }));
  };

  // Gestion des images
  const handleImageChange = (index: number, field: 'src' | 'alt', value: string) => {
    const newImages = [...formData.images];
    newImages[index] = { ...newImages[index], [field]: value };
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImage = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, { src: '', alt: '' }] }));
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#0f4c81]">
            Ajouter un nouveau business
          </h2>
          <p className="text-gray-500">
            Créez un nouveau business prêt à être commercialisé
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/admin/businesses')}
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
                  placeholder="Ex: BeautyBox E-commerce"
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
                  placeholder="Ex: beautybox-ecommerce"
                />
                <p className="text-xs text-gray-500">Utilisé dans l'URL: tekkistudio.com/business/slug</p>
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
                  placeholder="Ex: Beauté & Cosmétiques"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type*</Label>
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
                <Label htmlFor="price">Prix (FCFA)*</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="Ex: 500000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="original_price">Prix original (FCFA)*</Label>
                <Input
                  id="original_price"
                  name="original_price"
                  type="number"
                  value={formData.original_price}
                  onChange={handleChange}
                  required
                  placeholder="Ex: 650000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly_potential">Potentiel mensuel (FCFA)*</Label>
                <Input
                  id="monthly_potential"
                  name="monthly_potential"
                  type="number"
                  value={formData.monthly_potential}
                  onChange={handleChange}
                  required
                  placeholder="Ex: 800000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pitch">Pitch (court descriptif)*</Label>
              <Textarea
                id="pitch"
                name="pitch"
                value={formData.pitch}
                onChange={handleChange}
                required
                placeholder="Ex: Business e-commerce de produits de beauté bio avec une marge brute de 65% et un marché en pleine expansion."
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
                placeholder="Description complète du business, son fonctionnement, sa cible, son modèle économique..."
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
                <Label htmlFor="market_size">Taille du marché*</Label>
                <Input
                  id="market_size"
                  value={formData.market_analysis.size}
                  onChange={(e) => handleNestedChange('market_analysis', 'size', e.target.value)}
                  required
                  placeholder="Ex: Marché de 50 milliards FCFA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="market_growth">Croissance*</Label>
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
                <Label htmlFor="market_competition">Concurrence*</Label>
                <Input
                  id="market_competition"
                  value={formData.market_analysis.competition}
                  onChange={(e) => handleNestedChange('market_analysis', 'competition', e.target.value)}
                  required
                  placeholder="Ex: Modérée"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="market_opportunity">Opportunité*</Label>
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
                <Label htmlFor="product_type">Type de produits*</Label>
                <Input
                  id="product_type"
                  value={formData.product_details.type}
                  onChange={(e) => handleNestedChange('product_details', 'type', e.target.value)}
                  required
                  placeholder="Ex: Produits de beauté naturels"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product_margin">Marge brute*</Label>
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
                <Label htmlFor="product_suppliers">Fournisseurs*</Label>
                <Input
                  id="product_suppliers"
                  value={formData.product_details.suppliers}
                  onChange={(e) => handleNestedChange('product_details', 'suppliers', e.target.value)}
                  required
                  placeholder="Ex: 3 fournisseurs exclusifs identifiés"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product_logistics">Logistique*</Label>
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
              <Label htmlFor="marketing_channels">Canaux (séparés par des virgules)*</Label>
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
                <Label htmlFor="marketing_target">Cible*</Label>
                <Input
                  id="marketing_target"
                  value={formData.marketing_strategy.targetAudience}
                  onChange={(e) => handleNestedChange('marketing_strategy', 'targetAudience', e.target.value)}
                  required
                  placeholder="Ex: Femmes 25-45 ans, urbaines"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="marketing_cac">Coût d'acquisition*</Label>
                <Input
                  id="marketing_cac"
                  value={formData.marketing_strategy.acquisitionCost}
                  onChange={(e) => handleNestedChange('marketing_strategy', 'acquisitionCost', e.target.value)}
                  required
                  placeholder="Ex: 3,000 FCFA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marketing_conversion">Taux de conversion*</Label>
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
                <Label htmlFor="financials_setup">Investissement initial*</Label>
                <Input
                  id="financials_setup"
                  value={formData.financials.setupCost}
                  onChange={(e) => handleNestedChange('financials', 'setupCost', e.target.value)}
                  required
                  placeholder="Ex: 4,500,000 FCFA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="financials_monthly">Charges mensuelles*</Label>
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
                <Label htmlFor="financials_breakeven">Point mort*</Label>
                <Input
                  id="financials_breakeven"
                  value={formData.financials.breakevenPoint}
                  onChange={(e) => handleNestedChange('financials', 'breakevenPoint', e.target.value)}
                  required
                  placeholder="Ex: 4 mois"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="financials_roi">Retour sur investissement*</Label>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Images</CardTitle>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addImage}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              Ajouter une image
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.images.length === 0 ? (
              <div className="text-center p-6 border border-dashed rounded-lg text-gray-500">
                Aucune image ajoutée. Cliquez sur "Ajouter une image" pour commencer.
              </div>
            ) : (
              formData.images.map((image, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Image {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`image-src-${index}`}>URL de l'image*</Label>
                      <Input
                        id={`image-src-${index}`}
                        value={image.src}
                        onChange={(e) => handleImageChange(index, 'src', e.target.value)}
                        placeholder="https://exemple.com/image.jpg"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`image-alt-${index}`}>Description (alt)</Label>
                      <Input
                        id={`image-alt-${index}`}
                        value={image.alt}
                        onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                        placeholder="Description de l'image"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Ce qui est inclus */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ce qui est inclus</CardTitle>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addIncludeItem}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              Ajouter un élément
            </Button>
          </CardHeader>
          <CardContent>
            {formData.includes.length === 0 ? (
              <div className="text-center p-6 border border-dashed rounded-lg text-gray-500">
                Aucun élément ajouté. Cliquez sur "Ajouter un élément" pour commencer.
              </div>
            ) : (
              <div className="space-y-3">
                {formData.includes.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={item}
                      onChange={(e) => handleIncludesChange(index, e.target.value)}
                      placeholder="Ex: Site e-commerce optimisé"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIncludeItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
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
              'Créer le business'
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

// Fonction utilitaire pour générer un slug à partir d'un nom (à ajouter dans lib/utils/string-utils.ts)
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
    .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
    .replace(/--+/g, '-') // Éviter les tirets multiples
    .trim();
}

export default withAdminAuth(AddBusinessPage);