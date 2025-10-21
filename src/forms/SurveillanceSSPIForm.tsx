import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Save, Printer, FileText, Upload, ArrowLeft, Heart, Clock, Activity } from 'lucide-react';
import SignaturePad from '../components/SignaturePad';

interface SSPIData {
  patient: {
    nom: string;
    prenom: string;
    dateNaissance: string;
    age: string;
  };
  equipe: {
    anesthesiste: string;
    tsar: string;
    dateSurveillance: string;
    heureEntreeSSPI: string;
    heureSortieSSPI: string;
  };
  observations: {
    conditionEntree: string;
    observations: string;
    conditionSortie: string;
    complications: string;
  };
  ventilation: {
    saO2: string;
    etO2: string;
    vs: boolean;
    vi: string;
    vc: boolean;
    fr: string;
    pi: string;
    eva: string;
    tof: string;
    hematocrite: string;
  };
  scores: {
    aldrete: {
      activite: number;
      respiration: number;
      circulation: number;
      conscience: number;
      saturation: number;
      total: number;
    };
  };
  medicaments: {
    analgesie: string;
    medications: string;
    perfusions: string;
  };
  transfert: {
    serviceDestination: string;
    heureTransfert: string;
    medecinTransfert: string;
  };
  signature: string;
}

export default function SurveillanceSSPIForm({ 
  onBackToList, 
  onCreateNew, 
  onSelectPatient 
}: {
  onBackToList?: () => void;
  onCreateNew?: () => void;
  onSelectPatient?: (patientNumber: string) => void;
}) {
  const [savedMessage, setSavedMessage] = useState<string>('');
  const [formData, setFormData] = useState<SSPIData>({
    patient: {
      nom: '',
      prenom: '',
      dateNaissance: '',
      age: ''
    },
    equipe: {
      anesthesiste: '',
      tsar: '',
      dateSurveillance: new Date().toISOString().split('T')[0],
      heureEntreeSSPI: '',
      heureSortieSSPI: ''
    },
    observations: {
      conditionEntree: '',
      observations: '',
      conditionSortie: '',
      complications: ''
    },
    ventilation: {
      saO2: '',
      etO2: '',
      vs: false,
      vi: '',
      vc: false,
      fr: '',
      pi: '',
      eva: '',
      tof: '',
      hematocrite: ''
    },
    scores: {
      aldrete: {
        activite: 0,
        respiration: 0,
        circulation: 0,
        conscience: 0,
        saturation: 0,
        total: 0
      }
    },
    medicaments: {
      analgesie: '',
      medications: '',
      perfusions: ''
    },
    transfert: {
      serviceDestination: '',
      heureTransfert: '',
      medecinTransfert: ''
    },
    signature: ''
  });

  const calculateAge = () => {
    if (formData.patient.dateNaissance) {
      const today = new Date();
      const birth = new Date(formData.patient.dateNaissance);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      setFormData(prev => ({
        ...prev,
        patient: { ...prev.patient, age: age + ' ans' }
      }));
    }
  };

  const setCurrentTime = (field: string) => {
    const now = new Date();
    const timeString = now.toTimeString().substr(0, 5);
    
    if (field === 'heureEntreeSSPI') {
      setFormData(prev => ({
        ...prev,
        equipe: { ...prev.equipe, heureEntreeSSPI: timeString }
      }));
    } else if (field === 'heureSortieSSPI') {
      setFormData(prev => ({
        ...prev,
        equipe: { ...prev.equipe, heureSortieSSPI: timeString }
      }));
    } else if (field === 'heureTransfert') {
      setFormData(prev => ({
        ...prev,
        transfert: { ...prev.transfert, heureTransfert: timeString }
      }));
    }
  };

  const updateAldreteScore = (category: string, value: number) => {
    setFormData(prev => {
      const newScores = { ...prev.scores.aldrete, [category]: value };
      const total = Object.values(newScores).reduce((sum, score) => sum + score, 0) - newScores.total;
      
      return {
        ...prev,
        scores: {
          ...prev.scores,
          aldrete: { ...newScores, total }
        }
      };
    });
  };

  const handleSave = async () => {
    try {
      const patientNumber = `${formData.patient.nom}_${formData.patient.prenom}`.trim();
      if (!patientNumber || patientNumber === '_') {
        alert("Veuillez renseigner le nom et prénom du patient pour sauvegarder.");
        return;
      }

      const payload = { 
        patient_number: patientNumber, 
        data: formData
      };

      // Vérifier si l'enregistrement existe déjà
      const { data: existingRecord } = await supabase
        .from('preanesthesia_forms')
        .select('id')
        .eq('patient_number', patientNumber)
        .single();
      
      if (existingRecord) {
        // Mettre à jour l'enregistrement existant
        const { error } = await supabase
          .from('preanesthesia_forms')
          .update({ data: formData })
          .eq('patient_number', patientNumber);
        
        if (error) throw error;
      } else {
        // Créer un nouvel enregistrement
        const { error } = await supabase
          .from('preanesthesia_forms')
          .insert(payload);
        
        if (error) throw error;
      }

      setSavedMessage('✓ Surveillance SSPI sauvegardée avec succès');
      setTimeout(() => setSavedMessage(''), 5000);
    } catch (e: any) {
      alert('Erreur lors de la sauvegarde: ' + (e?.message || e));
    }
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire ?')) {
      setFormData({
        patient: {
          nom: '',
          prenom: '',
          dateNaissance: '',
          age: ''
        },
        equipe: {
          anesthesiste: '',
          tsar: '',
          dateSurveillance: new Date().toISOString().split('T')[0],
          heureEntreeSSPI: '',
          heureSortieSSPI: ''
        },
        observations: {
          conditionEntree: '',
          observations: '',
          conditionSortie: '',
          complications: ''
        },
        ventilation: {
          saO2: '',
          etO2: '',
          vs: false,
          vi: '',
          vc: false,
          fr: '',
          pi: '',
          eva: '',
          tof: '',
          hematocrite: ''
        },
        scores: {
          aldrete: {
            activite: 0,
            respiration: 0,
            circulation: 0,
            conscience: 0,
            saturation: 0,
            total: 0
          }
        },
        medicaments: {
          analgesie: '',
          medications: '',
          perfusions: ''
        },
        transfert: {
          serviceDestination: '',
          heureTransfert: '',
          medecinTransfert: ''
        },
        signature: ''
      });
      setSavedMessage('✓ Formulaire réinitialisé');
      setTimeout(() => setSavedMessage(''), 3000);
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `surveillance_sspi_${formData.patient.nom}_${formData.patient.prenom}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setFormData(imported);
          setSavedMessage('✓ Données importées avec succès');
          setTimeout(() => setSavedMessage(''), 3000);
        } catch (error) {
          alert('Erreur lors de l\'importation du fichier');
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    calculateAge();
  }, [formData.patient.dateNaissance]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 text-center relative">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
            <Heart className="w-8 h-8" />
            SURVEILLANCE SSPI
          </h1>
          <p className="text-blue-100 text-lg">Salle de Soins Post Interventionnelle</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white border-2 border-blue-200 p-4 flex gap-3 items-center flex-wrap">
          <button
            onClick={onBackToList}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition shadow-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux formulaires
          </button>
          <input
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
            id="import-file"
          />
          <label
            htmlFor="import-file"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer shadow-md"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </label>
          <button
            onClick={handleExportJSON}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-md"
          >
            <FileText className="w-4 h-4 mr-2" />
            Exporter
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-md"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </button>
          <button
            onClick={handleReset}
            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-md"
          >
            <Activity className="w-4 h-4 mr-2" />
            Réinitialiser
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
          >
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </button>
        </div>

        {savedMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 mx-6 mt-4 rounded">
            {savedMessage}
          </div>
        )}

        {/* Patient Info */}
        <div className="bg-blue-50 p-6 border-b-2 border-blue-200">
          <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Informations Patient et Équipe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Nom du patient *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.patient.nom}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  patient: { ...prev.patient, nom: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Prénom *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.patient.prenom}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  patient: { ...prev.patient, prenom: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Date de naissance</label>
              <input
                type="date"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.patient.dateNaissance}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  patient: { ...prev.patient, dateNaissance: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Âge</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg bg-gray-100"
                value={formData.patient.age}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Anesthésiste *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.equipe.anesthesiste}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  equipe: { ...prev.equipe, anesthesiste: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">TSAR</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.equipe.tsar}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  equipe: { ...prev.equipe, tsar: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Date surveillance *</label>
              <input
                type="date"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.equipe.dateSurveillance}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  equipe: { ...prev.equipe, dateSurveillance: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Heure entrée SSPI</label>
              <div className="flex gap-2">
                <input
                  type="time"
                  className="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.equipe.heureEntreeSSPI}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    equipe: { ...prev.equipe, heureEntreeSSPI: e.target.value }
                  }))}
                />
                <button
                  type="button"
                  onClick={() => setCurrentTime('heureEntreeSSPI')}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                >
                  <Clock className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Heure sortie SSPI</label>
              <div className="flex gap-2">
                <input
                  type="time"
                  className="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.equipe.heureSortieSSPI}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    equipe: { ...prev.equipe, heureSortieSSPI: e.target.value }
                  }))}
                />
                <button
                  type="button"
                  onClick={() => setCurrentTime('heureSortieSSPI')}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                >
                  <Clock className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Observations */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Observations Générales</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Condition d'entrée</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="État du patient à l'arrivée"
                value={formData.observations.conditionEntree}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  observations: { ...prev.observations, conditionEntree: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Condition de sortie</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="État du patient à la sortie"
                value={formData.observations.conditionSortie}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  observations: { ...prev.observations, conditionSortie: e.target.value }
                }))}
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-blue-700 mb-2">Observations</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Observations générales..."
                value={formData.observations.observations}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  observations: { ...prev.observations, observations: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>

        {/* Ventilation */}
        <div className="p-6 bg-blue-50">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Ventilation et Paramètres</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Sa O₂ (%)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="98"
                  value={formData.ventilation.saO2}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    ventilation: { ...prev.ventilation, saO2: e.target.value }
                  }))}
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, ventilation: { ...prev.ventilation, saO2: '98' } }))}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                >
                  98
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Et O₂ (mmHg)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Valeur"
                value={formData.ventilation.etO2}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  ventilation: { ...prev.ventilation, etO2: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Vi</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Valeur"
                value={formData.ventilation.vi}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  ventilation: { ...prev.ventilation, vi: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">FR</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Valeur"
                value={formData.ventilation.fr}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  ventilation: { ...prev.ventilation, fr: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Pi</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Valeur"
                value={formData.ventilation.pi}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  ventilation: { ...prev.ventilation, pi: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">E.V.A. (/10)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/10"
                value={formData.ventilation.eva}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  ventilation: { ...prev.ventilation, eva: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">T.O.F./Niveau A.L.R.</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Valeur"
                value={formData.ventilation.tof}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  ventilation: { ...prev.ventilation, tof: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Hématocrite/Dextro</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Valeur"
                value={formData.ventilation.hematocrite}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  ventilation: { ...prev.ventilation, hematocrite: e.target.value }
                }))}
              />
            </div>
          </div>
          
          {/* Checkboxes */}
          <div className="mt-4 flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600"
                checked={formData.ventilation.vs}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  ventilation: { ...prev.ventilation, vs: e.target.checked }
                }))}
              />
              <span className="font-semibold text-blue-700">VS</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600"
                checked={formData.ventilation.vc}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  ventilation: { ...prev.ventilation, vc: e.target.checked }
                }))}
              />
              <span className="font-semibold text-blue-700">VC</span>
            </label>
          </div>
        </div>

        {/* Score d'Aldrete */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Score d'ALDRETE</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { key: 'activite', label: 'Activité motrice' },
              { key: 'respiration', label: 'Respiration' },
              { key: 'circulation', label: 'Circulation' },
              { key: 'conscience', label: 'Conscience' },
              { key: 'saturation', label: 'Saturation O₂' }
            ].map(({ key, label }) => (
              <div key={key} className="text-center">
                <label className="block text-sm font-semibold text-blue-700 mb-2">{label}</label>
                <div className="flex gap-1 justify-center">
                  {[0, 1, 2].map(value => (
                    <button
                      key={value}
                      type="button"
                      className={`w-8 h-8 border-2 rounded font-bold transition ${
                        formData.scores.aldrete[key as keyof typeof formData.scores.aldrete] === value
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white border-blue-200 hover:border-blue-500'
                      }`}
                      onClick={() => updateAldreteScore(key, value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4 p-4 bg-white rounded-lg">
            <span className="text-2xl font-bold text-blue-800">
              Score total : {formData.scores.aldrete.total} / 10
            </span>
          </div>
        </div>

        {/* Médicaments */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Médicaments et Perfusions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Analgésie</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Médicaments analgésiques administrés..."
                value={formData.medicaments.analgesie}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  medicaments: { ...prev.medicaments, analgesie: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Médications</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Autres médicaments administrés..."
                value={formData.medicaments.medications}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  medicaments: { ...prev.medicaments, medications: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Perfusions</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Perfusions en cours..."
                value={formData.medicaments.perfusions}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  medicaments: { ...prev.medicaments, perfusions: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>

        {/* Transfert */}
        <div className="p-6 bg-blue-50">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Préparation au Transfert</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Service de destination</label>
              <select
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.transfert.serviceDestination}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  transfert: { ...prev.transfert, serviceDestination: e.target.value }
                }))}
              >
                <option value="">Sélectionner...</option>
                <option value="Chirurgie">Service de chirurgie</option>
                <option value="Médecine">Service de médecine</option>
                <option value="Réanimation">Réanimation</option>
                <option value="USC">USC</option>
                <option value="Domicile">Retour à domicile</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Heure de transfert</label>
              <div className="flex gap-2">
                <input
                  type="time"
                  className="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.transfert.heureTransfert}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    transfert: { ...prev.transfert, heureTransfert: e.target.value }
                  }))}
                />
                <button
                  type="button"
                  onClick={() => setCurrentTime('heureTransfert')}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                >
                  <Clock className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Médecin responsable</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Médecin du service de destination"
                value={formData.transfert.medecinTransfert}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  transfert: { ...prev.transfert, medecinTransfert: e.target.value }
                }))}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-semibold text-blue-700 mb-2">Complications survenues</label>
            <textarea
              className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Complications éventuelles durant le séjour en SSPI..."
              value={formData.observations.complications}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                observations: { ...prev.observations, complications: e.target.value }
              }))}
            />
          </div>
        </div>

        {/* Signature */}
        <div className="p-6 bg-purple-50">
          <h2 className="text-xl font-bold text-purple-800 mb-4">SIGNATURE</h2>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Signature de l'infirmier(e)</h3>
            <SignaturePad
              onSignatureChange={(signature) => setFormData(prev => ({
                ...prev,
                signature: signature
              }))}
              width={400}
              height={200}
              placeholder="Signature de l'infirmier(e)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
