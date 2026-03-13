// app/admin/enrollments/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import Link from 'next/link';
import { formatRelativeDate } from '@/app/lib/utils/date-utils';
import {
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Edit,
  DollarSign
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { toast } from 'sonner';

// Types
interface Enrollment {
  id: string;
  formation_id: string;
  session_date: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  payment_option: string;
  payment_status: 'pending' | 'paid' | 'partial' | 'cancelled';
  amount_paid: number;
  created_at: string;
  updated_at: string;
}

interface Formation {
  id: string;
  title: string;
  slug: string;
  price: string;
  price_amount: number;
  description: string;
}

type PaymentStatusType = 'pending' | 'paid' | 'partial' | 'cancelled';
type PaymentOptionType = 'full' | 'installments';

const translatePaymentOption = (option: string): string => {
  const optionMap: Record<PaymentOptionType, string> = {
    full: 'Paiement intégral',
    installments: 'Paiement en 2 fois'
  };
  return optionMap[option as PaymentOptionType] || option;
};

const translatePaymentStatus = (status: string): string => {
  const statusMap: Record<PaymentStatusType, string> = {
    pending: 'En attente de paiement',
    paid: 'Payé',
    partial: 'Partiellement payé',
    cancelled: 'Annulé'
  };
  return statusMap[status as PaymentStatusType] || status;
};

const getStatusColor = (status: string): string => {
  const colorMap: Record<PaymentStatusType, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    paid: 'bg-green-100 text-green-800 border-green-200',
    partial: 'bg-blue-100 text-blue-800 border-blue-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };
  return colorMap[status as PaymentStatusType] || 'bg-gray-100 text-gray-800 border-gray-200';
};

function EnrollmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const enrollmentId = params.id as string;
  
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [formation, setFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // États pour le dialogue de mise à jour du paiement
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatusType>('pending');
  const [newAmountPaid, setNewAmountPaid] = useState(0);

  useEffect(() => {
    fetchEnrollmentDetails();
  }, [enrollmentId]);

  const fetchEnrollmentDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Récupération des détails de l'inscription avec ID: ${enrollmentId}`);

      // Récupérer les détails de l'inscription
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('formation_enrollments')
        .select('*')
        .eq('id', enrollmentId)
        .single();

      if (enrollmentError) {
        console.error(`Erreur lors de la récupération de l'inscription:`, enrollmentError);
        throw enrollmentError;
      }

      if (!enrollmentData) {
        console.error(`Aucune inscription trouvée avec l'ID: ${enrollmentId}`);
        throw new Error(`Aucune inscription trouvée avec l'ID: ${enrollmentId}`);
      }

      console.log(`Inscription récupérée:`, enrollmentData);
      
      setEnrollment(enrollmentData);
      setNewAmountPaid(enrollmentData.amount_paid);
      setNewPaymentStatus(enrollmentData.payment_status);

      // Récupérer les détails de la formation
      if (enrollmentData.formation_id) {
        console.log(`Récupération des détails de la formation avec ID: ${enrollmentData.formation_id}`);
        
        const { data: formationData, error: formationError } = await supabase
          .from('formations')
          .select('id, title, slug, price, price_amount, description')
          .eq('id', enrollmentData.formation_id)
          .single();

        if (formationError) {
          console.error("Erreur lors de la récupération de la formation:", formationError);
        } else {
          console.log(`Formation récupérée:`, formationData);
          setFormation(formationData);
        }
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des détails:', err);
      setError(`Une erreur est survenue lors du chargement des détails de l'inscription: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentUpdate = async () => {
    if (!enrollment) return;
    
    setIsUpdating(true);
    
    try {
      // Mettre à jour le statut et le montant payé
      const { error: updateError } = await supabase
        .from('formation_enrollments')
        .update({ 
          payment_status: newPaymentStatus,
          amount_paid: newAmountPaid,
          updated_at: new Date().toISOString()
        })
        .eq('id', enrollment.id);

      if (updateError) throw updateError;

      // Ajouter une entrée dans les activity_logs
      await supabase
        .from('activity_logs')
        .insert([
          {
            type: 'payment_update',
            description: `Mise à jour du paiement pour l'inscription à la formation de ${enrollment.full_name}`,
            metadata: { 
              enrollmentId: enrollment.id,
              previousStatus: enrollment.payment_status,
              newStatus: newPaymentStatus,
              previousAmount: enrollment.amount_paid,
              newAmount: newAmountPaid
            }
          }
        ]);

      // Mettre à jour l'état local
      setEnrollment({
        ...enrollment,
        payment_status: newPaymentStatus,
        amount_paid: newAmountPaid,
        updated_at: new Date().toISOString()
      });

      // Fermer la modale et afficher un message de succès
      setIsPaymentDialogOpen(false);
      toast.success('Paiement mis à jour avec succès');
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour du paiement:', err);
      toast.error('Une erreur est survenue lors de la mise à jour du paiement');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendInvitation = async () => {
    if (!enrollment || !formation) return;

    setIsUpdating(true);
    try {
      // Ici, vous pourriez intégrer un service d'envoi d'emails
      // Pour l'instant, nous simulons simplement un succès
      
      await supabase
        .from('activity_logs')
        .insert([
          {
            type: 'invitation_sent',
            description: `Invitation envoyée à ${enrollment.email} pour la formation ${formation.title}`,
            metadata: { 
              enrollmentId: enrollment.id,
              email: enrollment.email,
              formationTitle: formation.title
            }
          }
        ]);
      
      toast.success(`Invitation envoyée à ${enrollment.email}`);
    } catch (err) {
      console.error('Erreur lors de l\'envoi de l\'invitation:', err);
      toast.error('Une erreur est survenue lors de l\'envoi de l\'invitation');
    } finally {
      setIsUpdating(false);
    }
  };

  // Calculer le montant total à payer en fonction de l'option de paiement
  const getTotalAmountToPay = () => {
    if (!formation) return 0;
    return formation.price_amount;
  };

  // Calculer le montant de la première tranche pour le paiement en 2 fois
  const getFirstInstallmentAmount = () => {
    if (!formation) return 0;
    return Math.ceil(formation.price_amount / 2);
  };

  // Calculer le montant de la deuxième tranche pour le paiement en 2 fois
  const getSecondInstallmentAmount = () => {
    if (!formation) return 0;
    return formation.price_amount - getFirstInstallmentAmount();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff7f50]" />
      </div>
    );
  }

  if (error || !enrollment) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error || "Cette inscription n'existe pas ou a été supprimée"}</p>
          </div>
        </div>
        <Link 
          href="/admin/enrollments" 
          className="inline-flex items-center text-[#0f4c81] hover:text-[#ff7f50]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste des inscriptions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Fil d'Ariane et navigation */}
      <div className="mb-8">
        <Link 
          href="/admin/enrollments" 
          className="inline-flex items-center text-[#0f4c81] hover:text-[#ff7f50]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste des inscriptions
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* En-tête */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-[#0f4c81]">{enrollment.full_name}</h1>
                <p className="text-gray-500 mt-1">
                  Inscription du {new Date(enrollment.created_at).toLocaleDateString('fr-FR')}
                  {' '}({formatRelativeDate(enrollment.created_at)})
                </p>
              </div>

              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(enrollment.payment_status)}`}>
                {translatePaymentStatus(enrollment.payment_status)}
              </div>
            </div>
          </div>

          {/* Informations de la formation */}
          {formation && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-[#0f4c81] mb-4 border-b pb-2">
                Détails de la formation
              </h2>
              
              <div className="flex items-start">
                <div className="flex-grow">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="font-medium text-lg">{formation.title}</h3>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Prix total</p>
                      <p className="font-medium">{formation.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Session</p>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{enrollment.session_date}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Option de paiement</p>
                      <p className="font-medium">{translatePaymentOption(enrollment.payment_option)}</p>
                    </div>
                    {enrollment.payment_option === 'installments' && (
                      <div>
                        <p className="text-sm text-gray-500">Détail des tranches</p>
                        <p className="font-medium">
                          1ère tranche: {getFirstInstallmentAmount().toLocaleString('fr-FR')} FCFA
                          <br />
                          2ème tranche: {getSecondInstallmentAmount().toLocaleString('fr-FR')} FCFA
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Link
                  href={`/admin/formations/${formation.id}/edit`}
                  className="bg-[#0f4c81] text-white px-3 py-1 rounded text-sm hover:bg-opacity-90 transition-colors"
                >
                  Voir la formation
                </Link>
              </div>
            </div>
          )}

          {/* Informations de paiement */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-semibold text-[#0f4c81]">
                Informations de paiement
              </h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsPaymentDialogOpen(true)}
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Mettre à jour
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 text-sm">Statut du paiement</p>
                <div className={`inline-block px-3 py-1 mt-1 rounded-full text-sm font-medium border ${getStatusColor(enrollment.payment_status)}`}>
                  {translatePaymentStatus(enrollment.payment_status)}
                </div>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Montant payé</p>
                <p className="font-medium text-lg">{enrollment.amount_paid.toLocaleString('fr-FR')} FCFA</p>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Montant total</p>
                <p className="font-medium">{getTotalAmountToPay().toLocaleString('fr-FR')} FCFA</p>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Reste à payer</p>
                <p className="font-medium">
                  {(getTotalAmountToPay() - enrollment.amount_paid).toLocaleString('fr-FR')} FCFA
                  {getTotalAmountToPay() - enrollment.amount_paid > 0 && enrollment.payment_option === 'installments' && (
                    <span className="ml-1 text-xs text-gray-500">(2ème tranche)</span>
                  )}
                </p>
              </div>
            </div>
            
            {/* Progrès du paiement */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Progression du paiement</span>
                <span>{Math.round((enrollment.amount_paid / getTotalAmountToPay()) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-[#0f4c81] h-2.5 rounded-full" 
                  style={{ width: `${Math.min(100, Math.round((enrollment.amount_paid / getTotalAmountToPay()) * 100))}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="font-semibold text-[#0f4c81] mb-4">Actions</h2>
            
            <div className="space-y-3">
              {enrollment.payment_status === 'pending' && (
                <button
                  onClick={() => setIsPaymentDialogOpen(true)}
                  disabled={isUpdating}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  {isUpdating ? 'Mise à jour...' : 'Enregistrer un paiement'}
                </button>
              )}
              
              {enrollment.payment_status === 'partial' && (
                <button
                  onClick={() => {
                    setNewPaymentStatus('paid');
                    setNewAmountPaid(getTotalAmountToPay());
                    setIsPaymentDialogOpen(true);
                  }}
                  disabled={isUpdating}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isUpdating ? 'Mise à jour...' : 'Marquer comme totalement payé'}
                </button>
              )}
              
              {(enrollment.payment_status === 'paid' || enrollment.payment_status === 'partial') && (
                <button
                  onClick={handleSendInvitation}
                  disabled={isUpdating}
                  className="w-full bg-[#0f4c81] text-white py-2 rounded hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {isUpdating ? 'Envoi...' : 'Envoyer l\'invitation'}
                </button>
              )}
              
              {enrollment.payment_status !== 'cancelled' && (
                <button
                  onClick={() => {
                    setNewPaymentStatus('cancelled');
                    setIsPaymentDialogOpen(true);
                  }}
                  disabled={isUpdating}
                  className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {isUpdating ? 'Mise à jour...' : 'Annuler l\'inscription'}
                </button>
              )}
              
              {/* Boutons de contact */}
              <div className="pt-4 border-t mt-4">
                <a
                  href={`mailto:${enrollment.email}`}
                  className="w-full bg-[#ff7f50] text-white py-2 rounded hover:bg-opacity-90 transition-colors flex justify-center items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer un email
                </a>
                
                <a
                  href={`tel:${enrollment.phone}`}
                  className="w-full mt-2 border border-[#0f4c81] text-[#0f4c81] py-2 rounded hover:bg-gray-50 transition-colors flex justify-center items-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </a>
                
                <a
                  href={`https://wa.me/${enrollment.phone.replace(/\s+/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-2 bg-green-500 text-white py-2 rounded hover:bg-opacity-90 transition-colors flex justify-center items-center"
                >
                  <span className="mr-2">WhatsApp</span>
                  Contacter
                </a>
              </div>
            </div>
          </div>
          
          {/* Informations de contact */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="font-semibold text-[#0f4c81] mb-4">Informations de contact</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href={`mailto:${enrollment.email}`} className="text-[#0f4c81] hover:underline">
                    {enrollment.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <a href={`tel:${enrollment.phone}`} className="text-[#0f4c81] hover:underline">
                    {enrollment.phone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Localisation</p>
                  <p>{enrollment.city}, {enrollment.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogue de mise à jour du paiement */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Mettre à jour le paiement</DialogTitle>
            <DialogDescription>
              Modifiez le statut du paiement et le montant payé pour cette inscription.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Statut du paiement</Label>
              <Select 
                value={newPaymentStatus} 
                onValueChange={(value) => setNewPaymentStatus(value as PaymentStatusType)}
              >
                <SelectTrigger id="paymentStatus">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="partial">Partiellement payé</SelectItem>
                  <SelectItem value="paid">Payé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newPaymentStatus !== 'cancelled' && newPaymentStatus !== 'pending' && (
              <div className="space-y-2">
                <Label htmlFor="amountPaid">Montant payé (FCFA)</Label>
                <Input
                  id="amountPaid"
                  type="number"
                  value={newAmountPaid}
                  onChange={(e) => setNewAmountPaid(parseInt(e.target.value) || 0)}
                  placeholder="Montant en FCFA"
                />
                
                {newPaymentStatus === 'paid' && newAmountPaid < getTotalAmountToPay() && (
                  <p className="text-red-500 text-sm">
                    Attention: Le montant payé est inférieur au montant total ({getTotalAmountToPay().toLocaleString('fr-FR')} FCFA).
                  </p>
                )}

                {newPaymentStatus === 'partial' && newAmountPaid >= getTotalAmountToPay() && (
                  <p className="text-orange-500 text-sm">
                    Attention: Le montant payé couvre le montant total. Le statut devrait être "Payé".
                  </p>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsPaymentDialogOpen(false)}
              disabled={isUpdating}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              onClick={handlePaymentUpdate}
              disabled={isUpdating}
              className="bg-[#0f4c81] hover:bg-[#0f4c81]/90"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withAdminAuth(EnrollmentDetailPage);