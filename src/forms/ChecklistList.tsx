import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Eye, Edit, Download, Trash2, ArrowLeft, Plus } from 'lucide-react';

interface ChecklistListProps {
  onBackToMain: () => void;
  onSelectChecklist: (checklist: any, mode: 'view' | 'edit') => void;
}

const ChecklistList: React.FC<ChecklistListProps> = ({ onBackToMain, onSelectChecklist }) => {
  const [checklists, setChecklists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadChecklists();
  }, []);

  const loadChecklists = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('checklist_chirurgicale')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChecklists(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des checklists:', error);
      setError('Erreur lors du chargement des checklists');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette checklist ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('checklist_chirurgicale')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setChecklists(checklists.filter(checklist => checklist.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleDownload = async (checklist: any) => {
    try {
      const data = {
        intervention: checklist.data?.intervention,
        checklist: checklist.data?.checklist,
        progress: checklist.data?.progress,
        createdAt: checklist.created_at
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `checklist_chirurgicale_${checklist.patient_name}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-emerald-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = (progress: number) => {
    if (progress === 100) return 'Complété';
    if (progress >= 70) return 'En cours';
    if (progress >= 40) return 'Partiel';
    return 'Non commencé';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-4 text-lg text-gray-600">Chargement des checklists...</span>
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
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToMain}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux formulaires
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Checklists Chirurgicales</h1>
                <p className="text-gray-600">Centre Diagnostic de Libreville</p>
              </div>
            </div>
            <button
              onClick={() => onSelectChecklist(null, 'edit')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Checklist
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{checklists.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Complétées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {checklists.filter(c => c.data?.progress === 100).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {checklists.filter(c => c.data?.progress > 0 && c.data?.progress < 100).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taux de complétion</p>
                <p className="text-2xl font-bold text-gray-900">
                  {checklists.length > 0 
                    ? Math.round(checklists.reduce((acc, c) => acc + (c.data?.progress || 0), 0) / checklists.length)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des checklists */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Liste des Checklists</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {checklists.length === 0 ? (
              <div className="p-8 text-center">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune checklist trouvée</h3>
                <p className="text-gray-600 mb-4">Commencez par créer une nouvelle checklist chirurgicale.</p>
                <button
                  onClick={() => onSelectChecklist(null, 'edit')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mx-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une checklist
                </button>
              </div>
            ) : (
              checklists.map((checklist) => (
                <div key={checklist.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {checklist.patient_name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          checklist.data?.progress === 100 
                            ? 'bg-emerald-100 text-emerald-800'
                            : checklist.data?.progress > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {getStatusText(checklist.data?.progress || 0)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Intervention:</span> {checklist.intervention_type}
                        </div>
                        <div>
                          <span className="font-medium">Chirurgien:</span> {checklist.surgeon}
                        </div>
                        <div>
                          <span className="font-medium">Salle:</span> {checklist.operating_room}
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Progression:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(checklist.data?.progress || 0)}`}
                              style={{ width: `${checklist.data?.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {Math.round(checklist.data?.progress || 0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-6">
                      <button
                        onClick={() => onSelectChecklist(checklist, 'view')}
                        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        title="Consulter"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onSelectChecklist(checklist, 'edit')}
                        className="flex items-center px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(checklist)}
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        title="Télécharger"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(checklist.id)}
                        className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Eye className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChecklistList;
