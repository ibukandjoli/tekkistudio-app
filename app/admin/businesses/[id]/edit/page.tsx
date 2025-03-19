// app/admin/businesses/[id]/edit/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { withAdminAuth } from '../../../../lib/withAdminAuth';
import ImageUploader from '@/app/components/common/ImageUploader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Textarea } from '../../../../components/ui/textarea';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Switch } from '../../../../components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../../components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../components/ui/popover';
import { Calendar } from '../../../../components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Loader2, AlertCircle, ArrowLeft, Plus, Trash, Save, Calendar as CalendarIcon, Info } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import type { Business, FAQ, SuccessStory, ProjectionGraphData, MonthlyCostsBreakdown } from '../../../../types/database';
import { toast } from 'sonner';

type BusinessFormData = Omit<Business, 'id' | 'created_at' | 'updated_at'>;

// Fonction utilitaire pour générer un slug à partir d'un nom
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

function BusinessForm() {
  const params = useParams();
  const router = useRouter();
  const isEditing = params.id !== 'new';
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

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
    includes: [],
    benefits: [],
    target_audience: '',
    skill_level_required: '',
    time_required_weekly: 0,
    roi_estimation_months: 6,
    monthly_costs_breakdown: {
      hosting: 15,
      marketing: 40,
      stock: 35,
      other: 10
    },
    success_stories: [],
    common_questions: [],
    faqs: [],
    active_viewers_count: 0,
    garantee_days: 30,
    projection_graph_data: {
      months: ['Mois 1', 'Mois 2', 'Mois 3', 'Mois 4', 'Mois 5', 'Mois 6'],
      revenue: [0, 0, 0, 0, 0, 0],
      expenses: [0, 0, 0, 0, 0, 0],
      profit: [0, 0, 0, 0, 0, 0]
    }
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
      
      if (data) {
        // Initialiser les champs qui pourraient être undefined avec des valeurs par défaut
        const businessData = {
          ...formData, // Valeurs par défaut
          ...data, // Données récupérées
          // Assurer que les structures sont correctement initialisées
          common_questions: data.common_questions || [],
          faqs: data.faqs || [],
          benefits: data.benefits || [],
          success_stories: data.success_stories || [],
          monthly_costs_breakdown: data.monthly_costs_breakdown || {
            hosting: 15,
            marketing: 40,
            stock: 35,
            other: 10
          },
          projection_graph_data: data.projection_graph_data || {
            months: ['Mois 1', 'Mois 2', 'Mois 3', 'Mois 4', 'Mois 5', 'Mois 6'],
            revenue: [0, 0, 0, 0, 0, 0],
            expenses: [0, 0, 0, 0, 0, 0],
            profit: [0, 0, 0, 0, 0, 0]
          }
        };
        
        // Normalisation des channels
        if (typeof businessData.marketing_strategy.channels === 'string') {
          businessData.marketing_strategy.channels = businessData.marketing_strategy.channels
            .split(',')
            .map((channel: string) => channel.trim());
        }
        
        // Normalisation des success_stories en s'assurant qu'ils sont des objets
        if (businessData.success_stories && businessData.success_stories.length > 0) {
          if (typeof businessData.success_stories[0] === 'string') {
            // Si c'est un tableau de chaînes, le convertir en objets SuccessStory
            businessData.success_stories = (businessData.success_stories as string[]).map(story => ({
              name: '',
              business: '',
              testimonial: story,
              revenue: '',
              photo: ''
            }));
          }
        }
        
        setFormData(businessData as BusinessFormData);
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

      // Validation des données
      if (!formData.name.trim()) {
        throw new Error('Le nom du business est requis');
      }

      // Génération automatique du slug si vide
      if (!formData.slug.trim()) {
        const newSlug = generateSlug(formData.name);
        setFormData(prev => ({ ...prev, slug: newSlug }));
        formData.slug = newSlug;
      }

      // Préparation des données pour l'envoi
      const dataToSave = {
        ...formData,
        // Normalisation des channels s'il s'agit d'un tableau
        marketing_strategy: {
          ...formData.marketing_strategy,
          channels: Array.isArray(formData.marketing_strategy.channels)
            ? formData.marketing_strategy.channels
            : formData.marketing_strategy.channels.split(',').map(channel => channel.trim())
        }
      };

      if (isEditing) {
        const { error } = await supabase
          .from('businesses')
          .update(dataToSave)
          .eq('id', params.id);

        if (error) throw error;

        // Journaliser l'activité
        await supabase.from('activity_logs').insert([
          {
            type: 'business_updated',
            description: `Business mis à jour: ${formData.name}`,
            metadata: {
              business_name: formData.name,
              business_id: params.id
            }
          }
        ]);

        toast.success('Business mis à jour avec succès');
      } else {
        const { data, error } = await supabase
          .from('businesses')
          .insert([dataToSave])
          .select();

        if (error) throw error;

        // Journaliser l'activité
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
      }

      router.push('/admin/businesses');
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError(error.message || 'Erreur lors de la sauvegarde. Veuillez réessayer.');
      toast.error('Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-suggestion du slug si nom change et que slug est vide
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
        [name]: ['price', 'original_price', 'monthly_potential', 'time_required_weekly', 'roi_estimation_months', 'garantee_days', 'active_viewers_count'].includes(name)
          ? parseFloat(value) || 0
          : value
      }));
    }
  };

  const handleNestedChange = (
    category: keyof Pick<BusinessFormData, 'market_analysis' | 'product_details' | 'marketing_strategy' | 'financials' | 'monthly_costs_breakdown'>,
    field: string,
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: typeof value === 'string' && ['hosting', 'marketing', 'stock', 'other'].includes(field) 
          ? parseFloat(value) || 0
          : value
      }
    } as BusinessFormData));
  };

  // Gestion des éléments inclus
  const handleArrayItemChange = (
    arrayName: 'includes' | 'benefits',
    index: number, 
    value: string
  ) => {
    if (arrayName === 'includes' || arrayName === 'benefits') {
      const newArray = [...(formData[arrayName] || [])];
      newArray[index] = value;
      setFormData(prev => ({ ...prev, [arrayName]: newArray }));
    }
  };

  const addArrayItem = (arrayName: 'includes' | 'benefits') => {
    if (arrayName === 'includes' || arrayName === 'benefits') {
      setFormData(prev => ({ 
        ...prev, 
        [arrayName]: [...(prev[arrayName] || []), ''] 
      }));
    }
  };

  const removeArrayItem = (arrayName: 'includes' | 'benefits', index: number) => {
    if (arrayName === 'includes' || arrayName === 'benefits') {
      const newArray = [...(formData[arrayName] || [])];
      newArray.splice(index, 1);
      setFormData(prev => ({ ...prev, [arrayName]: newArray }));
    }
  };

  // Gestion des images
  const handleImageChange = (index: number, field: 'src' | 'alt', value: string) => {
    const newImages = [...formData.images];
    newImages[index] = { ...newImages[index], [field]: value };
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImage = () => {
    setFormData(prev => ({ 
      ...prev, 
      images: [...prev.images, { src: '', alt: '' }] 
    }));
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  // Gestion des FAQ
  const handleFAQChange = (
    arrayName: 'common_questions' | 'faqs',
    index: number, 
    field: 'question' | 'answer', 
    value: string
  ) => {
    const faqs = [...(formData[arrayName] || [])] as FAQ[];
    faqs[index] = { ...faqs[index], [field]: value };
    setFormData(prev => ({ ...prev, [arrayName]: faqs }));
  };

  const addFAQ = (arrayName: 'common_questions' | 'faqs') => {
    setFormData(prev => ({ 
      ...prev, 
      [arrayName]: [...(prev[arrayName] || []), { question: '', answer: '' }] 
    } as BusinessFormData));
  };

  const removeFAQ = (arrayName: 'common_questions' | 'faqs', index: number) => {
    const faqs = [...(formData[arrayName] || [])] as FAQ[];
    faqs.splice(index, 1);
    setFormData(prev => ({ ...prev, [arrayName]: faqs }));
  };

  // Gestion des histoires de réussite
  const handleSuccessStoryChange = (index: number, field: keyof SuccessStory, value: string) => {
    const stories = [...(formData.success_stories || [])] as SuccessStory[];
    stories[index] = { ...stories[index], [field]: value };
    setFormData(prev => ({ ...prev, success_stories: stories }));
  };

  const addSuccessStory = () => {
    const newStory: SuccessStory = { 
      name: '', 
      business: '', 
      testimonial: '',
      revenue: '',
      photo: ''
    };

    setFormData(prev => ({ 
      ...prev, 
      success_stories: [...(prev.success_stories || []), newStory] 
    } as BusinessFormData));
  };

  const removeSuccessStory = (index: number) => {
    const stories = [...(formData.success_stories || [])] as SuccessStory[];
    stories.splice(index, 1);
    setFormData(prev => ({ ...prev, success_stories: stories }));
  };

  // Gestion des données de projection
  const handleProjectionDataChange = (
    monthIndex: number, 
    dataType: 'revenue' | 'expenses' | 'profit', 
    value: string
  ) => {
    if (!formData.projection_graph_data) return;
    
    const projectionData = { 
      ...formData.projection_graph_data,
      [dataType]: [...formData.projection_graph_data[dataType]]
    };
    
    projectionData[dataType][monthIndex] = parseFloat(value) || 0;
    
    setFormData(prev => ({ 
      ...prev, 
      projection_graph_data: projectionData 
    }));
  };

  // Gestion de la date d'expiration
  const handleExpiryDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ 
        ...prev, 
        offer_expiry_date: date.toISOString() 
      }));
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#0f4c81]">
            {isEditing ? 'Modifier le business' : 'Nouveau business'}
          </h2>
          <p className="text-gray-500">
            {isEditing ? 'Modifiez les informations du business' : 'Créez un nouveau business prêt à être commercialisé'}
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="basic">Informations de base</TabsTrigger>
          <TabsTrigger value="details">Détails produit</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="financial">Financier</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="advanced">Avancé</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Tab: Informations de base */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations essentielles</CardTitle>
                <CardDescription>Informations principales du business à vendre</CardDescription>
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

            <Card>
              <CardHeader>
                <CardTitle>Statut et Disponibilité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="status">Statut du business</Label>
                  <Select
                    name="status"
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'available' | 'reserved' | 'sold' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Disponible</SelectItem>
                      <SelectItem value="reserved">Réservé</SelectItem>
                      <SelectItem value="sold">Vendu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="offer_expiry_date">Date d'expiration de l'offre</Label>
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.offer_expiry_date ? (
                            format(new Date(formData.offer_expiry_date), "PPP", { locale: fr })
                          ) : (
                            <span>Choisir une date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.offer_expiry_date ? new Date(formData.offer_expiry_date) : undefined}
                          onSelect={handleExpiryDateChange}
                          initialFocus
                          locale={fr}
                        />
                      </PopoverContent>
                    </Popover>
                    
                    {formData.offer_expiry_date && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setFormData(prev => ({ ...prev, offer_expiry_date: undefined }))}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Public cible</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="target_audience">Description de l'audience cible</Label>
                  <Textarea
                    id="target_audience"
                    name="target_audience"
                    value={formData.target_audience || ''}
                    onChange={handleChange}
                    placeholder="Ex: Femmes urbaines de 25-45 ans, CSP+, intéressées par les produits naturels et le bien-être"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="skill_level_required">Niveau de compétence requis</Label>
                    <Select
                      name="skill_level_required"
                      value={formData.skill_level_required || ''}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, skill_level_required: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="débutant">Débutant</SelectItem>
                        <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                        <SelectItem value="avancé">Avancé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time_required_weekly">Temps requis par semaine (heures)</Label>
                    <Input
                      id="time_required_weekly"
                      name="time_required_weekly"
                      type="number"
                      value={formData.time_required_weekly || 0}
                      onChange={handleChange}
                      placeholder="Ex: 10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Détails produit */}
          <TabsContent value="details" className="space-y-6">
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
                      
                      <ImageUploader
                        existingImageUrl={image.src}
                        existingImageAlt={image.alt}
                        onImageUploaded={(imageUrl, imageAlt) => {
                          const newImages = [...formData.images];
                          newImages[index] = { 
                            src: imageUrl, 
                            alt: imageAlt 
                          };
                          setFormData(prev => ({ ...prev, images: newImages }));
                        }}
                      />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Marketing */}
          <TabsContent value="marketing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stratégie marketing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="marketing_channels">Canaux (séparés par des virgules)*</Label>
                  <Input
                    id="marketing_channels"
                    value={Array.isArray(formData.marketing_strategy.channels) 
                      ? formData.marketing_strategy.channels.join(', ')
                      : formData.marketing_strategy.channels}
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Avantages clés</CardTitle>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addArrayItem('benefits')}
                  className="flex items-center gap-1"
                >
                  <Plus size={16} />
                  Ajouter un avantage
                </Button>
              </CardHeader>
              <CardContent>
                {!formData.benefits || formData.benefits.length === 0 ? (
                  <div className="text-center p-6 border border-dashed rounded-lg text-gray-500">
                    Aucun avantage ajouté. Cliquez sur "Ajouter un avantage" pour commencer.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={benefit}
                          onChange={(e) => handleArrayItemChange('benefits', index, e.target.value)}
                          placeholder="Ex: ROI rapide en moins de 6 mois"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem('benefits', index)}
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Histoires de réussite</CardTitle>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addSuccessStory}
                  className="flex items-center gap-1"
                >
                  <Plus size={16} />
                  Ajouter une histoire
                </Button>
              </CardHeader>
              <CardContent>
                {!formData.success_stories || formData.success_stories.length === 0 ? (
                  <div className="text-center p-6 border border-dashed rounded-lg text-gray-500">
                    Aucune histoire de réussite ajoutée. Cliquez sur "Ajouter une histoire" pour commencer.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(formData.success_stories as SuccessStory[]).map((story, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Histoire #{index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSuccessStory(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`story-name-${index}`}>Nom de la personne</Label>
                            <Input
                              id={`story-name-${index}`}
                              value={story.name}
                              onChange={(e) => handleSuccessStoryChange(index, 'name', e.target.value)}
                              placeholder="Ex: Marie Diop"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`story-business-${index}`}>Nom du business</Label>
                            <Input
                              id={`story-business-${index}`}
                              value={story.business}
                              onChange={(e) => handleSuccessStoryChange(index, 'business', e.target.value)}
                              placeholder="Ex: MarieSkin Sénégal"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`story-testimonial-${index}`}>Témoignage</Label>
                          <Textarea
                            id={`story-testimonial-${index}`}
                            value={story.testimonial}
                            onChange={(e) => handleSuccessStoryChange(index, 'testimonial', e.target.value)}
                            placeholder="Ex: Grâce à ce business clé en main, j'ai pu démarrer rapidement mon activité..."
                            rows={3}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`story-revenue-${index}`}>Revenu généré</Label>
                            <Input
                              id={`story-revenue-${index}`}
                              value={story.revenue || ''}
                              onChange={(e) => handleSuccessStoryChange(index, 'revenue', e.target.value)}
                              placeholder="Ex: 750,000 FCFA le premier mois"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`story-photo-${index}`}>URL de la photo</Label>
                            <Input
                              id={`story-photo-${index}`}
                              value={story.photo || ''}
                              onChange={(e) => handleSuccessStoryChange(index, 'photo', e.target.value)}
                              placeholder="https://exemple.com/photo.jpg"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Financier */}
          <TabsContent value="financial" className="space-y-6">
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

            <Card>
              <CardHeader>
                <CardTitle>Délai de ROI estimé</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="roi_estimation_months">
                    Délai de ROI estimé en mois (utilisé pour le calculateur de ROI)
                  </Label>
                  <Input
                    id="roi_estimation_months"
                    name="roi_estimation_months"
                    type="number"
                    value={formData.roi_estimation_months || 6}
                    onChange={handleChange}
                    min="1"
                    max="36"
                  />
                  <p className="text-xs text-gray-500">
                    Cette valeur sera utilisée pour calculer le temps nécessaire pour rentabiliser l'investissement initial.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des coûts mensuels</CardTitle>
                <CardDescription>Pourcentage des différents postes de dépenses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="cost_hosting">Hébergement et outils web (%)</Label>
                      <span className="text-sm text-gray-500">{formData.monthly_costs_breakdown?.hosting || 15}%</span>
                    </div>
                    <Input
                      id="cost_hosting"
                      type="range"
                      min="0"
                      max="100"
                      value={formData.monthly_costs_breakdown?.hosting || 15}
                      onChange={(e) => handleNestedChange('monthly_costs_breakdown', 'hosting', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="cost_marketing">Marketing et publicité (%)</Label>
                      <span className="text-sm text-gray-500">{formData.monthly_costs_breakdown?.marketing || 40}%</span>
                    </div>
                    <Input
                      id="cost_marketing"
                      type="range"
                      min="0"
                      max="100"
                      value={formData.monthly_costs_breakdown?.marketing || 40}
                      onChange={(e) => handleNestedChange('monthly_costs_breakdown', 'marketing', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="cost_stock">Stock de produits (%)</Label>
                      <span className="text-sm text-gray-500">{formData.monthly_costs_breakdown?.stock || 35}%</span>
                    </div>
                    <Input
                      id="cost_stock"
                      type="range"
                      min="0"
                      max="100"
                      value={formData.monthly_costs_breakdown?.stock || 35}
                      onChange={(e) => handleNestedChange('monthly_costs_breakdown', 'stock', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="cost_other">Autres frais divers (%)</Label>
                      <span className="text-sm text-gray-500">{formData.monthly_costs_breakdown?.other || 10}%</span>
                    </div>
                    <Input
                      id="cost_other"
                      type="range"
                      min="0"
                      max="100"
                      value={formData.monthly_costs_breakdown?.other || 10}
                      onChange={(e) => handleNestedChange('monthly_costs_breakdown', 'other', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-sm mb-2">Visualisation de la répartition</h3>
                  <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden flex">
                    <div className="bg-blue-500 h-full" style={{ width: `${formData.monthly_costs_breakdown?.hosting || 15}%` }}></div>
                    <div className="bg-green-500 h-full" style={{ width: `${formData.monthly_costs_breakdown?.marketing || 40}%` }}></div>
                    <div className="bg-yellow-500 h-full" style={{ width: `${formData.monthly_costs_breakdown?.stock || 35}%` }}></div>
                    <div className="bg-red-500 h-full" style={{ width: `${formData.monthly_costs_breakdown?.other || 10}%` }}></div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Hébergement</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Marketing</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span>Stock</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Autres</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  <p>Note: Le total doit être égal à 100%. Les valeurs seront ajustées automatiquement si nécessaire.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projections financières</CardTitle>
                <CardDescription>
                  Données pour le graphique de projection sur 6 mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                {formData.projection_graph_data && (
                  <div className="space-y-6">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="border px-4 py-2 bg-gray-50">Mois</th>
                            {formData.projection_graph_data.months.map((month, index) => (
                              <th key={index} className="border px-4 py-2 bg-gray-50">
                                {month}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border px-4 py-2 font-medium bg-blue-50">Revenus (FCFA)</td>
                            {formData.projection_graph_data.revenue.map((value, index) => (
                              <td key={index} className="border px-4 py-2">
                                <Input
                                  type="number"
                                  value={value}
                                  onChange={(e) => handleProjectionDataChange(index, 'revenue', e.target.value)}
                                  className="border-0 p-0 h-8 text-center"
                                />
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-medium bg-red-50">Dépenses (FCFA)</td>
                            {formData.projection_graph_data.expenses.map((value, index) => (
                              <td key={index} className="border px-4 py-2">
                                <Input
                                  type="number"
                                  value={value}
                                  onChange={(e) => handleProjectionDataChange(index, 'expenses', e.target.value)}
                                  className="border-0 p-0 h-8 text-center"
                                />
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="border px-4 py-2 font-medium bg-green-50">Profit (FCFA)</td>
                            {formData.projection_graph_data.profit.map((value, index) => (
                              <td key={index} className="border px-4 py-2">
                                <Input
                                  type="number"
                                  value={value}
                                  onChange={(e) => handleProjectionDataChange(index, 'profit', e.target.value)}
                                  className="border-0 p-0 h-8 text-center"
                                />
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (formData.projection_graph_data) {
                          // Calculer automatiquement les profits (revenue - expenses)
                          const revenue = formData.projection_graph_data.revenue;
                          const expenses = formData.projection_graph_data.expenses;
                          const profit = revenue.map((rev, index) => rev - (expenses[index] || 0));
                          
                          const newProjectionData = {
                            ...formData.projection_graph_data,
                            profit
                          };
                          
                          setFormData(prev => ({ 
                            ...prev, 
                            projection_graph_data: newProjectionData 
                          }));
                        }
                      }}
                      className="w-full"
                    >
                      Calculer les profits automatiquement
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Contenu */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Ce qui est inclus</CardTitle>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addArrayItem('includes')}
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
                          onChange={(e) => handleArrayItemChange('includes', index, e.target.value)}
                          placeholder="Ex: Site e-commerce optimisé"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem('includes', index)}
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Questions fréquentes</CardTitle>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addFAQ('common_questions')}
                  className="flex items-center gap-1"
                >
                  <Plus size={16} />
                  Ajouter une question
                </Button>
              </CardHeader>
              <CardContent>
                {!formData.common_questions || formData.common_questions.length === 0 ? (
                  <div className="text-center p-6 border border-dashed rounded-lg text-gray-500">
                    Aucune question ajoutée. Cliquez sur "Ajouter une question" pour commencer.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(formData.common_questions as FAQ[]).map((faq, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Question #{index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFAQ('common_questions', index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`faq-question-${index}`}>Question</Label>
                          <Input
                            id={`faq-question-${index}`}
                            value={faq.question}
                            onChange={(e) => handleFAQChange('common_questions', index, 'question', e.target.value)}
                            placeholder="Ex: Combien de temps faut-il pour lancer le business?"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`faq-answer-${index}`}>Réponse</Label>
                          <Textarea
                            id={`faq-answer-${index}`}
                            value={faq.answer}
                            onChange={(e) => handleFAQChange('common_questions', index, 'answer', e.target.value)}
                            placeholder="Ex: Le business peut être lancé en 2 semaines après acquisition..."
                            rows={3}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Questions pour le chatbot</CardTitle>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addFAQ('faqs')}
                  className="flex items-center gap-1"
                >
                  <Plus size={16} />
                  Ajouter une question
                </Button>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg mb-4 flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    Ces questions et réponses seront utilisées par le chatbot IA pour répondre aux visiteurs. 
                    Ajoutez des questions spécifiques à ce business avec leurs réponses détaillées.
                  </p>
                </div>
                
                {!formData.faqs || formData.faqs.length === 0 ? (
                  <div className="text-center p-6 border border-dashed rounded-lg text-gray-500">
                    Aucune question pour le chatbot ajoutée. Cliquez sur "Ajouter une question" pour commencer.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(formData.faqs as FAQ[]).map((faq, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Question #{index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFAQ('faqs', index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`chatbot-question-${index}`}>Question</Label>
                          <Input
                            id={`chatbot-question-${index}`}
                            value={faq.question}
                            onChange={(e) => handleFAQChange('faqs', index, 'question', e.target.value)}
                            placeholder="Ex: Quels sont les fournisseurs pour ce business?"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`chatbot-answer-${index}`}>Réponse</Label>
                          <Textarea
                            id={`chatbot-answer-${index}`}
                            value={faq.answer}
                            onChange={(e) => handleFAQChange('faqs', index, 'answer', e.target.value)}
                            placeholder="Ex: Pour ce business, nous avons identifié 3 fournisseurs fiables basés au Sénégal et en Côte d'Ivoire..."
                            rows={4}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Avancé */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Garantie et confiance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="garantee_days">Nombre de jours de garantie</Label>
                  <Input
                    id="garantee_days"
                    name="garantee_days"
                    type="number"
                    min="0"
                    max="365"
                    value={formData.garantee_days || 30}
                    onChange={handleChange}
                    placeholder="Ex: 30"
                  />
                  <p className="text-xs text-gray-500">
                    Durée de la garantie de satisfaction. 0 pour aucune garantie.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="active_viewers_count">Nombre de visiteurs actifs initial</Label>
                  <Input
                    id="active_viewers_count"
                    name="active_viewers_count"
                    type="number"
                    min="0"
                    value={formData.active_viewers_count || 0}
                    onChange={handleChange}
                    placeholder="Ex: 8"
                  />
                  <p className="text-xs text-gray-500">
                    Ce nombre sera utilisé comme base pour le compteur de visiteurs actifs (il fluctuera aléatoirement).
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Données JSON brutes</CardTitle>
                <CardDescription>
                  Édition avancée des données au format JSON (pour les développeurs)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="raw-json">
                    <AccordionTrigger>
                      Afficher/masquer JSON
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-auto max-h-96">
                        <pre className="text-xs">
                          {JSON.stringify(formData, null, 2)}
                        </pre>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Note: La modification directe du JSON n'est pas prise en charge actuellement.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Boutons de soumission */}
          <div className="sticky bottom-6 bg-white border rounded-lg shadow-lg p-4 z-10">
            <div className="flex gap-4 justify-between">
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-[#ff7f50] hover:bg-[#ff6b3d]"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isEditing ? 'Mise à jour...' : 'Création...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEditing ? 'Mettre à jour' : 'Créer le business'}
                    </>
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
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {isEditing ? 'Modification du business' : 'Création d\'un nouveau business'} - 
                <span className="font-medium text-[#0f4c81]">
                  {activeTab === 'basic' ? 'Informations de base' : 
                   activeTab === 'details' ? 'Détails produit' : 
                   activeTab === 'marketing' ? 'Marketing' :
                   activeTab === 'financial' ? 'Financier' :
                   activeTab === 'content' ? 'Contenu' : 'Avancé'}
                </span>
              </div>
            </div>
          </div>
        </form>
      </Tabs>
    </div>
  );
}

export default withAdminAuth(BusinessForm);