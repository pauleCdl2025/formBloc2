import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Search, Eye, Edit, Trash2, Plus, Calendar, User, ArrowLeft } from 'lucide-react';

interface PatientData {
  id: string;
  patient_number: string;
  data: any;
  created_at: string;
  updated_at: string;
}

export default function PatientList({ onSelectPatient, onCreateNew, onBackToList }: {
  onSelectPatient: (patientNumber: string) => void;
  onCreateNew: () => void;
  onBackToList?: () => void;
}) {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
    const { data, error } = await supabase
      .from('consultation_preanesthesique')
      .select('*')
      .order('updated_at', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (err: any) {
      setError('Erreur lors du chargement des patients: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (id: string, patientNumber: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le patient ${patientNumber} ?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('consultation_preanesthesique')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPatients(patients.filter(p => p.id !== id));
    } catch (err: any) {
      alert('Erreur lors de la suppression: ' + err.message);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.patient_number.toLowerCase().includes(searchLower) ||
      patient.data?.patient?.nom?.toLowerCase().includes(searchLower) ||
      patient.data?.patient?.prenom?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0ea5e9] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <img 
                src="https://res.cloudinary.com/dd64mwkl2/image/upload/v1758286702/Centre_Diagnostic-Logo_xhxxpv.png" 
                alt="Centre Diagnostic de Libreville" 
                className="h-16 w-auto"
              />
              <div>
                <h1 className="text-3xl font-bold text-[#1e3a8a]">Consultation des Formulaires</h1>
                <p className="text-gray-600 mt-2">Gestion des consultations pré-anesthésiques</p>
              </div>
            </div>
            <div className="flex gap-3">
              {onBackToList && (
                <button
                  onClick={onBackToList}
                  className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition shadow-md"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux formulaires
                </button>
              )}
              <button
                onClick={onCreateNew}
                className="flex items-center px-6 py-3 bg-[#0ea5e9] text-white rounded-md hover:bg-[#0284c7] transition shadow-md"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouveau Formulaire
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par numéro, nom ou prénom..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <User className="w-8 h-8 text-[#0ea5e9] mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Ce Mois</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patients.filter(p => {
                    const date = new Date(p.created_at);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Search className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Résultats</p>
                <p className="text-2xl font-bold text-gray-900">{filteredPatients.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Aucun patient trouvé' : 'Aucun patient enregistré'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Essayez avec d\'autres termes de recherche'
                  : 'Commencez par créer un nouveau formulaire'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={onCreateNew}
                  className="inline-flex items-center px-4 py-2 bg-[#0ea5e9] text-white rounded-md hover:bg-[#0284c7] transition"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer le premier formulaire
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Numéro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Intervention
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Créé le
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modifié le
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-[#0ea5e9] flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {patient.data?.patient?.nom || 'N/A'} {patient.data?.patient?.prenom || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {patient.data?.patient?.age ? `${patient.data.patient.age} ans` : 'Âge non renseigné'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.patient_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {patient.data?.intervention?.libelle || 'Non renseigné'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {patient.data?.intervention?.dateIntervention 
                            ? new Date(patient.data.intervention.dateIntervention).toLocaleDateString('fr-FR')
                            : 'Date non renseignée'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(patient.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(patient.updated_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onSelectPatient(patient.patient_number)}
                            className="text-[#0ea5e9] hover:text-[#0284c7] transition"
                            title="Consulter/Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deletePatient(patient.id, patient.patient_number)}
                            className="text-red-600 hover:text-red-800 transition"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
