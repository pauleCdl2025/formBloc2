import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Save, Printer, FileText, Upload, ArrowLeft, FileCheck, Shield, AlertTriangle } from 'lucide-react';
import SignaturePad from '../components/SignaturePad';

interface ConsentementData {
  patient: {
    nom: string;
    prenom: string;
    dateNaissance: string;
    age: string;
  };
  medecin: {
    nom: string;
    dateConsentement: string;
    lieu: string;
  };
  diagnostic: string;
  indication: string;
  informationsPreop: {
    jeune: boolean;
    tabac: boolean;
    medicaments: boolean;
  };
  anesthesie: {
    generale: boolean;
    locoRegionale: boolean;
    localeSedation: boolean;
  };
  transfusion: {
    oui: boolean;
    non: boolean;
    refusDocument: boolean;
  };
  gestes: {
    invasifs: string;
    autres: string;
  };
  risquesALR: {
    lesionsNerveuses: boolean;
    hematome: boolean;
    infection: boolean;
    criseConvulsive: boolean;
    brecheDuremere: boolean;
  };
  risquesPatient: string;
  risquesDentition: string;
  complicationsPostop: string;
  lieuTransfert: string;
  consentementEclaire: boolean;
  documentSigne: boolean;
  signaturePatient: string;
}

export default function ConsentementAnesthesiqueForm({ 
  onBackToList, 
  onCreateNew, 
  onSelectPatient 
}: {
  onBackToList?: () => void;
  onCreateNew?: () => void;
  onSelectPatient?: (patientNumber: string) => void;
}) {
  const [savedMessage, setSavedMessage] = useState<string>('');
  const [hasSignature, setHasSignature] = useState<boolean>(false);
  const [formData, setFormData] = useState<ConsentementData>({
    patient: {
      nom: '',
      prenom: '',
      dateNaissance: '',
      age: ''
    },
    medecin: {
      nom: '',
      dateConsentement: new Date().toISOString().split('T')[0],
      lieu: ''
    },
    diagnostic: '',
    indication: '',
    informationsPreop: {
      jeune: false,
      tabac: false,
      medicaments: false
    },
    anesthesie: {
      generale: false,
      locoRegionale: false,
      localeSedation: false
    },
    transfusion: {
      oui: false,
      non: false,
      refusDocument: false
    },
    gestes: {
      invasifs: '',
      autres: ''
    },
    risquesALR: {
      lesionsNerveuses: false,
      hematome: false,
      infection: false,
      criseConvulsive: false,
      brecheDuremere: false
    },
    risquesPatient: '',
    risquesDentition: '',
    complicationsPostop: '',
    lieuTransfert: '',
    consentementEclaire: false,
    documentSigne: false,
    signaturePatient: ''
  });

  const calculateAge = () => {
    const { dateNaissance } = formData.patient;
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
        form_type: 'consentement_anesthesique'
      };

      const { error } = await supabase
        .from('preanesthesia_forms')
        .upsert(payload, { onConflict: 'patient_number' });

      if (error) throw error;

      setSavedMessage('✓ Consentement anesthésique sauvegardé avec succès');
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
        medecin: {
          nom: '',
          dateConsentement: new Date().toISOString().split('T')[0],
          lieu: ''
        },
        diagnostic: '',
        indication: '',
        informationsPreop: {
          jeune: false,
          tabac: false,
          medicaments: false
        },
        anesthesie: {
          generale: false,
          locoRegionale: false,
          localeSedation: false
        },
        transfusion: {
          oui: false,
          non: false,
          refusDocument: false
        },
        gestes: {
          invasifs: '',
          autres: ''
        },
        risquesALR: {
          lesionsNerveuses: false,
          hematome: false,
          infection: false,
          criseConvulsive: false,
          brecheDuremere: false
        },
        risquesPatient: '',
        risquesDentition: '',
        complicationsPostop: '',
        lieuTransfert: '',
        consentementEclaire: false,
        documentSigne: false,
        signaturePatient: ''
      });
      setHasSignature(false);
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
    link.download = `consentement_anesthesique_${formData.patient.nom}_${formData.patient.prenom}_${new Date().toISOString().split('T')[0]}.json`;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-8 text-center relative">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
            <Shield className="w-8 h-8" />
            CONSULTATIONS DU SERVICE D'ANESTHÉSIE-RÉANIMATION
          </h1>
          <h2 className="text-xl opacity-90">Consentement anesthésique</h2>
        </div>

        {/* Toolbar */}
        <div className="bg-white border-2 border-slate-200 p-4 flex gap-3 items-center flex-wrap">
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
            <AlertTriangle className="w-4 h-4 mr-2" />
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

        {/* Informations patient */}
        <div className="bg-slate-50 p-6 border-b-2 border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nom du patient *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                value={formData.patient.nom}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  patient: { ...prev.patient, nom: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Prénom *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                value={formData.patient.prenom}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  patient: { ...prev.patient, prenom: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Date de naissance</label>
              <input
                type="date"
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                value={formData.patient.dateNaissance}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  patient: { ...prev.patient, dateNaissance: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Âge</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg bg-gray-100"
                value={formData.patient.age}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Médecin anesthésiste *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                value={formData.medecin.nom}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  medecin: { ...prev.medecin, nom: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Date du consentement *</label>
              <input
                type="date"
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                value={formData.medecin.dateConsentement}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  medecin: { ...prev.medecin, dateConsentement: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Lieu</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="Service, hôpital"
                value={formData.medecin.lieu}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  medecin: { ...prev.medecin, lieu: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>

        {/* Diagnostic et indication */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              DIAGNOSTIC :
            </h2>
            <textarea
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              rows={3}
              placeholder="Diagnostic principal"
              value={formData.diagnostic}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                diagnostic: e.target.value
              }))}
            />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              INDICATION :
            </h2>
            <textarea
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              rows={3}
              placeholder="Indication opératoire"
              value={formData.indication}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                indication: e.target.value
              }))}
            />
          </div>
        </div>

        {/* Informations préopératoires */}
        <div className="p-6 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Le patient a été informé des points suivants :</h2>
          
          <h3 className="text-lg font-semibold text-slate-700 mb-4 pl-3 border-l-4 border-slate-500">PÉRIODE PRÉOPÉRATOIRE</h3>
          <p className="text-slate-600 mb-4">Le patient a été informé concernant :</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-lg hover:border-slate-400 transition cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-slate-600"
                checked={formData.informationsPreop.jeune}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  informationsPreop: { ...prev.informationsPreop, jeune: e.target.checked }
                }))}
              />
              <span className="font-medium text-slate-700">Jeûne préopératoire</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-lg hover:border-slate-400 transition cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-slate-600"
                checked={formData.informationsPreop.tabac}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  informationsPreop: { ...prev.informationsPreop, tabac: e.target.checked }
                }))}
              />
              <span className="font-medium text-slate-700">Arrêt du tabac</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-lg hover:border-slate-400 transition cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-slate-600"
                checked={formData.informationsPreop.medicaments}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  informationsPreop: { ...prev.informationsPreop, medicaments: e.target.checked }
                }))}
              />
              <span className="font-medium text-slate-700">Médicaments à poursuivre ou arrêter</span>
            </label>
          </div>
        </div>

        {/* Période opératoire */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-700 mb-4 pl-3 border-l-4 border-slate-500">PÉRIODE OPÉRATOIRE</h3>
          
          <h4 className="text-md font-semibold text-slate-600 mb-3">Anesthésie proposée :</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <label className="flex items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-lg hover:border-slate-400 transition cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-slate-600"
                checked={formData.anesthesie.generale}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  anesthesie: { ...prev.anesthesie, generale: e.target.checked }
                }))}
              />
              <span className="font-medium text-slate-700">Anesthésie générale</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-lg hover:border-slate-400 transition cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-slate-600"
                checked={formData.anesthesie.locoRegionale}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  anesthesie: { ...prev.anesthesie, locoRegionale: e.target.checked }
                }))}
              />
              <span className="font-medium text-slate-700">Anesthésie loco-régionale</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-lg hover:border-slate-400 transition cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-slate-600"
                checked={formData.anesthesie.localeSedation}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  anesthesie: { ...prev.anesthesie, localeSedation: e.target.checked }
                }))}
              />
              <span className="font-medium text-slate-700">Anesthésie locale avec sédation</span>
            </label>
          </div>

          <h4 className="text-md font-semibold text-slate-600 mb-3">Transfusion</h4>
          <p className="text-slate-600 mb-3">Le patient consent à l'administration de produits sanguins labiles :</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <label className="flex items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-lg hover:border-slate-400 transition cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-slate-600"
                checked={formData.transfusion.oui}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFormData(prev => ({
                    ...prev,
                    transfusion: { 
                      ...prev.transfusion, 
                      oui: checked,
                      non: checked ? false : prev.transfusion.non
                    }
                  }));
                }}
              />
              <span className="font-medium text-slate-700">Oui</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-lg hover:border-slate-400 transition cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-slate-600"
                checked={formData.transfusion.non}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFormData(prev => ({
                    ...prev,
                    transfusion: { 
                      ...prev.transfusion, 
                      non: checked,
                      oui: checked ? false : prev.transfusion.oui
                    }
                  }));
                }}
              />
              <span className="font-medium text-slate-700">Non</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-lg hover:border-slate-400 transition cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-slate-600"
                checked={formData.transfusion.refusDocument}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  transfusion: { ...prev.transfusion, refusDocument: e.target.checked }
                }))}
              />
              <span className="font-medium text-slate-700">Document de refus de transfusion signé</span>
            </label>
          </div>

          <h4 className="text-md font-semibold text-slate-600 mb-3">Gestes invasifs et monitoring</h4>
          <p className="text-slate-600 mb-3">Gestes invasifs pour le monitorage/l'anesthésie/l'analgésie :</p>
          <textarea
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 mb-4"
            rows={3}
            placeholder="Cathéter veineux, artériel, sondage, etc."
            value={formData.gestes.invasifs}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              gestes: { ...prev.gestes, invasifs: e.target.value }
            }))}
          />
          
          <p className="text-slate-600 mb-3">Autres gestes (sondage vésical, etc.) :</p>
          <textarea
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            rows={3}
            placeholder="Autres gestes prévus"
            value={formData.gestes.autres}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              gestes: { ...prev.gestes, autres: e.target.value }
            }))}
          />
        </div>

        {/* Risques */}
        <div className="p-6 bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-700 mb-4 pl-3 border-l-4 border-slate-500">Risques liés à la procédure d'ALR</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <label className="flex items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-lg hover:border-slate-400 transition cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-slate-600"
                checked={formData.risquesALR.lesionsNerveuses}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  risquesALR: { ...prev.risquesALR, lesionsNerveuses: e.target.checked }
                }))}
              />
              <span className="font-medium text-slate-700">Lésions nerveuses</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-lg hover:border-slate-400 transition cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-slate-600"
                checked={formData.risquesALR.hematome}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  risquesALR: { ...prev.risquesALR, hematome: e.target.checked }
                }))}
              />
              <span className="font-medium text-slate-700">Hématome</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-lg hover:border-slate-400 transition cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-slate-600"
                checked={formData.risquesALR.infection}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  risquesALR: { ...prev.risquesALR, infection: e.target.checked }
                }))}
              />
              <span className="font-medium text-slate-700">Infection</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-lg hover:border-slate-400 transition cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-slate-600"
                checked={formData.risquesALR.criseConvulsive}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  risquesALR: { ...prev.risquesALR, criseConvulsive: e.target.checked }
                }))}
              />
              <span className="font-medium text-slate-700">Crise convulsive</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-lg hover:border-slate-400 transition cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-slate-600"
                checked={formData.risquesALR.brecheDuremere}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  risquesALR: { ...prev.risquesALR, brecheDuremere: e.target.checked }
                }))}
              />
              <span className="font-medium text-slate-700">Échec, brèche dure-mère/céphalées</span>
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-semibold text-slate-600 mb-3">Risques liés au patient :</h4>
              <textarea
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                rows={3}
                placeholder="Risques spécifiques liés à l'état du patient"
                value={formData.risquesPatient}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  risquesPatient: e.target.value
                }))}
              />
            </div>
            <div>
              <h4 className="text-md font-semibold text-slate-600 mb-3">Risques liés à l'état de la dentition du patient :</h4>
              <textarea
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                rows={3}
                placeholder="Risques dentaires"
                value={formData.risquesDentition}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  risquesDentition: e.target.value
                }))}
              />
            </div>
          </div>
        </div>

        {/* Période postopératoire */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-700 mb-4 pl-3 border-l-4 border-slate-500">PÉRIODE POSTOPÉRATOIRE</h3>
          <p className="text-slate-600 mb-3">Complications éventuelles, lieu de transfert postopératoire :</p>
          <textarea
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 mb-4"
            rows={3}
            placeholder="Complications possibles et prise en charge"
            value={formData.complicationsPostop}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              complicationsPostop: e.target.value
            }))}
          />
          
          <p className="text-slate-600 mb-3">Lieu de transfert :</p>
          <textarea
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            rows={3}
            placeholder="SSPI, réanimation, service..."
            value={formData.lieuTransfert}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              lieuTransfert: e.target.value
            }))}
          />
        </div>

        {/* Validation du consentement */}
        <div className="p-6 bg-green-50 border-2 border-green-200">
          <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Validation du consentement éclairé
          </h3>
          <label className="flex items-start gap-3 p-4 bg-white border-2 border-green-300 rounded-lg">
            <input
              type="checkbox"
              className="w-5 h-5 text-green-600 mt-1"
              checked={formData.consentementEclaire}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                consentementEclaire: e.target.checked
              }))}
            />
            <span className="font-semibold text-green-800">
              Je certifie avoir expliqué au patient tous les éléments ci-dessus, 
              avoir répondu à ses questions et avoir obtenu son consentement éclairé.
            </span>
          </label>
        </div>

        {/* Signature */}
        <div className="p-6 bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Signature du patient ou de son représentant légal</h3>
          <SignaturePad
            onSignatureChange={(signature) => {
              setFormData(prev => ({
                ...prev,
                signaturePatient: signature,
                documentSigne: signature !== ''
              }));
              setHasSignature(signature !== '');
            }}
            width={500}
            height={250}
            placeholder="Signature du patient ou représentant légal"
            className="mx-auto"
          />
        </div>

        {/* Bouton de sauvegarde */}
        <div className="p-6 text-center bg-white">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md text-lg font-semibold"
          >
            Enregistrer le consentement
          </button>
        </div>
      </div>
    </div>
  );
}
