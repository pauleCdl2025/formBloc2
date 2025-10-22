import React from 'react';
import { ArrowLeft, User, Calendar, FileText, Stethoscope, Edit, Heart, Activity, AlertTriangle, ClipboardList, Microscope, Shield, Clock, MapPin } from 'lucide-react';

interface PatientConsultationProps {
  patientData: any;
  onBackToList: () => void;
  onEdit: () => void;
}

export default function PatientConsultation({ patientData, onBackToList, onEdit }: PatientConsultationProps) {
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

  const { patient, intervention, anamnese, allergies, examenPhysique, examensParacliniques } = data;

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
      </div>
    </div>
  );
}
