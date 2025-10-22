import React from 'react';
import { ArrowLeft, User, Calendar, FileText, Stethoscope } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBackToList}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la liste
            </button>
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Modifier
            </button>
          </div>
          
          <div className="flex items-center mb-4">
            <User className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {patient?.nom} {patient?.prenom}
              </h1>
              <p className="text-gray-600">Patient #{patientData.patient_number}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-gray-600">Date de naissance:</span>
              <span className="ml-2 font-medium">{formatValue(patient?.dateNaissance)}</span>
            </div>
            <div className="flex items-center">
              <Stethoscope className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-gray-600">Sexe:</span>
              <span className="ml-2 font-medium">{formatValue(patient?.sexe)}</span>
            </div>
            <div className="flex items-center">
              <FileText className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-gray-600">Type:</span>
              <span className="ml-2 font-medium">{formatValue(patient?.type)}</span>
            </div>
          </div>
        </div>

        {/* Informations de l'intervention */}
        {intervention && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Stethoscope className="w-5 h-5 mr-2 text-blue-600" />
              Intervention prévue
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Type de chirurgie:</span>
                <span className="ml-2 font-medium">{formatValue(intervention.typeChirurgie)}</span>
              </div>
              <div>
                <span className="text-gray-600">Chirurgie longue durée:</span>
                <span className="ml-2 font-medium">{formatValue(intervention.chirurgieLongueDuree)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Anamnèse */}
        {anamnese && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Anamnèse</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{formatValue(anamnese)}</p>
          </div>
        )}

        {/* Allergies */}
        {allergies && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Allergies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Antibiotiques:</span>
                <span className="ml-2 font-medium">{formatValue(allergies.antibiotiques)}</span>
              </div>
              <div>
                <span className="text-gray-600">Aspirine/AINS:</span>
                <span className="ml-2 font-medium">{formatValue(allergies.aspirineAINS)}</span>
              </div>
              <div>
                <span className="text-gray-600">Autres médicaments:</span>
                <span className="ml-2 font-medium">{formatValue(allergies.autresMedicaments)}</span>
              </div>
              <div>
                <span className="text-gray-600">Produits de contraste:</span>
                <span className="ml-2 font-medium">{formatValue(allergies.produitsContraste)}</span>
              </div>
              <div>
                <span className="text-gray-600">Alimentaires:</span>
                <span className="ml-2 font-medium">{formatValue(allergies.alimentaires)}</span>
              </div>
              <div>
                <span className="text-gray-600">Latex:</span>
                <span className="ml-2 font-medium">{formatValue(allergies.latex)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Examen physique */}
        {examenPhysique && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Examen physique</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Poids:</span>
                <span className="ml-2 font-medium">{formatValue(examenPhysique.poids)}</span>
              </div>
              <div>
                <span className="text-gray-600">Taille:</span>
                <span className="ml-2 font-medium">{formatValue(examenPhysique.taille)}</span>
              </div>
              <div>
                <span className="text-gray-600">IMC:</span>
                <span className="ml-2 font-medium">{formatValue(examenPhysique.imc)}</span>
              </div>
              <div>
                <span className="text-gray-600">FC:</span>
                <span className="ml-2 font-medium">{formatValue(examenPhysique.fc)}</span>
              </div>
              <div>
                <span className="text-gray-600">PA:</span>
                <span className="ml-2 font-medium">{formatValue(examenPhysique.pa)}</span>
              </div>
              <div>
                <span className="text-gray-600">SpO2:</span>
                <span className="ml-2 font-medium">{formatValue(examenPhysique.spo2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Examens para-cliniques */}
        {examensParacliniques && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Examens para-cliniques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Biologie:</span>
                <span className="ml-2 font-medium">{formatValue(examensParacliniques.biologie)}</span>
                {examensParacliniques.biologie === 'Oui' && examensParacliniques.biologieCommentaire && (
                  <div className="ml-4 text-sm text-gray-500 italic">
                    {examensParacliniques.biologieCommentaire}
                  </div>
                )}
              </div>
              <div>
                <span className="text-gray-600">Hémostase:</span>
                <span className="ml-2 font-medium">{formatValue(examensParacliniques.hemostase)}</span>
                {examensParacliniques.hemostase === 'Oui' && examensParacliniques.hemostaseCommentaire && (
                  <div className="ml-4 text-sm text-gray-500 italic">
                    {examensParacliniques.hemostaseCommentaire}
                  </div>
                )}
              </div>
              <div>
                <span className="text-gray-600">Groupe sanguin:</span>
                <span className="ml-2 font-medium">{formatValue(examensParacliniques.groupeSanguin)}</span>
                {examensParacliniques.groupeSanguin === 'Oui' && examensParacliniques.groupeSanguinCommentaire && (
                  <div className="ml-4 text-sm text-gray-500 italic">
                    {examensParacliniques.groupeSanguinCommentaire}
                  </div>
                )}
              </div>
              <div>
                <span className="text-gray-600">ECG repos:</span>
                <span className="ml-2 font-medium">{formatValue(examensParacliniques.ecgRepos)}</span>
                {examensParacliniques.ecgRepos === 'Oui' && examensParacliniques.ecgReposCommentaire && (
                  <div className="ml-4 text-sm text-gray-500 italic">
                    {examensParacliniques.ecgReposCommentaire}
                  </div>
                )}
              </div>
              <div>
                <span className="text-gray-600">RX thorax:</span>
                <span className="ml-2 font-medium">{formatValue(examensParacliniques.rxThorax)}</span>
                {examensParacliniques.rxThorax === 'Oui' && examensParacliniques.rxThoraxCommentaire && (
                  <div className="ml-4 text-sm text-gray-500 italic">
                    {examensParacliniques.rxThoraxCommentaire}
                  </div>
                )}
              </div>
              <div>
                <span className="text-gray-600">EFR:</span>
                <span className="ml-2 font-medium">{formatValue(examensParacliniques.efr)}</span>
                {examensParacliniques.efr === 'Oui' && examensParacliniques.efrCommentaire && (
                  <div className="ml-4 text-sm text-gray-500 italic">
                    {examensParacliniques.efrCommentaire}
                  </div>
                )}
              </div>
              <div>
                <span className="text-gray-600">Test effort:</span>
                <span className="ml-2 font-medium">{formatValue(examensParacliniques.testEffort)}</span>
                {examensParacliniques.testEffort === 'Oui' && examensParacliniques.testEffortCommentaire && (
                  <div className="ml-4 text-sm text-gray-500 italic">
                    {examensParacliniques.testEffortCommentaire}
                  </div>
                )}
              </div>
              <div>
                <span className="text-gray-600">Autres:</span>
                <span className="ml-2 font-medium">{formatValue(examensParacliniques.autres)}</span>
                {examensParacliniques.autres === 'Oui' && examensParacliniques.autresCommentaire && (
                  <div className="ml-4 text-sm text-gray-500 italic">
                    {examensParacliniques.autresCommentaire}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Commentaires généraux */}
        {examensParacliniques?.commentaires && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Commentaires généraux</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{examensParacliniques.commentaires}</p>
          </div>
        )}
      </div>
    </div>
  );
}
