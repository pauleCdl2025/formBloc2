import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Save, Printer, FileText, Upload, ArrowLeft, Heart, Clock, Activity, Calendar, User } from 'lucide-react';
import SignaturePad from '../components/SignaturePad';

interface SSPIData {
  // Informations patient
  patient: {
    nom: string;
    prenom: string;
    dateNaissance: string;
    age: string;
  };
  
  // Équipe et horaires
  equipe: {
    anesthesiste: string;
    tsar: string;
    dateSurveillance: string;
    heureEntreeSSPI: string;
    heureSortieSSPI: string;
  };
  
  // Observations générales
  observations: {
    conditionEntree: string;
    observationsGenerales: string;
    conditionSortie: string;
    complications: string;
  };
  
  // Paramètres vitaux et ventilation
  parametresVitaux: {
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
  
  // Score d'Aldrete détaillé
  aldrete: {
    activite: number;
    respiration: number;
    circulation: number;
    conscience: number;
    saturation: number;
    total: number;
  };
  
  // Médicaments
  medicaments: {
    analgesie: string;
    medications: string;
    perfusions: string;
  };
  
  // Bilans entrées/sorties
  bilans: {
    diurese: string;
    saignement: string;
    pertesInsensibles: string;
    redon1: string;
    redon2: string;
    totalSorties: string;
    totalEntrees: string;
    bilanCumulatif: string;
  };
  
  // Transfert
  transfert: {
    serviceDestination: string;
    heureTransfert: string;
    medecinResponsable: string;
  };
  
  // Signature
  signature: string;
}

const initialSSPIData: SSPIData = {
  patient: {
    nom: '',
    prenom: '',
    dateNaissance: '',
    age: ''
  },
  equipe: {
    anesthesiste: '',
    tsar: '',
    dateSurveillance: new Date().toLocaleDateString('fr-FR'),
    heureEntreeSSPI: '',
    heureSortieSSPI: ''
  },
  observations: {
    conditionEntree: '',
    observationsGenerales: '',
    conditionSortie: '',
    complications: ''
  },
  parametresVitaux: {
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
  aldrete: {
    activite: 0,
    respiration: 0,
    circulation: 0,
    conscience: 0,
    saturation: 0,
    total: 0
  },
  medicaments: {
    analgesie: '',
    medications: '',
    perfusions: ''
  },
  bilans: {
    diurese: '',
    saignement: '',
    pertesInsensibles: '',
    redon1: '',
    redon2: '',
    totalSorties: '',
    totalEntrees: '',
    bilanCumulatif: ''
  },
  transfert: {
    serviceDestination: '',
    heureTransfert: '',
    medecinResponsable: ''
  },
  signature: ''
};

export default function SurveillanceSSPIForm({ 
  onBackToList, 
  onCreateNew, 
  onSelectPatient 
}: {
  onBackToList?: () => void;
  onCreateNew?: () => void;
  onSelectPatient?: (patientNumber: string) => void;
}) {
  const [formData, setFormData] = useState<SSPIData>(initialSSPIData);
  const [savedMessage, setSavedMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Calcul automatique du score d'Aldrete
  useEffect(() => {
    const total = formData.aldrete.activite + formData.aldrete.respiration + 
                  formData.aldrete.circulation + formData.aldrete.conscience + 
                  formData.aldrete.saturation;
    setFormData(prev => ({
      ...prev,
      aldrete: { ...prev.aldrete, total }
    }));
  }, [formData.aldrete.activite, formData.aldrete.respiration, 
      formData.aldrete.circulation, formData.aldrete.conscience, 
      formData.aldrete.saturation]);

  // Calcul automatique des bilans
  useEffect(() => {
    const diurese = parseFloat(formData.bilans.diurese) || 0;
    const saignement = parseFloat(formData.bilans.saignement) || 0;
    const pertesInsensibles = parseFloat(formData.bilans.pertesInsensibles) || 0;
    const redon1 = parseFloat(formData.bilans.redon1) || 0;
    const redon2 = parseFloat(formData.bilans.redon2) || 0;
    
    const totalSorties = diurese + saignement + pertesInsensibles + redon1 + redon2;
    const totalEntrees = parseFloat(formData.bilans.totalEntrees) || 0;
    const bilanCumulatif = totalEntrees - totalSorties;
    
    setFormData(prev => ({
      ...prev,
      bilans: {
        ...prev.bilans,
        totalSorties: totalSorties.toString(),
        bilanCumulatif: bilanCumulatif.toString()
      }
    }));
  }, [formData.bilans.diurese, formData.bilans.saignement, 
      formData.bilans.pertesInsensibles, formData.bilans.redon1, 
      formData.bilans.redon2, formData.bilans.totalEntrees]);

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
        .from('surveillance_sspi')
        .select('id')
        .eq('patient_number', patientNumber)
        .single();
      
      if (existingRecord) {
        // Mettre à jour l'enregistrement existant
        const { error } = await supabase
          .from('surveillance_sspi')
          .update({ data: formData })
          .eq('patient_number', patientNumber);
        
        if (error) throw error;
      } else {
        // Créer un nouvel enregistrement
        const { error } = await supabase
          .from('surveillance_sspi')
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
    setFormData(initialSSPIData);
    setSavedMessage('');
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `surveillance_sspi_${formData.patient.nom}_${formData.patient.prenom}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          setFormData(importedData);
          setSavedMessage('✓ Données importées avec succès');
          setTimeout(() => setSavedMessage(''), 3000);
        } catch (error) {
          alert('Erreur lors de l\'importation du fichier JSON');
        }
      };
      reader.readAsText(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const setCurrentTime = (field: 'heureEntreeSSPI' | 'heureSortieSSPI' | 'heureTransfert') => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    setFormData(prev => ({
      ...prev,
      equipe: field.includes('Transfert') ? prev.equipe : { ...prev.equipe, [field]: timeString },
      transfert: field === 'heureTransfert' ? { ...prev.transfert, heureTransfert: timeString } : prev.transfert
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header avec boutons d'action */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <img 
                src="https://res.cloudinary.com/dd64mwkl2/image/upload/v1758286702/Centre_Diagnostic-Logo_xhxxpv.png" 
                alt="Centre Diagnostic de Libreville" 
                className="h-16 w-auto"
              />
              <div>
                <h1 className="text-3xl font-bold text-[#1e3a8a]">Surveillance SSPI</h1>
                <p className="text-gray-600 mt-2">Salle de Soins Post Interventionnelle</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onBackToList}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition shadow-md"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux formulaires
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition shadow-md"
              >
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </button>
            </div>
          </div>

          {/* Barre d'outils */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">ID surveillance:</label>
              <input
                type="text"
                className="px-3 py-1 border rounded text-sm"
                placeholder="Auto-généré"
                readOnly
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Recherche:</label>
              <input
                type="text"
                className="px-3 py-1 border rounded text-sm w-64"
                placeholder="Patient, anesthésiste..."
              />
            </div>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={handlePrint}
                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                <Printer className="w-4 h-4 mr-1" />
                Imprimer
              </button>
            </div>
          </div>
        </div>

        {/* Message de sauvegarde */}
        {savedMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {savedMessage}
          </div>
        )}

        {/* Formulaire principal */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Informations patient */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du patient *
              </label>
              <input
                type="text"
                value={formData.patient.nom}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  patient: { ...prev.patient, nom: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom *
              </label>
              <input
                type="text"
                value={formData.patient.prenom}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  patient: { ...prev.patient, prenom: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de naissance
              </label>
              <input
                type="date"
                value={formData.patient.dateNaissance}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  patient: { ...prev.patient, dateNaissance: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Âge
              </label>
              <input
                type="text"
                value={formData.patient.age}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  patient: { ...prev.patient, age: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ans"
              />
            </div>
          </div>

          {/* Équipe et horaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anesthésiste *
              </label>
              <input
                type="text"
                value={formData.equipe.anesthesiste}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  equipe: { ...prev.equipe, anesthesiste: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TSAR
              </label>
              <input
                type="text"
                value={formData.equipe.tsar}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  equipe: { ...prev.equipe, tsar: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date surveillance *
              </label>
              <input
                type="date"
                value={formData.equipe.dateSurveillance}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  equipe: { ...prev.equipe, dateSurveillance: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heure entrée SSPI
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={formData.equipe.heureEntreeSSPI}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    equipe: { ...prev.equipe, heureEntreeSSPI: e.target.value }
                  }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setCurrentTime('heureEntreeSSPI')}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Maintenant
                </button>
              </div>
            </div>
          </div>

          {/* Heure sortie SSPI */}
          <div className="mb-8">
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heure sortie SSPI
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={formData.equipe.heureSortieSSPI}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    equipe: { ...prev.equipe, heureSortieSSPI: e.target.value }
                  }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setCurrentTime('heureSortieSSPI')}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Maintenant
                </button>
              </div>
            </div>
          </div>

          {/* Section Observations */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Observations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition d'entrée
                </label>
                <textarea
                  value={formData.observations.conditionEntree}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    observations: { ...prev.observations, conditionEntree: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="État du patient à l'arrivée"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observations générales
                </label>
                <textarea
                  value={formData.observations.observationsGenerales}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    observations: { ...prev.observations, observationsGenerales: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Observations générales..."
                />
              </div>
            </div>
          </div>

          {/* Section Paramètres vitaux et ventilation */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Paramètres vitaux et ventilation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sa O₂ (%)
                </label>
                <input
                  type="text"
                  value={formData.parametresVitaux.saO2}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    parametresVitaux: { ...prev.parametresVitaux, saO2: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Valeur"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      parametresVitaux: { ...prev.parametresVitaux, saO2: '98' }
                    }))}
                    className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                  >
                    98
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      parametresVitaux: { ...prev.parametresVitaux, saO2: '99' }
                    }))}
                    className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                  >
                    99
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      parametresVitaux: { ...prev.parametresVitaux, saO2: '100' }
                    }))}
                    className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                  >
                    100
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Et O₂ (mmHg)
                </label>
                <input
                  type="text"
                  value={formData.parametresVitaux.etO2}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    parametresVitaux: { ...prev.parametresVitaux, etO2: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Valeur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E.V.A. (/10)
                </label>
                <input
                  type="text"
                  value={formData.parametresVitaux.eva}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    parametresVitaux: { ...prev.parametresVitaux, eva: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Score douleur"
                />
              </div>
            </div>

            {/* Ventilation */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-700 mb-3">Ventilation</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.parametresVitaux.vs}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        parametresVitaux: { ...prev.parametresVitaux, vs: e.target.checked }
                      }))}
                      className="rounded"
                    />
                    VS
                  </label>
                  <input
                    type="text"
                    value={formData.parametresVitaux.vi}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      parametresVitaux: { ...prev.parametresVitaux, vi: e.target.value }
                    }))}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Vi:"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.parametresVitaux.vc}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        parametresVitaux: { ...prev.parametresVitaux, vc: e.target.checked }
                      }))}
                      className="rounded"
                    />
                    VC
                  </label>
                  <input
                    type="text"
                    value={formData.parametresVitaux.fr}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      parametresVitaux: { ...prev.parametresVitaux, fr: e.target.value }
                    }))}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                    placeholder="FR:"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.parametresVitaux.pi}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      parametresVitaux: { ...prev.parametresVitaux, pi: e.target.value }
                    }))}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Pi:"
                  />
                </div>
              </div>
            </div>

            {/* Autres paramètres */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  T.O.F./Niveau A.L.R.
                </label>
                <input
                  type="text"
                  value={formData.parametresVitaux.tof}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    parametresVitaux: { ...prev.parametresVitaux, tof: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hématocrite/Dextro
                </label>
                <input
                  type="text"
                  value={formData.parametresVitaux.hematocrite}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    parametresVitaux: { ...prev.parametresVitaux, hematocrite: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Score d'Aldrete détaillé */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Score d'ALDRETE détaillé</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {[
                  { key: 'activite', label: 'Activité motrice', options: ['0', '1', '2'] },
                  { key: 'respiration', label: 'Respiration', options: ['0', '1', '2'] },
                  { key: 'circulation', label: 'Circulation', options: ['0', '1', '2'] },
                  { key: 'conscience', label: 'Conscience', options: ['0', '1', '2'] },
                  { key: 'saturation', label: 'Saturation O₂', options: ['0', '1', '2'] }
                ].map(({ key, label, options }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {label}
                    </label>
                    <div className="space-y-2">
                      {options.map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="radio"
                            name={key}
                            value={parseInt(option)}
                            checked={formData.aldrete[key as keyof typeof formData.aldrete] === parseInt(option)}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              aldrete: { ...prev.aldrete, [key]: parseInt(e.target.value) }
                            }))}
                            className="mr-2"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <div className="text-lg font-semibold text-gray-800">
                  Score total: {formData.aldrete.total}/10
                </div>
              </div>
            </div>
          </div>

          {/* Médicaments */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Médicaments</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Analgésie
                </label>
                <textarea
                  value={formData.medicaments.analgesie}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    medicaments: { ...prev.medicaments, analgesie: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Médicaments analgésiques administrés..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Médications
                </label>
                <textarea
                  value={formData.medicaments.medications}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    medicaments: { ...prev.medicaments, medications: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Autres médicaments administrés..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Perfusions
                </label>
                <textarea
                  value={formData.medicaments.perfusions}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    medicaments: { ...prev.medicaments, perfusions: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Perfusions en cours, débits..."
                />
              </div>
            </div>
          </div>

          {/* Bilans entrées/sorties */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Bilans entrées/sorties</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diurèse (ml)
                  </label>
                  <input
                    type="number"
                    value={formData.bilans.diurese}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      bilans: { ...prev.bilans, diurese: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saignement (ml)
                  </label>
                  <input
                    type="number"
                    value={formData.bilans.saignement}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      bilans: { ...prev.bilans, saignement: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    P. Insensibles (ml)
                  </label>
                  <input
                    type="number"
                    value={formData.bilans.pertesInsensibles}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      bilans: { ...prev.bilans, pertesInsensibles: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total sorties (ml)
                  </label>
                  <input
                    type="number"
                    value={formData.bilans.totalSorties}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    readOnly
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Redon 1 (ml)
                  </label>
                  <input
                    type="number"
                    value={formData.bilans.redon1}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      bilans: { ...prev.bilans, redon1: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Redon 2 (ml)
                  </label>
                  <input
                    type="number"
                    value={formData.bilans.redon2}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      bilans: { ...prev.bilans, redon2: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total entrées (ml)
                  </label>
                  <input
                    type="number"
                    value={formData.bilans.totalEntrees}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      bilans: { ...prev.bilans, totalEntrees: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bilan H/cumul (ml)
                  </label>
                  <input
                    type="number"
                    value={formData.bilans.bilanCumulatif}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Préparation au transfert */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Préparation au transfert</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition de sortie
                </label>
                <textarea
                  value={formData.observations.conditionSortie}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    observations: { ...prev.observations, conditionSortie: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="État du patient à la sortie"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service de destination
                </label>
                <select
                  value={formData.transfert.serviceDestination}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    transfert: { ...prev.transfert, serviceDestination: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner...</option>
                  <option value="chirurgie">Chirurgie</option>
                  <option value="medecine">Médecine</option>
                  <option value="reanimation">Réanimation</option>
                  <option value="cardiologie">Cardiologie</option>
                  <option value="neurologie">Neurologie</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure de transfert
                </label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={formData.transfert.heureTransfert}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      transfert: { ...prev.transfert, heureTransfert: e.target.value }
                    }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setCurrentTime('heureTransfert')}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    Maintenant
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Médecin responsable
                </label>
                <input
                  type="text"
                  value={formData.transfert.medecinResponsable}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    transfert: { ...prev.transfert, medecinResponsable: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Médecin du service de dest"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complications survenues
              </label>
              <textarea
                value={formData.observations.complications}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  observations: { ...prev.observations, complications: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Complications éventuelles durant le séjour en SSPI..."
              />
            </div>
          </div>

          {/* Signature */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Signature</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <SignaturePad
                onSignatureChange={(signatureData) => setFormData(prev => ({
                  ...prev,
                  signature: signatureData
                }))}
                width={400}
                height={200}
                placeholder="Signature de l'infirmier(e)"
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                Réinitialiser
              </button>
              <label className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Importer JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleExportJSON}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              >
                <FileText className="w-4 h-4 mr-2" />
                Exporter JSON
              </button>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
