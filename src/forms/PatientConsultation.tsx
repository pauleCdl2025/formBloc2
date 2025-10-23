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

  const { patient, intervention, anamnese, allergies, examenPhysique, examensParacliniques, pyrosis, rgo, tabac, tabagismePassif, hepatite, alcool, activitesPhysiques, cardiaques, stimulateur, hta, diabete, reins, hemostase, stopBang, hasAntecedentsChirurgicaux, antecedentsChirurgicaux, parametresPhysiques, avisSpecialises, checklistHDJ, douleursPostop, scoreApfel, scoreLee, autres, conclusion, signature } = data;

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === '') return 'Non renseigné';
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
    if (typeof value === 'object' && value !== null) {
      if (value.presente !== undefined) return value.presente ? 'Oui' : 'Non';
      if (value.details) return value.details;
    }
    return String(value);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Impossible d\'ouvrir la fenêtre d\'impression');
      return;
    }

    const printContent = generatePrintContent();
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Consultation Pré-Anesthésique - ${patient?.nom || ''} ${patient?.prenom || ''}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; line-height: 1.4; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1e3a8a; padding-bottom: 15px; }
            .logo { max-width: 200px; height: auto; margin-bottom: 15px; }
            .logo-container { margin-bottom: 15px; text-align: center; }
            .logo-text { font-size: 20px; font-weight: bold; color: #1e3a8a; margin-bottom: 5px; letter-spacing: 1px; }
            .patient-info { margin-bottom: 20px; }
            .section { margin-bottom: 25px; page-break-inside: avoid; }
            .section-title { font-weight: bold; font-size: 14px; color: #1e3a8a; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            .field { margin-bottom: 8px; }
            .field-label { font-weight: bold; display: inline-block; width: 150px; }
            .field-value { display: inline-block; }
            .checkbox-group { margin-left: 20px; }
            .checkbox-item { margin-bottom: 5px; }
            .signature-section { margin-top: 40px; border-top: 2px solid #ccc; padding-top: 20px; }
            .signature-line { margin-top: 30px; }
            .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; }
            .score-box { border: 1px solid #ccc; padding: 10px; margin: 5px 0; }
            .score-title { font-weight: bold; margin-bottom: 5px; }
            .score-item { display: flex; justify-content: space-between; margin-bottom: 3px; }
            .score-total { border-top: 1px solid #ccc; padding-top: 5px; margin-top: 5px; font-weight: bold; }
            @media print { 
              body { margin: 0; } 
              .page-break { page-break-before: always; }
              .logo { max-width: 150px; }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const generatePrintContent = () => {
    return `
      <div class="header">
        <div class="logo-container">
          <div class="logo-text">🏥 CENTRE DIAGNOSTIC DE LIBREVILLE</div>
          <div style="font-size: 12px; color: #666; margin-top: 5px;">Centre Médical Spécialisé</div>
        </div>
        <h1>CONSULTATION PRÉ-ANESTHÉSIQUE</h1>
        <h2>Centre Diagnostic de Libreville</h2>
        <p>Date: ${patient?.dateConsultation || new Date().toLocaleDateString('fr-FR')}</p>
      </div>

      <div class="patient-info">
        <div class="section-title">INFORMATIONS PATIENT</div>
        <div class="field"><span class="field-label">Nom:</span> <span class="field-value">${patient?.nom || ''}</span></div>
        <div class="field"><span class="field-label">Prénom:</span> <span class="field-value">${patient?.prenom || ''}</span></div>
        <div class="field"><span class="field-label">Date de naissance:</span> <span class="field-value">${formatValue(patient?.dateNaissance)}</span></div>
        <div class="field"><span class="field-label">Âge:</span> <span class="field-value">${patient?.age || ''} ans</span></div>
        <div class="field"><span class="field-label">N° Identification:</span> <span class="field-value">${patient?.numeroIdentification || ''}</span></div>
      </div>

      <div class="section">
        <div class="section-title">INTERVENTION PRÉVUE</div>
        <div class="field"><span class="field-label">Libellé:</span> <span class="field-value">${intervention?.libelle || ''}</span></div>
        <div class="field"><span class="field-label">Date:</span> <span class="field-value">${intervention?.dateIntervention || ''}</span></div>
        <div class="field"><span class="field-label">Ambulatoire:</span> <span class="field-value">${intervention?.ambulatoire ? 'Oui' : 'Non'}</span></div>
        <div class="field"><span class="field-label">Date entrée prévue:</span> <span class="field-value">${intervention?.dateEntreePrevue || ''}</span></div>
        ${intervention?.commentaires ? `<div class="field"><span class="field-label">Commentaires:</span> <span class="field-value">${intervention.commentaires}</span></div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">ANAMNÈSE</div>
        <p>${formatValue(anamnese)}</p>
      </div>

      <div class="section">
        <div class="section-title">ALLERGIES</div>
        <div class="grid-2">
          <div class="field"><span class="field-label">Antibiotiques:</span> <span class="field-value">${formatValue(allergies?.antibiotiques)}</span></div>
          <div class="field"><span class="field-label">Aspirine/AINS:</span> <span class="field-value">${formatValue(allergies?.aspirineAINS)}</span></div>
          <div class="field"><span class="field-label">Autres médicaments:</span> <span class="field-value">${formatValue(allergies?.autresMedicaments)}</span></div>
          <div class="field"><span class="field-label">Produits de contraste:</span> <span class="field-value">${formatValue(allergies?.produitsContraste)}</span></div>
          <div class="field"><span class="field-label">Alimentaires:</span> <span class="field-value">${formatValue(allergies?.alimentaires)}</span></div>
          <div class="field"><span class="field-label">Latex:</span> <span class="field-value">${formatValue(allergies?.latex)}</span></div>
        </div>
      </div>

      ${hasAntecedentsChirurgicaux && antecedentsChirurgicaux && antecedentsChirurgicaux.length > 0 ? `
      <div class="section">
        <div class="section-title">ANTÉCÉDENTS CHIRURGICAUX</div>
        ${antecedentsChirurgicaux.map((antecedent: any, index: number) => `
          <div class="score-box">
            <div class="score-title">Antécédent ${index + 1}</div>
            <div class="field"><span class="field-label">Année:</span> <span class="field-value">${formatValue(antecedent.annee)}</span></div>
            <div class="field"><span class="field-label">Intervention:</span> <span class="field-value">${formatValue(antecedent.intervention)}</span></div>
            <div class="field"><span class="field-label">Type d'anesthésie:</span> <span class="field-value">${formatValue(antecedent.typeAnesthesie)}</span></div>
            <div class="field"><span class="field-label">Difficultés:</span> <span class="field-value">${formatValue(antecedent.difficultes)}</span></div>
            <div class="field"><span class="field-label">Cormack:</span> <span class="field-value">${formatValue(antecedent.cormack)}</span></div>
            <div class="field"><span class="field-label">Technique:</span> <span class="field-value">${formatValue(antecedent.technique)}</span></div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${(pyrosis || rgo || tabac || hepatite || alcool || hta || diabete || reins) ? `
      <div class="section">
        <div class="section-title">ANTÉCÉDENTS MÉDICAUX</div>
        <div class="grid-2">
          ${pyrosis ? `<div class="field"><span class="field-label">Pyrosis:</span> <span class="field-value">${pyrosis.presente ? 'Oui' : 'Non'} ${pyrosis.presente && pyrosis.details ? '- ' + pyrosis.details : ''}</span></div>` : ''}
          ${rgo ? `<div class="field"><span class="field-label">RGO:</span> <span class="field-value">${rgo.presente ? 'Oui' : 'Non'} ${rgo.presente && rgo.details ? '- ' + rgo.details : ''}</span></div>` : ''}
          ${tabac ? `<div class="field"><span class="field-label">Tabac:</span> <span class="field-value">${tabac.presente ? 'Oui' : 'Non'} ${tabac.presente && tabac.paquetsAnnees ? '- ' + tabac.paquetsAnnees : ''}</span></div>` : ''}
          ${hepatite ? `<div class="field"><span class="field-label">Hépatite:</span> <span class="field-value">${hepatite.presente ? 'Oui' : 'Non'} ${hepatite.presente ? `- ${hepatite.type || ''} ${hepatite.dateDecouverte || ''} ${hepatite.statut || ''}` : ''}</span></div>` : ''}
          ${alcool ? `<div class="field"><span class="field-label">Alcool:</span> <span class="field-value">${alcool.presente ? 'Oui' : 'Non'} ${alcool.presente && alcool.details ? '- ' + alcool.details : ''}</span></div>` : ''}
          ${hta ? `<div class="field"><span class="field-label">HTA:</span> <span class="field-value">${hta.presente ? 'Oui' : 'Non'} ${hta.presente && hta.details ? '- ' + hta.details : ''}</span></div>` : ''}
          ${diabete ? `<div class="field"><span class="field-label">Diabète:</span> <span class="field-value">${diabete.presente ? 'Oui' : 'Non'} ${diabete.presente && diabete.details ? '- ' + diabete.details : ''}</span></div>` : ''}
          ${reins ? `<div class="field"><span class="field-label">Reins:</span> <span class="field-value">${reins.presente ? 'Oui' : 'Non'} ${reins.presente && reins.details ? '- ' + reins.details : ''}</span></div>` : ''}
        </div>
      </div>
      ` : ''}

      <div class="section">
        <div class="section-title">EXAMEN PHYSIQUE</div>
        <div class="grid-3">
          <div class="field"><span class="field-label">Poids:</span> <span class="field-value">${formatValue(examenPhysique?.poids)} kg</span></div>
          <div class="field"><span class="field-label">Taille:</span> <span class="field-value">${formatValue(examenPhysique?.taille)} cm</span></div>
          <div class="field"><span class="field-label">IMC:</span> <span class="field-value">${formatValue(parametresPhysiques?.bmi)} kg/m²</span></div>
          <div class="field"><span class="field-label">FC:</span> <span class="field-value">${formatValue(examenPhysique?.fc)} bpm</span></div>
          <div class="field"><span class="field-label">PA:</span> <span class="field-value">${formatValue(examenPhysique?.pa)} mmHg</span></div>
          <div class="field"><span class="field-label">SpO2:</span> <span class="field-value">${formatValue(examenPhysique?.spo2)}%</span></div>
          <div class="field"><span class="field-label">Température:</span> <span class="field-value">${formatValue(examenPhysique?.temperature)}°C</span></div>
        </div>
        ${examenPhysique?.examen ? `<div class="field"><span class="field-label">Examen:</span> <span class="field-value">${examenPhysique.examen}</span></div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">EXAMENS PARA-CLINIQUES</div>
        <div class="grid-2">
          <div class="field"><span class="field-label">Biologie:</span> <span class="field-value">${formatValue(examensParacliniques?.biologie)} ${examensParacliniques?.biologie === 'Oui' && examensParacliniques?.biologieCommentaire ? '- ' + examensParacliniques.biologieCommentaire : ''}</span></div>
          <div class="field"><span class="field-label">Hémostase:</span> <span class="field-value">${formatValue(examensParacliniques?.hemostase)} ${examensParacliniques?.hemostase === 'Oui' && examensParacliniques?.hemostaseCommentaire ? '- ' + examensParacliniques.hemostaseCommentaire : ''}</span></div>
          <div class="field"><span class="field-label">Groupe sanguin:</span> <span class="field-value">${formatValue(examensParacliniques?.groupeSanguin)} ${examensParacliniques?.groupeSanguin === 'Oui' && examensParacliniques?.groupeSanguinCommentaire ? '- ' + examensParacliniques.groupeSanguinCommentaire : ''}</span></div>
          <div class="field"><span class="field-label">ECG repos:</span> <span class="field-value">${formatValue(examensParacliniques?.ecgRepos)} ${examensParacliniques?.ecgRepos === 'Oui' && examensParacliniques?.ecgReposCommentaire ? '- ' + examensParacliniques.ecgReposCommentaire : ''}</span></div>
          <div class="field"><span class="field-label">RX thorax:</span> <span class="field-value">${formatValue(examensParacliniques?.rxThorax)} ${examensParacliniques?.rxThorax === 'Oui' && examensParacliniques?.rxThoraxCommentaire ? '- ' + examensParacliniques.rxThoraxCommentaire : ''}</span></div>
          <div class="field"><span class="field-label">EFR:</span> <span class="field-value">${formatValue(examensParacliniques?.efr)} ${examensParacliniques?.efr === 'Oui' && examensParacliniques?.efrCommentaire ? '- ' + examensParacliniques.efrCommentaire : ''}</span></div>
          <div class="field"><span class="field-label">Test effort:</span> <span class="field-value">${formatValue(examensParacliniques?.testEffort)} ${examensParacliniques?.testEffort === 'Oui' && examensParacliniques?.testEffortCommentaire ? '- ' + examensParacliniques.testEffortCommentaire : ''}</span></div>
          <div class="field"><span class="field-label">Autres:</span> <span class="field-value">${formatValue(examensParacliniques?.autres)} ${examensParacliniques?.autres === 'Oui' && examensParacliniques?.autresCommentaire ? '- ' + examensParacliniques.autresCommentaire : ''}</span></div>
        </div>
        ${examensParacliniques?.commentaires ? `<div class="field"><span class="field-label">Commentaires:</span> <span class="field-value">${examensParacliniques.commentaires}</span></div>` : ''}
      </div>

      ${stopBang ? `
      <div class="section">
        <div class="section-title">SCORE STOP-BANG</div>
        <div class="grid-3">
          <div class="field"><span class="field-label">Ronflement:</span> <span class="field-value">${stopBang.ronflement ? 'Oui' : 'Non'}</span></div>
          <div class="field"><span class="field-label">Fatigue:</span> <span class="field-value">${stopBang.fatigue ? 'Oui' : 'Non'}</span></div>
          <div class="field"><span class="field-label">Apnée:</span> <span class="field-value">${stopBang.apnee ? 'Oui' : 'Non'}</span></div>
          <div class="field"><span class="field-label">Pression artérielle:</span> <span class="field-value">${stopBang.pressionArterielle ? 'Oui' : 'Non'}</span></div>
          <div class="field"><span class="field-label">IMC:</span> <span class="field-value">${stopBang.imc ? 'Oui' : 'Non'}</span></div>
          <div class="field"><span class="field-label">Âge:</span> <span class="field-value">${stopBang.age ? 'Oui' : 'Non'}</span></div>
          <div class="field"><span class="field-label">Tour de cou:</span> <span class="field-value">${stopBang.tourCou ? 'Oui' : 'Non'}</span></div>
          <div class="field"><span class="field-label">Sexe:</span> <span class="field-value">${stopBang.sexe ? 'Oui' : 'Non'}</span></div>
        </div>
        <div class="field"><span class="field-label">Score total:</span> <span class="field-value">${Object.values(stopBang).filter(v => v).length}/8</span></div>
      </div>
      ` : ''}

      ${(scoreApfel || scoreLee || douleursPostop) ? `
      <div class="section">
        <div class="section-title">SCORES DE RISQUE</div>
        <div class="grid-3">
          ${scoreApfel ? `
          <div class="score-box">
            <div class="score-title">Score Apfel</div>
            <div class="score-item"><span>Femme:</span> <span>${scoreApfel.femme ? 'Oui' : 'Non'}</span></div>
            <div class="score-item"><span>Non fumeur:</span> <span>${scoreApfel.nonFumeur ? 'Oui' : 'Non'}</span></div>
            <div class="score-item"><span>ATCD NVPO:</span> <span>${scoreApfel.atcdNVPO ? 'Oui' : 'Non'}</span></div>
            <div class="score-item"><span>ATCD cinétose:</span> <span>${scoreApfel.atcdCinetose ? 'Oui' : 'Non'}</span></div>
            <div class="score-item"><span>Opioïdes postop:</span> <span>${scoreApfel.opioidesPostop ? 'Oui' : 'Non'}</span></div>
            <div class="score-total">Total: ${Object.values(scoreApfel).filter(v => v).length}/5</div>
          </div>
          ` : ''}
          ${scoreLee ? `
          <div class="score-box">
            <div class="score-title">Score Lee</div>
            <div class="score-item"><span>Chirurgie risque élevé:</span> <span>${scoreLee.chirurgieRisqueEleve ? 'Oui' : 'Non'}</span></div>
            <div class="score-item"><span>Cardiopathie ischémique:</span> <span>${scoreLee.cardiopathieIschemique ? 'Oui' : 'Non'}</span></div>
            <div class="score-item"><span>Insuffisance cardiaque:</span> <span>${scoreLee.insuffisanceCardiaque ? 'Oui' : 'Non'}</span></div>
            <div class="score-item"><span>ATCD AVC:</span> <span>${scoreLee.atcdAVC ? 'Oui' : 'Non'}</span></div>
            <div class="score-item"><span>Insulinothérapie:</span> <span>${scoreLee.insulinotherapie ? 'Oui' : 'Non'}</span></div>
            <div class="score-item"><span>Créatinine élevée:</span> <span>${scoreLee.creatinine ? 'Oui' : 'Non'}</span></div>
            <div class="score-total">Total: ${Object.values(scoreLee).filter(v => v).length}/6</div>
          </div>
          ` : ''}
          ${douleursPostop ? `
          <div class="score-box">
            <div class="score-title">Douleurs postopératoires</div>
            <div class="score-item"><span>Sexe féminin:</span> <span>${formatValue(douleursPostop.sexeFeminin)}</span></div>
            <div class="score-item"><span>Âge:</span> <span>${formatValue(douleursPostop.age)}</span></div>
            <div class="score-item"><span>Douleur préop site:</span> <span>${formatValue(douleursPostop.douleurPreopSite)}</span></div>
            <div class="score-item"><span>Usage opiacés:</span> <span>${formatValue(douleursPostop.usageOpiaces)}</span></div>
            <div class="score-item"><span>Usage antidépresseurs:</span> <span>${formatValue(douleursPostop.usageAntidepresseurs)}</span></div>
            <div class="score-item"><span>Chirurgie tomie:</span> <span>${formatValue(douleursPostop.chirurgieTomie)}</span></div>
            <div class="score-item"><span>Type chirurgie:</span> <span>${formatValue(douleursPostop.typeChirurgie)}</span></div>
            <div class="score-item"><span>Chirurgie longue durée:</span> <span>${formatValue(douleursPostop.chirurgieLongueDuree)}</span></div>
            <div class="score-item"><span>Obésité importante:</span> <span>${formatValue(douleursPostop.obesiteImportante)}</span></div>
            <div class="score-item"><span>Patient très anxieux:</span> <span>${formatValue(douleursPostop.patientTresAnxieux)}</span></div>
            <div class="score-total">Risque douleurs sévères: ${formatValue(douleursPostop.risqueDouleursSeveres)} (Score: ${douleursPostop.totalScore || 'N/A'})</div>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}

      ${avisSpecialises ? `
      <div class="section">
        <div class="section-title">AVIS SPÉCIALISÉS</div>
        ${avisSpecialises.avisDemandes ? `<div class="field"><span class="field-label">Avis demandés:</span> <span class="field-value">${avisSpecialises.avisDemandes}</span></div>` : ''}
        ${avisSpecialises.commentaires ? `<div class="field"><span class="field-label">Commentaires:</span> <span class="field-value">${avisSpecialises.commentaires}</span></div>` : ''}
      </div>
      ` : ''}

      ${checklistHDJ ? `
      <div class="section">
        <div class="section-title">CHECKLIST HOSPITALISATION DE JOUR</div>
        <div class="grid-2">
          <div class="field"><span class="field-label">ASA 3 mal équilibré:</span> <span class="field-value">${formatValue(checklistHDJ.asa3MalEquilibre)}</span></div>
          <div class="field"><span class="field-label">Conduit véhicule:</span> <span class="field-value">${formatValue(checklistHDJ.conduitVehicule)}</span></div>
          <div class="field"><span class="field-label">Rentre seul:</span> <span class="field-value">${formatValue(checklistHDJ.rentreSeul)}</span></div>
          <div class="field"><span class="field-label">Non accompagné nuit:</span> <span class="field-value">${formatValue(checklistHDJ.nonAccompagneNuit)}</span></div>
          <div class="field"><span class="field-label">Plus de 75 ans:</span> <span class="field-value">${formatValue(checklistHDJ.plus75Ans)}</span></div>
          <div class="field"><span class="field-label">Douleur non contrôlable:</span> <span class="field-value">${formatValue(checklistHDJ.douleurNonControllable)}</span></div>
          <div class="field"><span class="field-label">Saignement important:</span> <span class="field-value">${formatValue(checklistHDJ.saignementImportant)}</span></div>
          <div class="field"><span class="field-label">Admission HDJ:</span> <span class="field-value">${formatValue(checklistHDJ.admissionHospiDay)}</span></div>
        </div>
        ${checklistHDJ.commentaire ? `<div class="field"><span class="field-label">Commentaire:</span> <span class="field-value">${checklistHDJ.commentaire}</span></div>` : ''}
      </div>
      ` : ''}

      ${conclusion ? `
      <div class="section">
        <div class="section-title">CONCLUSION</div>
        <div class="grid-2">
          <div class="field"><span class="field-label">Score ASA:</span> <span class="field-value">${formatValue(conclusion.scoreASA)}</span></div>
          <div class="field"><span class="field-label">Type d'anesthésie:</span> <span class="field-value">${formatValue(conclusion.typeAnesthesie)}</span></div>
          <div class="field"><span class="field-label">Adaptation traitement:</span> <span class="field-value">${formatValue(conclusion.adaptationTraitement)}</span></div>
          <div class="field"><span class="field-label">Consentement:</span> <span class="field-value">${formatValue(conclusion.consentement)}</span></div>
          <div class="field"><span class="field-label">Validation:</span> <span class="field-value">${formatValue(conclusion.validation)}</span></div>
          <div class="field"><span class="field-label">Compléments:</span> <span class="field-value">${formatValue(conclusion.complements)}</span></div>
        </div>
        ${conclusion.texte ? `<div class="field"><span class="field-label">Texte de conclusion:</span> <span class="field-value">${conclusion.texte}</span></div>` : ''}
      </div>
      ` : ''}

      ${autres ? `
      <div class="section">
        <div class="section-title">AUTRES INFORMATIONS</div>
        <p>${autres}</p>
      </div>
      ` : ''}

      <div class="signature-section">
        <div class="section-title">SIGNATURE</div>
        <div class="signature-line">
          <div class="field"><span class="field-label">Nom du médecin:</span> <span class="field-value">_______________________</span></div>
          <div class="field"><span class="field-label">Date:</span> <span class="field-value">_______________________</span></div>
          <div class="field"><span class="field-label">Signature:</span> <span class="field-value">_______________________</span></div>
        </div>
      </div>
    `;
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
                onClick={handlePrint}
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
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <Activity className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">Type de chirurgie</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{formatValue(intervention.libelle)}</span>
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
              <span className="text-lg font-semibold text-gray-900">{formatValue(parametresPhysiques?.poids)} kg</span>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center mb-2">
                <Activity className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-800">Taille</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{formatValue(parametresPhysiques?.taille)} cm</span>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center mb-2">
                <Activity className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-800">IMC</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{formatValue(parametresPhysiques?.bmi)} kg/m²</span>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center mb-2">
                <Heart className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-800">FC</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{formatValue(parametresPhysiques?.fc)} bpm</span>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center mb-2">
                <Activity className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-800">PA</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{formatValue(parametresPhysiques?.pa)} mmHg</span>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center mb-2">
                <Activity className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-800">SpO2</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{formatValue(parametresPhysiques?.spo2)}%</span>
            </div>
          </div>
        </div>

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

        {/* Avis spécialisés */}
        {avisSpecialises && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="bg-gradient-to-br from-cyan-100 to-blue-100 p-2 rounded-lg mr-3">
                <Eye className="w-6 h-6 text-cyan-600" />
              </div>
              Avis spécialisés
            </h2>
            <div className="space-y-4">
              {avisSpecialises.avisDemandes && (
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg border border-cyan-200">
                  <div className="flex items-center mb-2">
                    <Eye className="w-5 h-5 text-cyan-600 mr-2" />
                    <span className="text-sm font-medium text-cyan-800">Avis demandés</span>
                  </div>
                  <p className="text-gray-700">{avisSpecialises.avisDemandes}</p>
                </div>
              )}
              {avisSpecialises.commentaires && (
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg border border-cyan-200">
                  <div className="flex items-center mb-2">
                    <FileText className="w-5 h-5 text-cyan-600 mr-2" />
                    <span className="text-sm font-medium text-cyan-800">Commentaires</span>
                  </div>
                  <p className="text-gray-700">{avisSpecialises.commentaires}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Checklist HDJ */}
        {checklistHDJ && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-2 rounded-lg mr-3">
                <ClipboardList className="w-6 h-6 text-green-600" />
              </div>
              Checklist Hospitalisation de Jour
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">ASA 3 mal équilibré</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    checklistHDJ.asa3MalEquilibre === 'Oui' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {formatValue(checklistHDJ.asa3MalEquilibre)}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Conduit véhicule</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    checklistHDJ.conduitVehicule === 'Oui' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {formatValue(checklistHDJ.conduitVehicule)}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Rentre seul</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    checklistHDJ.rentreSeul === 'Oui' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {formatValue(checklistHDJ.rentreSeul)}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Non accompagné nuit</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    checklistHDJ.nonAccompagneNuit === 'Oui' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {formatValue(checklistHDJ.nonAccompagneNuit)}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Plus de 75 ans</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    checklistHDJ.plus75Ans === 'Oui' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {formatValue(checklistHDJ.plus75Ans)}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Douleur non contrôlable</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    checklistHDJ.douleurNonControllable === 'Oui' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {formatValue(checklistHDJ.douleurNonControllable)}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Saignement important</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    checklistHDJ.saignementImportant === 'Oui' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {formatValue(checklistHDJ.saignementImportant)}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Admission HDJ</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    checklistHDJ.admissionHospiDay === 'Oui' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {formatValue(checklistHDJ.admissionHospiDay)}
                  </span>
                </div>
              </div>
            </div>
            {checklistHDJ.commentaire && (
              <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 italic">{checklistHDJ.commentaire}</p>
              </div>
            )}
          </div>
        )}

        {/* Scores de risque */}
        {(scoreApfel || scoreLee || douleursPostop) && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="bg-gradient-to-br from-red-100 to-pink-100 p-2 rounded-lg mr-3">
                <Activity className="w-6 h-6 text-red-600" />
              </div>
              Scores de risque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Score Apfel */}
              {scoreApfel && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center mb-3">
                    <Activity className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-sm font-medium text-red-800">Score Apfel</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Femme:</span>
                      <span className={scoreApfel.femme ? 'text-red-600 font-semibold' : 'text-gray-600'}>{scoreApfel.femme ? 'Oui' : 'Non'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Non fumeur:</span>
                      <span className={scoreApfel.nonFumeur ? 'text-red-600 font-semibold' : 'text-gray-600'}>{scoreApfel.nonFumeur ? 'Oui' : 'Non'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ATCD NVPO:</span>
                      <span className={scoreApfel.atcdNVPO ? 'text-red-600 font-semibold' : 'text-gray-600'}>{scoreApfel.atcdNVPO ? 'Oui' : 'Non'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ATCD cinétose:</span>
                      <span className={scoreApfel.atcdCinetose ? 'text-red-600 font-semibold' : 'text-gray-600'}>{scoreApfel.atcdCinetose ? 'Oui' : 'Non'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Opioïdes postop:</span>
                      <span className={scoreApfel.opioidesPostop ? 'text-red-600 font-semibold' : 'text-gray-600'}>{scoreApfel.opioidesPostop ? 'Oui' : 'Non'}</span>
                    </div>
                    <div className="mt-3 pt-2 border-t border-red-200">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span className="text-red-600">{Object.values(scoreApfel).filter(v => v).length}/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Score Lee */}
              {scoreLee && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center mb-3">
                    <Heart className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-sm font-medium text-red-800">Score Lee</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Chirurgie risque élevé:</span>
                      <span className={scoreLee.chirurgieRisqueEleve ? 'text-red-600 font-semibold' : 'text-gray-600'}>{scoreLee.chirurgieRisqueEleve ? 'Oui' : 'Non'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cardiopathie ischémique:</span>
                      <span className={scoreLee.cardiopathieIschemique ? 'text-red-600 font-semibold' : 'text-gray-600'}>{scoreLee.cardiopathieIschemique ? 'Oui' : 'Non'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insuffisance cardiaque:</span>
                      <span className={scoreLee.insuffisanceCardiaque ? 'text-red-600 font-semibold' : 'text-gray-600'}>{scoreLee.insuffisanceCardiaque ? 'Oui' : 'Non'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ATCD AVC:</span>
                      <span className={scoreLee.atcdAVC ? 'text-red-600 font-semibold' : 'text-gray-600'}>{scoreLee.atcdAVC ? 'Oui' : 'Non'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insulinothérapie:</span>
                      <span className={scoreLee.insulinotherapie ? 'text-red-600 font-semibold' : 'text-gray-600'}>{scoreLee.insulinotherapie ? 'Oui' : 'Non'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Créatinine élevée:</span>
                      <span className={scoreLee.creatinine ? 'text-red-600 font-semibold' : 'text-gray-600'}>{scoreLee.creatinine ? 'Oui' : 'Non'}</span>
                    </div>
                    <div className="mt-3 pt-2 border-t border-red-200">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span className="text-red-600">{Object.values(scoreLee).filter(v => v).length}/6</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Douleurs postopératoires */}
              {douleursPostop && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center mb-3">
                    <Pill className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-sm font-medium text-red-800">Douleurs postopératoires</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sexe féminin:</span>
                      <span className={douleursPostop.sexeFeminin === 'Oui' ? 'text-red-600 font-semibold' : 'text-gray-600'}>{formatValue(douleursPostop.sexeFeminin)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Âge:</span>
                      <span className="text-gray-600">{formatValue(douleursPostop.age)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Douleur préop site:</span>
                      <span className={douleursPostop.douleurPreopSite === 'Oui' ? 'text-red-600 font-semibold' : 'text-gray-600'}>{formatValue(douleursPostop.douleurPreopSite)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Usage opiacés:</span>
                      <span className={douleursPostop.usageOpiaces === 'Oui' ? 'text-red-600 font-semibold' : 'text-gray-600'}>{formatValue(douleursPostop.usageOpiaces)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Usage antidépresseurs:</span>
                      <span className={douleursPostop.usageAntidepresseurs === 'Oui' ? 'text-red-600 font-semibold' : 'text-gray-600'}>{formatValue(douleursPostop.usageAntidepresseurs)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chirurgie tomie:</span>
                      <span className={douleursPostop.chirurgieTomie === 'Oui' ? 'text-red-600 font-semibold' : 'text-gray-600'}>{formatValue(douleursPostop.chirurgieTomie)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type chirurgie:</span>
                      <span className="text-gray-600">{formatValue(douleursPostop.typeChirurgie)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chirurgie longue durée:</span>
                      <span className={douleursPostop.chirurgieLongueDuree === 'Oui' ? 'text-red-600 font-semibold' : 'text-gray-600'}>{formatValue(douleursPostop.chirurgieLongueDuree)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Obésité importante:</span>
                      <span className={douleursPostop.obesiteImportante === 'Oui' ? 'text-red-600 font-semibold' : 'text-gray-600'}>{formatValue(douleursPostop.obesiteImportante)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Patient très anxieux:</span>
                      <span className={douleursPostop.patientTresAnxieux === 'Oui' ? 'text-red-600 font-semibold' : 'text-gray-600'}>{formatValue(douleursPostop.patientTresAnxieux)}</span>
                    </div>
                    <div className="mt-3 pt-2 border-t border-red-200">
                      <div className="flex justify-between font-semibold">
                        <span>Risque douleurs sévères:</span>
                        <span className={douleursPostop.risqueDouleursSeveres === 'Oui' ? 'text-red-600' : 'text-green-600'}>{formatValue(douleursPostop.risqueDouleursSeveres)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Score total:</span>
                        <span>{douleursPostop.totalScore || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Conclusion */}
        {conclusion && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-2 rounded-lg mr-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              Conclusion
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <Activity className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-800">Score ASA</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{formatValue(conclusion.scoreASA)}</span>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <Stethoscope className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-800">Type d'anesthésie</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{formatValue(conclusion.typeAnesthesie)}</span>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <Pill className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-800">Adaptation traitement</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{formatValue(conclusion.adaptationTraitement)}</span>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <Shield className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-800">Consentement</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{formatValue(conclusion.consentement)}</span>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-800">Validation</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{formatValue(conclusion.validation)}</span>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-800">Compléments</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{formatValue(conclusion.complements)}</span>
                </div>
              </div>
              {conclusion.texte && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-3">
                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-800">Texte de conclusion</span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{conclusion.texte}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Signature */}
        {signature && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="bg-gradient-to-br from-gray-100 to-blue-100 p-2 rounded-lg mr-3">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
              Signature
            </h2>
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border border-gray-200">
              <div className="text-center">
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700">Signature du médecin:</span>
                </div>
                <div className="border-2 border-dashed border-gray-300 h-24 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Signature</span>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-600">Date: _______________________</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
