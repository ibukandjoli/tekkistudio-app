// app/admin/users/page.tsx
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
  CardFooter,
} from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/app/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  User,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users as UsersIcon,
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  Key,
  RefreshCw,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { ScrollArea } from '@/app/components/ui/scroll-area';

// Types pour les utilisateurs
interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  phone?: string;
  created_at: string;
  last_login?: string;
  avatar_url?: string;
}

interface NewUserFormData {
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'editor' | 'viewer';
  phone?: string;
}

function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Formulaire pour nouvel utilisateur
  const [newUserForm, setNewUserForm] = useState<NewUserFormData>({
    email: '',
    first_name: '',
    last_name: '',
    role: 'editor',
    phone: '',
  });
  
  // Validation du formulaire
  const [formErrors, setFormErrors] = useState({
    email: false,
    first_name: false,
    last_name: false
  });
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    setLoading(true);
    
    try {
      // Récupérer les utilisateurs depuis la table admin_users
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setUsers(data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };
  
  // Filtrer les utilisateurs en fonction de la recherche
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      user.first_name.toLowerCase().includes(searchLower) ||
      user.last_name.toLowerCase().includes(searchLower) ||
      (user.phone && user.phone.includes(searchQuery))
    );
  });
  
  // Gérer les changements dans le formulaire
  const handleFormChange = (field: keyof NewUserFormData, value: string) => {
    setNewUserForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Réinitialiser l'erreur pour ce champ
    if (field in formErrors) {
      setFormErrors(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };
  
  // Validation du formulaire
  const validateForm = () => {
    const errors = {
      email: !newUserForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserForm.email),
      first_name: !newUserForm.first_name,
      last_name: !newUserForm.last_name
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };
  
  // Ajouter un nouvel utilisateur
  const handleAddUser = async () => {
    if (!validateForm()) return;
    
    setActionLoading(true);
    
    try {
      // 1. D'abord, inviter l'utilisateur via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(
        newUserForm.email, 
        { 
          data: {
            first_name: newUserForm.first_name,
            last_name: newUserForm.last_name,
            role: newUserForm.role
          }
        }
      );
      
      if (authError) throw authError;
      
      // 2. Ensuite, ajouter l'utilisateur dans notre table admin_users
      const newUser = {
        id: authData.user?.id || '?',
        email: newUserForm.email,
        first_name: newUserForm.first_name,
        last_name: newUserForm.last_name,
        role: newUserForm.role,
        phone: newUserForm.phone || null,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      const { error: dbError } = await supabase
        .from('admin_users')
        .insert(newUser);
        
      if (dbError) throw dbError;
      
      // Log de l'activité
      await supabase
        .from('activity_logs')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          action: 'create_user',
          details: `Ajout de l'utilisateur ${newUserForm.email}`,
          resource_type: 'admin_user',
          resource_id: newUser.id
        });
      
      // Réinitialiser le formulaire
      setNewUserForm({
        email: '',
        first_name: '',
        last_name: '',
        role: 'editor',
        phone: '',
      });
      
      // Fermer le dialogue
      setIsAddUserOpen(false);
      
      // Rafraîchir la liste des utilisateurs
      await fetchUsers();
      
      toast.success('Invitation envoyée avec succès', {
        description: `Un email d'invitation a été envoyé à ${newUserForm.email}`
      });
      
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', err);
      toast.error('Erreur lors de l\'ajout de l\'utilisateur');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Mettre à jour un utilisateur
  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    setActionLoading(true);
    
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({
          first_name: newUserForm.first_name,
          last_name: newUserForm.last_name,
          role: newUserForm.role,
          phone: newUserForm.phone || null
        })
        .eq('id', selectedUser.id);
        
      if (error) throw error;
      
      // Mettre à jour les métadonnées Supabase Auth
      const { error: authError } = await supabase.auth.admin.updateUserById(
        selectedUser.id,
        { 
          user_metadata: {
            first_name: newUserForm.first_name,
            last_name: newUserForm.last_name,
            role: newUserForm.role
          }
        }
      );
      
      if (authError) throw authError;
      
      // Log de l'activité
      await supabase
        .from('activity_logs')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          action: 'update_user',
          details: `Mise à jour de l'utilisateur ${selectedUser.email}`,
          resource_type: 'admin_user',
          resource_id: selectedUser.id
        });
      
      // Fermer le dialogue
      setIsEditUserOpen(false);
      
      // Rafraîchir la liste des utilisateurs
      await fetchUsers();
      
      toast.success('Utilisateur mis à jour avec succès');
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
      toast.error('Erreur lors de la mise à jour de l\'utilisateur');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Supprimer un utilisateur
  const handleDeleteUser = async (user: AdminUser) => {
    setActionLoading(true);
    
    try {
      // 1. Supprimer l'utilisateur de la base de données
      const { error: dbError } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', user.id);
        
      if (dbError) throw dbError;
      
      // 2. Désactiver l'utilisateur dans Supabase Auth
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (authError) throw authError;
      
      // Log de l'activité
      await supabase
        .from('activity_logs')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          action: 'delete_user',
          details: `Suppression de l'utilisateur ${user.email}`,
          resource_type: 'admin_user',
          resource_id: user.id
        });
      
      // Rafraîchir la liste des utilisateurs
      await fetchUsers();
      
      toast.success('Utilisateur supprimé avec succès');
      
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', err);
      toast.error('Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Réinviter un utilisateur
  const handleResendInvitation = async (user: AdminUser) => {
    setActionLoading(true);
    
    try {
      // Réinviter l'utilisateur via Supabase Auth
      const { error } = await supabase.auth.admin.inviteUserByEmail(
        user.email,
        { 
          data: {
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role
          }
        }
      );
      
      if (error) throw error;
      
      // Log de l'activité
      await supabase
        .from('activity_logs')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          action: 'resend_invitation',
          details: `Réinvitation de l'utilisateur ${user.email}`,
          resource_type: 'admin_user',
          resource_id: user.id
        });
      
      toast.success('Invitation renvoyée avec succès', {
        description: `Un nouvel email d'invitation a été envoyé à ${user.email}`
      });
      
    } catch (err) {
      console.error('Erreur lors de l\'envoi de l\'invitation:', err);
      toast.error('Erreur lors de l\'envoi de l\'invitation');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Changer le statut d'un utilisateur
  const handleToggleStatus = async (user: AdminUser) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ status: newStatus })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Log de l'activité
      await supabase
        .from('activity_logs')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          action: 'update_user_status',
          details: `Statut de l'utilisateur ${user.email} changé à ${newStatus}`,
          resource_type: 'admin_user',
          resource_id: user.id
        });
      
      // Rafraîchir la liste des utilisateurs
      await fetchUsers();
      
      toast.success(`Utilisateur ${newStatus === 'active' ? 'activé' : 'désactivé'} avec succès`);
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };
  
  // Réinitialiser le mot de passe
  const handleResetPassword = async (user: AdminUser) => {
    try {
      // Utiliser la bonne méthode de l'API Supabase pour réinitialiser le mot de passe
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/admin/reset-password-confirmation`,
      });
      
      if (error) throw error;
      
      toast.success('Email de réinitialisation envoyé', {
        description: `Un email de réinitialisation a été envoyé à ${user.email}`
      });
      
    } catch (err) {
      console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', err);
      toast.error('Erreur lors de l\'envoi de l\'email de réinitialisation');
    }
  };
  
  // Ouvrir le dialogue de modification
  const openEditDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setNewUserForm({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      phone: user.phone || '',
    });
    setIsEditUserOpen(true);
  };
  
  // Formatter les dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Obtenir les initiales pour l'avatar
  const getInitials = (firstName: string, lastName: string) => {
    // Vérifier que firstName et lastName ne sont pas undefined ou vides
    const firstInitial = firstName && firstName.length > 0 ? firstName.charAt(0) : '?';
    const lastInitial = lastName && lastName.length > 0 ? lastName.charAt(0) : '?';
    
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };
  
  // Obtenir la couleur de fond pour l'avatar en fonction du rôle
  const getAvatarColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'editor':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Rendu du badge de statut
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Actif</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Inactif</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">En attente</Badge>;
      default:
        return null;
    }
  };
  
  // Rendu du badge de rôle
  const renderRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Administrateur</Badge>;
      case 'editor':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Éditeur</Badge>;
      case 'viewer':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Lecteur</Badge>;
      default:
        return null;
    }
  };
  
  // Description des rôles
  const roleDescriptions = {
    admin: "Accès complet à toutes les fonctionnalités et paramètres",
    editor: "Peut créer et modifier du contenu, mais pas accéder aux paramètres système",
    viewer: "Peut uniquement consulter les données sans y apporter de modifications"
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-[#0f4c81]" />
        <p>Chargement des utilisateurs...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0f4c81]">Utilisateurs</h1>
          <p className="text-gray-500">Gestion des utilisateurs de l'espace administrateur</p>
        </div>
        
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0f4c81]">
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter un utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
              <DialogDescription>
                L'utilisateur recevra un email d'invitation pour créer son compte.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Prénom</Label>
                  <Input
                    id="first_name"
                    value={newUserForm.first_name}
                    onChange={(e) => handleFormChange('first_name', e.target.value)}
                    className={formErrors.first_name ? 'border-red-500' : ''}
                  />
                  {formErrors.first_name && (
                    <p className="text-xs text-red-500">Prénom requis</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="last_name">Nom</Label>
                  <Input
                    id="last_name"
                    value={newUserForm.last_name}
                    onChange={(e) => handleFormChange('last_name', e.target.value)}
                    className={formErrors.last_name ? 'border-red-500' : ''}
                  />
                  {formErrors.last_name && (
                    <p className="text-xs text-red-500">Nom requis</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  className={formErrors.email ? 'border-red-500' : ''}
                />
                {formErrors.email && (
                  <p className="text-xs text-red-500">Email valide requis</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone (optionnel)</Label>
                <Input
                  id="phone"
                  value={newUserForm.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                  placeholder="Ex: +221 XX XXX XX XX"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Select
                  value={newUserForm.role}
                  onValueChange={(value) => handleFormChange('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="editor">Éditeur</SelectItem>
                    <SelectItem value="viewer">Lecteur</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  {newUserForm.role && roleDescriptions[newUserForm.role as keyof typeof roleDescriptions]}
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleAddUser} 
                className="bg-[#0f4c81]"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Inviter l'utilisateur
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Rechercher un utilisateur..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Tableau des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <UsersIcon className="mr-2 h-5 w-5 text-[#0f4c81]" />
            Liste des utilisateurs
          </CardTitle>
          <CardDescription>
            {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} trouvé{filteredUsers.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-350px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            {user.avatar_url ? (
                              <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
                            ) : (
                              <AvatarFallback className={getAvatarColor(user.role)}>
                                {getInitials(user.first_name, user.last_name)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            {user.phone && (
                              <div className="text-xs text-gray-400">{user.phone}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {renderRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>
                        {renderStatusBadge(user.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(user.created_at)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {user.last_login 
                            ? formatDate(user.last_login)
                            : <span className="text-gray-400">Jamais</span>
                          }
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem onClick={() => openEditDialog(user)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                              {user.status === 'active' ? (
                                <>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Désactiver
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Activer
                                </>
                              )}
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                              <Key className="mr-2 h-4 w-4" />
                              Réinitialiser le mot de passe
                            </DropdownMenuItem>
                            
                            {user.status === 'pending' && (
                              <DropdownMenuItem onClick={() => handleResendInvitation(user)}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Renvoyer l'invitation
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                                  <span className="text-red-600">Supprimer</span>
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer cet utilisateur ?
                                    <div className="mt-2 p-2 bg-gray-50 rounded-md">
                                      <p className="font-medium">{user.first_name} {user.last_name}</p>
                                      <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                    Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => handleDeleteUser(user)}
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <p className="text-sm text-gray-500">
            <Shield className="inline-block mr-2 h-4 w-4" />
            Les utilisateurs invités doivent créer un compte pour accéder à l'espace administrateur.
          </p>
        </CardFooter>
      </Card>
      
      {/* Dialogue de modification d'utilisateur */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifier les informations de l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_first_name">Prénom</Label>
                <Input
                  id="edit_first_name"
                  value={newUserForm.first_name}
                  onChange={(e) => handleFormChange('first_name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit_last_name">Nom</Label>
                <Input
                  id="edit_last_name"
                  value={newUserForm.last_name}
                  onChange={(e) => handleFormChange('last_name', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_email">Adresse email</Label>
              <Input
                id="edit_email"
                type="email"
                value={newUserForm.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">L'adresse email ne peut pas être modifiée</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_phone">Téléphone (optionnel)</Label>
              <Input
                id="edit_phone"
                value={newUserForm.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                placeholder="Ex: +221 XX XXX XX XX"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_role">Rôle</Label>
              <Select
                value={newUserForm.role}
                onValueChange={(value) => handleFormChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="editor">Éditeur</SelectItem>
                  <SelectItem value="viewer">Lecteur</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {newUserForm.role && roleDescriptions[newUserForm.role as keyof typeof roleDescriptions]}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleUpdateUser} 
              className="bg-[#0f4c81]"
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withAdminAuth(UsersPage);