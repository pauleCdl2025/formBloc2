import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft } from 'lucide-react';

interface AnesthesieFormProps {
  formData?: any;
  patientData?: any;
  editMode?: boolean;
  onBack?: () => void;
  onSave?: (data: any) => void;
}

const AnesthesieForm: React.FC<AnesthesieFormProps> = ({ 
  formData, 
  patientData,
  editMode = false, 
  onBack,
  onSave 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [savedForms, setSavedForms] = useState<any[]>([]);
  const [currentFormId, setCurrentFormId] = useState<number | null>(null);

  // États pour les modes anesthésiques
  const [modes, setModes] = useState({
    sedation: false,
    ag: false,
    crush: false,
    ra: false,
    apd: false,
    bloc: false
  });

  // États pour l'appareillage
  const [appareillage, setAppareillage] = useState({
    masque: false,
    mlf: false,
    ito: false,
    orale: false,
    nasale: false,
    lma: false,
    autre: false
  });

  // États pour les grilles de dessin
  const [gridData, setGridData] = useState<Record<string, any[]>>({
    temperature: [],
    spo2: [],
    fc: [],
    pa: []
  });

  // Références pour les canvas
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});

  useEffect(() => {
    const dataToUse = patientData || formData;
    if (dataToUse) {
      populateForm(dataToUse);
    }
  }, [patientData, formData]);

  const populateForm = (data: any) => {
    // Remplir les champs texte
    const textFields = [
      'salle', 'heure', 'date_intervention', 'chirurgien', 'anesthesistes',
      'tsar', 'checklist', 'position_patient', 'site_ponction', 'aiguille',
      'profondeur', 'intensite_ma', 'kt', 'dose_test', 'melange',
      'incident_alr', 'bloc_obtenu', 'alr_complement', 'alr_autre1', 'alr_autre2',
      'alr_autre3', 'alr_autre4', 'alr_autre5', 'alr_autre6', 'sao2_value', 'eto2_value',
      'vs_vi_value', 'vc_fr_value', 'pi_value', 'fio2_n2o_air',
      'halogene', 'fi_value', 'fe_value', 'tof_alr', 'hematocrite_dextro',
      'drogue1', 'drogue2', 'drogue3', 'drogue4', 'drogue5',
      'perfusion1', 'perfusion2', 'perfusion3', 'perfusion4', 'perfusion5',
      'autres_bilans', 'commentaires'
    ];
    
    textFields.forEach(field => {
      const element = document.getElementById(field) as HTMLInputElement | HTMLTextAreaElement;
      if (element && data[field]) {
        element.value = data[field];
      }
    });

    // Remplir les modes anesthésiques
    if (data.mode_sedation) setModes(prev => ({ ...prev, sedation: true }));
    if (data.mode_ag) setModes(prev => ({ ...prev, ag: true }));
    if (data.mode_crush) setModes(prev => ({ ...prev, crush: true }));
    if (data.mode_ra) setModes(prev => ({ ...prev, ra: true }));
    if (data.mode_apd) setModes(prev => ({ ...prev, apd: true }));
    if (data.mode_bloc) setModes(prev => ({ ...prev, bloc: true }));

    // Remplir l'appareillage
    if (data.appareillage_data) {
      setAppareillage(prev => ({
        ...prev,
        masque: data.appareillage_data.app_masque || false,
        mlf: data.appareillage_data.app_mlf || false,
        ito: data.appareillage_data.app_ito || false,
        orale: data.appareillage_data.app_orale || false,
        nasale: data.appareillage_data.app_nasale || false,
        lma: data.appareillage_data.app_lma || false,
        autre: data.appareillage_data.app_autre || false
      }));
    }

    // Remplir les grilles
    if (data.grilles_data) {
      setGridData(data.grilles_data);
    }
  };

  const collectFormData = () => {
    const data: any = {
      // Informations générales
      salle: (document.getElementById('salle') as HTMLInputElement)?.value || '',
      heure: (document.getElementById('heure') as HTMLInputElement)?.value || '',
      date_intervention: (document.getElementById('date_intervention') as HTMLInputElement)?.value || '',
      chirurgien: (document.getElementById('chirurgien') as HTMLInputElement)?.value || '',
      anesthesistes: (document.getElementById('anesthesistes') as HTMLInputElement)?.value || '',
      tsar: (document.getElementById('tsar') as HTMLInputElement)?.value || '',
      checklist: (document.getElementById('checklist') as HTMLInputElement)?.value || '',
      position_patient: (document.getElementById('position_patient') as HTMLInputElement)?.value || '',
      
      // Modes anesthésiques
      mode_sedation: modes.sedation,
      mode_ag: modes.ag,
      mode_crush: modes.crush,
      mode_ra: modes.ra,
      mode_apd: modes.apd,
      mode_bloc: modes.bloc,
      
      // Détails ALR
      site_ponction: (document.getElementById('site_ponction') as HTMLInputElement)?.value || '',
      aiguille: (document.getElementById('aiguille') as HTMLInputElement)?.value || '',
      profondeur: (document.getElementById('profondeur') as HTMLInputElement)?.value || '',
      intensite_ma: (document.getElementById('intensite_ma') as HTMLInputElement)?.value || '',
      kt: (document.getElementById('kt') as HTMLInputElement)?.value || '',
      dose_test: (document.getElementById('dose_test') as HTMLInputElement)?.value || '',
      melange: (document.getElementById('melange') as HTMLInputElement)?.value || '',
      incident_alr: (document.getElementById('incident_alr') as HTMLInputElement)?.value || '',
      bloc_obtenu: (document.getElementById('bloc_obtenu') as HTMLInputElement)?.value || '',
      alr_complement: (document.getElementById('alr_complement') as HTMLInputElement)?.value || '',
      alr_autre1: (document.getElementById('alr_autre1') as HTMLInputElement)?.value || '',
      alr_autre2: (document.getElementById('alr_autre2') as HTMLInputElement)?.value || '',
      alr_autre3: (document.getElementById('alr_autre3') as HTMLInputElement)?.value || '',
      alr_autre4: (document.getElementById('alr_autre4') as HTMLInputElement)?.value || '',
      alr_autre5: (document.getElementById('alr_autre5') as HTMLInputElement)?.value || '',
      alr_autre6: (document.getElementById('alr_autre6') as HTMLInputElement)?.value || '',
      
      // Appareillage
      appareillage_data: appareillage,
      
      // Valeurs de monitoring
      sao2_value: (document.getElementById('sao2_value') as HTMLInputElement)?.value || '',
      eto2_value: (document.getElementById('eto2_value') as HTMLInputElement)?.value || '',
      vs_checked: (document.getElementById('vs_checked') as HTMLInputElement)?.checked || false,
      vs_vi_value: (document.getElementById('vs_vi_value') as HTMLInputElement)?.value || '',
      vc_checked: (document.getElementById('vc_checked') as HTMLInputElement)?.checked || false,
      vc_fr_value: (document.getElementById('vc_fr_value') as HTMLInputElement)?.value || '',
      pi_value: (document.getElementById('pi_value') as HTMLInputElement)?.value || '',
      fio2_n2o_air: (document.getElementById('fio2_n2o_air') as HTMLInputElement)?.value || '',
      halogene: (document.getElementById('halogene') as HTMLInputElement)?.value || '',
      fi_value: (document.getElementById('fi_value') as HTMLInputElement)?.value || '',
      fe_value: (document.getElementById('fe_value') as HTMLInputElement)?.value || '',
      tof_alr: (document.getElementById('tof_alr') as HTMLInputElement)?.value || '',
      hematocrite_dextro: (document.getElementById('hematocrite_dextro') as HTMLInputElement)?.value || '',
      
      // Drogues
      drogue1: (document.getElementById('drogue1') as HTMLInputElement)?.value || '',
      drogue2: (document.getElementById('drogue2') as HTMLInputElement)?.value || '',
      drogue3: (document.getElementById('drogue3') as HTMLInputElement)?.value || '',
      drogue4: (document.getElementById('drogue4') as HTMLInputElement)?.value || '',
      drogue5: (document.getElementById('drogue5') as HTMLInputElement)?.value || '',
      
      // Perfusions
      perfusion1: (document.getElementById('perfusion1') as HTMLInputElement)?.value || '',
      perfusion2: (document.getElementById('perfusion2') as HTMLInputElement)?.value || '',
      perfusion3: (document.getElementById('perfusion3') as HTMLInputElement)?.value || '',
      perfusion4: (document.getElementById('perfusion4') as HTMLInputElement)?.value || '',
      perfusion5: (document.getElementById('perfusion5') as HTMLInputElement)?.value || '',
      
      // Autres
      autres_bilans: (document.getElementById('autres_bilans') as HTMLInputElement)?.value || '',
      commentaires: (document.getElementById('commentaires') as HTMLTextAreaElement)?.value || '',
      
      // Grilles de dessin
      grilles_data: gridData
    };

    if (currentFormId) {
      data.id = currentFormId;
    }
    
    return data;
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formData = collectFormData();
      
      console.log('Données à sauvegarder:', formData);
      
      const { data: result, error } = await supabase
        .from('anesthesie_form')
        .upsert(formData)
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      console.log('Résultat sauvegarde:', result);
      
      setCurrentFormId(result.id);
      setMessage({ text: 'Formulaire sauvegardé avec succès', type: 'success' });
      
      if (onSave) {
        onSave(formData);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setMessage({ text: `Erreur lors de la sauvegarde: ${errorMessage}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = async () => {
    try {
      const { data: forms, error } = await supabase
        .from('anesthesie_form')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSavedForms(forms || []);
      setShowLoadModal(true);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setMessage({ text: 'Erreur lors du chargement des formulaires', type: 'error' });
    }
  };

  const handleLoadForm = (form: any) => {
    populateForm(form);
    setCurrentFormId(form.id);
    setShowLoadModal(false);
  };

  const handleNewForm = () => {
    // Réinitialiser tous les champs
    const textFields = [
      'salle', 'heure', 'date_intervention', 'chirurgien', 'anesthesistes',
      'tsar', 'checklist', 'position_patient', 'site_ponction', 'aiguille',
      'profondeur', 'intensite_ma', 'kt', 'dose_test', 'melange',
      'incident_alr', 'bloc_obtenu', 'alr_complement', 'alr_autre1', 'alr_autre2',
      'alr_autre3', 'alr_autre4', 'alr_autre5', 'alr_autre6', 'sao2_value', 'eto2_value',
      'vs_vi_value', 'vc_fr_value', 'pi_value', 'fio2_n2o_air',
      'halogene', 'fi_value', 'fe_value', 'tof_alr', 'hematocrite_dextro',
      'drogue1', 'drogue2', 'drogue3', 'drogue4', 'drogue5',
      'perfusion1', 'perfusion2', 'perfusion3', 'perfusion4', 'perfusion5',
      'autres_bilans', 'commentaires'
    ];
    
    textFields.forEach(field => {
      const element = document.getElementById(field) as HTMLInputElement | HTMLTextAreaElement;
      if (element) {
        element.value = '';
      }
    });

    // Réinitialiser les états
    setModes({
      sedation: false,
      ag: false,
      crush: false,
      ra: false,
      apd: false,
      bloc: false
    });

    setAppareillage({
      masque: false,
      mlf: false,
      ito: false,
      orale: false,
      nasale: false,
      lma: false,
      autre: false
    });

    setGridData({
      temperature: [],
      spo2: [],
      fc: [],
      pa: []
    });

    setCurrentFormId(null);
    setMessage({ text: 'Nouveau formulaire créé', type: 'success' });
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleMode = (mode: keyof typeof modes) => {
    setModes(prev => ({ ...prev, [mode]: !prev[mode] }));
  };

  const toggleAppareillage = (app: keyof typeof appareillage) => {
    setAppareillage(prev => ({ ...prev, [app]: !prev[app] }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Retour</span>
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Formulaire d'Anesthésie</h1>
                <p className="text-gray-600">Enregistrement des paramètres peropératoires</p>
              </div>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleNewForm}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Nouveau
              </button>
              <button
                onClick={handleLoad}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Charger
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Imprimer
              </button>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Formulaire principal */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
              <input
                type="text"
                id="salle"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Bloc 1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
              <input
                type="time"
                id="heure"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date intervention</label>
              <input
                type="date"
                id="date_intervention"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chirurgien</label>
              <input
                type="text"
                id="chirurgien"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom du chirurgien"
              />
            </div>
          </div>

          {/* Modes anesthésiques */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Modes anesthésiques</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(modes).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => toggleMode(key as keyof typeof modes)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    value 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{value ? '✓' : '○'}</div>
                    <div className="text-sm font-medium">
                      {key === 'sedation' && 'Sédation'}
                      {key === 'ag' && 'AG'}
                      {key === 'crush' && 'CRUSH'}
                      {key === 'ra' && 'RA'}
                      {key === 'apd' && 'APD'}
                      {key === 'bloc' && 'BLOC'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Appareillage */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Appareillage</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {Object.entries(appareillage).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => toggleAppareillage(key as keyof typeof appareillage)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    value 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{value ? '✓' : '○'}</div>
                    <div className="text-sm font-medium">
                      {key === 'masque' && 'Masque'}
                      {key === 'mlf' && 'MLØ'}
                      {key === 'ito' && 'ITØ'}
                      {key === 'orale' && 'Orale'}
                      {key === 'nasale' && 'Nasale'}
                      {key === 'lma' && 'LMA'}
                      {key === 'autre' && 'Autre'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Grilles de monitoring */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Monitoring</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Grille Température */}
              <div className="border border-gray-300 rounded-lg p-4">
                <h4 className="text-md font-medium text-red-600 mb-2">Température (°C)</h4>
                <div className="bg-gray-100 p-4 rounded text-center">
                  <p className="text-gray-500">Grille de dessin à implémenter</p>
                  <p className="text-sm text-gray-400">Fonctionnalité de dessin en cours de développement</p>
                </div>
              </div>

              {/* Grille SpO₂ */}
              <div className="border border-gray-300 rounded-lg p-4">
                <h4 className="text-md font-medium text-blue-600 mb-2">SpO₂ (%)</h4>
                <div className="bg-gray-100 p-4 rounded text-center">
                  <p className="text-gray-500">Grille de dessin à implémenter</p>
                  <p className="text-sm text-gray-400">Fonctionnalité de dessin en cours de développement</p>
                </div>
              </div>

              {/* Grille FC */}
              <div className="border border-gray-300 rounded-lg p-4">
                <h4 className="text-md font-medium text-green-600 mb-2">FC (bpm)</h4>
                <div className="bg-gray-100 p-4 rounded text-center">
                  <p className="text-gray-500">Grille de dessin à implémenter</p>
                  <p className="text-sm text-gray-400">Fonctionnalité de dessin en cours de développement</p>
                </div>
              </div>

              {/* Grille PA */}
              <div className="border border-gray-300 rounded-lg p-4">
                <h4 className="text-md font-medium text-purple-600 mb-2">PA (mmHg)</h4>
                <div className="bg-gray-100 p-4 rounded text-center">
                  <p className="text-gray-500">Grille de dessin à implémenter</p>
                  <p className="text-sm text-gray-400">Fonctionnalité de dessin en cours de développement</p>
                </div>
              </div>
            </div>
          </div>

          {/* Commentaires */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Commentaires</label>
            <textarea
              id="commentaires"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Commentaires additionnels..."
            />
          </div>
        </div>

        {/* Modal de chargement */}
        {showLoadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Charger un formulaire</h3>
                <button
                  onClick={() => setShowLoadModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              {savedForms.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucun formulaire sauvegardé</p>
              ) : (
                <div className="space-y-2">
                  {savedForms.map((form) => (
                    <div
                      key={form.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleLoadForm(form)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">ID: {form.id}</div>
                          <div className="text-sm text-gray-500">
                            {form.salle && `Salle: ${form.salle}`}
                            {form.chirurgien && ` | Chirurgien: ${form.chirurgien}`}
                            {form.date_intervention && ` | Date: ${form.date_intervention}`}
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(form.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnesthesieForm;