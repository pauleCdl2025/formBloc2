import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  Save, 
  Printer, 
  FileText, 
  Download, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Syringe,
  Scissors,
  Shield,
  User,
  Calendar,
  MapPin,
  Stethoscope
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  checked: boolean;
  time?: string;
}

interface InterventionData {
  patientName: string;
  patientAge?: number;
  interventionType: string;
  surgeon: string;
  operatingRoom: string;
  scheduledTime?: string;
}

interface ChecklistData {
  section1: ChecklistItem[];
  section2: ChecklistItem[];
  section3: ChecklistItem[];
}

const ChecklistChirurgicaleForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [interventionData, setInterventionData] = useState<InterventionData>({
    patientName: '',
    patientAge: undefined,
    interventionType: '',
    surgeon: '',
    operatingRoom: '',
    scheduledTime: ''
  });
  const [checklistData, setChecklistData] = useState<ChecklistData>({
    section1: [],
    section2: [],
    section3: []
  });
  const [showInterventionForm, setShowInterventionForm] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string>('');

  // Données des sections de checklist
  const sections = [
    {
      id: 'section1',
      title: 'Partie I : Avant l\'induction de l\'anesthésie',
      icon: <Syringe className="w-6 h-6" />,
      items: [
        'Confirmer l\'autonomie énergétique et en oxygène',
        'Vérifier l\'identité du patient (verbal et dossier médical)',
        'Vérifier le type et le site de l\'intervention',
        'Vérifier le bon fonctionnement des équipements',
        'Vérifier les consentements anesthésiques et chirurgicaux',
        'Évaluer le risque d\'intubation difficile',
        'Vérifier la disponibilité de l\'oxygène de réserve',
        'Vérifier l\'oxymètre de pouls',
        'Évaluer les risques de pertes sanguines',
        'Confirmer les allergies connues'
      ]
    },
    {
      id: 'section2',
      title: 'Partie II : Avant l\'incision de la peau',
      icon: <Scissors className="w-6 h-6" />,
      items: [
        'Présentation de toute l\'équipe du bloc',
        'Confirmer à nouveau l\'identité du patient',
        'Risque de pertes sanguines évalué',
        'Dose d\'antibioprophylaxie administrée (<60min)',
        'Tout le matériel chirurgical est en place et fonctionnel',
        'Vérifier que tout est stérile',
        'Patient installé en position adéquate',
        'Documents d\'imagerie disponibles',
        'Permission de l\'anesthésiste pour inciser'
      ]
    },
    {
      id: 'section3',
      title: 'Partie III : Avant la fermeture de la peau',
      icon: <Shield className="w-6 h-6" />,
      items: [
        'Compte final des compresses et instruments',
        'Vérifier l\'étiquetage des prélèvements',
        'Signaler tout matériel défectueux'
      ]
    }
  ];

  // Initialiser les données de checklist
  useEffect(() => {
    const initialData: ChecklistData = {
      section1: sections[0].items.map((item, index) => ({
        id: `1-${index + 1}`,
        checked: false,
        time: ''
      })),
      section2: sections[1].items.map((item, index) => ({
        id: `2-${index + 1}`,
        checked: false,
        time: ''
      })),
      section3: sections[2].items.map((item, index) => ({
        id: `3-${index + 1}`,
        checked: false,
        time: ''
      }))
    };
    setChecklistData(initialData);
  }, []);

  // Vérifier que les données sont initialisées avant de rendre
  if (!checklistData.section1 || !checklistData.section2 || !checklistData.section3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-4 text-lg text-gray-600">Chargement de la checklist...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleCheckboxChange = (sectionId: string, itemId: string, checked: boolean) => {
    setChecklistData(prev => ({
      ...prev,
      [sectionId]: prev[sectionId].map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              checked, 
              time: checked ? new Date().toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : ''
            }
          : item
      )
    }));
  };

  const calculateProgress = (sectionId: string) => {
    const section = checklistData[sectionId as keyof ChecklistData];
    if (!section || section.length === 0) {
      return 0;
    }
    const checked = section.filter(item => item.checked).length;
    const progress = (checked / section.length) * 100;
    return isNaN(progress) ? 0 : progress;
  };

  const calculateOverallProgress = () => {
    if (!checklistData.section1 || !checklistData.section2 || !checklistData.section3) {
      return 0;
    }
    const allItems = [...checklistData.section1, ...checklistData.section2, ...checklistData.section3];
    const checked = allItems.filter(item => item.checked).length;
    const progress = (checked / allItems.length) * 100;
    return isNaN(progress) ? 0 : progress;
  };

  const handleSave = async () => {
    try {
      const dataToSave = {
        intervention: interventionData,
        checklist: checklistData,
        progress: calculateOverallProgress(),
        completedAt: new Date().toISOString()
      };

      const { error } = await supabase
        .from('checklist_chirurgicale')
        .insert([{
          patient_name: interventionData.patientName,
          intervention_type: interventionData.interventionType,
          surgeon: interventionData.surgeon,
          operating_room: interventionData.operatingRoom,
          data: dataToSave,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        if (error.code === 'PGRST116') {
          // Table n'existe pas
          setSavedMessage('⚠️ Table checklist_chirurgicale non créée. Veuillez exécuter le script SQL sur Supabase.');
        } else {
          throw error;
        }
      } else {
        setSavedMessage('Checklist sauvegardée avec succès !');
      }
      
      setTimeout(() => setSavedMessage(''), 5000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSavedMessage('Erreur lors de la sauvegarde');
      setTimeout(() => setSavedMessage(''), 3000);
    }
  };

  const handlePrint = () => {
    const printContent = generatePrintContent();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const generatePrintContent = () => {
    const overallProgress = calculateOverallProgress();
    const isComplete = overallProgress === 100;

    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Checklist Chirurgicale - Centre Diagnostic de Libreville</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
          .subtitle { color: #666; font-size: 14px; }
          .intervention-info { background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .section { margin-bottom: 25px; page-break-inside: avoid; }
          .section-title { font-size: 18px; font-weight: bold; color: #1e40af; margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
          .checklist-item { margin-bottom: 8px; display: flex; align-items: center; }
          .checkbox { width: 20px; height: 20px; border: 2px solid #2563eb; margin-right: 10px; display: flex; align-items: center; justify-content: center; }
          .checkbox.checked { background: #10b981; color: white; }
          .item-text { flex: 1; }
          .item-time { font-size: 12px; color: #666; margin-left: 10px; }
          .progress-summary { background: #e0f2fe; padding: 15px; border-radius: 8px; margin-top: 20px; }
          .status { font-size: 18px; font-weight: bold; text-align: center; margin-top: 20px; }
          .status.complete { color: #10b981; }
          .status.incomplete { color: #f59e0b; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🏥 CENTRE DIAGNOSTIC DE LIBREVILLE</div>
          <div class="subtitle">Centre Médical Spécialisé</div>
          <h1>CHECKLIST CHIRURGICALE</h1>
        </div>

        <div class="intervention-info">
          <h3>Informations de l'Intervention</h3>
          <p><strong>Patient:</strong> ${interventionData.patientName || 'Non spécifié'}</p>
          <p><strong>Âge:</strong> ${interventionData.patientAge || 'Non spécifié'}</p>
          <p><strong>Type d'intervention:</strong> ${interventionData.interventionType || 'Non spécifié'}</p>
          <p><strong>Chirurgien:</strong> ${interventionData.surgeon || 'Non spécifié'}</p>
          <p><strong>Salle:</strong> ${interventionData.operatingRoom || 'Non spécifié'}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        ${sections.map((section, sectionIndex) => {
          const sectionData = checklistData[`section${sectionIndex + 1}` as keyof ChecklistData];
          const progress = calculateProgress(`section${sectionIndex + 1}`);
          
          return `
            <div class="section">
              <div class="section-title">${section.title} (${Math.round(progress)}% complété)</div>
              ${section.items.map((item, itemIndex) => {
                const itemData = sectionData[itemIndex];
                return `
                  <div class="checklist-item">
                    <div class="checkbox ${itemData.checked ? 'checked' : ''}">${itemData.checked ? '✓' : ''}</div>
                    <div class="item-text">${item}</div>
                    <div class="item-time">${itemData.time || ''}</div>
                  </div>
                `;
              }).join('')}
            </div>
          `;
        }).join('')}

        <div class="progress-summary">
          <h3>Résumé de la Progression</h3>
          <p><strong>Progression globale:</strong> ${Math.round(overallProgress)}%</p>
          <p><strong>Éléments complétés:</strong> ${[...checklistData.section1, ...checklistData.section2, ...checklistData.section3].filter(item => item.checked).length} / ${[...checklistData.section1, ...checklistData.section2, ...checklistData.section3].length}</p>
        </div>

        <div class="status ${isComplete ? 'complete' : 'incomplete'}">
          ${isComplete ? '✅ CHECKLIST COMPLÉTÉE' : '⚠️ CHECKLIST EN COURS'}
        </div>
      </body>
      </html>
    `;
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const previousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const resetChecklist = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser la checklist ?')) {
      const resetData: ChecklistData = {
        section1: sections[0].items.map((item, index) => ({
          id: `1-${index + 1}`,
          checked: false,
          time: ''
        })),
        section2: sections[1].items.map((item, index) => ({
          id: `2-${index + 1}`,
          checked: false,
          time: ''
        })),
        section3: sections[2].items.map((item, index) => ({
          id: `3-${index + 1}`,
          checked: false,
          time: ''
        }))
      };
      setChecklistData(resetData);
      setCurrentSection(0);
    }
  };

  const createIntervention = () => {
    if (!interventionData.patientName || !interventionData.interventionType || !interventionData.surgeon || !interventionData.operatingRoom) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setShowInterventionForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Checklist Chirurgicale</h1>
                <p className="text-gray-600">Centre Diagnostic de Libreville</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowInterventionForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <User className="w-4 h-4 mr-2" />
                Nouvelle Intervention
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
              </button>
            </div>
          </div>
        </div>

        {/* Formulaire d'intervention */}
        {showInterventionForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-6 h-6 mr-2 text-blue-600" />
              Nouvelle Intervention
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Patient *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={interventionData.patientName}
                  onChange={(e) => setInterventionData({...interventionData, patientName: e.target.value})}
                  placeholder="Entrez le nom complet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Âge</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={interventionData.patientAge || ''}
                  onChange={(e) => setInterventionData({...interventionData, patientAge: parseInt(e.target.value) || undefined})}
                  placeholder="Âge du patient"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type d'Intervention *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={interventionData.interventionType}
                  onChange={(e) => setInterventionData({...interventionData, interventionType: e.target.value})}
                >
                  <option value="">Sélectionnez...</option>
                  <option value="Appendicectomie">Appendicectomie</option>
                  <option value="Cholécystectomie">Cholécystectomie</option>
                  <option value="Hernie inguinale">Hernie inguinale</option>
                  <option value="Césarienne">Césarienne</option>
                  <option value="Arthroscopie">Arthroscopie</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chirurgien Principal *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={interventionData.surgeon}
                  onChange={(e) => setInterventionData({...interventionData, surgeon: e.target.value})}
                  placeholder="Dr. ..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salle d'Opération *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={interventionData.operatingRoom}
                  onChange={(e) => setInterventionData({...interventionData, operatingRoom: e.target.value})}
                >
                  <option value="">Sélectionnez...</option>
                  <option value="Bloc A">Bloc A</option>
                  <option value="Bloc B">Bloc B</option>
                  <option value="Bloc C">Bloc C</option>
                  <option value="Urgences">Urgences</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure Prévue</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={interventionData.scheduledTime}
                  onChange={(e) => setInterventionData({...interventionData, scheduledTime: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowInterventionForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Annuler
              </button>
              <button
                onClick={createIntervention}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Créer l'Intervention
              </button>
            </div>
          </div>
        )}

        {/* Progression globale */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 relative">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (calculateOverallProgress() / 100) * 251.2}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {Math.round(calculateOverallProgress())}%
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Progression Globale</h3>
              <p className="text-gray-600 mb-4">
                {interventionData.patientName ? (
                  <>
                    <strong>Patient:</strong> {interventionData.patientName} ({interventionData.patientAge} ans)<br />
                    <strong>Intervention:</strong> {interventionData.interventionType} - {interventionData.surgeon}<br />
                    <strong>Bloc:</strong> {interventionData.operatingRoom}
                  </>
                ) : (
                  'Aucune intervention sélectionnée'
                )}
              </p>
              <div className="flex gap-2">
                {sections.map((_, index) => (
                  <div key={index} className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${calculateProgress(`section${index + 1}`)}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Onglets de navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6 border border-blue-100">
          <div className="flex border-b border-gray-200">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setCurrentSection(index)}
                className={`flex-1 px-6 py-4 text-left transition-colors ${
                  currentSection === index
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {section.icon}
                  <div>
                    <div className="font-medium">{section.title.split(':')[0]}</div>
                    <div className="text-sm text-gray-500">
                      {checklistData[`section${index + 1}` as keyof ChecklistData].filter(item => item.checked).length} / {sections[index].items.length}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Contenu de la section active */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              {sections[currentSection].icon}
              <h2 className="text-xl font-semibold text-gray-900">{sections[currentSection].title}</h2>
            </div>

            <div className="space-y-4">
              {sections[currentSection].items.map((item, index) => {
                const itemData = checklistData[`section${currentSection + 1}` as keyof ChecklistData]?.[index];
                if (!itemData) return null;
                
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      itemData.checked
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-white border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleCheckboxChange(`section${currentSection + 1}`, itemData.id, !itemData.checked)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                          itemData.checked
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {itemData.checked && <CheckCircle className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <span className={`font-medium ${itemData.checked ? 'text-emerald-800' : 'text-gray-900'}`}>
                          {item}
                        </span>
                      </div>
                      {itemData.time && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {itemData.time}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <button
                onClick={previousSection}
                disabled={currentSection === 0}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Précédent
              </button>
              <button
                onClick={nextSection}
                disabled={currentSection === sections.length - 1}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={resetChecklist}
                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Réinitialiser
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>

        {/* Message de sauvegarde */}
        {savedMessage && (
          <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            savedMessage.includes('succès') ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {savedMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChecklistChirurgicaleForm;
