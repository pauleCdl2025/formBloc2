import React from 'react';
import { ArrowLeft, User, Calendar, FileText, Stethoscope, Edit, Heart, Activity, AlertTriangle, ClipboardList, Microscope, Shield, Clock, MapPin, Printer, Cigarette, Droplets, Zap, Brain, Pill, Thermometer, Scale, Eye } from 'lucide-react';

interface PatientConsultationProps {
  patientData: any;
  onBackToList: () => void;
  onEdit: () => void;
  onPrint?: () => void;
}

export default function PatientConsultation({ patientData, onBackToList, onEdit, onPrint }: PatientConsultationProps) {
  if (!patientData || !patientData.data) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-500 text-center">Aucune donnée patient disponible</p>
            <button
              onClick={onBackToList}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { data } = patientData;
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-500 text-center">Données du formulaire non disponibles</p>
            <button
              onClick={onBackToList}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { patient, intervention, anamnese, allergies, examenPhysique, examensParacliniques, pyrosis, rgo, tabac, tabagismePassif, hepatite, alcool, activitesPhysiques, cardiaques, stimulateur, hta, diabete, reins, hemostase, stopBang, hasAntecedentsChirurgicaux, antecedentsChirurgicaux, parametresPhysiques, avisSpecialises, checklistHDJ, douleursPostop, scoreApfel, scoreLee, autres, signature } = data;

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === '') return 'Non renseigné';
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
    if (typeof value === 'object' && value !== null) {
      if (value.presente !== undefined) return value.presente ? 'Oui' : 'Non';
      if (value.details) return value.details;
    }
    return String(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-3 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header amélioré */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 mb-6 border border-blue-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <button
              onClick={onBackToList}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition mb-4 md:mb-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la liste
            </button>
            <button
              onClick={onEdit}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
            >
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </button>
            {onPrint && (
              <button
                onClick={onPrint}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition shadow-md"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
              </button>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-4 rounded-xl mr-4 mb-4 md:mb-0">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {patient?.nom} {patient?.prenom}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                  <FileText className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-blue-800 font-medium">#{patientData.patient_number}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Né le {formatValue(patient?.dateNaissance)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{patient?.age || 'N/A'} ans</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200">
              <div className="flex items-center mb-2">
                <Heart className="w-5 h-5 text-emerald-600 mr-2" />
                <span className="text-sm font-medium text-emerald-800">Sexe</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{formatValue(patient?.sexe)}</span>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <Activity className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Type</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{formatValue(patient?.type)}</span>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center mb-2">
                <MapPin className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-800">Identification</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{formatValue(patient?.numeroIdentification)}</span>
            </div>
          </div>
        </div>

        {/* Informations de l'intervention */}
        {intervention && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-2 rounded-lg mr-3">
                <Stethoscope className="w-6 h-6 text-blue-600" />
              </div>
              Intervention prévue
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <Activity className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">Type de chirurgie</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{formatValue(intervention.typeChirurgie)}</span>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 text-emerald-600 mr-2" />
                  <span className="text-sm font-medium text-emerald-800">Chirurgie longue durée</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{formatValue(intervention.chirurgieLongueDuree)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Anamnèse */}
        {anamnese && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-2 rounded-lg mr-3">
                <ClipboardList className="w-6 h-6 text-emerald-600" />
              </div>
              Anamnèse
            </h2>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg border border-emerald-200">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{formatValue(anamnese)}</p>
            </div>
          </div>
        )}

        {/* Allergies */}
        {allergies && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="bg-gradient-to-br from-red-100 to-orange-100 p-2 rounded-lg mr-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              Allergies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-800">Antibiotiques</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    formatValue(allergies.antibiotiques) === 'Oui' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {formatValue(allergies.antibiotiques)}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-800">Aspirine/AINS</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    formatValue(allergies.aspirineAINS) === 'Oui' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {formatValue(allergies.aspirineAINS)}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-800">Autres médicaments</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    formatValue(allergies.autresMedicaments) === 'Oui' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {formatValue(allergies.autresMedicaments)}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-800">Produits de contraste</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    formatValue(allergies.produitsContraste) === 'Oui' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {formatValue(allergies.produitsContraste)}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-800">Alimentaires</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    formatValue(allergies.alimentaires) === 'Oui' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {formatValue(allergies.alimentaires)}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-800">Latex</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    formatValue(allergies.latex) === 'Oui' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {formatValue(allergies.latex)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Examen physique */}
        {examenPhysique && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-2 rounded-lg mr-3">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              Examen physique
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center mb-2">
                  <Activity className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-800">Poids</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{formatValue(examenPhysique.poids)} kg</span>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center mb-2">
                  <Activity className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-800">Taille</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{formatValue(examenPhysique.taille)} cm</span>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center mb-2">
                  <Activity className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-800">IMC</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{formatValue(examenPhysique.imc)}</span>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center mb-2">
                  <Heart className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-800">FC</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{formatValue(examenPhysique.fc)} bpm</span>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center mb-2">
                  <Activity className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-800">PA</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{formatValue(examenPhysique.pa)} mmHg</span>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center mb-2">
                  <Activity className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-800">SpO2</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{formatValue(examenPhysique.spo2)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Examens para-cliniques */}
        {examensParacliniques && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="bg-gradient-to-br from-indigo-100 to-blue-100 p-2 rounded-lg mr-3">
                <Microscope className="w-6 h-6 text-indigo-600" />
              </div>
              Examens para-cliniques
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-800">Biologie</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    formatValue(examensParacliniques.biologie) === 'Oui' 
                      ? 'bg-indigo-100 text-indigo-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {formatValue(examensParacliniques.biologie)}
                  </span>
                </div>
                {examensParacliniques.biologie === 'Oui' && examensParacliniques.biologieCommentaire && (
                  <div className="mt-2 p-3 bg-white rounded border border-indigo-200">
                    <p className="text-sm text-gray-600 italic">{examensParacliniques.biologieCommentaire}</p>
                  </div>
                )}
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-800">Hémostase</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    formatValue(examensParacliniques.hemostase) === 'Oui' 
                      ? 'bg-indigo-100 text-indigo-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {formatValue(examensParacliniques.hemostase)}
                  </span>
                </div>
                {examensParacliniques.hemostase === 'Oui' && examensParacliniques.hemostaseCommentaire && (
                  <div className="mt-2 p-3 bg-white rounded border border-indigo-200">
                    <p className="text-sm text-gray-600 italic">{examensParacliniques.hemostaseCommentaire}</p>
                  </div>
                )}
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-800">Groupe sanguin</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    formatValue(examensParacliniques.groupeSanguin) === 'Oui' 
                      ? 'bg-indigo-100 text-indigo-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {formatValue(examensParacliniques.groupeSanguin)}
                  </span>
                </div>
                {examensParacliniques.groupeSanguin === 'Oui' && examensParacliniques.groupeSanguinCommentaire && (
                  <div className="mt-2 p-3 bg-white rounded border border-indigo-200">
                    <p className="text-sm text-gray-600 italic">{examensParacliniques.groupeSanguinCommentaire}</p>
                  </div>
                )}
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-800">ECG repos</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    formatValue(examensParacliniques.ecgRepos) === 'Oui' 
                      ? 'bg-indigo-100 text-indigo-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {formatValue(examensParacliniques.ecgRepos)}
                  </span>
                </div>
                {examensParacliniques.ecgRepos === 'Oui' && examensParacliniques.ecgReposCommentaire && (
                  <div className="mt-2 p-3 bg-white rounded border border-indigo-200">
                    <p className="text-sm text-gray-600 italic">{examensParacliniques.ecgReposCommentaire}</p>
                  </div>
                )}
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-800">RX thorax</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    formatValue(examensParacliniques.rxThorax) === 'Oui' 
                      ? 'bg-indigo-100 text-indigo-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {formatValue(examensParacliniques.rxThorax)}
                  </span>
                </div>
                {examensParacliniques.rxThorax === 'Oui' && examensParacliniques.rxThoraxCommentaire && (
                  <div className="mt-2 p-3 bg-white rounded border border-indigo-200">
                    <p className="text-sm text-gray-600 italic">{examensParacliniques.rxThoraxCommentaire}</p>
                  </div>
                )}
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-800">EFR</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    formatValue(examensParacliniques.efr) === 'Oui' 
                      ? 'bg-indigo-100 text-indigo-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {formatValue(examensParacliniques.efr)}
                  </span>
                </div>
                {examensParacliniques.efr === 'Oui' && examensParacliniques.efrCommentaire && (
                  <div className="mt-2 p-3 bg-white rounded border border-indigo-200">
                    <p className="text-sm text-gray-600 italic">{examensParacliniques.efrCommentaire}</p>
                  </div>
                )}
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-800">Test effort</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    formatValue(examensParacliniques.testEffort) === 'Oui' 
                      ? 'bg-indigo-100 text-indigo-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {formatValue(examensParacliniques.testEffort)}
                  </span>
                </div>
                {examensParacliniques.testEffort === 'Oui' && examensParacliniques.testEffortCommentaire && (
                  <div className="mt-2 p-3 bg-white rounded border border-indigo-200">
                    <p className="text-sm text-gray-600 italic">{examensParacliniques.testEffortCommentaire}</p>
                  </div>
                )}
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-800">Autres</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    formatValue(examensParacliniques.autres) === 'Oui' 
                      ? 'bg-indigo-100 text-indigo-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {formatValue(examensParacliniques.autres)}
                  </span>
                </div>
                {examensParacliniques.autres === 'Oui' && examensParacliniques.autresCommentaire && (
                  <div className="mt-2 p-3 bg-white rounded border border-indigo-200">
                    <p className="text-sm text-gray-600 italic">{examensParacliniques.autresCommentaire}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Commentaires généraux */}
        {examensParacliniques?.commentaires && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="bg-gradient-to-br from-teal-100 to-emerald-100 p-2 rounded-lg mr-3">
                <FileText className="w-6 h-6 text-teal-600" />
              </div>
              Commentaires généraux
            </h2>
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-6 rounded-lg border border-teal-200">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{examensParacliniques.commentaires}</p>
            </div>
          </div>
        )}

        {/* Antécédents chirurgicaux */}
        {hasAntecedentsChirurgicaux && antecedentsChirurgicaux && antecedentsChirurgicaux.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="bg-gradient-to-br from-orange-100 to-red-100 p-2 rounded-lg mr-3">
                <Stethoscope className="w-6 h-6 text-orange-600" />
              </div>
              Antécédents chirurgicaux
            </h2>
            <div className="space-y-4">
              {antecedentsChirurgicaux.map((antecedent: any, index: number) => (
                <div key={index} className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-orange-800">Année:</span>
                      <span className="ml-2 font-semibold text-gray-900">{formatValue(antecedent.annee)}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-orange-800">Intervention:</span>
                      <span className="ml-2 font-semibold text-gray-900">{formatValue(antecedent.intervention)}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-orange-800">Type d'anesthésie:</span>
                      <span className="ml-2 font-semibold text-gray-900">{formatValue(antecedent.typeAnesthesie)}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-orange-800">Difficultés:</span>
                      <span className="ml-2 font-semibold text-gray-900">{formatValue(antecedent.difficultes)}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-orange-800">Cormack:</span>
                      <span className="ml-2 font-semibold text-gray-900">{formatValue(antecedent.cormack)}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-orange-800">Technique:</span>
                      <span className="ml-2 font-semibold text-gray-900">{formatValue(antecedent.technique)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Antécédents médicaux */}
        {(pyrosis || rgo || tabac || hepatite || alcool || hta || diabete || reins) && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-2 rounded-lg mr-3">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              Antécédents médicaux
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pyrosis */}
              {pyrosis && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-800">Pyrosis</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      pyrosis.presente ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {pyrosis.presente ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  {pyrosis.presente && pyrosis.details && (
                    <p className="text-sm text-gray-600 italic">{pyrosis.details}</p>
                  )}
                </div>
              )}

              {/* RGO */}
              {rgo && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-800">RGO</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      rgo.presente ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {rgo.presente ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  {rgo.presente && rgo.details && (
                    <p className="text-sm text-gray-600 italic">{rgo.details}</p>
                  )}
                </div>
              )}

              {/* Tabac */}
              {tabac && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-800">Tabac</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      tabac.presente ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {tabac.presente ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  {tabac.presente && tabac.paquetsAnnees && (
                    <p className="text-sm text-gray-600 italic">{tabac.paquetsAnnees}</p>
                  )}
                </div>
              )}

              {/* Hépatite */}
              {hepatite && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-800">Hépatite</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      hepatite.presente ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {hepatite.presente ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  {hepatite.presente && (
                    <div className="mt-2 space-y-1">
                      {hepatite.type && <p className="text-sm text-gray-600">Type: {hepatite.type}</p>}
                      {hepatite.dateDecouverte && <p className="text-sm text-gray-600">Date: {hepatite.dateDecouverte}</p>}
                      {hepatite.statut && <p className="text-sm text-gray-600">Statut: {hepatite.statut}</p>}
                    </div>
                  )}
                </div>
              )}

              {/* Alcool */}
              {alcool && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-800">Alcool</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      alcool.presente ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {alcool.presente ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  {alcool.presente && alcool.details && (
                    <p className="text-sm text-gray-600 italic">{alcool.details}</p>
                  )}
                </div>
              )}

              {/* HTA */}
              {hta && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-800">HTA</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      hta.presente ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {hta.presente ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  {hta.presente && hta.details && (
                    <p className="text-sm text-gray-600 italic">{hta.details}</p>
                  )}
                </div>
              )}

              {/* Diabète */}
              {diabete && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-800">Diabète</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      diabete.presente ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {diabete.presente ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  {diabete.presente && diabete.details && (
                    <p className="text-sm text-gray-600 italic">{diabete.details}</p>
                  )}
                </div>
              )}

              {/* Reins */}
              {reins && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-800">Reins</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      reins.presente ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {reins.presente ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  {reins.presente && reins.details && (
                    <p className="text-sm text-gray-600 italic">{reins.details}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Score STOP-BANG */}
        {stopBang && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-2 rounded-lg mr-3">
                <Brain className="w-6 h-6 text-yellow-600" />
              </div>
              Score STOP-BANG
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-yellow-800">Ronflement</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    stopBang.ronflement ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {stopBang.ronflement ? 'Oui' : 'Non'}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-yellow-800">Fatigue</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    stopBang.fatigue ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {stopBang.fatigue ? 'Oui' : 'Non'}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-yellow-800">Apnée</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    stopBang.apnee ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {stopBang.apnee ? 'Oui' : 'Non'}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-yellow-800">Pression artérielle</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    stopBang.pressionArterielle ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {stopBang.pressionArterielle ? 'Oui' : 'Non'}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-yellow-800">IMC</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    stopBang.imc ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {stopBang.imc ? 'Oui' : 'Non'}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-yellow-800">Âge</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    stopBang.age ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {stopBang.age ? 'Oui' : 'Non'}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-yellow-800">Tour de cou</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    stopBang.tourCou ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {stopBang.tourCou ? 'Oui' : 'Non'}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-yellow-800">Sexe</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    stopBang.sexe ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {stopBang.sexe ? 'Oui' : 'Non'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Paramètres physiques */}
        {parametresPhysiques && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-2 rounded-lg mr-3">
                <Scale className="w-6 h-6 text-indigo-600" />
              </div>
              Paramètres physiques détaillés
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center mb-2">
                  <Scale className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="text-sm font-medium text-indigo-800">Poids</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{formatValue(parametresPhysiques.poids)} kg</span>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center mb-2">
                  <Activity className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="text-sm font-medium text-indigo-800">Taille</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{formatValue(parametresPhysiques.taille)} cm</span>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center mb-2">
                  <Activity className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="text-sm font-medium text-indigo-800">BMI</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{formatValue(parametresPhysiques.bmi)}</span>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center mb-2">
                  <Heart className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="text-sm font-medium text-indigo-800">TA Systolique</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{formatValue(parametresPhysiques.taSystolique)} mmHg</span>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center mb-2">
                  <Heart className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="text-sm font-medium text-indigo-800">TA Diastolique</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{formatValue(parametresPhysiques.taDiastolique)} mmHg</span>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center mb-2">
                  <Heart className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="text-sm font-medium text-indigo-800">Pouls</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{formatValue(parametresPhysiques.pouls)} bpm</span>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center mb-2">
                  <Activity className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="text-sm font-medium text-indigo-800">Fréquence respiratoire</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{formatValue(parametresPhysiques.frequenceRespiratoire)} /min</span>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center mb-2">
                  <Activity className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="text-sm font-medium text-indigo-800">Perte de poids récente</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{formatValue(parametresPhysiques.pertePoidsRecente)}</span>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center mb-2">
                  <Activity className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="text-sm font-medium text-indigo-800">Perte d'appétit</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{formatValue(parametresPhysiques.perteAppetit)}</span>
              </div>
            </div>
            {parametresPhysiques.commentaires && (
              <div className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                <p className="text-sm text-gray-600 italic">{parametresPhysiques.commentaires}</p>
              </div>
            )}
          </div>
        )}

        {/* Autres informations */}
        {autres && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="bg-gradient-to-br from-gray-100 to-blue-100 p-2 rounded-lg mr-3">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
              Autres informations
            </h2>
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border border-gray-200">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{autres}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
