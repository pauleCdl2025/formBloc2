import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  ArrowLeft, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Stethoscope,
  Calendar,
  MapPin,
  User,
  Clock
} from 'lucide-react';

interface AnesthesieFormData {
  id: number;
  salle: string;
  heure: string;
  date_intervention: string;
  chirurgien: string;
  anesthesistes: string;
  tsar: string;
  checklist: string;
  position_patient: string;
  created_at: string;
  updated_at: string;
}

interface AnesthesieListProps {
  onCreateNew: () => void;
  onBack: () => void;
  onSelectForm: (formData: AnesthesieFormData, mode: 'view' | 'edit') => void;
}

const AnesthesieList: React.FC<AnesthesieListProps> = ({ 
  onCreateNew, 
  onBack, 
  onSelectForm 
}) => {
  const [forms, setForms] = useState<AnesthesieFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('anesthesie_form')
        .select('id, salle, heure, date_intervention, chirurgien, anesthesistes, tsar, checklist, position_patient, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des formulaires:', error);
        setError('Erreur lors du chargement des formulaires');
        return;
      }

      setForms(data || []);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce formulaire ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('anesthesie_form')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
        return;
      }

      // Recharger la liste
      loadForms();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur de connexion');
    }
  };

  const filteredForms = forms.filter(form => {
    const searchLower = searchTerm.toLowerCase();
    return (
      form.salle?.toLowerCase().includes(searchLower) ||
      form.chirurgien?.toLowerCase().includes(searchLower) ||
      form.anesthesistes?.toLowerCase().includes(searchLower) ||
      form.tsar?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Date invalide';
    }
  };

  const formatTime = (timeString: string) => {
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timeString || 'Non renseigné';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Chargement des formulaires...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Retour</span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Formulaires d'Anesthésie</h1>
                  <p className="text-gray-600">Liste des formulaires d'anesthésie sauvegardés</p>
                </div>
              </div>
            </div>
            <button
              onClick={onCreateNew}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Formulaire</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher par salle, chirurgien, anesthésiste..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="text-sm text-gray-500">
              {filteredForms.length} formulaire{filteredForms.length !== 1 ? 's' : ''} trouvé{filteredForms.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Forms List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {filteredForms.length === 0 ? (
            <div className="p-8 text-center">
              <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Aucun formulaire trouvé' : 'Aucun formulaire d\'anesthésie'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Essayez avec d\'autres termes de recherche'
                  : 'Commencez par créer votre premier formulaire d\'anesthésie'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={onCreateNew}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Créer le premier formulaire</span>
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Informations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Équipe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date/Heure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Créé le
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredForms.map((form) => (
                    <tr key={form.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                            <Stethoscope className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              ID: {form.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              {form.salle ? `Salle ${form.salle}` : 'Salle non renseignée'}
                            </div>
                            {form.position_patient && (
                              <div className="text-xs text-gray-400">
                                Position: {form.position_patient}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {form.chirurgien || 'Chirurgien non renseigné'}
                        </div>
                        {form.anesthesistes && (
                          <div className="text-sm text-gray-500">
                            {form.anesthesistes}
                          </div>
                        )}
                        {form.tsar && (
                          <div className="text-xs text-gray-400">
                            TSAR: {form.tsar}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {form.date_intervention ? formatDate(form.date_intervention) : 'Date non renseignée'}
                        </div>
                        {form.heure && (
                          <div className="text-sm text-gray-500">
                            {formatTime(form.heure)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(form.created_at)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(form.created_at).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onSelectForm(form, 'view')}
                            className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Consulter</span>
                          </button>
                          <button
                            onClick={() => onSelectForm(form, 'edit')}
                            className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Modifier</span>
                          </button>
                          <button
                            onClick={() => handleDelete(form.id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Supprimer</span>
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
};

export default AnesthesieList;
