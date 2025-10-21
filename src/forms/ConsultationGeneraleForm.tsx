import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Save, Printer, FileText, Upload, ArrowLeft } from 'lucide-react';

interface ConsultationData {
  patient: {
    nom: string;
    prenom: string;
    numeroIdentification: string;
    age: string;
    sexe: string;
    telephone: string;
    adresse: string;
  };
  consultation: {
    dateConsultation: string;
    motifConsultation: string;
    antecedents: string;
    traitementEnCours: string;
    allergies: string;
    examenClinique: {
      tensionArterielle: string;
      frequenceCardiaque: string;
      temperature: string;
      poids: string;
      taille: string;
      observations: string;
    };
    diagnostic: string;
    traitementPrescrit: string;
    recommandations: string;
    prochaineConsultation: string;
  };
}

export default function ConsultationGeneraleForm({ 
  onBackToList, 
  onCreateNew, 
  onSelectPatient 
}: {
  onBackToList?: () => void;
  onCreateNew?: () => void;
  onSelectPatient?: (patientNumber: string) => void;
}) {
  const [savedMessage, setSavedMessage] = useState<string>('');
  const [formData, setFormData] = useState<ConsultationData>({
    patient: {
      nom: '',
      prenom: '',
      numeroIdentification: '',
      age: '',
      sexe: '',
      telephone: '',
      adresse: ''
    },
    consultation: {
      dateConsultation: new Date().toISOString().split('T')[0],
      motifConsultation: '',
      antecedents: '',
      traitementEnCours: '',
      allergies: '',
      examenClinique: {
        tensionArterielle: '',
        frequenceCardiaque: '',
        temperature: '',
        poids: '',
        taille: '',
        observations: ''
      },
      diagnostic: '',
      traitementPrescrit: '',
      recommandations: '',
      prochaineConsultation: ''
    }
  });

  const handleSave = async () => {
    try {
      const patientNumber = formData.patient?.numeroIdentification?.trim();
      if (!patientNumber) {
        alert("Veuillez renseigner le numéro d'identification du patient pour sauvegarder.");
        return;
      }

      const payload = { 
        patient_number: patientNumber, 
        data: formData,
        form_type: 'consultation_generale'
      };

      const { error } = await supabase
        .from('preanesthesia_forms')
        .upsert(payload, { onConflict: 'patient_number' });

      if (error) throw error;

      setSavedMessage('✓ Consultation sauvegardée avec succès');
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
    link.download = `consultation_${formData.patient.nom}_${formData.patient.prenom}_${new Date().toISOString().split('T')[0]}.json`;
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="no-print mb-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <img 
              src="https://res.cloudinary.com/dd64mwkl2/image/upload/v1758286702/Centre_Diagnostic-Logo_xhxxpv.png" 
              alt="Centre Diagnostic de Libreville" 
              className="h-16 w-auto"
            />
            <div>
              <h1 className="text-3xl font-bold text-[#1e3a8a]">Consultation Générale</h1>
              <p className="text-gray-600 mt-1">Formulaire de consultation médicale générale</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onBackToList}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition shadow-md"
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
              className="flex items-center px-4 py-2 bg-[#0ea5e9] text-white rounded-md hover:bg-[#0284c7] transition cursor-pointer shadow-md"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importer
            </label>
            <button
              onClick={handleExportJSON}
              className="flex items-center px-4 py-2 bg-[#0ea5e9] text-white rounded-md hover:bg-[#0284c7] transition shadow-md"
            >
              <FileText className="w-4 h-4 mr-2" />
              Exporter
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center px-4 py-2 bg-[#0ea5e9] text-white rounded-md hover:bg-[#0284c7] transition shadow-md"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
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

        {savedMessage && (
          <div className="no-print mb-4 p-3 bg-green-100 text-green-800 rounded-md text-center">
            {savedMessage}
          </div>
        )}

        {/* Formulaire */}
        <div className="space-y-8">
          {/* Informations Patient */}
          <section className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations Patient</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  value={formData.patient.nom}
                  onChange={(e) => setFormData({
                    ...formData,
                    patient: { ...formData.patient, nom: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  value={formData.patient.prenom}
                  onChange={(e) => setFormData({
                    ...formData,
                    patient: { ...formData.patient, prenom: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro d'identification *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  value={formData.patient.numeroIdentification}
                  onChange={(e) => setFormData({
                    ...formData,
                    patient: { ...formData.patient, numeroIdentification: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Âge</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  value={formData.patient.age}
                  onChange={(e) => setFormData({
                    ...formData,
                    patient: { ...formData.patient, age: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  value={formData.patient.sexe}
                  onChange={(e) => setFormData({
                    ...formData,
                    patient: { ...formData.patient, sexe: e.target.value }
                  })}
                >
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  value={formData.patient.telephone}
                  onChange={(e) => setFormData({
                    ...formData,
                    patient: { ...formData.patient, telephone: e.target.value }
                  })}
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  rows={2}
                  value={formData.patient.adresse}
                  onChange={(e) => setFormData({
                    ...formData,
                    patient: { ...formData.patient, adresse: e.target.value }
                  })}
                />
              </div>
            </div>
          </section>

          {/* Consultation */}
          <section className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Consultation</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de consultation</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    value={formData.consultation.dateConsultation}
                    onChange={(e) => setFormData({
                      ...formData,
                      consultation: { ...formData.consultation, dateConsultation: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motif de consultation</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    value={formData.consultation.motifConsultation}
                    onChange={(e) => setFormData({
                      ...formData,
                      consultation: { ...formData.consultation, motifConsultation: e.target.value }
                    })}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Antécédents médicaux</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  rows={3}
                  value={formData.consultation.antecedents}
                  onChange={(e) => setFormData({
                    ...formData,
                    consultation: { ...formData.consultation, antecedents: e.target.value }
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Traitement en cours</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  rows={3}
                  value={formData.consultation.traitementEnCours}
                  onChange={(e) => setFormData({
                    ...formData,
                    consultation: { ...formData.consultation, traitementEnCours: e.target.value }
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  rows={2}
                  value={formData.consultation.allergies}
                  onChange={(e) => setFormData({
                    ...formData,
                    consultation: { ...formData.consultation, allergies: e.target.value }
                  })}
                />
              </div>
            </div>
          </section>

          {/* Examen Clinique */}
          <section className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Examen Clinique</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tension artérielle</label>
                <input
                  type="text"
                  placeholder="ex: 120/80"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  value={formData.consultation.examenClinique.tensionArterielle}
                  onChange={(e) => setFormData({
                    ...formData,
                    consultation: {
                      ...formData.consultation,
                      examenClinique: {
                        ...formData.consultation.examenClinique,
                        tensionArterielle: e.target.value
                      }
                    }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fréquence cardiaque</label>
                <input
                  type="text"
                  placeholder="ex: 72 bpm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  value={formData.consultation.examenClinique.frequenceCardiaque}
                  onChange={(e) => setFormData({
                    ...formData,
                    consultation: {
                      ...formData.consultation,
                      examenClinique: {
                        ...formData.consultation.examenClinique,
                        frequenceCardiaque: e.target.value
                      }
                    }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Température</label>
                <input
                  type="text"
                  placeholder="ex: 37°C"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  value={formData.consultation.examenClinique.temperature}
                  onChange={(e) => setFormData({
                    ...formData,
                    consultation: {
                      ...formData.consultation,
                      examenClinique: {
                        ...formData.consultation.examenClinique,
                        temperature: e.target.value
                      }
                    }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poids</label>
                <input
                  type="text"
                  placeholder="ex: 70 kg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  value={formData.consultation.examenClinique.poids}
                  onChange={(e) => setFormData({
                    ...formData,
                    consultation: {
                      ...formData.consultation,
                      examenClinique: {
                        ...formData.consultation.examenClinique,
                        poids: e.target.value
                      }
                    }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taille</label>
                <input
                  type="text"
                  placeholder="ex: 175 cm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  value={formData.consultation.examenClinique.taille}
                  onChange={(e) => setFormData({
                    ...formData,
                    consultation: {
                      ...formData.consultation,
                      examenClinique: {
                        ...formData.consultation.examenClinique,
                        taille: e.target.value
                      }
                    }
                  })}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observations</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                rows={4}
                value={formData.consultation.examenClinique.observations}
                onChange={(e) => setFormData({
                  ...formData,
                  consultation: {
                    ...formData.consultation,
                    examenClinique: {
                      ...formData.consultation.examenClinique,
                      observations: e.target.value
                    }
                  }
                })}
              />
            </div>
          </section>

          {/* Diagnostic et Traitement */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Diagnostic et Traitement</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnostic</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  rows={3}
                  value={formData.consultation.diagnostic}
                  onChange={(e) => setFormData({
                    ...formData,
                    consultation: { ...formData.consultation, diagnostic: e.target.value }
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Traitement prescrit</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  rows={3}
                  value={formData.consultation.traitementPrescrit}
                  onChange={(e) => setFormData({
                    ...formData,
                    consultation: { ...formData.consultation, traitementPrescrit: e.target.value }
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recommandations</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  rows={3}
                  value={formData.consultation.recommandations}
                  onChange={(e) => setFormData({
                    ...formData,
                    consultation: { ...formData.consultation, recommandations: e.target.value }
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prochaine consultation</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  value={formData.consultation.prochaineConsultation}
                  onChange={(e) => setFormData({
                    ...formData,
                    consultation: { ...formData.consultation, prochaineConsultation: e.target.value }
                  })}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
