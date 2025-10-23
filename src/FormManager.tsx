import React, { useState } from 'react';
import { Stethoscope, Heart, Shield, FileCheck, FileText, Users, ClipboardList, Eye, CheckSquare } from 'lucide-react';
import PreAnesthesiaForm from './forms/PreAnesthesiaForm';
import CompteRenduPreAnesthesiqueForm from './forms/CompteRenduPreAnesthesiqueForm';
import ConsentementAnesthesiqueForm from './forms/ConsentementAnesthesiqueForm';
import ChecklistChirurgicaleForm from './forms/ChecklistChirurgicaleForm';
import PatientList from './forms/PatientList';
import CompteRenduConsultation from './forms/CompteRenduConsultation';
import ConsentementConsultation from './forms/ConsentementConsultation';
import PatientConsultation from './forms/PatientConsultation';
import ChecklistList from './forms/ChecklistList';
import ChecklistConsultation from './forms/ChecklistConsultation';

interface FormConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
  color: string;
}

const availableForms: FormConfig[] = [
  {
    id: 'preanesthesia',
    name: 'Consultation Pré-Anesthésique',
    description: 'Formulaire de consultation pré-anesthésique complet',
    icon: <Stethoscope className="w-8 h-8" />,
    component: PreAnesthesiaForm,
    color: 'bg-gradient-to-br from-blue-600 to-blue-700'
  },
  {
    id: 'compte-rendu',
    name: 'Compte-rendu Pré-anesthésique',
    description: 'Formulaire de compte-rendu de consultation pré-anesthésique',
    icon: <FileCheck className="w-8 h-8" />,
    component: CompteRenduPreAnesthesiqueForm,
    color: 'bg-gradient-to-br from-teal-600 to-teal-700'
  },
  {
    id: 'consentement',
    name: 'Consentement Anesthésique',
    description: 'Formulaire de consentement éclairé pour l\'anesthésie',
    icon: <Shield className="w-8 h-8" />,
    component: ConsentementAnesthesiqueForm,
    color: 'bg-gradient-to-br from-emerald-600 to-emerald-700'
  },
  {
    id: 'checklist-chirurgicale',
    name: 'Checklist Chirurgicale',
    description: 'Checklist de sécurité chirurgicale complète',
    icon: <CheckSquare className="w-8 h-8" />,
    component: ChecklistChirurgicaleForm,
    color: 'bg-gradient-to-br from-purple-600 to-purple-700'
  }
];

