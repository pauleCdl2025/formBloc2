import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, Search, Eye, Trash2, Calendar, User, FileText, Heart, Shield, Stethoscope } from 'lucide-react';

interface FormData {
  patient_number: string;
  data: any;
  form_type: string;
  created_at: string;
  updated_at: string;
}

interface FormConsultationProps {
  onBackToList: () => void;
}

const FormConsultation: React.FC<FormConsultationProps> = ({ onBackToList }) => {
  const [forms, setForms] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormType, setSelectedFormType] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    results: 0
  });

  useEffect(() => {
    loadForms();
  }, []);

  useEffect(() => {
    updateStats();
  }, [forms, searchTerm, selectedFormType]);

  const loadForms = async () => {
    try {
      const { data, error } = await supabase
        .from('preanesthesia_forms')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setForms(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des formulaires:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = () => {
    const filteredForms = getFilteredForms();
    const thisMonth = new Date();
    thisMonth.setDate(1);
    
    const thisMonthForms = filteredForms.filter(form => 
      new Date(form.created_at) >= thisMonth
    );

    setStats({
      total: filteredForms.length,
      thisMonth: thisMonthForms.length,
      results: filteredForms.length
    });
  };

  const getFilteredForms = () => {
    let filtered = forms;

    // Filter by form type
    if (selectedFormType !== 'all') {
      filtered = filtered.filter(form => form.form_type === selectedFormType);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(form => {
        const patientData = form.data?.patient || {};
        const patientName = `${patientData.nom || ''} ${patientData.prenom || ''}`.toLowerCase();
        const patientNumber = form.patient_number?.toLowerCase() || '';
        return patientName.includes(term) || patientNumber.includes(term);
      });
    }

    return filtered;
  };

  const handleDeleteForm = async (patientNumber: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce formulaire ?')) return;

    try {
      const { error } = await supabase
        .from('preanesthesia_forms')
        .delete()
        .eq('patient_number', patientNumber);

      if (error) throw error;
      
      await loadForms();
      alert('Formulaire supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du formulaire');
    }
  };

  const getFormIcon = (formType: string) => {
    switch (formType) {
      case 'preanesthesia':
        return <Stethoscope className="w-5 h-5 text-blue-600" />;
      case 'surveillance_sspi':
        return <Heart className="w-5 h-5 text-purple-600" />;
      case 'compte_rendu_preanesthesique':
        return <FileText className="w-5 h-5 text-blue-700" />;
      case 'consentement_anesthesique':
        return <Shield className="w-5 h-5 text-slate-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getFormTypeName = (formType: string) => {
    switch (formType) {
      case 'preanesthesia':
        return 'Consultation Pré-Anesthésique';
      case 'surveillance_sspi':
        return 'Surveillance SSPI';
      case 'compte_rendu_preanesthesique':
        return 'Compte-rendu Pré-anesthésique';
      case 'consentement_anesthesique':
        return 'Consentement Anesthésique';
      default:
        return formType;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredForms = getFilteredForms();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des formulaires...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <img 
                src="https://res.cloudinary.com/dd64mwkl2/image/upload/v1758286702/Centre_Diagnostic-Logo_xhxxpv.png" 
                alt="Centre Diagnostic de Libreville" 
                className="h-16 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-[#1e3a8a]">Consultation des Formulaires</h1>
                <p className="text-gray-600">Gestion des consultations pré-anesthésiques</p>
              </div>
            </div>
            <button
              onClick={onBackToList}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition shadow-md"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux formulaires
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par numéro, nom ou prénom..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter by Form Type */}
          <div className="mt-4">
            <select
              value={selectedFormType}
              onChange={(e) => setSelectedFormType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les formulaires</option>
              <option value="preanesthesia">Consultation Pré-Anesthésique</option>
              <option value="surveillance_sspi">Surveillance SSPI</option>
              <option value="compte_rendu_preanesthesique">Compte-rendu Pré-anesthésique</option>
              <option value="consentement_anesthesique">Consentement Anesthésique</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Ce Mois</p>
                <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Résultats</p>
                <p className="text-2xl font-bold text-gray-900">{stats.results}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Forms Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PATIENT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NUMÉRO
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TYPE DE FORMULAIRE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    INTERVENTION
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CRÉÉ LE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MODIFIÉ LE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredForms.map((form, index) => {
                  const patientData = form.data?.patient || {};
                  const interventionData = form.data?.intervention || {};
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {patientData.nom || 'N/A'} {patientData.prenom || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {patientData.age || 'Âge non renseigné'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {form.patient_number || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getFormIcon(form.form_type)}
                          <span className="ml-2 text-sm text-gray-900">
                            {getFormTypeName(form.form_type)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {interventionData.type || 'Non spécifiée'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {interventionData.datePrevue ? 
                            new Date(interventionData.datePrevue).toLocaleDateString('fr-FR') : 
                            'Date non renseignée'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(form.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(form.updated_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              // TODO: Implement view form functionality
                              alert('Fonctionnalité de consultation en cours de développement');
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Consulter le formulaire"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteForm(form.patient_number)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Supprimer le formulaire"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredForms.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun formulaire trouvé</h3>
              <p className="text-gray-500">
                {searchTerm || selectedFormType !== 'all' 
                  ? 'Aucun formulaire ne correspond à vos critères de recherche.'
                  : 'Aucun formulaire n\'a encore été créé.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormConsultation;
