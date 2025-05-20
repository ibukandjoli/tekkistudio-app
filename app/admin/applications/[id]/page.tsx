// app/admin/applications/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Briefcase, 
  Link as LinkIcon, 
  Linkedin,
  Trash2,
  Edit,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Globe,
  Send
} from 'lucide-react';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import { getJobApplicationById, updateJobApplicationStatus, deleteJobApplication, getJobOpeningById } from '@/app/lib/db/jobs';
import type { JobApplication } from '@/app/types/database';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { formatRelativeDate } from '@/app/lib/utils/date-utils';

function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;
  
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [jobOpening, setJobOpening] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [notesEditing, setNotesEditing] = useState(false);
  const [status, setStatus] = useState<JobApplication['status']>('new');
  const [updating, setUpdating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Déclaration d'une interface étendue qui inclut les informations de l'offre d'emploi
interface ExtendedJobApplication extends JobApplication {
  job_details?: {
    id: string;
    title: string;
    slug?: string;
    department: string;
    location: string;
    type: string;
  };
}
  
  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId]);
  
  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const applicationData = await getJobApplicationById(applicationId);
      
      if (!applicationData) {
        setError('La candidature n\'a pas été trouvée');
        return;
      }
      
      // Conversion du type pour l'adapter à notre interface étendue
      const extendedData = applicationData as ExtendedJobApplication;
      
      setApplication(extendedData);
      setStatus(extendedData.status);
      setNotes(extendedData.notes || '');
      
      // Accéder aux informations de l'offre d'emploi de manière sécurisée
      if (extendedData.job_details) {
        setJobOpening(extendedData.job_details);
      } else if (extendedData.job_opening_id) {
        // Récupérer les détails de l'offre d'emploi séparément si nécessaire
        try {
          const jobData = await getJobOpeningById(extendedData.job_opening_id);
          if (jobData) {
            setJobOpening(jobData);
          }
        } catch (jobErr) {
          console.error('Erreur lors de la récupération des détails du poste:', jobErr);
          // Ne pas échouer complètement si les détails du poste ne peuvent pas être récupérés
        }
      }
      
    } catch (err) {
      console.error('Erreur lors du chargement des détails de la candidature:', err);
      setError('Une erreur est survenue lors du chargement des détails de la candidature.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (newStatus: JobApplication['status']) => {
    if (!application) return;
    
    try {
      setUpdating(true);
      
      await updateJobApplicationStatus(applicationId, newStatus, notes);
      
      setStatus(newStatus);
      setApplication(prev => prev ? { ...prev, status: newStatus } : null);
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      setError('Erreur lors de la mise à jour du statut. Veuillez réessayer.');
    } finally {
      setUpdating(false);
    }
  };
  
  const handleNotesUpdate = async () => {
    if (!application) return;
    
    try {
      setUpdating(true);
      
      await updateJobApplicationStatus(applicationId, status, notes);
      
      setNotesEditing(false);
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour des notes:', err);
      setError('Erreur lors de la mise à jour des notes. Veuillez réessayer.');
    } finally {
      setUpdating(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      setUpdating(true);
      
      await deleteJobApplication(applicationId);
      
      setDeleteDialogOpen(false);
      
      // Redirection vers la liste
      router.push('/admin/applications');
      
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression. Veuillez réessayer.');
    } finally {
      setUpdating(false);
    }
  };
  
  const getStatusBadgeVariant = (status: JobApplication['status']) => {
    switch (status) {
      case 'new': return 'candidateNew';
      case 'reviewing': return 'candidateReviewing';
      case 'interview': return 'candidateInterview';
      case 'hired': return 'candidateHired';
      case 'rejected': return 'candidateRejected';
      default: return 'default';
    }
  };
  
  const getStatusDisplayName = (status: JobApplication['status']) => {
    switch (status) {
      case 'new': return 'Nouveau';
      case 'reviewing': return 'En revue';
      case 'interview': return 'Entretien';
      case 'hired': return 'Embauché';
      case 'rejected': return 'Refusé';
      default: return status;
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-tekki-coral mb-4" />
        <p className="text-gray-500">Chargement des détails de la candidature...</p>
      </div>
    );
  }
  
  if (error || !application) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-1" />
          <div>
            <h3 className="font-medium text-red-800">Erreur</h3>
            <p className="text-red-700">{error || 'La candidature n\'a pas été trouvée'}</p>
          </div>
        </div>
        <Link href="/admin/applications" className="flex items-center text-tekki-blue hover:text-tekki-coral">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste des candidatures
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-tekki-blue">
            Candidature de {application.full_name}
          </h2>
          <p className="text-gray-500">
            Pour le poste {jobOpening ? `"${jobOpening.title}"` : 'de candidature spontanée'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Link href="/admin/applications">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          
          <Button
            variant="destructive"
            className="flex items-center"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>
      
      {/* Statut actuel et actions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Statut de la candidature</CardTitle>
            <Badge variant={getStatusBadgeVariant(application.status)}>
              {getStatusDisplayName(application.status)}
            </Badge>
          </div>
          <CardDescription>
            Candidature reçue {formatRelativeDate(application.created_at)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as JobApplication['status'])}
              disabled={updating}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Changer le statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">
                  <Badge variant="candidateNew">Nouveau</Badge>
                </SelectItem>
                <SelectItem value="reviewing">
                  <Badge variant="candidateReviewing">En revue</Badge>
                </SelectItem>
                <SelectItem value="interview">
                  <Badge variant="candidateInterview">Entretien</Badge>
                </SelectItem>
                <SelectItem value="hired">
                  <Badge variant="candidateHired">Embauché</Badge>
                </SelectItem>
                <SelectItem value="rejected">
                  <Badge variant="candidateRejected">Refusé</Badge>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              onClick={() => handleStatusChange(status)}
              disabled={updating || application.status === status}
              className="bg-tekki-blue hover:bg-tekki-blue/90"
            >
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                'Mettre à jour le statut'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne d'infos principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations du candidat */}
          <Card>
            <CardHeader>
              <CardTitle>Informations du candidat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <a href={`mailto:${application.email}`} className="text-tekki-blue hover:text-tekki-coral">
                    {application.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Téléphone</div>
                  <a href={`tel:${application.phone}`} className="text-tekki-blue hover:text-tekki-coral">
                    {application.phone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Localisation</div>
                  <div>{application.location}</div>
                </div>
              </div>
              
              {application.portfolio_url && (
                <div className="flex items-start">
                  <LinkIcon className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Portfolio</div>
                    <a 
                      href={application.portfolio_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-tekki-blue hover:text-tekki-coral"
                    >
                      {application.portfolio_url}
                    </a>
                  </div>
                </div>
              )}
              
              {application.linkedin_url && (
                <div className="flex items-start">
                  <Linkedin className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">LinkedIn</div>
                    <a 
                      href={application.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-tekki-blue hover:text-tekki-coral"
                    >
                      {application.linkedin_url}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Lettre de motivation */}
          {application.cover_letter && (
            <Card>
              <CardHeader>
                <CardTitle>Lettre de motivation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line">
                  {application.cover_letter}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Notes internes */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Notes internes</CardTitle>
                {!notesEditing && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setNotesEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                )}
              </div>
              <CardDescription>
                Notes privées concernant cette candidature
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notesEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ajoutez des notes internes concernant cette candidature..."
                    rows={5}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setNotes(application.notes || '');
                        setNotesEditing(false);
                      }}
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleNotesUpdate}
                      disabled={updating}
                      className="bg-tekki-blue hover:bg-tekki-blue/90"
                    >
                      {updating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sauvegarde...
                        </>
                      ) : (
                        'Sauvegarder les notes'
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
                  {notes ? (
                    <div className="whitespace-pre-line">{notes}</div>
                  ) : (
                    <div className="text-gray-500 italic">
                      Aucune note pour le moment. Cliquez sur "Modifier" pour ajouter des notes.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Infos sur le poste */}
          {jobOpening && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Détails du poste</CardTitle>
                  {jobOpening.slug && (
                    <Link href={`/careers/${jobOpening.slug}`} target="_blank">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        Voir
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Poste</div>
                  <div className="font-medium">{jobOpening.title}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500">Département</div>
                  <div>{jobOpening.department}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500">Localisation</div>
                  <div>{jobOpening.location}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500">Type</div>
                  <div>{jobOpening.type}</div>
                </div>
                
                <Link href={`/admin/jobs/${jobOpening.id}/edit`} className="text-tekki-blue hover:text-tekki-coral inline-flex items-center text-sm">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Gérer cette offre d'emploi
                </Link>
              </CardContent>
            </Card>
          )}
          
          {/* CV */}
          {application.resume_url && (
            <Card>
              <CardHeader>
                <CardTitle>Curriculum Vitae</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={application.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-tekki-blue hover:bg-tekki-blue/90 text-white px-4 py-3 rounded-lg flex items-center justify-center"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Voir le CV
                </a>
              </CardContent>
            </Card>
          )}
          
          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href={`mailto:${application.email}`}
                className="bg-tekki-coral hover:bg-tekki-coral/90 text-white px-4 py-3 rounded-lg flex items-center justify-center"
              >
                <Mail className="h-5 w-5 mr-2" />
                Envoyer un email
              </a>
              
              {application.phone && (
                <a
                  href={`tel:${application.phone}`}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg flex items-center justify-center"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Appeler
                </a>
              )}
              
              <a
                href={`https://wa.me/${application.phone.replace(/\s+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg flex items-center justify-center"
              >
                <Send className="h-5 w-5 mr-2" />
                WhatsApp
              </a>
            </CardContent>
          </Card>
          
          {/* Historique */}
          <Card>
            <CardHeader>
              <CardTitle>Historique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-2 h-full">
                    <div className="bg-tekki-coral h-6 w-6 rounded-full flex items-center justify-center text-white">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="h-full w-0.5 bg-gray-200 mx-auto mt-1"></div>
                  </div>
                  <div>
                    <div className="font-medium">Candidature reçue</div>
                    <div className="text-sm text-gray-500">
                      {new Date(application.created_at).toLocaleDateString('fr-FR')} ({formatRelativeDate(application.created_at)})
                    </div>
                  </div>
                </div>
                
                {application.updated_at !== application.created_at && (
                  <div className="flex">
                    <div className="mr-2">
                      <div className="bg-tekki-blue h-6 w-6 rounded-full flex items-center justify-center text-white">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Dernière mise à jour</div>
                      <div className="text-sm text-gray-500">
                        {new Date(application.updated_at).toLocaleDateString('fr-FR')} ({formatRelativeDate(application.updated_at)})
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Dialog de confirmation de suppression */}
      <AlertDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement la candidature
              de {application.full_name}.
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

export default withAdminAuth(ApplicationDetailPage);