export default function FormManager() {
  const [selectedForm, setSelectedForm] = useState<string>('preanesthesia');
  const [currentView, setCurrentView] = useState<'main' | 'list' | 'form' | 'consultation' | 'compte-rendu-consultation' | 'consentement-consultation' | 'checklist-consultation'>('main');
  const [selectedPatientData, setSelectedPatientData] = useState<any>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  const handleFormSelect = (formId: string) => {
    setSelectedForm(formId);
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setCurrentView('main');
  };

  const handleCreateNew = () => {
    setSelectedPatientData(null);
    setEditMode(true);
    setCurrentView('form');
  };

  const handleSelectPatient = (patientData: any, mode: 'view' | 'edit') => {
    setSelectedPatientData(patientData);
    setEditMode(mode === 'edit');
    if (mode === 'view') {
      if (selectedForm === 'checklist-chirurgicale') {
        setCurrentView('checklist-consultation');
      } else {
        setCurrentView('consultation');
      }
    } else {
      setCurrentView('form');
    }
  };

  const handleSelectChecklist = (checklistData: any, mode: 'view' | 'edit') => {
    setSelectedPatientData(checklistData);
    setEditMode(mode === 'edit');
    
    // Empêcher la modification des checklists déjà sauvegardées
    if (mode === 'edit' && checklistData && checklistData.id) {
      alert('Cette checklist est verrouillée et ne peut plus être modifiée pour des raisons de traçabilité.');
      return;
    }
    
    if (mode === 'view') {
      setCurrentView('checklist-consultation');
    } else {
      setCurrentView('form');
    }
  };


  const handleCompteRenduConsultation = () => {
    setCurrentView('compte-rendu-consultation');
  };

  const handleConsentementConsultation = () => {
    setCurrentView('consentement-consultation');
  };

  const selectedFormConfig = availableForms.find(form => form.id === selectedForm);
  const FormComponent = selectedFormConfig?.component;

  if (currentView === 'list') {
    if (selectedForm === 'checklist-chirurgicale') {
      return (
        <ChecklistList 
          onBackToMain={handleBackToList}
          onSelectChecklist={handleSelectChecklist}
        />
      );
    } else {
      return (
        <PatientList 
          onCreateNew={handleCreateNew}
          onSelectPatient={handleSelectPatient}
          onBackToList={handleBackToList}
        />
      );
    }
  }

  if (currentView === 'form' && FormComponent) {
    return (
      <FormComponent 
        onBackToList={handleBackToList}
        onCreateNew={handleCreateNew}
        onSelectPatient={handleSelectPatient}
        patientData={selectedPatientData}
        editMode={editMode}
      />
    );
  }

  if (currentView === 'consultation') {
    return (
      <PatientConsultation 
        patientData={selectedPatientData}
        onBackToList={handleBackToList}
        onEdit={() => {
          setEditMode(true);
          setCurrentView('form');
        }}
        onPrint={() => {
          // La fonction d'impression est maintenant gérée directement dans PatientConsultation
          // Pas besoin d'implémenter quoi que ce soit ici
        }}
      />
    );
  }

  if (currentView === 'checklist-consultation') {
    return (
      <ChecklistConsultation 
        checklistData={selectedPatientData}
        onBackToList={handleBackToList}
        onEdit={(checklist) => {
          setSelectedPatientData(checklist);
          setEditMode(true);
          setCurrentView('form');
        }}
        onDelete={(id) => {
          // La suppression est gérée dans ChecklistConsultation
          handleBackToList();
        }}
      />
    );
  }


  if (currentView === 'compte-rendu-consultation') {
    return (
      <CompteRenduConsultation 
        onBackToList={handleBackToList}
        onCreateNew={() => {
          setSelectedForm('compte-rendu');
          setCurrentView('form');
        }}
        onSelectPatient={(patientNumber) => {
          setSelectedForm('compte-rendu');
          setCurrentView('form');
        }}
      />
    );
  }

  if (currentView === 'consentement-consultation') {
    return (
      <ConsentementConsultation 
        onBackToList={handleBackToList}
        onCreateNew={() => {
          setSelectedForm('consentement');
          setCurrentView('form');
        }}
        onSelectPatient={(patientNumber) => {
          setSelectedForm('consentement');
          setCurrentView('form');
        }}
      />
    );
  }

  if (currentView === 'main') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <img 
                  src="https://res.cloudinary.com/dd64mwkl2/image/upload/v1758286702/Centre_Diagnostic-Logo_xhxxpv.png" 
                  alt="Centre Diagnostic de Libreville" 
                  className="h-16 w-auto"
                />
                <div>
                  <h1 className="text-2xl font-bold text-[#1e3a8a]">Système de gestion des formulaires médicaux</h1>
                </div>
              </div>
            </div>
          </div>

          {/* Forms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableForms.map((form) => (
              <div
                key={form.id}
                onClick={() => {
                  if (form.id === 'preanesthesia') {
                    setSelectedForm('preanesthesia');
                    setCurrentView('form');
                  } else if (form.id === 'compte-rendu') {
                    handleCompteRenduConsultation();
                  } else if (form.id === 'consentement') {
                    handleConsentementConsultation();
                  } else {
                    handleFormSelect(form.id);
                  }
                }}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-blue-200"
              >
                <div className="flex items-center mb-4">
                  <div className={`${form.color} text-white p-3 rounded-lg mr-4`}>
                    {form.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{form.name}</h3>
                    <p className="text-sm text-gray-600">{form.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 font-semibold">
                    Disponible
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Bouton Consulter cliqué pour:', form.id);
                        if (form.id === 'preanesthesia') {
                          console.log('Aller à PatientList');
                          setCurrentView('list');
                        } else if (form.id === 'checklist-chirurgicale') {
                          console.log('Aller à ChecklistList');
                          setSelectedForm('checklist-chirurgicale');
                          setCurrentView('list');
                        } else if (form.id === 'compte-rendu') {
                          console.log('Aller à Compte-rendu Consultation');
                          handleCompteRenduConsultation();
                        } else if (form.id === 'consentement') {
                          console.log('Aller à Consentement Consultation');
                          handleConsentementConsultation();
                        } else {
                          console.log('Aller à FormSelect');
                          handleFormSelect(form.id);
                        }
                      }}
                      className="flex items-center px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition cursor-pointer font-medium"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">Consulter</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Bouton Nouveau cliqué pour:', form.id);
                        if (form.id === 'preanesthesia') {
                          console.log('Aller au formulaire PreAnesthesia');
                          setSelectedForm('preanesthesia');
                          setCurrentView('form');
                        } else if (form.id === 'checklist-chirurgicale') {
                          console.log('Aller au formulaire ChecklistChirurgicale');
                          setSelectedForm('checklist-chirurgicale');
                          setCurrentView('form');
                        } else {
                          console.log('Aller à FormSelect');
                          handleFormSelect(form.id);
                        }
                      }}
                      className="flex items-center px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition cursor-pointer font-medium"
                    >
                      <span className="text-sm font-medium mr-1">
                        {form.id === 'preanesthesia' ? 'Nouveau Formulaire' : 
                         form.id === 'checklist-chirurgicale' ? 'Nouvelle Checklist' :
                         form.id === 'compte-rendu' ? 'Nouveau Compte-rendu' :
                         form.id === 'consentement' ? 'Nouveau Consentement' : 'Nouveau'}
                      </span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border border-blue-200">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-4 shadow-md">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">Formulaires</p>
                  <p className="text-2xl font-bold text-blue-800">{availableForms.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-lg p-6 border border-emerald-200">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl mr-4 shadow-md">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-700">Patients</p>
                  <p className="text-2xl font-bold text-emerald-800">-</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-6 border border-purple-200">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mr-4 shadow-md">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700">Consultations</p>
                  <p className="text-2xl font-bold text-purple-800">-</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg p-6 border border-orange-200">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mr-4 shadow-md">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-700">Actifs</p>
                  <p className="text-2xl font-bold text-orange-800">{availableForms.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="bg-white p-3 rounded-xl shadow-md">
                <img 
                  src="https://res.cloudinary.com/dd64mwkl2/image/upload/v1758286702/Centre_Diagnostic-Logo_xhxxpv.png" 
                  alt="Centre Diagnostic de Libreville" 
                  className="h-16 w-auto"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Système de gestion des formulaires médicaux
                </h1>
                <p className="text-gray-600 mt-2 text-lg">Centre Diagnostic de Libreville</p>
              </div>
            </div>
          </div>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableForms.map((form) => (
            <div
              key={form.id}
              onClick={() => {
                if (form.id === 'preanesthesia') {
                  setSelectedForm('preanesthesia');
                  setCurrentView('form');
                } else if (form.id === 'compte-rendu') {
                  handleCompteRenduConsultation();
                } else if (form.id === 'consentement') {
                  handleConsentementConsultation();
                } else {
                  handleFormSelect(form.id);
                }
              }}
              className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <div className={`${form.color} text-white p-3 rounded-lg mr-4`}>
                  {form.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{form.name}</h3>
                  <p className="text-sm text-gray-600">{form.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 font-semibold">
                  Disponible
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Bouton Consulter cliqué pour:', form.id);
                      if (form.id === 'preanesthesia') {
                        console.log('Aller à PatientList');
                        setCurrentView('list');
                      } else if (form.id === 'compte-rendu') {
                        console.log('Aller à Compte-rendu Consultation');
                        handleCompteRenduConsultation();
                      } else if (form.id === 'consentement') {
                        console.log('Aller à Consentement Consultation');
                        handleConsentementConsultation();
                      } else {
                        console.log('Aller à FormSelect');
                        handleFormSelect(form.id);
                      }
                    }}
                    className="flex items-center px-3 py-1 text-[#0ea5e9] hover:text-[#0284c7] hover:bg-blue-50 rounded transition cursor-pointer"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Consulter</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Bouton Nouveau cliqué pour:', form.id);
                      if (form.id === 'preanesthesia') {
                        console.log('Aller au formulaire PreAnesthesia');
                        setSelectedForm('preanesthesia');
                        setCurrentView('form');
                      } else {
                        console.log('Aller à FormSelect');
                        handleFormSelect(form.id);
                      }
                    }}
                    className="flex items-center px-3 py-1 text-[#0ea5e9] hover:text-[#0284c7] hover:bg-blue-50 rounded transition cursor-pointer"
                  >
                    <span className="text-sm font-medium mr-1">
                      {form.id === 'preanesthesia' ? 'Nouveau Formulaire' : 
                       form.id === 'compte-rendu' ? 'Nouveau Compte-rendu' :
                       form.id === 'consentement' ? 'Nouveau Consentement' : 'Nouveau'}
                    </span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Formulaires</p>
                <p className="text-2xl font-bold text-gray-900">{availableForms.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Patients</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <ClipboardList className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Consultations</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <Stethoscope className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{availableForms.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
