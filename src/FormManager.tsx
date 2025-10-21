import React, { useState } from 'react';
import { Stethoscope, Heart, Shield, FileCheck, FileText, Users, ClipboardList, Eye } from 'lucide-react';
import PreAnesthesiaForm from './forms/PreAnesthesiaForm';
import SurveillanceSSPIForm from './forms/SurveillanceSSPIForm';
import CompteRenduPreAnesthesiqueForm from './forms/CompteRenduPreAnesthesiqueForm';
import ConsentementAnesthesiqueForm from './forms/ConsentementAnesthesiqueForm';
import PatientList from './forms/PatientList';
import FormConsultation from './forms/FormConsultation';
import SSPIConsultation from './forms/SSPIConsultation';
import CompteRenduConsultation from './forms/CompteRenduConsultation';
import ConsentementConsultation from './forms/ConsentementConsultation';

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
    color: 'bg-blue-500'
  },
  {
    id: 'sspi',
    name: 'Surveillance SSPI',
    description: 'Formulaire de surveillance en Salle de Soins Post Interventionnelle',
    icon: <Heart className="w-8 h-8" />,
    component: SurveillanceSSPIForm,
    color: 'bg-purple-500'
  },
  {
    id: 'compte-rendu',
    name: 'Compte-rendu Pré-anesthésique',
    description: 'Formulaire de compte-rendu de consultation pré-anesthésique',
    icon: <FileCheck className="w-8 h-8" />,
    component: CompteRenduPreAnesthesiqueForm,
    color: 'bg-blue-600'
  },
  {
    id: 'consentement',
    name: 'Consentement Anesthésique',
    description: 'Formulaire de consentement éclairé pour l\'anesthésie',
    icon: <Shield className="w-8 h-8" />,
    component: ConsentementAnesthesiqueForm,
    color: 'bg-slate-500'
  }
];

export default function FormManager() {
  const [selectedForm, setSelectedForm] = useState<string>('preanesthesia');
  const [currentView, setCurrentView] = useState<'list' | 'form' | 'consultation' | 'sspi-consultation' | 'compte-rendu-consultation' | 'consentement-consultation'>('list');

  const handleFormSelect = (formId: string) => {
    setSelectedForm(formId);
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setCurrentView('list');
  };

  const handleCreateNew = () => {
    setCurrentView('form');
  };

  const handleSelectPatient = (patientNumber: string) => {
    setCurrentView('form');
  };

  const handleConsultationView = () => {
    setCurrentView('consultation');
  };

  const handleSSPIConsultation = () => {
    setCurrentView('sspi-consultation');
  };

  const handleCompteRenduConsultation = () => {
    setCurrentView('compte-rendu-consultation');
  };

  const handleConsentementConsultation = () => {
    setCurrentView('consentement-consultation');
  };

  const selectedFormConfig = availableForms.find(form => form.id === selectedForm);
  const FormComponent = selectedFormConfig?.component;

  if (currentView === 'form' && FormComponent) {
    return (
      <FormComponent 
        onBackToList={handleBackToList}
        onCreateNew={handleCreateNew}
        onSelectPatient={handleSelectPatient}
      />
    );
  }

  if (currentView === 'consultation') {
    return (
      <FormConsultation 
        onBackToList={handleBackToList}
      />
    );
  }

  if (currentView === 'sspi-consultation') {
    return (
      <SSPIConsultation 
        onBackToList={handleBackToList}
        onCreateNew={() => {
          setSelectedForm('sspi');
          setCurrentView('form');
        }}
        onSelectPatient={(patientNumber) => {
          setSelectedForm('sspi');
          setCurrentView('form');
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
            <div className="flex gap-3">
              <button
                onClick={handleConsultationView}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                <Eye className="w-4 h-4 mr-2" />
                Consultation des Formulaires
              </button>
            </div>
          </div>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableForms.map((form) => (
            <div
              key={form.id}
              onClick={() => handleFormSelect(form.id)}
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
                    onClick={() => {
                      if (form.id === 'sspi') handleSSPIConsultation();
                      else if (form.id === 'compte-rendu') handleCompteRenduConsultation();
                      else if (form.id === 'consentement') handleConsentementConsultation();
                      else handleFormSelect(form.id);
                    }}
                    className="flex items-center text-[#0ea5e9] hover:text-[#0284c7] transition"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Consulter</span>
                  </button>
                  <button
                    onClick={() => handleFormSelect(form.id)}
                    className="flex items-center text-[#0ea5e9] hover:text-[#0284c7] transition"
                  >
                    <span className="text-sm font-medium mr-1">Nouveau</span>
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
