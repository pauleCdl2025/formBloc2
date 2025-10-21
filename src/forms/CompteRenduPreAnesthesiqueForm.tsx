import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Save, Printer, FileText, Upload, ArrowLeft, Stethoscope, ClipboardList, Heart, Activity } from 'lucide-react';
import SignaturePad from '../components/SignaturePad';

interface CompteRenduData {
  identification: {
    dateConsultation: string;
    medecinAnesthesiste: string;
    rpps: string;
  };
  patient: {
    nom: string;
    prenom: string;
    dateNaissance: string;
    sexe: string;
    poids: number;
    taille: number;
    imc: number;
    age: string;
  };
  intervention: {
    type: string;
    datePrevue: string;
    chirurgien: string;
    duree: string;
    caractere: string;
    hospitalisation: string;
  };
  antecedents: {
    allergies: string;
    allergiesDetails: string;
    cardio: string;
    respiratory: string;
    endocrine: string;
    neuro: string;
    digestive: string;
    renal: string;
    otherPatho: string;
    previousConsultation: string;
    previousDetails: string;
    previousComplications: string;
  };
  examenClinique: {
    heartRate: number;
    taSys: number;
    taDia: number;
    ecg: string;
    auscultationCardio: string;
    asa: string;
    ven: number;
    spo2: number;
    auscultationResp: string;
  };
  examensComplementaires: {
    biologyDate: string;
    biologyResults: string;
    imagingDate: string;
    imagingResults: string;
  };
  preparation: {
    fastingSolids: string;
    fastingLiquids: string;
    premedication: string;
    preparationInstructions: string;
  };
  techniqueAnesthesique: {
    anesthesiaType: string;
    anesthesiaDetails: string;
    monitoringPlan: string;
  };
  informationConsentement: {
    risksExplained: boolean;
    complicationsExplained: boolean;
    alternativesExplained: boolean;
    consentObtained: boolean;
    consentDate: string;
    patientQuestions: string;
  };
  signatures: {
    doctorSignature: string;
    patientSignature: string;
  };
}

