import React from 'react';
import { Printer, ArrowLeft, Download, Trash2, Shield, Lock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface ChecklistConsultationProps {
  checklistData: any;
  onBackToList: () => void;
  onEdit: (checklist: any) => void;
  onDelete: (id: number) => void;
}

const ChecklistConsultation: React.FC<ChecklistConsultationProps> = ({
  checklistData,
  onBackToList,
  onEdit,
  onDelete
}) => {
  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === '') {
      return 'Non renseigné';
    }
    
    // Si c'est une date, la formater correctement
    if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
      try {
        return new Date(value).toLocaleDateString('fr-FR');
      } catch {
        return value.toString();
      }
    }
    
    return value;
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
    const { intervention, checklist, progress } = checklistData.data || {};
    const isComplete = progress === 100;

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
          <p><strong>Patient:</strong> ${formatValue(intervention?.patientName)}</p>
          <p><strong>Âge:</strong> ${intervention?.patientAge ? `${intervention.patientAge} ans` : 'Non renseigné'}</p>
          <p><strong>Type d'intervention:</strong> ${formatValue(intervention?.interventionType)}</p>
          <p><strong>Chirurgien:</strong> ${formatValue(intervention?.surgeon)}</p>
          <p><strong>Salle:</strong> ${formatValue(intervention?.operatingRoom)}</p>
          <p><strong>Date:</strong> ${(() => {
            // Essayer interventionDate d'abord
            if (intervention?.interventionDate) {
              const date = new Date(intervention.interventionDate);
              if (!isNaN(date.getTime())) {
                return date.toLocaleDateString('fr-FR');
              }
            }
            
            // Essayer scheduledTime ensuite
            if (intervention?.scheduledTime) {
              const date = new Date(intervention.scheduledTime);
              if (!isNaN(date.getTime())) {
                return date.toLocaleDateString('fr-FR');
              }
            }
            
            return 'Non renseigné';
          })()}</p>
        </div>

        ${checklist ? `
          <div class="section">
            <div class="section-title">Partie I : Avant l'induction de l'anesthésie</div>
            ${checklist.section1?.map((item: any) => `
              <div class="checklist-item">
                <div class="checkbox ${item.checked ? 'checked' : ''}">${item.checked ? '✓' : ''}</div>
                <div class="item-text">${getItemText('section1', item.id)}</div>
                <div class="item-time">${item.time || ''}</div>
              </div>
            `).join('') || ''}
          </div>

          <div class="section">
            <div class="section-title">Partie II : Avant l'incision de la peau</div>
            ${checklist.section2?.map((item: any) => `
              <div class="checklist-item">
                <div class="checkbox ${item.checked ? 'checked' : ''}">${item.checked ? '✓' : ''}</div>
                <div class="item-text">${getItemText('section2', item.id)}</div>
                <div class="item-time">${item.time || ''}</div>
              </div>
            `).join('') || ''}
          </div>

          <div class="section">
            <div class="section-title">Partie III : Avant la fermeture de la peau</div>
            ${checklist.section3?.map((item: any) => `
              <div class="checklist-item">
                <div class="checkbox ${item.checked ? 'checked' : ''}">${item.checked ? '✓' : ''}</div>
                <div class="item-text">${getItemText('section3', item.id)}</div>
                <div class="item-time">${item.time || ''}</div>
              </div>
            `).join('') || ''}
          </div>
        ` : ''}

        <div class="progress-summary">
          <h3>Résumé de la Progression</h3>
          <p><strong>Progression globale:</strong> ${Math.round(progress || 0)}%</p>
          <p><strong>Statut:</strong> ${isComplete ? 'Complété' : 'En cours'}</p>
        </div>

        <div class="status ${isComplete ? 'complete' : 'incomplete'}">
          ${isComplete ? '✅ CHECKLIST COMPLÉTÉE' : '⚠️ CHECKLIST EN COURS'}
        </div>
      </body>
      </html>
    `;
  };

  const getItemText = (section: string, itemId: string) => {
    const sections = {
      section1: [
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
      ],
      section2: [
        'Présentation de toute l\'équipe du bloc',
        'Confirmer à nouveau l\'identité du patient',
        'Risque de pertes sanguines évalué',
        'Dose d\'antibioprophylaxie administrée (<60min)',
        'Tout le matériel chirurgical est en place et fonctionnel',
        'Vérifier que tout est stérile',
        'Patient installé en position adéquate',
        'Documents d\'imagerie disponibles',
        'Permission de l\'anesthésiste pour inciser'
      ],
      section3: [
        'Compte final des compresses et instruments',
        'Vérifier l\'étiquetage des prélèvements',
        'Signaler tout matériel défectueux'
      ]
    };

    const sectionItems = sections[section as keyof typeof sections];
    const index = parseInt(itemId.split('-')[1]) - 1;
    return sectionItems[index] || 'Item non trouvé';
  };

  const handleDownload = async () => {
    try {
      const data = {
        intervention: checklistData.data?.intervention,
        checklist: checklistData.data?.checklist,
        progress: checklistData.data?.progress,
        createdAt: checklistData.created_at
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `checklist_chirurgicale_${checklistData.patient_name}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  const { intervention, checklist, progress } = checklistData.data || {};

  // Debug: Afficher les données pour comprendre le problème
  console.log('ChecklistConsultation - checklistData:', checklistData);
  console.log('ChecklistConsultation - intervention:', intervention);
  console.log('ChecklistConsultation - operatingRoom:', intervention?.operatingRoom);
  console.log('ChecklistConsultation - interventionDate:', intervention?.interventionDate);
  console.log('ChecklistConsultation - scheduledTime:', intervention?.scheduledTime);
  console.log('ChecklistConsultation - scheduledTime type:', typeof intervention?.scheduledTime);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
                <Printer className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Consultation Checklist Chirurgicale</h1>
                <p className="text-gray-600">Centre Diagnostic de Libreville</p>
                <div className="flex items-center gap-2 mt-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-600 font-medium">Checklist verrouillée - Lecture seule</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onBackToList}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la liste
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
              </button>
              <button
                onClick={() => onDelete(checklistData.id)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </button>
            </div>
          </div>
        </div>

        {/* Informations de l'intervention */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-2 rounded-lg mr-3">
              <Printer className="w-6 h-6 text-blue-600" />
            </div>
            Informations de l'Intervention
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <Printer className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Patient</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{formatValue(intervention?.patientName)}</span>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <Printer className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Âge</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {intervention?.patientAge ? `${intervention.patientAge} ans` : 'Non renseigné'}
              </span>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <Printer className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Type d'intervention</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{formatValue(intervention?.interventionType)}</span>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <Printer className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Chirurgien</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{formatValue(intervention?.surgeon)}</span>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <Printer className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Salle</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{formatValue(intervention?.operatingRoom)}</span>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <Printer className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Date</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {(() => {
                  // Essayer interventionDate d'abord
                  if (intervention?.interventionDate) {
                    const date = new Date(intervention.interventionDate);
                    if (!isNaN(date.getTime())) {
                      return date.toLocaleDateString('fr-FR');
                    }
                  }
                  
                  // Essayer scheduledTime ensuite
                  if (intervention?.scheduledTime) {
                    const date = new Date(intervention.scheduledTime);
                    if (!isNaN(date.getTime())) {
                      return date.toLocaleDateString('fr-FR');
                    }
                  }
                  
                  return 'Non renseigné';
                })()}
              </span>
            </div>
          </div>
        </div>

        {/* Progression */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-2 rounded-lg mr-3">
              <Printer className="w-6 h-6 text-emerald-600" />
            </div>
            Progression de la Checklist
          </h2>
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
                    strokeDashoffset={251.2 - ((progress || 0) / 100) * 251.2}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {Math.round(progress || 0)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Statut de la Checklist</h3>
              <p className="text-gray-600 mb-4">
                {progress === 100 ? (
                  <span className="text-emerald-600 font-semibold">✅ Checklist complétée</span>
                ) : (
                  <span className="text-orange-600 font-semibold">⚠️ Checklist en cours</span>
                )}
              </p>
              <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${progress || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Détails de la checklist */}
        {checklist && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-2 rounded-lg mr-3">
                <Printer className="w-6 h-6 text-purple-600" />
              </div>
              Détails de la Checklist
            </h2>

            {/* Section 1 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Partie I : Avant l'induction de l'anesthésie</h3>
              <div className="space-y-3">
                {checklist.section1?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      item.checked
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          item.checked
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {item.checked && <Printer className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <span className={`font-medium ${item.checked ? 'text-emerald-800' : 'text-gray-900'}`}>
                          {getItemText('section1', item.id)}
                        </span>
                      </div>
                      {item.time && (
                        <div className="text-sm text-gray-500">
                          {item.time}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Partie II : Avant l'incision de la peau</h3>
              <div className="space-y-3">
                {checklist.section2?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      item.checked
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          item.checked
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {item.checked && <Printer className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <span className={`font-medium ${item.checked ? 'text-emerald-800' : 'text-gray-900'}`}>
                          {getItemText('section2', item.id)}
                        </span>
                      </div>
                      {item.time && (
                        <div className="text-sm text-gray-500">
                          {item.time}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Partie III : Avant la fermeture de la peau</h3>
              <div className="space-y-3">
                {checklist.section3?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      item.checked
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          item.checked
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {item.checked && <Printer className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <span className={`font-medium ${item.checked ? 'text-emerald-800' : 'text-gray-900'}`}>
                          {getItemText('section3', item.id)}
                        </span>
                      </div>
                      {item.time && (
                        <div className="text-sm text-gray-500">
                          {item.time}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChecklistConsultation;
