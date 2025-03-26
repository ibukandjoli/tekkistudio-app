// app/admin/settings/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import { supabase } from '@/app/lib/supabase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { 
  Switch, 
} from '@/app/components/ui/switch';
import {
  Globe,
  Mail,
  BellRing,
  Database,
  Settings as SettingsIcon,
  Save,
  Loader2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { Separator } from '@/app/components/ui/separator';

interface AppSettings {
  site: {
    name: string;
    description: string;
    logo: string;
    primary_color: string;
    secondary_color: string;
    contact_email: string;
    contact_phone: string;
  };
  email: {
    notification_enabled: boolean;
    lead_notification_emails: string[];
    sender_name: string;
    sender_email: string;
    welcome_template: string;
    lead_template: string;
  };
  notifications: {
    lead_notifications: boolean;
    sale_notifications: boolean;
    enrollment_notifications: boolean;
    whatsapp_notifications: boolean;
  };
  backup: {
    auto_backup_enabled: boolean;
    backup_frequency: 'daily' | 'weekly' | 'monthly';
    backup_retention_days: number;
  };
}

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // Données fictives des paramètres
  const [settings, setSettings] = useState<AppSettings>({
    site: {
      name: 'TEKKI Studio',
      description: 'Fabrique de marques de produits et business e-commerce',
      logo: '/images/logos/logo_blue.svg',
      primary_color: '#0f4c81',
      secondary_color: '#ff7f50',
      contact_email: 'contact@tekkistudio.com',
      contact_phone: '+221 78 000 00 00',
    },
    email: {
      notification_enabled: true,
      lead_notification_emails: ['info@tekkistudio.com', 'support@tekkistudio.com'],
      sender_name: 'TEKKI Studio',
      sender_email: 'noreply@tekkistudio.com',
      welcome_template: 'Bienvenue chez TEKKI Studio, {name}!\n\nNous sommes ravis de vous accueillir parmi nous...',
      lead_template: 'Nouveau lead reçu: {name} ({email}) s\'intéresse à {business}',
    },
    notifications: {
      lead_notifications: true,
      sale_notifications: true,
      enrollment_notifications: true,
      whatsapp_notifications: false,
    },
    backup: {
      auto_backup_enabled: true,
      backup_frequency: 'daily',
      backup_retention_days: 30,
    }
  });

  useEffect(() => {
    // Au chargement de la page, essayer de récupérer les paramètres depuis la base de données
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    setLoading(true);
    
    try {
      // Récupérer les paramètres depuis Supabase
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .single();
        
      if (error) {
        // Si la table n'existe pas encore ou autre erreur
        console.warn('Erreur lors de la récupération des paramètres:', error);
      } else if (data) {
        // Paramètres trouvés dans la base de données
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des paramètres:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (section: keyof AppSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };
  
  const handleArrayChange = (section: keyof AppSettings, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value.split(',').map(item => item.trim())
      }
    }));
  };
  
  const saveSettings = async () => {
    setSaveStatus('saving');
    
    try {
      // Sauvegarder les paramètres dans Supabase
      const { data, error } = await supabase
        .from('app_settings')
        .upsert(
          { 
            id: 'app-settings', // Utiliser un ID fixe car nous n'avons qu'un seul enregistrement
            settings: settings, 
            updated_at: new Date().toISOString() 
          }, 
          { onConflict: 'id' }
        );
        
      if (error) throw error;
      
      // Log de l'activité
      await supabase
        .from('activity_logs')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          action: 'update_settings',
          details: 'Mise à jour des paramètres de l\'application',
          resource_type: 'settings',
          resource_id: 'app-settings'
        });
        
      toast.success('Paramètres enregistrés avec succès');
      setSaveStatus('saved');
      
      // Réinitialiser après 2 secondes
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement des paramètres:', err);
      toast.error('Erreur lors de l\'enregistrement des paramètres');
      setSaveStatus('idle');
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-[#0f4c81]" />
        <p>Chargement des paramètres...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0f4c81]">Paramètres</h1>
          <p className="text-gray-500">Configuration de l'application</p>
        </div>
        
        <Button 
          onClick={saveSettings}
          className="bg-[#0f4c81]"
          disabled={saveStatus !== 'idle'}
        >
          {saveStatus === 'saving' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Enregistré
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer les modifications
            </>
          )}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="email">Emails</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="backup">Sauvegarde</TabsTrigger>
        </TabsList>
        
        {/* Onglet Général */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Globe className="mr-2 h-5 w-5 text-[#0f4c81]" />
                Configuration du site
              </CardTitle>
              <CardDescription>
                Paramètres généraux du site web
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Nom du site */}
                <div className="space-y-2">
                  <Label htmlFor="site-name">Nom du site</Label>
                  <Input
                    id="site-name"
                    value={settings.site.name}
                    onChange={(e) => handleInputChange('site', 'name', e.target.value)}
                    placeholder="Nom de votre site"
                  />
                </div>
                
                {/* Logo */}
                <div className="space-y-2">
                  <Label htmlFor="site-logo">Chemin du logo</Label>
                  <Input
                    id="site-logo"
                    value={settings.site.logo}
                    onChange={(e) => handleInputChange('site', 'logo', e.target.value)}
                    placeholder="/images/logo.svg"
                  />
                </div>
                
                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="site-description">Description</Label>
                  <Textarea
                    id="site-description"
                    value={settings.site.description}
                    onChange={(e) => handleInputChange('site', 'description', e.target.value)}
                    placeholder="Description de votre site"
                    rows={3}
                  />
                </div>
                
                {/* Couleur primaire */}
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Couleur primaire</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primary-color"
                      type="text"
                      value={settings.site.primary_color}
                      onChange={(e) => handleInputChange('site', 'primary_color', e.target.value)}
                      placeholder="#0f4c81"
                    />
                    <div 
                      className="h-10 w-10 rounded border border-gray-200"
                      style={{ backgroundColor: settings.site.primary_color }}
                    />
                  </div>
                </div>
                
                {/* Couleur secondaire */}
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Couleur secondaire</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="secondary-color"
                      type="text"
                      value={settings.site.secondary_color}
                      onChange={(e) => handleInputChange('site', 'secondary_color', e.target.value)}
                      placeholder="#ff7f50"
                    />
                    <div 
                      className="h-10 w-10 rounded border border-gray-200"
                      style={{ backgroundColor: settings.site.secondary_color }}
                    />
                  </div>
                </div>
                
                {/* Email de contact */}
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email de contact</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={settings.site.contact_email}
                    onChange={(e) => handleInputChange('site', 'contact_email', e.target.value)}
                    placeholder="contact@example.com"
                  />
                </div>
                
                {/* Téléphone de contact */}
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Téléphone de contact</Label>
                  <Input
                    id="contact-phone"
                    value={settings.site.contact_phone}
                    onChange={(e) => handleInputChange('site', 'contact_phone', e.target.value)}
                    placeholder="+221 XX XXX XX XX"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Emails */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Mail className="mr-2 h-5 w-5 text-[#0f4c81]" />
                Configuration des emails
              </CardTitle>
              <CardDescription>
                Paramètres pour les notifications par email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Activer les notifications */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-notifications">Activer les notifications par email</Label>
                  <p className="text-sm text-gray-500">
                    Permet l'envoi automatique d'emails pour différents événements
                  </p>
                </div>
                <Switch
                  id="enable-notifications"
                  checked={settings.email.notification_enabled}
                  onCheckedChange={(checked) => handleInputChange('email', 'notification_enabled', checked)}
                />
              </div>
              
              <Separator />
              
              {/* Configuration d'envoi */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Configuration d'envoi</h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Nom de l'expéditeur */}
                  <div className="space-y-2">
                    <Label htmlFor="sender-name">Nom de l'expéditeur</Label>
                    <Input
                      id="sender-name"
                      value={settings.email.sender_name}
                      onChange={(e) => handleInputChange('email', 'sender_name', e.target.value)}
                      placeholder="TEKKI Studio"
                    />
                  </div>
                  
                  {/* Email de l'expéditeur */}
                  <div className="space-y-2">
                    <Label htmlFor="sender-email">Email de l'expéditeur</Label>
                    <Input
                      id="sender-email"
                      type="email"
                      value={settings.email.sender_email}
                      onChange={(e) => handleInputChange('email', 'sender_email', e.target.value)}
                      placeholder="noreply@tekkistudio.com"
                    />
                  </div>
                </div>
                
                {/* Emails de notification des leads */}
                <div className="space-y-2">
                  <Label htmlFor="notification-emails">
                    Emails recevant les notifications de leads
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="ml-1 cursor-help text-gray-400">(?)</span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p>Séparez plusieurs adresses email par des virgules</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="notification-emails"
                    value={settings.email.lead_notification_emails.join(', ')}
                    onChange={(e) => handleArrayChange('email', 'lead_notification_emails', e.target.value)}
                    placeholder="info@example.com, support@example.com"
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Templates d'email */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Templates d'email</h3>
                
                {/* Template de bienvenue */}
                <div className="space-y-2">
                  <Label htmlFor="welcome-template">Template de bienvenue</Label>
                  <Textarea
                    id="welcome-template"
                    value={settings.email.welcome_template}
                    onChange={(e) => handleInputChange('email', 'welcome_template', e.target.value)}
                    placeholder="Bienvenue {name}, nous sommes ravis..."
                    rows={5}
                  />
                  <p className="text-xs text-gray-500">
                    Variables disponibles: {'{'}name{'}'}, {'{'}email{'}'}
                  </p>
                </div>
                
                {/* Template de notification de lead */}
                <div className="space-y-2">
                  <Label htmlFor="lead-template">Template de notification de lead</Label>
                  <Textarea
                    id="lead-template"
                    value={settings.email.lead_template}
                    onChange={(e) => handleInputChange('email', 'lead_template', e.target.value)}
                    placeholder="Nouveau lead reçu: {name} ({email}) s'intéresse à {business}"
                    rows={5}
                  />
                  <p className="text-xs text-gray-500">
                    Variables disponibles: {'{'}name{'}'}, {'{'}email{'}'}, {'{'}business{'}'}, {'{'}date{'}'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BellRing className="mr-2 h-5 w-5 text-[#0f4c81]" />
                Configuration des notifications
              </CardTitle>
              <CardDescription>
                Paramètres pour les notifications dans l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {/* Notifications de leads */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="lead-notifications">Notifications de leads</Label>
                    <p className="text-sm text-gray-500">
                      Notifications de nouveaux prospects intéressés par un business
                    </p>
                  </div>
                  <Switch
                    id="lead-notifications"
                    checked={settings.notifications.lead_notifications}
                    onCheckedChange={(checked) => handleInputChange('notifications', 'lead_notifications', checked)}
                  />
                </div>
                
                <Separator />
                
                {/* Notifications de ventes */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sale-notifications">Notifications de ventes</Label>
                    <p className="text-sm text-gray-500">
                      Notifications de nouvelles ventes de business
                    </p>
                  </div>
                  <Switch
                    id="sale-notifications"
                    checked={settings.notifications.sale_notifications}
                    onCheckedChange={(checked) => handleInputChange('notifications', 'sale_notifications', checked)}
                  />
                </div>
                
                <Separator />
                
                {/* Notifications d'inscriptions */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enrollment-notifications">Notifications d'inscriptions</Label>
                    <p className="text-sm text-gray-500">
                      Notifications de nouvelles inscriptions aux formations
                    </p>
                  </div>
                  <Switch
                    id="enrollment-notifications"
                    checked={settings.notifications.enrollment_notifications}
                    onCheckedChange={(checked) => handleInputChange('notifications', 'enrollment_notifications', checked)}
                  />
                </div>
                
                <Separator />
                
                {/* Notifications WhatsApp */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="whatsapp-notifications">Notifications WhatsApp</Label>
                    <p className="text-sm text-gray-500">
                      Recevoir les notifications importantes par WhatsApp
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="whatsapp-notifications"
                      checked={settings.notifications.whatsapp_notifications}
                      onCheckedChange={(checked) => handleInputChange('notifications', 'whatsapp_notifications', checked)}
                    />
                    <div className="text-xs text-amber-600 flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      En développement
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md mt-4">
                  <p className="text-sm text-gray-600">
                    Note: Les notifications WhatsApp nécessitent une configuration supplémentaire et un abonnement au service WhatsApp Business API.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Sauvegarde */}
        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Database className="mr-2 h-5 w-5 text-[#0f4c81]" />
                Configuration de la sauvegarde
              </CardTitle>
              <CardDescription>
                Paramètres pour les sauvegardes automatiques de la base de données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Activer les sauvegardes automatiques */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-backup">Sauvegardes automatiques</Label>
                  <p className="text-sm text-gray-500">
                    Activer les sauvegardes automatiques de la base de données
                  </p>
                </div>
                <Switch
                  id="auto-backup"
                  checked={settings.backup.auto_backup_enabled}
                  onCheckedChange={(checked) => handleInputChange('backup', 'auto_backup_enabled', checked)}
                />
              </div>
              
              <Separator />
              
              {/* Options de sauvegarde */}
              <div className="space-y-4">
                {/* Fréquence de sauvegarde */}
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Fréquence de sauvegarde</Label>
                  <Select
                    value={settings.backup.backup_frequency}
                    onValueChange={(value) => handleInputChange('backup', 'backup_frequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisissez la fréquence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Quotidienne</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Durée de conservation */}
                <div className="space-y-2">
                  <Label htmlFor="retention-days">
                    Durée de conservation (jours)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="ml-1 cursor-help text-gray-400">(?)</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Nombre de jours pendant lesquels les sauvegardes sont conservées</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="retention-days"
                    type="number"
                    min={1}
                    max={365}
                    value={settings.backup.backup_retention_days}
                    onChange={(e) => handleInputChange('backup', 'backup_retention_days', parseInt(e.target.value))}
                  />
                </div>
                
                {/* Information sur Supabase */}
                <div className="bg-blue-50 p-4 rounded-md mt-4">
                  <h4 className="text-sm font-medium text-blue-700">Information</h4>
                  <p className="text-sm text-blue-600 mt-1">
                    Ces paramètres sont applicables pour les sauvegardes supplémentaires. Notez que Supabase fournit déjà des sauvegardes automatiques quotidiennes selon votre plan.
                  </p>
                </div>
                
                {/* Actions de sauvegarde */}
                <div className="pt-4">
                  <Button 
                    className="bg-[#0f4c81]"
                    onClick={() => toast.success('Sauvegarde manuelle lancée')}
                  >
                    <Database className="mr-2 h-4 w-4" />
                    Lancer une sauvegarde manuelle
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withAdminAuth(SettingsPage);