export default function CompteRenduPreAnesthesiqueForm({ 
  onBackToList, 
  onCreateNew, 
  onSelectPatient 
}: {
  onBackToList?: () => void;
  onCreateNew?: () => void;
  onSelectPatient?: (patientNumber: string) => void;
}) {
  const [savedMessage, setSavedMessage] = useState<string>('');
  const [formData, setFormData] = useState<CompteRenduData>({
    identification: {
      dateConsultation: new Date().toISOString().split('T')[0],
      medecinAnesthesiste: '',
      rpps: ''
    },
    patient: {
      nom: '',
      prenom: '',
      dateNaissance: '',
      sexe: '',
      poids: 0,
      taille: 0,
      imc: 0,
      age: ''
    },
    intervention: {
      type: '',
      datePrevue: '',
      chirurgien: '',
      duree: '',
      caractere: '',
      hospitalisation: ''
    },
    antecedents: {
      allergies: '',
      allergiesDetails: '',
      cardio: '',
      respiratory: '',
      endocrine: '',
      neuro: '',
      digestive: '',
      renal: '',
      otherPatho: '',
      previousConsultation: '',
      previousDetails: '',
      previousComplications: ''
    },
    examenClinique: {
      heartRate: 0,
      taSys: 0,
      taDia: 0,
      ecg: '',
      auscultationCardio: '',
      asa: '',
      ven: 0,
      spo2: 0,
      auscultationResp: ''
    },
    examensComplementaires: {
      biologyDate: '',
      biologyResults: '',
      imagingDate: '',
      imagingResults: ''
    },
    preparation: {
      fastingSolids: '',
      fastingLiquids: '',
      premedication: '',
      preparationInstructions: ''
    },
    techniqueAnesthesique: {
      anesthesiaType: '',
      anesthesiaDetails: '',
      monitoringPlan: ''
    },
    informationConsentement: {
      risksExplained: false,
      complicationsExplained: false,
      alternativesExplained: false,
      consentObtained: false,
      consentDate: '',
      patientQuestions: ''
    },
    signatures: {
      doctorSignature: '',
      patientSignature: ''
    }
  });

  const calculateBMIAndAge = () => {
    const { poids, taille, dateNaissance } = formData.patient;
    
    // Calcul IMC
    if (poids && taille) {
      const heightInMeters = taille / 100;
      const bmi = (poids / (heightInMeters * heightInMeters));
      setFormData(prev => ({
        ...prev,
        patient: { ...prev.patient, imc: Number(bmi.toFixed(1)) }
      }));
    }
    
    // Calcul âge
    if (dateNaissance) {
      const today = new Date();
      const birth = new Date(dateNaissance);
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

  const handleSave = async () => {
    try {
      const patientNumber = `${formData.patient.nom}_${formData.patient.prenom}`.trim();
      if (!patientNumber || patientNumber === '_') {
        alert("Veuillez renseigner le nom et prénom du patient pour sauvegarder.");
        return;
      }

      const payload = { 
        patient_number: patientNumber, 
        data: formData,
        form_type: 'compte_rendu_preanesthesique'
      };

      const { error } = await supabase
        .from('preanesthesia_forms')
        .upsert(payload, { onConflict: 'patient_number' });

      if (error) throw error;

      setSavedMessage('✓ Compte-rendu pré-anesthésique sauvegardé avec succès');
      setTimeout(() => setSavedMessage(''), 5000);
    } catch (e: any) {
      alert('Erreur lors de la sauvegarde: ' + (e?.message || e));
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compte_rendu_preanesthesique_${formData.patient.nom}_${formData.patient.prenom}_${new Date().toISOString().split('T')[0]}.json`;
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
    calculateBMIAndAge();
  }, [formData.patient.poids, formData.patient.taille, formData.patient.dateNaissance]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-8 text-center relative">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
            <Stethoscope className="w-8 h-8" />
            COMPTE-RENDU DE CONSULTATION PRÉ-ANESTHÉSIQUE
          </h1>
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

        {/* Identification */}
        <div className="p-6 bg-blue-50 border-b-2 border-blue-200">
          <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            IDENTIFICATION
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Date de consultation *</label>
              <input
                type="date"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.identification.dateConsultation}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  identification: { ...prev.identification, dateConsultation: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Médecin anesthésiste *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dr"
                value={formData.identification.medecinAnesthesiste}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  identification: { ...prev.identification, medecinAnesthesiste: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">N° RPPS</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="11 chiffres"
                pattern="\d{11}"
                value={formData.identification.rpps}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  identification: { ...prev.identification, rpps: e.target.value }
                }))}
              />
            </div>
          </div>

          {/* Patient */}
          <h3 className="text-lg font-semibold text-blue-700 mt-6 mb-4 pl-3 border-l-4 border-blue-500">Patient</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Nom *</label>
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
              <label className="block text-sm font-semibold text-blue-700 mb-1">Date de naissance *</label>
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
              <label className="block text-sm font-semibold text-blue-700 mb-1">Sexe *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sexe"
                    value="M"
                    checked={formData.patient.sexe === 'M'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      patient: { ...prev.patient, sexe: e.target.value }
                    }))}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Masculin</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sexe"
                    value="F"
                    checked={formData.patient.sexe === 'F'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      patient: { ...prev.patient, sexe: e.target.value }
                    }))}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Féminin</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Poids (kg) *</label>
              <input
                type="number"
                step="0.1"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.patient.poids || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  patient: { ...prev.patient, poids: Number(e.target.value) }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Taille (cm) *</label>
              <input
                type="number"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.patient.taille || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  patient: { ...prev.patient, taille: Number(e.target.value) }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">IMC</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg bg-gray-100"
                value={formData.patient.imc || ''}
                readOnly
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
          </div>
        </div>

        {/* Intervention prévue */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            INTERVENTION PRÉVUE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Type d'intervention *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.intervention.type}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  intervention: { ...prev.intervention, type: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Date prévue *</label>
              <input
                type="date"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.intervention.datePrevue}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  intervention: { ...prev.intervention, datePrevue: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Chirurgien *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dr"
                value={formData.intervention.chirurgien}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  intervention: { ...prev.intervention, chirurgien: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Durée estimée</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ex: 2h00"
                value={formData.intervention.duree}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  intervention: { ...prev.intervention, duree: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Caractère *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="caractere"
                    value="programmed"
                    checked={formData.intervention.caractere === 'programmed'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      intervention: { ...prev.intervention, caractere: e.target.value }
                    }))}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Programmé</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="caractere"
                    value="urgent"
                    checked={formData.intervention.caractere === 'urgent'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      intervention: { ...prev.intervention, caractere: e.target.value }
                    }))}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Urgent</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Hospitalisation *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hospitalisation"
                    value="ambulatory"
                    checked={formData.intervention.hospitalisation === 'ambulatory'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      intervention: { ...prev.intervention, hospitalisation: e.target.value }
                    }))}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Ambulatoire</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hospitalisation"
                    value="conventional"
                    checked={formData.intervention.hospitalisation === 'conventional'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      intervention: { ...prev.intervention, hospitalisation: e.target.value }
                    }))}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Conventionnelle</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Antécédents */}
        <div className="p-6 bg-blue-50">
          <h2 className="text-xl font-bold text-blue-800 mb-4">ANTÉCÉDENTS</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Allergies</label>
              <div className="flex gap-4 mb-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="allergies"
                    value="no"
                    checked={formData.antecedents.allergies === 'no'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      antecedents: { ...prev.antecedents, allergies: e.target.value }
                    }))}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Non</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="allergies"
                    value="yes"
                    checked={formData.antecedents.allergies === 'yes'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      antecedents: { ...prev.antecedents, allergies: e.target.value }
                    }))}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Oui</span>
                </label>
              </div>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Préciser si oui"
                value={formData.antecedents.allergiesDetails}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  antecedents: { ...prev.antecedents, allergiesDetails: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Pathologies cardiovasculaires</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.antecedents.cardio}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  antecedents: { ...prev.antecedents, cardio: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Pathologies respiratoires</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.antecedents.respiratory}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  antecedents: { ...prev.antecedents, respiratory: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Pathologies endocriniennes</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.antecedents.endocrine}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  antecedents: { ...prev.antecedents, endocrine: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Pathologies neurologiques</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.antecedents.neuro}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  antecedents: { ...prev.antecedents, neuro: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Pathologies digestives</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.antecedents.digestive}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  antecedents: { ...prev.antecedents, digestive: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Pathologies rénales</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.antecedents.renal}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  antecedents: { ...prev.antecedents, renal: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Autres</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.antecedents.otherPatho}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  antecedents: { ...prev.antecedents, otherPatho: e.target.value }
                }))}
              />
            </div>
          </div>

          {/* Consultation anesthésique précédente */}
          <h3 className="text-lg font-semibold text-blue-700 mt-6 mb-4 pl-3 border-l-4 border-blue-500">Consultation anesthésique précédente</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Consultation précédente</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="previousConsultation"
                    value="no"
                    checked={formData.antecedents.previousConsultation === 'no'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      antecedents: { ...prev.antecedents, previousConsultation: e.target.value }
                    }))}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Non</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="previousConsultation"
                    value="yes"
                    checked={formData.antecedents.previousConsultation === 'yes'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      antecedents: { ...prev.antecedents, previousConsultation: e.target.value }
                    }))}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Oui</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Détails de la consultation précédente</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.antecedents.previousDetails}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  antecedents: { ...prev.antecedents, previousDetails: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Complications précédentes</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.antecedents.previousComplications}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  antecedents: { ...prev.antecedents, previousComplications: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>

        {/* Examen clinique */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-800 mb-4">EXAMEN CLINIQUE</h2>
          
          {/* Appareil cardiovasculaire */}
          <h3 className="text-lg font-semibold text-blue-700 mb-4 pl-3 border-l-4 border-blue-500">Appareil cardiovasculaire</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">FC (bpm)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="battements/min"
                value={formData.examenClinique.heartRate || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  examenClinique: { ...prev.examenClinique, heartRate: Number(e.target.value) }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">TA Systolique (mmHg)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Systolique"
                value={formData.examenClinique.taSys || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  examenClinique: { ...prev.examenClinique, taSys: Number(e.target.value) }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">TA Diastolique (mmHg)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Diastolique"
                value={formData.examenClinique.taDia || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  examenClinique: { ...prev.examenClinique, taDia: Number(e.target.value) }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">SpO2 (%)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="%"
                max="100"
                value={formData.examenClinique.spo2 || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  examenClinique: { ...prev.examenClinique, spo2: Number(e.target.value) }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Classification ASA</label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map(value => (
                  <label key={value} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="asa"
                      value={value.toString()}
                      checked={formData.examenClinique.asa === value.toString()}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        examenClinique: { ...prev.examenClinique, asa: e.target.value }
                      }))}
                      className="text-blue-600"
                    />
                    <span className="text-sm">ASA {value}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">ECG</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Résultats ECG"
                value={formData.examenClinique.ecg}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  examenClinique: { ...prev.examenClinique, ecg: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Auscultation cardiaque</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.examenClinique.auscultationCardio}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  examenClinique: { ...prev.examenClinique, auscultationCardio: e.target.value }
                }))}
              />
            </div>
          </div>

          {/* Appareil respiratoire */}
          <h3 className="text-lg font-semibold text-blue-700 mb-4 mt-6 pl-3 border-l-4 border-blue-500">Appareil respiratoire</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Fréquence respiratoire (/min)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/min"
                value={formData.examenClinique.ven || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  examenClinique: { ...prev.examenClinique, ven: Number(e.target.value) }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Auscultation respiratoire</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.examenClinique.auscultationResp}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  examenClinique: { ...prev.examenClinique, auscultationResp: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>

        {/* Examens complémentaires */}
        <div className="p-6 bg-blue-50">
          <h2 className="text-xl font-bold text-blue-800 mb-4">EXAMENS COMPLÉMENTAIRES</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Date des examens biologiques</label>
              <input
                type="date"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.examensComplementaires.biologyDate}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  examensComplementaires: { ...prev.examensComplementaires, biologyDate: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Date de l'imagerie</label>
              <input
                type="date"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.examensComplementaires.imagingDate}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  examensComplementaires: { ...prev.examensComplementaires, imagingDate: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Résultats biologiques</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Hémogramme, ionogramme, hémostase..."
                value={formData.examensComplementaires.biologyResults}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  examensComplementaires: { ...prev.examensComplementaires, biologyResults: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Résultats d'imagerie</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Radio thorax, ECG..."
                value={formData.examensComplementaires.imagingResults}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  examensComplementaires: { ...prev.examensComplementaires, imagingResults: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>

        {/* Jeûne et préparation */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-800 mb-4">JEÛNE ET PRÉPARATION</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Dernière prise solide</label>
              <input
                type="time"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.preparation.fastingSolids}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  preparation: { ...prev.preparation, fastingSolids: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Dernière prise liquide</label>
              <input
                type="time"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.preparation.fastingLiquids}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  preparation: { ...prev.preparation, fastingLiquids: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Prémédication</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Médicaments et posologie"
                value={formData.preparation.premedication}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  preparation: { ...prev.preparation, premedication: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Instructions de préparation</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Instructions pour le patient"
                value={formData.preparation.preparationInstructions}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  preparation: { ...prev.preparation, preparationInstructions: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>

        {/* Technique anesthésique */}
        <div className="p-6 bg-blue-50">
          <h2 className="text-xl font-bold text-blue-800 mb-4">TECHNIQUE ANESTHÉSIQUE PRÉVUE</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Type d'anesthésie</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="AG, ALR, combinée..."
                value={formData.techniqueAnesthesique.anesthesiaType}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  techniqueAnesthesique: { ...prev.techniqueAnesthesique, anesthesiaType: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Détails techniques</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Technique détaillée, médicaments prévus..."
                value={formData.techniqueAnesthesique.anesthesiaDetails}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  techniqueAnesthesique: { ...prev.techniqueAnesthesique, anesthesiaDetails: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">Plan de monitorage</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Monitoring prévu (standard, invasif...)"
                value={formData.techniqueAnesthesique.monitoringPlan}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  techniqueAnesthesique: { ...prev.techniqueAnesthesique, monitoringPlan: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>

        {/* Information et consentement */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-800 mb-4">INFORMATION ET CONSENTEMENT</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600"
                  checked={formData.informationConsentement.risksExplained}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    informationConsentement: { ...prev.informationConsentement, risksExplained: e.target.checked }
                  }))}
                />
                <span className="font-semibold text-blue-700">Risques expliqués au patient</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600"
                  checked={formData.informationConsentement.complicationsExplained}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    informationConsentement: { ...prev.informationConsentement, complicationsExplained: e.target.checked }
                  }))}
                />
                <span className="font-semibold text-blue-700">Complications possibles expliquées</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600"
                  checked={formData.informationConsentement.alternativesExplained}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    informationConsentement: { ...prev.informationConsentement, alternativesExplained: e.target.checked }
                  }))}
                />
                <span className="font-semibold text-blue-700">Alternatives thérapeutiques expliquées</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600"
                  checked={formData.informationConsentement.consentObtained}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    informationConsentement: { ...prev.informationConsentement, consentObtained: e.target.checked }
                  }))}
                />
                <span className="font-semibold text-blue-700">Consentement éclairé obtenu</span>
              </label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-1">Date du consentement</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.informationConsentement.consentDate}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    informationConsentement: { ...prev.informationConsentement, consentDate: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">Questions du patient</label>
                <textarea
                  className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Questions posées par le patient et réponses apportées"
                  value={formData.informationConsentement.patientQuestions}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    informationConsentement: { ...prev.informationConsentement, patientQuestions: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="p-6 bg-blue-50">
          <h2 className="text-xl font-bold text-blue-800 mb-4">SIGNATURES</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Signature du médecin anesthésiste</h3>
              <SignaturePad
                onSignatureChange={(signature) => setFormData(prev => ({
                  ...prev,
                  signatures: { ...prev.signatures, doctorSignature: signature }
                }))}
                width={400}
                height={200}
                placeholder="Signature du médecin"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Signature du patient</h3>
              <SignaturePad
                onSignatureChange={(signature) => setFormData(prev => ({
                  ...prev,
                  signatures: { ...prev.signatures, patientSignature: signature }
                }))}
                width={400}
                height={200}
                placeholder="Signature du patient"
              />
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="p-6 text-center bg-white">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md mr-4"
          >
            Sauvegarder la consultation
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Valider définitivement
          </button>
        </div>
      </div>
    </div>
  );
}
