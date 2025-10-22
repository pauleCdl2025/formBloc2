import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Plus, Trash2, Save, Printer, FileText, Upload, List, ArrowLeft } from 'lucide-react';
import PatientList from './PatientList';

interface PatientInfo {
  nom: string;
  prenom: string;
  numeroIdentification: string;
  dateNaissance: string;
  age: number;
  dateConsultation: string;
}

interface Intervention {
  libelle: string;
  dateIntervention: string;
  ambulatoire: boolean;
  dateEntreePrevue: string;
  commentaires: string;
}

interface Allergie {
  type: string;
  presente: boolean;
  details: string;
}

interface AntecedentChirurgical {
  annee: string;
  intervention: string;
  typeAnesthesie: string;
  difficultes: string;
  cormack: string;
  technique: string;
}

interface FormData {
  patient: PatientInfo;
  intervention: Intervention;
  anamnese: string;
  allergies: {
    antibiotiques: Allergie;
    aspirineAINS: Allergie;
    autresMedicaments: Allergie;
    produitsContraste: Allergie;
    alimentaires: Allergie;
    latex: Allergie;
    autres: Allergie;
  };
  pyrosis: { presente: boolean; details: string };
  rgo: { presente: boolean; details: string };
  tabac: { presente: boolean; paquetsAnnees: string };
  tabagismePassif: boolean;
  hepatite: { presente: boolean; type: string; dateDecouverte: string; statut: string };
  alcool: { presente: boolean; details: string };
  activitesPhysiques: { 
    niveauActivite: string; 
    commentaires: string; 
  };
  cardiaques: {
    angorInstable: boolean;
    infarctusRecent: boolean;
    insuffisanceCardiaqueDecompensee: boolean;
    arythmieGrave: boolean;
    valvulopathieSevere: boolean;
    htaNonControlee: boolean;
    autres: boolean;
    autresDetails: string;
  };
  stimulateur: {
    presente: boolean;
    cardiopathie: string;
    dateImplantation: string;
    centreImplantation: string;
    dependance: string;
    marque: string;
    controleRecent: boolean;
  };
  hta: { presente: boolean; details: string };
  diabete: { presente: boolean; details: string };
  reins: { presente: boolean; details: string };
  hemostase: {
    saignementPostOp: boolean;
    hemorragieExtractionDentaire: boolean;
    hematurieInexpliquee: boolean;
    ecchymosesAnormales: boolean;
    maladieHepatiqueHematologique: boolean;
    epistaxis: boolean;
    menorragies: boolean;
    gingivorragies: boolean;
    antecedentsFamiliauxHemorrhagiques: boolean;
    anemieCarenceFer: boolean;
    transfusions: boolean;
  };
  stopBang: {
    ronflement: boolean;
    fatigue: boolean;
    apnee: boolean;
    pressionArterielle: boolean;
    imc: boolean;
    age: boolean;
    tourCou: boolean;
    sexe: boolean;
  };
  autres: string;
  hasAntecedentsChirurgicaux: boolean;
  antecedentsChirurgicaux: AntecedentChirurgical[];
  examenPhysique: {
    poids: string;
    taille: string;
    imc: string;
    fc: string;
    pa: string;
    spo2: string;
    temperature: string;
    examen: string;
  };
  parametresPhysiques: {
    poids: string;
    pertePoidsRecente: string;
    perteAppetit: string;
    taille: string;
    bmi: string;
    taSystolique: string;
    taDiastolique: string;
    pouls: string;
    frequenceRespiratoire: string;
    commentaires: string;
    debutPertePoids: string;
    poidsPerdu: string;
    pertePoidsVolontaire: string;
  };
  examen: {
    coeur: string;
    poumons: string;
    abdomen: string;
    membres: string;
    coeurCommentaire: string;
    poumonsCommentaire: string;
    abdomenCommentaire: string;
    membresCommentaire: string;
    varices: string;
    oedemes: string;
    douleursAutres: string;
    autres: string;
    autresCommentaire: string;
  };
  criteresIntubation: {
    mallampati: string;
    ouvertureBouche: string;
    morsureLevreSup: string;
    mobiliteTete: string;
    distanceThyroMenton: string;
    dentition: string;
  };
  scoreApfel: {
    femme: boolean;
    nonFumeur: boolean;
    atcdNVPO: boolean;
    atcdCinetose: boolean;
    opioidesPostop: boolean;
  };
  scoreLee: {
    chirurgieRisqueEleve: boolean;
    cardiopathieIschemique: boolean;
    insuffisanceCardiaque: boolean;
    atcdAVC: boolean;
    insulinotherapie: boolean;
    creatinine: boolean;
  };
  douleursPostop: {
    sexeFeminin: string;
    age: string;
    douleurPreopSite: string;
    usageOpiaces: string;
    usageAntidepresseurs: string;
    chirurgieTomie: string;
    typeChirurgie: string;
    chirurgieLongueDuree: string;
    obesiteImportante: string;
    patientTresAnxieux: string;
    totalScore: number;
    risqueDouleursSeveres: string;
  };
  medicaments: string;
  examensParacliniques: {
    biologie: string;
    biologieCommentaire: string;
    hemostase: string;
    hemostaseCommentaire: string;
    groupeSanguin: string;
    groupeSanguinCommentaire: string;
    ecgRepos: string;
    ecgReposCommentaire: string;
    rxThorax: string;
    rxThoraxCommentaire: string;
    efr: string;
    efrCommentaire: string;
    testEffort: string;
    testEffortCommentaire: string;
    autres: string;
    autresCommentaire: string;
    commentaires: string;
  };
  avisSpecialises: {
    avisDemandes: string;
    commentaires: string;
  };
  checklistHDJ: {
    asa3MalEquilibre: string;
    conduitVehicule: string;
    rentreSeul: string;
    nonAccompagneNuit: string;
    plus75Ans: string;
    douleurNonControllable: string;
    saignementImportant: string;
    admissionHospiDay: string;
    commentaire: string;
  };
  conclusion: {
    scoreASA: string;
    typeAnesthesie: string;
    adaptationTraitement: string;
    consentement: string;
    validation: string;
    complements: string;
    texte: string;
  };
}

export default function PreAnesthesiaForm({ 
  onBackToList, 
  onCreateNew, 
  onSelectPatient,
  patientData,
  editMode = true
}: {
  onBackToList?: () => void;
  onCreateNew?: () => void;
  onSelectPatient?: (patientNumber: string) => void;
  patientData?: any;
  editMode?: boolean;
}) {
  const [savedMessage, setSavedMessage] = useState<string>('');
  const [currentView, setCurrentView] = useState<'form' | 'list'>('list');
  const [selectedPatientNumber, setSelectedPatientNumber] = useState<string>('');
  
  // Charger les données du patient si fournies
  useEffect(() => {
    console.log('=== PreAnesthesiaForm useEffect DEBUG ===');
    console.log('patientData:', patientData);
    console.log('patientData type:', typeof patientData);
    console.log('patientData keys:', patientData ? Object.keys(patientData) : 'patientData is null/undefined');
    console.log('editMode:', editMode);
    
    if (patientData) {
      console.log('patientData.data:', patientData.data);
      console.log('patientData.data type:', typeof patientData.data);
      console.log('patientData.patient_number:', patientData.patient_number);
      
      if (patientData.data) {
        console.log('Setting formData with patientData.data');
        setFormData(patientData.data);
        setSelectedPatientNumber(String(patientData.patient_number || ''));
        setCurrentView('form');
      } else {
        console.error('❌ patientData.data is undefined or null');
        console.log('Available keys in patientData:', Object.keys(patientData));
      }
    } else {
      console.log('❌ patientData is null or undefined');
    }
    console.log('=== END DEBUG ===');
  }, [patientData]);

  // Fonction utilitaire pour les propriétés des champs selon le mode
  const getFieldProps = () => ({
    readOnly: !editMode,
    className: `w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none ${
      editMode 
        ? 'focus:ring-2 focus:ring-[#0ea5e9] bg-white' 
        : 'bg-gray-50 cursor-not-allowed'
    }`
  });
  
  const initialFormData: FormData = {
    patient: {
      nom: '',
      prenom: '',
      numeroIdentification: '',
      dateNaissance: '',
      age: 0,
      dateConsultation: new Date().toISOString().split('T')[0],
    },
    intervention: {
      libelle: '',
      dateIntervention: '',
      ambulatoire: false,
      dateEntreePrevue: '',
      commentaires: '',
    },
    anamnese: '',
    allergies: {
      antibiotiques: { type: 'Antibiotiques', presente: false, details: '' },
      aspirineAINS: { type: 'Aspirine/AINS', presente: false, details: '' },
      autresMedicaments: { type: 'Autres médicaments', presente: false, details: '' },
      produitsContraste: { type: 'Produits de contraste iodés', presente: false, details: '' },
      alimentaires: { type: 'Alimentaires', presente: false, details: '' },
      latex: { type: 'Latex', presente: false, details: '' },
      autres: { type: 'Autres', presente: false, details: '' },
    },
    pyrosis: { presente: false, details: '' },
    rgo: { presente: false, details: '' },
    tabac: { presente: false, paquetsAnnees: '' },
    tabagismePassif: false,
    hepatite: { presente: false, type: '', dateDecouverte: '', statut: '' },
    alcool: { presente: false, details: '' },
    activitesPhysiques: { niveauActivite: '', commentaires: '' },
    cardiaques: {
      angorInstable: false,
      infarctusRecent: false,
      insuffisanceCardiaqueDecompensee: false,
      arythmieGrave: false,
      valvulopathieSevere: false,
      htaNonControlee: false,
      autres: false,
      autresDetails: '',
    },
    stimulateur: {
      presente: false,
      cardiopathie: '',
      dateImplantation: '',
      centreImplantation: '',
      dependance: '',
      marque: '',
      controleRecent: false,
    },
    hta: { presente: false, details: '' },
    diabete: { presente: false, details: '' },
    reins: { presente: false, details: '' },
    hemostase: {
      saignementPostOp: false,
      hemorragieExtractionDentaire: false,
      hematurieInexpliquee: false,
      ecchymosesAnormales: false,
      maladieHepatiqueHematologique: false,
      epistaxis: false,
      menorragies: false,
      gingivorragies: false,
      antecedentsFamiliauxHemorrhagiques: false,
      anemieCarenceFer: false,
      transfusions: false,
    },
    stopBang: {
      ronflement: false,
      fatigue: false,
      apnee: false,
      pressionArterielle: false,
      imc: false,
      age: false,
      tourCou: false,
      sexe: false,
    },
    autres: '',
    hasAntecedentsChirurgicaux: false,
    antecedentsChirurgicaux: [],
    examenPhysique: {
      poids: '',
      taille: '',
      imc: '',
      fc: '',
      pa: '',
      spo2: '',
      temperature: '',
      examen: '',
    },
    parametresPhysiques: {
      poids: '',
      pertePoidsRecente: '',
      perteAppetit: '',
      taille: '',
      bmi: '',
      taSystolique: '',
      taDiastolique: '',
      pouls: '',
      frequenceRespiratoire: '',
      commentaires: '',
      debutPertePoids: '',
      poidsPerdu: '',
      pertePoidsVolontaire: '',
    },
    examen: {
      coeur: '',
      poumons: '',
      abdomen: '',
      membres: '',
      coeurCommentaire: '',
      poumonsCommentaire: '',
      abdomenCommentaire: '',
      membresCommentaire: '',
      varices: '',
      oedemes: '',
      douleursAutres: '',
      autres: '',
      autresCommentaire: '',
    },
    criteresIntubation: {
      mallampati: '',
      ouvertureBouche: '',
      morsureLevreSup: '',
      mobiliteTete: '',
      distanceThyroMenton: '',
      dentition: '',
    },
    scoreApfel: {
      femme: false,
      nonFumeur: false,
      atcdNVPO: false,
      atcdCinetose: false,
      opioidesPostop: false,
    },
    scoreLee: {
      chirurgieRisqueEleve: false,
      cardiopathieIschemique: false,
      insuffisanceCardiaque: false,
      atcdAVC: false,
      insulinotherapie: false,
      creatinine: false,
    },
    douleursPostop: {
      sexeFeminin: '',
      age: '',
      douleurPreopSite: '',
      usageOpiaces: '',
      usageAntidepresseurs: '',
      chirurgieTomie: '',
      typeChirurgie: '',
      chirurgieLongueDuree: '',
      obesiteImportante: '',
      patientTresAnxieux: '',
      totalScore: 0,
      risqueDouleursSeveres: '',
    },
    medicaments: '',
    examensParacliniques: {
      biologie: '',
      biologieCommentaire: '',
      hemostase: '',
      hemostaseCommentaire: '',
      groupeSanguin: '',
      groupeSanguinCommentaire: '',
      ecgRepos: '',
      ecgReposCommentaire: '',
      rxThorax: '',
      rxThoraxCommentaire: '',
      efr: '',
      efrCommentaire: '',
      testEffort: '',
      testEffortCommentaire: '',
      autres: '',
      autresCommentaire: '',
      commentaires: '',
    },
    avisSpecialises: {
      avisDemandes: '',
      commentaires: '',
    },
    checklistHDJ: {
      asa3MalEquilibre: '',
      conduitVehicule: '',
      rentreSeul: '',
      nonAccompagneNuit: '',
      plus75Ans: '',
      douleurNonControllable: '',
      saignementImportant: '',
      admissionHospiDay: '',
      commentaire: '',
    },
    conclusion: {
      scoreASA: '',
      typeAnesthesie: '',
      adaptationTraitement: '',
      consentement: '',
      validation: '',
      complements: '',
      texte: '',
    },
  };

  // Calcule automatiquement le statut d'admission HospiDay à partir de la checklist
  const computeAdmissionHospiDay = (c: FormData['checklistHDJ']): string => {
    if (!c) return '';
    // Utilise le score STOP-BANG au lieu de la valeur manuelle apneesSommeil
    const apneesSommeilRisk = calculateStopBangScore() >= 3 ? 'Oui' : 'Non';
    const strongCriteriaYesCount = [
      c.asa3MalEquilibre,
      apneesSommeilRisk,
      c.saignementImportant,
    ].filter((v) => v === 'Oui').length;

    const otherCriteriaYesCount = [
      c.nonAccompagneNuit,
      c.plus75Ans,
      c.douleurNonControllable,
      c.rentreSeul,
      c.conduitVehicule,
    ].filter((v) => v === 'Oui').length;

    if (strongCriteriaYesCount >= 1 || otherCriteriaYesCount >= 2) {
      return 'Non admis';
    }
    if (otherCriteriaYesCount === 1) {
      return 'À évaluer';
    }
    return 'Admis';
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Met à jour automatiquement admissionHospiDay lorsque la checklist change
  useEffect(() => {
    const c = formData.checklistHDJ;
    if (!c) return;
    const computed = computeAdmissionHospiDay(c);
    if (c.admissionHospiDay !== computed) {
      setFormData({
        ...formData,
        checklistHDJ: { ...(formData.checklistHDJ || {}), admissionHospiDay: computed },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.checklistHDJ.asa3MalEquilibre,
    formData.checklistHDJ.conduitVehicule,
    formData.checklistHDJ.rentreSeul,
    formData.checklistHDJ.nonAccompagneNuit,
    formData.checklistHDJ.plus75Ans,
    formData.checklistHDJ.douleurNonControllable,
    formData.checklistHDJ.saignementImportant,
    // Ajouter les champs STOP-BANG pour le calcul automatique des apnées
    formData.stopBang.ronflement,
    formData.stopBang.fatigue,
    formData.stopBang.apnee,
    formData.stopBang.pressionArterielle,
    formData.stopBang.imc,
    formData.stopBang.age,
    formData.stopBang.tourCou,
    formData.stopBang.sexe,
  ]);

  // Met à jour automatiquement le risque de douleurs postopératoires sévères selon le score
  useEffect(() => {
    const d = formData.douleursPostop;
    if (!d) return;
    let score = 0;
    if (d.sexeFeminin === 'Oui') score += 1;
    if (d.age === '< 30 ans' || d.age === '> 65 ans') score += 1;
    if (d.douleurPreopSite === 'Oui') score += 2;
    if (d.usageOpiaces === 'Oui') score += 2;
    if (d.usageAntidepresseurs === 'Oui') score += 1;
    if (d.chirurgieTomie === 'Oui') score += 2;
    if (d.typeChirurgie === 'Orthopédique' || d.typeChirurgie === 'Thoracique') score += 1;
    if (d.chirurgieLongueDuree === 'Oui') score += 1;
    if (d.obesiteImportante === 'Oui') score += 1;
    if (d.patientTresAnxieux === 'Oui') score += 2;

    const risk = score > 4 ? 'Oui' : 'Non';
    if (d.risqueDouleursSeveres !== risk) {
      setFormData({
        ...formData,
        douleursPostop: { ...d, risqueDouleursSeveres: risk, totalScore: score },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.douleursPostop.sexeFeminin,
    formData.douleursPostop.age,
    formData.douleursPostop.douleurPreopSite,
    formData.douleursPostop.usageOpiaces,
    formData.douleursPostop.usageAntidepresseurs,
    formData.douleursPostop.chirurgieTomie,
    formData.douleursPostop.typeChirurgie,
    formData.douleursPostop.chirurgieLongueDuree,
    formData.douleursPostop.obesiteImportante,
    formData.douleursPostop.patientTresAnxieux,
  ]);

  // Calcul automatique du BMI = poids (kg) / (taille (m))^2
  useEffect(() => {
    const params = formData.parametresPhysiques;
    if (!params) return;
    const weightKg = parseFloat(params.poids);
    const heightCm = parseFloat(params.taille);
    let bmi = '';
    if (!isNaN(weightKg) && weightKg > 0 && !isNaN(heightCm) && heightCm > 0) {
      const heightM = heightCm / 100;
      const computed = weightKg / (heightM * heightM);
      if (isFinite(computed)) {
        bmi = computed.toFixed(1);
      }
    }
    if ((params.bmi || '') !== bmi) {
      setFormData({
        ...formData,
        parametresPhysiques: { ...(params || {}), bmi },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.parametresPhysiques.poids, formData.parametresPhysiques.taille]);

  // Charger les données depuis Supabase quand un patient est sélectionné
  useEffect(() => {
    const load = async () => {
      if (!selectedPatientNumber) return;
      
      try {
        const { data, error } = await supabase
          .from('preanesthesia_forms')
          .select('data')
          .eq('patient_number', selectedPatientNumber)
          .maybeSingle();
        if (error) throw error;
        if (data?.data) setFormData(data.data);
      } catch (error) {
        console.error('Erreur lors du chargement Supabase:', error);
      }
    };
    load();
  }, [selectedPatientNumber]);

  // Sauvegarder automatiquement vers Supabase (debounce)
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const patientNumber = formData.patient?.numeroIdentification?.trim();
        if (!patientNumber) return;
        
        // Vérifier si l'enregistrement existe déjà
        const { data: existingRecord } = await supabase
          .from('consultation_preanesthesique')
          .select('id')
          .eq('patient_number', patientNumber)
          .single();
        
        if (existingRecord) {
          // Mettre à jour l'enregistrement existant
          const { error } = await supabase
            .from('consultation_preanesthesique')
            .update({ data: formData })
            .eq('patient_number', patientNumber);
          
          if (error) throw error;
        } else {
          // Créer un nouvel enregistrement
          const payload = { 
        patient_number: patientNumber, 
        data: formData
      };
          const { error } = await supabase
            .from('consultation_preanesthesique')
            .insert(payload);
          
          if (error) throw error;
        }
      } catch (error) {
        console.error('Autosave Supabase error:', error);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [formData]);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Fonction de calcul IMC (utilisée dans le useEffect)
  const calculateIMC = (poids: string, taille: string) => {
    const p = parseFloat(poids);
    const t = parseFloat(taille) / 100;
    if (p && t) {
      return (p / (t * t)).toFixed(1);
    }
    return '';
  };

  const calculateStopBangScore = () => {
    const score = Object.values(formData.stopBang).filter(v => v).length;
    return score;
  };

  const calculateApfelScore = () => {
    return Object.values(formData.scoreApfel).filter(v => v).length;
  };

  const calculateLeeScore = () => {
    return Object.values(formData.scoreLee).filter(v => v).length;
  };

  const calculateDouleursPostopScore = () => {
    let score = 0;
    
    // Sexe féminin (1 point)
    if (formData.douleursPostop?.sexeFeminin === 'Oui') score += 1;
    
    // Âge (1 point si < 30 ans ou > 65 ans)
    if (formData.douleursPostop?.age === '< 30 ans' || formData.douleursPostop?.age === '> 65 ans') score += 1;
    
    // Douleur préopératoire (2 points)
    if (formData.douleursPostop?.douleurPreopSite === 'Oui') score += 2;
    
    // Usage régulier d'opiacés (2 points)
    if (formData.douleursPostop?.usageOpiaces === 'Oui') score += 2;
    
    // Usage régulier d'antidépresseurs/anxiolytiques (1 point)
    if (formData.douleursPostop?.usageAntidepresseurs === 'Oui') score += 1;
    
    // Chirurgie par tomie (2 points)
    if (formData.douleursPostop?.chirurgieTomie === 'Oui') score += 2;
    
    // Type de chirurgie (1 point si orthopédique ou thoracique)
    if (formData.douleursPostop?.typeChirurgie === 'Orthopédique' || formData.douleursPostop?.typeChirurgie === 'Thoracique') score += 1;
    
    // Chirurgie de longue durée (1 point)
    if (formData.douleursPostop?.chirurgieLongueDuree === 'Oui') score += 1;
    
    // Obésité importante (1 point)
    if (formData.douleursPostop?.obesiteImportante === 'Oui') score += 1;
    
    // Patient très anxieux (2 points)
    if (formData.douleursPostop?.patientTresAnxieux === 'Oui') score += 2;
    
    return score;
  };

  const addAntecedentChirurgical = () => {
    setFormData({
      ...formData,
      antecedentsChirurgicaux: [
        ...formData.antecedentsChirurgicaux,
        { annee: '', intervention: '', typeAnesthesie: '', difficultes: '', cormack: '', technique: '' },
      ],
    });
  };

  const removeAntecedentChirurgical = (index: number) => {
    setFormData({
      ...formData,
      antecedentsChirurgicaux: formData.antecedentsChirurgicaux.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    console.log('handleSave appelé');
    try {
      const patientNumber = formData.patient?.numeroIdentification?.trim();
      console.log('Numéro patient:', patientNumber);
      
      if (!patientNumber) {
        alert("Veuillez renseigner le numéro d'identification du patient pour sauvegarder.");
        return;
      }
      
      console.log('Test de connexion Supabase...');
      
      // Test simple de connexion
      const { data: testData, error: testError } = await supabase
        .from('consultation_preanesthesique')
        .select('count')
        .limit(1);
        
      if (testError) {
        console.error('Erreur de test Supabase:', testError);
        alert('Erreur de connexion Supabase: ' + testError.message);
        return;
      }
      
      console.log('Connexion Supabase OK, testData:', testData);
      
      console.log('Tentative de sauvegarde vers Supabase...');
      const payload = { 
        patient_number: patientNumber, 
        data: formData
      };
      console.log('Payload:', payload);
      
      // Vérifier si l'enregistrement existe déjà
      const { data: existingRecord } = await supabase
        .from('consultation_preanesthesique')
        .select('id')
        .eq('patient_number', patientNumber)
        .single();
      
      if (existingRecord) {
        // Mettre à jour l'enregistrement existant
        const { error } = await supabase
          .from('consultation_preanesthesique')
          .update({ data: formData })
          .eq('patient_number', patientNumber);
        
        if (error) throw error;
        console.log('Enregistrement mis à jour');
      } else {
        // Créer un nouvel enregistrement
        const { error } = await supabase
          .from('consultation_preanesthesique')
          .insert(payload);
        
        if (error) throw error;
        console.log('Nouvel enregistrement créé');
      }
      setSavedMessage('✓ Données sauvegardées sur Supabase');
      setTimeout(() => setSavedMessage(''), 5000);
    } catch (e: any) {
      console.error('Erreur dans handleSave:', e);
      alert('Erreur lors de la sauvegarde Supabase: ' + (e?.message || e));
    }
  };

  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire ? Toutes les données seront perdues.')) {
      setFormData(initialFormData);
      localStorage.removeItem('preAnesthesiaFormData');
      setSavedMessage('✓ Formulaire réinitialisé');
      setTimeout(() => setSavedMessage(''), 3000);
    }
  };

  const handlePrint = () => {
    // Créer une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Générer le contenu HTML pour l'impression
    const printContent = generatePrintContent();
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Consultation Pré-Anesthésique - ${formData.patient?.nom || ''} ${formData.patient?.prenom || ''}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1e3a8a; padding-bottom: 15px; }
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
            @media print { body { margin: 0; } }
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
    const { patient, intervention, anamnese, allergies, examenPhysique, examensParacliniques } = formData;
    
    return `
      <div class="header">
        <h1>CONSULTATION PRÉ-ANESTHÉSIQUE</h1>
        <h2>Centre Diagnostic de Libreville</h2>
        <p>Date: ${formData.patient?.dateConsultation || new Date().toLocaleDateString('fr-FR')}</p>
      </div>

      <div class="patient-info">
        <div class="section-title">INFORMATIONS PATIENT</div>
        <div class="field"><span class="field-label">Nom:</span> <span class="field-value">${patient?.nom || ''}</span></div>
        <div class="field"><span class="field-label">Prénom:</span> <span class="field-value">${patient?.prenom || ''}</span></div>
        <div class="field"><span class="field-label">Date de naissance:</span> <span class="field-value">${patient?.dateNaissance || ''}</span></div>
        <div class="field"><span class="field-label">Âge:</span> <span class="field-value">${patient?.age || ''} ans</span></div>
        <div class="field"><span class="field-label">N° Identification:</span> <span class="field-value">${patient?.numeroIdentification || ''}</span></div>
      </div>

      <div class="section">
        <div class="section-title">INTERVENTION PRÉVUE</div>
        <div class="field"><span class="field-label">Libellé:</span> <span class="field-value">${intervention?.libelle || ''}</span></div>
        <div class="field"><span class="field-label">Date:</span> <span class="field-value">${intervention?.dateIntervention || ''}</span></div>
        <div class="field"><span class="field-label">Ambulatoire:</span> <span class="field-value">${intervention?.ambulatoire ? 'Oui' : 'Non'}</span></div>
        <div class="field"><span class="field-label">Date entrée prévue:</span> <span class="field-value">${intervention?.dateEntreePrevue || ''}</span></div>
      </div>

      <div class="section">
        <div class="section-title">ANAMNÈSE</div>
        <div class="field-value">${anamnese || 'Non renseigné'}</div>
      </div>

      <div class="section">
        <div class="section-title">ALLERGIES</div>
        <div class="field"><span class="field-label">Antibiotiques:</span> <span class="field-value">${allergies?.antibiotiques?.presente ? 'Oui' : 'Non'}</span></div>
        <div class="field"><span class="field-label">Aspirine/AINS:</span> <span class="field-value">${allergies?.aspirineAINS?.presente ? 'Oui' : 'Non'}</span></div>
        <div class="field"><span class="field-label">Latex:</span> <span class="field-value">${allergies?.latex?.presente ? 'Oui' : 'Non'}</span></div>
        <div class="field"><span class="field-label">Autres:</span> <span class="field-value">${allergies?.autres?.presente ? 'Oui' : 'Non'}</span></div>
      </div>

      <div class="section">
        <div class="section-title">EXAMEN PHYSIQUE</div>
        <div class="field"><span class="field-label">Poids:</span> <span class="field-value">${examenPhysique?.poids || ''} kg</span></div>
        <div class="field"><span class="field-label">Taille:</span> <span class="field-value">${examenPhysique?.taille || ''} cm</span></div>
        <div class="field"><span class="field-label">IMC:</span> <span class="field-value">${examenPhysique?.imc || ''}</span></div>
        <div class="field"><span class="field-label">FC:</span> <span class="field-value">${examenPhysique?.fc || ''} bpm</span></div>
        <div class="field"><span class="field-label">PA:</span> <span class="field-value">${examenPhysique?.pa || ''} mmHg</span></div>
        <div class="field"><span class="field-label">SpO2:</span> <span class="field-value">${examenPhysique?.spo2 || ''}%</span></div>
      </div>

      <div class="section">
        <div class="section-title">EXAMENS PARA-CLINIQUES</div>
        <div class="field"><span class="field-label">Biologie:</span> <span class="field-value">${examensParacliniques?.biologie || 'Non renseigné'}</span></div>
        <div class="field"><span class="field-label">ECG:</span> <span class="field-value">${examensParacliniques?.ecgRepos || 'Non renseigné'}</span></div>
        <div class="field"><span class="field-label">RX Thorax:</span> <span class="field-value">${examensParacliniques?.rxThorax || 'Non renseigné'}</span></div>
        <div class="field"><span class="field-label">Groupe sanguin:</span> <span class="field-value">${examensParacliniques?.groupeSanguin || 'Non renseigné'}</span></div>
      </div>

      <div class="signature-section">
        <div class="section-title">SIGNATURE</div>
        <div class="signature-line">
          <div class="field"><span class="field-label">Nom du médecin:</span> <span class="field-value">_______________________</span></div>
          <div class="field"><span class="field-label">Signature:</span> <span class="field-value">_______________________</span></div>
          <div class="field"><span class="field-label">Date:</span> <span class="field-value">${new Date().toLocaleDateString('fr-FR')}</span></div>
        </div>
      </div>
    `;
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

  const handleSelectPatient = (patientNumber: string) => {
    setSelectedPatientNumber(patientNumber);
    setCurrentView('form');
    onSelectPatient?.(patientNumber);
  };

  const handleCreateNew = () => {
    setSelectedPatientNumber('');
    setFormData(initialFormData);
    setCurrentView('form');
    onCreateNew?.();
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedPatientNumber('');
    onBackToList?.();
  };

  // Si on est en mode liste, afficher la liste des patients
  if (currentView === 'list') {
    return <PatientList onSelectPatient={handleSelectPatient} onCreateNew={handleCreateNew} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="no-print mb-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <img 
              src="https://res.cloudinary.com/dd64mwkl2/image/upload/v1758286702/Centre_Diagnostic-Logo_xhxxpv.png" 
              alt="Centre Diagnostic de Libreville" 
              className="h-16 w-auto"
            />
            <div>
              <h1 className="text-3xl font-bold text-[#1e3a8a]">Formulaire de Consultation Pré-Anesthésique</h1>
              {selectedPatientNumber && (
                <p className="text-sm text-gray-600 mt-1">
                  Patient: {String(selectedPatientNumber)}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBackToList}
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
          </div>
        </div>
        
        {savedMessage && (
          <div className="no-print mb-4 p-3 bg-green-100 text-green-800 rounded-md text-center">
            {savedMessage}
          </div>
        )}

        <section className="mb-8">
          <div className="print-only text-center mb-8">
            <div className="flex items-center justify-center gap-6 mb-4">
              <img 
                src="https://res.cloudinary.com/dd64mwkl2/image/upload/v1758286702/Centre_Diagnostic-Logo_xhxxpv.png" 
                alt="Centre Diagnostic de Libreville" 
                className="h-14 w-auto"
              />
            </div>
            <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Formulaire de Consultation Pré-Anesthésique</h1>
          </div>
        </section>

        {/* Informations Patient */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#1e3a8a] border-b-2 border-[#0ea5e9] pb-2 mb-4">
            Informations Patient
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                {...getFieldProps()}
                value={formData.patient?.nom || ''}
                onChange={(e) => setFormData({ ...formData, patient: { ...(formData.patient || {}), nom: e.target.value } })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                type="text"
                {...getFieldProps()}
                value={formData.patient?.prenom || ''}
                onChange={(e) => setFormData({ ...formData, patient: { ...(formData.patient || {}), prenom: e.target.value } })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro d'identification</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                value={formData.patient?.numeroIdentification || ''}
                onChange={(e) => setFormData({ ...formData, patient: { ...(formData.patient || {}), numeroIdentification: e.target.value } })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                value={formData.patient?.dateNaissance || ''}
                onChange={(e) => {
                  const age = calculateAge(e.target.value);
                  setFormData({ ...formData, patient: { ...(formData.patient || {}), dateNaissance: e.target.value, age } });
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Âge</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                value={formData.patient?.age || ''}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de consultation</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                value={formData.patient?.dateConsultation || ''}
                onChange={(e) => setFormData({ ...formData, patient: { ...(formData.patient || {}), dateConsultation: e.target.value } })}
              />
            </div>
          </div>
        </section>

        {/* Intervention */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#1e3a8a] border-b-2 border-[#0ea5e9] pb-2 mb-4">
            Intervention
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Libellé</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                value={formData.intervention?.libelle || ''}
                onChange={(e) => setFormData({ ...formData, intervention: { ...(formData.intervention || {}), libelle: e.target.value } })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de l'intervention</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  value={formData.intervention?.dateIntervention || ''}
                  onChange={(e) => setFormData({ ...formData, intervention: { ...formData.intervention, dateIntervention: e.target.value } })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date d'entrée prévue</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  value={formData.intervention?.dateEntreePrevue || ''}
                  onChange={(e) => setFormData({ ...formData, intervention: { ...formData.intervention, dateEntreePrevue: e.target.value } })}
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={formData.intervention.ambulatoire}
                onChange={(e) => setFormData({ ...formData, intervention: { ...formData.intervention, ambulatoire: e.target.checked } })}
              />
              <label className="ml-2 text-sm font-medium text-gray-700">Ambulatoire</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commentaires</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                rows={3}
                value={formData.intervention?.commentaires || ''}
                onChange={(e) => setFormData({ ...formData, intervention: { ...formData.intervention, commentaires: e.target.value } })}
              />
            </div>
          </div>
        </section>

        {/* Anamnèse brève */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#1e3a8a] border-b-2 border-[#0ea5e9] pb-2 mb-4">
            Anamnèse brève
          </h2>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={formData.anamnese}
            onChange={(e) => setFormData({ ...formData, anamnese: e.target.value })}
          />
        </section>

        {/* Antécédents médicaux - Allergies */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#1e3a8a] border-b-2 border-[#0ea5e9] pb-2 mb-4">
            Antécédents Médicaux
          </h2>
          
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Allergies</h3>
          {Object.entries(formData.allergies).map(([key, allergie]) => (
            <div key={key} className="mb-4 p-4 bg-gray-50 rounded-md">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#0ea5e9] border-gray-300 rounded focus:ring-[#0ea5e9]"
                  checked={allergie.presente}
                  onChange={(e) => setFormData({
                    ...formData,
                    allergies: {
                      ...formData.allergies,
                      [key]: { ...allergie, presente: e.target.checked }
                    }
                  })}
                />
                <label className="ml-2 text-sm font-medium text-gray-700">{allergie.type}</label>
              </div>
              {allergie.presente && (
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  placeholder="Détails (nom, date, voie d'administration, type de réaction...)"
                  rows={2}
                  value={allergie.details}
                  onChange={(e) => setFormData({
                    ...formData,
                    allergies: {
                      ...formData.allergies,
                      [key]: { ...allergie, details: e.target.value }
                    }
                  })}
                />
              )}
            </div>
          ))}

          {/* Autres antécédents */}
          <div className="space-y-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#0ea5e9] border-gray-300 rounded focus:ring-[#0ea5e9]"
                  checked={formData.pyrosis.presente}
                  onChange={(e) => setFormData({ ...formData, pyrosis: { ...formData.pyrosis, presente: e.target.checked } })}
                />
                <label className="ml-2 text-sm font-medium text-gray-700">Pyrosis</label>
              </div>
              {formData.pyrosis.presente && (
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  placeholder="Depuis quand, traitement..."
                  rows={2}
                  value={formData.pyrosis?.details || ''}
                  onChange={(e) => setFormData({ ...formData, pyrosis: { ...formData.pyrosis, details: e.target.value } })}
                />
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-md">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#0ea5e9] border-gray-300 rounded focus:ring-[#0ea5e9]"
                  checked={formData.rgo.presente}
                  onChange={(e) => setFormData({ ...formData, rgo: { ...formData.rgo, presente: e.target.checked } })}
                />
                <label className="ml-2 text-sm font-medium text-gray-700">RGO</label>
              </div>
              {formData.rgo.presente && (
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  placeholder="Depuis quand, fibroscopie, traitement..."
                  rows={2}
                  value={formData.rgo?.details || ''}
                  onChange={(e) => setFormData({ ...formData, rgo: { ...formData.rgo, details: e.target.value } })}
                />
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-md">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#0ea5e9] border-gray-300 rounded focus:ring-[#0ea5e9]"
                  checked={formData.tabac.presente}
                  onChange={(e) => setFormData({ ...formData, tabac: { ...formData.tabac, presente: e.target.checked } })}
                />
                <label className="ml-2 text-sm font-medium text-gray-700">Tabac</label>
              </div>
              {formData.tabac.presente && (
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  placeholder="Nombre de paquets-années"
                  value={formData.tabac?.paquetsAnnees || ''}
                  onChange={(e) => setFormData({ ...formData, tabac: { ...formData.tabac, paquetsAnnees: e.target.value } })}
                />
              )}
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-md">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={formData.tabagismePassif}
                onChange={(e) => setFormData({ ...formData, tabagismePassif: e.target.checked })}
              />
              <label className="ml-2 text-sm font-medium text-gray-700">Tabagisme passif</label>
            </div>

            <div className="p-4 bg-gray-50 rounded-md">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#0ea5e9] border-gray-300 rounded focus:ring-[#0ea5e9]"
                  checked={formData.hepatite.presente}
                  onChange={(e) => setFormData({ ...formData, hepatite: { ...formData.hepatite, presente: e.target.checked } })}
                />
                <label className="ml-2 text-sm font-medium text-gray-700">Hépatite</label>
              </div>
              {formData.hepatite.presente && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type"
                    value={formData.hepatite?.type || ''}
                    onChange={(e) => setFormData({ ...formData, hepatite: { ...formData.hepatite, type: e.target.value } })}
                  />
                  <input
                    type="date"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Date de découverte"
                    value={formData.hepatite?.dateDecouverte || ''}
                    onChange={(e) => setFormData({ ...formData, hepatite: { ...formData.hepatite, dateDecouverte: e.target.value } })}
                  />
                  <input
                    type="text"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Statut"
                    value={formData.hepatite?.statut || ''}
                    onChange={(e) => setFormData({ ...formData, hepatite: { ...formData.hepatite, statut: e.target.value } })}
                  />
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-md">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#0ea5e9] border-gray-300 rounded focus:ring-[#0ea5e9]"
                  checked={formData.alcool.presente}
                  onChange={(e) => setFormData({ ...formData, alcool: { ...formData.alcool, presente: e.target.checked } })}
                />
                <label className="ml-2 text-sm font-medium text-gray-700">Alcool</label>
              </div>
              {formData.alcool.presente && (
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  placeholder="Détails..."
                  rows={2}
                  value={formData.alcool?.details || ''}
                  onChange={(e) => setFormData({ ...formData, alcool: { ...formData.alcool, details: e.target.value } })}
                />
              )}
            </div>

       {/* Section Activités physiques */}
            <div className="p-4 bg-gray-50 rounded-md">
         <h4 className="text-md font-semibold text-[#1e3a8a] mb-4 underline">Activités physiques :</h4>
         
         {/* Instructions */}
         <div className="mb-4">
           <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
             <li>A définir en équivalent métabolique (MET)</li>
             <li>Ou en explicitant les activités du patient</li>
           </ul>
         </div>

         {/* Tableau détaillé des MET */}
         <div className="mb-6">
           <h5 className="text-sm font-semibold text-gray-700 mb-3">Activité physique</h5>
           <div className="overflow-x-auto">
             <table className="w-full border-collapse border border-gray-300 text-sm">
               <thead>
                 <tr className="bg-gray-100">
                   <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Activité physique</th>
                   <th className="border border-gray-300 px-3 py-2 text-center font-semibold">MET</th>
                 </tr>
               </thead>
               <tbody>
                 {/* Activités physiques d'intensité légère (< 3 MET) */}
                 <tr className="bg-blue-50">
                   <td className="border border-gray-300 px-3 py-1 font-medium text-blue-800" colSpan={2}>
                     Activités physiques d'intensité légère (&lt; 3 MET)
                   </td>
                 </tr>
                 <tr>
                   <td className="border border-gray-300 px-3 py-2">Dormir</td>
                   <td className="border border-gray-300 px-3 py-2 text-center">0.9</td>
                 </tr>
                 <tr className="bg-gray-50">
                   <td className="border border-gray-300 px-3 py-2">Regarder la télévision</td>
                   <td className="border border-gray-300 px-3 py-2 text-center">1.0</td>
                 </tr>
                 <tr>
                   <td className="border border-gray-300 px-3 py-2">Écrire à la main ou à l'ordinateur</td>
                   <td className="border border-gray-300 px-3 py-2 text-center">1.8</td>
                 </tr>
                 <tr className="bg-gray-50">
                   <td className="border border-gray-300 px-3 py-2">Marche à 2,7 km/h, sans pente</td>
                   <td className="border border-gray-300 px-3 py-2 text-center">2.3</td>
                 </tr>
                 <tr>
                   <td className="border border-gray-300 px-3 py-2">Marche à 4 km/h</td>
                   <td className="border border-gray-300 px-3 py-2 text-center">2.9</td>
                 </tr>

                 {/* Activités physiques d'intensité modérée (3 à 6 MET) */}
                 <tr className="bg-green-50">
                   <td className="border border-gray-300 px-3 py-1 font-medium text-green-800" colSpan={2}>
                     Activités physiques d'intensité modérée (3 à 6 MET)
                   </td>
                 </tr>
                 <tr>
                   <td className="border border-gray-300 px-3 py-2">Vélo stationnaire, 50 W, effort très léger</td>
                   <td className="border border-gray-300 px-3 py-2 text-center">3.0</td>
                 </tr>
                 <tr className="bg-gray-50">
                   <td className="border border-gray-300 px-3 py-2">Marche à 4,8 km/h</td>
                   <td className="border border-gray-300 px-3 py-2 text-center">3.3</td>
                 </tr>
                 <tr>
                   <td className="border border-gray-300 px-3 py-2">Exercices à la maison (général), effort léger ou modéré</td>
                   <td className="border border-gray-300 px-3 py-2 text-center">3.5</td>
                 </tr>
                 <tr className="bg-gray-50">
                   <td className="border border-gray-300 px-3 py-2">Marche à 5,4 km/h</td>
                   <td className="border border-gray-300 px-3 py-2 text-center">3.6</td>
                 </tr>
                 <tr>
                   <td className="border border-gray-300 px-3 py-2">Vélo de plaisance, &lt;16 km/h</td>
                   <td className="border border-gray-300 px-3 py-2 text-center">4.0</td>
                 </tr>
                 <tr className="bg-gray-50">
                   <td className="border border-gray-300 px-3 py-2">Vélo stationnaire, 100 W, effort léger</td>
                   <td className="border border-gray-300 px-3 py-2 text-center">5.5</td>
                 </tr>

                 {/* Activités physiques intenses (> 6 MET) */}
                 <tr className="bg-orange-50">
                   <td className="border border-gray-300 px-3 py-1 font-medium text-orange-800" colSpan={2}>
                     Activités physiques intenses (&gt; 6 MET)
                   </td>
                 </tr>
                 <tr>
                   <td className="border border-gray-300 px-3 py-2">Course à pied, général</td>
                   <td className="border border-gray-300 px-3 py-2 text-center">7</td>
                 </tr>
                 <tr className="bg-gray-50">
                   <td className="border border-gray-300 px-3 py-2">Pompes, redressements assis, effort élevé</td>
                   <td className="border border-gray-300 px-3 py-2 text-center">8</td>
                 </tr>
                 <tr>
                   <td className="border border-gray-300 px-3 py-2">Course à pied, sur place</td>
                   <td className="border border-gray-300 px-3 py-2 text-center">8</td>
                 </tr>
                 <tr className="bg-gray-50">
                   <td className="border border-gray-300 px-3 py-2">Saut à la corde</td>
                   <td className="border border-gray-300 px-3 py-2 text-center">10</td>
                 </tr>
                 <tr>
                   <td className="border border-gray-300 px-3 py-2">Course à pied, &gt;17,5 km/h</td>
                   <td className="border border-gray-300 px-3 py-2 text-center">18</td>
                 </tr>
               </tbody>
             </table>
           </div>
              </div>
            </div>

            {/* Section Cardiaques */}
            <div className="p-4 bg-gray-50 rounded-md">
              <h4 className="text-md font-semibold text-[#1e3a8a] mb-4 underline">Cardiaques :</h4>
              
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                {/* Champ texte libre */}
                <div className="flex-1">
                <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    placeholder=""
                    value={formData.cardiaques?.autresDetails || ''}
                    onChange={(e) => setFormData({ ...formData, cardiaques: { ...formData.cardiaques, autresDetails: e.target.value } })}
                  />
              </div>
                
                {/* Liste de référence */}
                <div className="md:w-96">
                  <p className="text-sm text-gray-600">
                    angor, troubles du rythme, dyspnée, syncope, présence d'un stimulateur cardiaque
                  </p>
                </div>
              </div>

              {/* Bloc informatif supprimé selon demande */}
            </div>

            {/* Stimulateur cardiaque */}
            <div className="p-4 bg-cyan-50 rounded-md border-2 border-[#0ea5e9]">
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#0ea5e9] border-gray-300 rounded focus:ring-[#0ea5e9]"
                  checked={formData.stimulateur.presente}
                  onChange={(e) => setFormData({ ...formData, stimulateur: { ...formData.stimulateur, presente: e.target.checked } })}
                />
                <label className="ml-2 text-sm font-semibold text-gray-700">Stimulateur cardiaque (Pacemaker/Défibrillateur)</label>
              </div>
              {formData.stimulateur.presente && (
                <div className="space-y-3">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    placeholder="Cardiopathie"
                    value={formData.stimulateur?.cardiopathie || ''}
                    onChange={(e) => setFormData({ ...formData, stimulateur: { ...formData.stimulateur, cardiopathie: e.target.value } })}
                  />
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    placeholder="Date d'implantation"
                    value={formData.stimulateur?.dateImplantation || ''}
                    onChange={(e) => setFormData({ ...formData, stimulateur: { ...formData.stimulateur, dateImplantation: e.target.value } })}
                  />
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    placeholder="Centre d'implantation et suivi cardio"
                    value={formData.stimulateur?.centreImplantation || ''}
                    onChange={(e) => setFormData({ ...formData, stimulateur: { ...formData.stimulateur, centreImplantation: e.target.value } })}
                  />
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    placeholder="Dépendance du patient au stimulateur"
                    value={formData.stimulateur?.dependance || ''}
                    onChange={(e) => setFormData({ ...formData, stimulateur: { ...formData.stimulateur, dependance: e.target.value } })}
                  />
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    placeholder="Marque et type de stimulation (carte de porteur)"
                    value={formData.stimulateur?.marque || ''}
                    onChange={(e) => setFormData({ ...formData, stimulateur: { ...formData.stimulateur, marque: e.target.value } })}
                  />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 rounded focus:ring-[#0ea5e9]"
                      checked={formData.stimulateur.controleRecent}
                      onChange={(e) => setFormData({ ...formData, stimulateur: { ...formData.stimulateur, controleRecent: e.target.checked } })}
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700">Contrôle récent (dans les 6 mois)</label>
                  </div>
                  {/* Bloc examens complémentaires supprimé selon demande */}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 rounded focus:ring-[#0ea5e9]"
                    checked={formData.hta.presente}
                    onChange={(e) => setFormData({ ...formData, hta: { ...formData.hta, presente: e.target.checked } })}
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">HTA</label>
                </div>
                {formData.hta.presente && (
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    placeholder="Détails..."
                    rows={2}
                    value={formData.hta?.details || ''}
                    onChange={(e) => setFormData({ ...formData, hta: { ...formData.hta, details: e.target.value } })}
                  />
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 rounded focus:ring-[#0ea5e9]"
                    checked={formData.diabete.presente}
                    onChange={(e) => setFormData({ ...formData, diabete: { ...formData.diabete, presente: e.target.checked } })}
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">Diabète</label>
                </div>
                {formData.diabete.presente && (
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    placeholder="Détails..."
                    rows={2}
                    value={formData.diabete?.details || ''}
                    onChange={(e) => setFormData({ ...formData, diabete: { ...formData.diabete, details: e.target.value } })}
                  />
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 rounded focus:ring-[#0ea5e9]"
                    checked={formData.reins.presente}
                    onChange={(e) => setFormData({ ...formData, reins: { ...formData.reins, presente: e.target.checked } })}
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">Problèmes rénaux</label>
                </div>
                {formData.reins.presente && (
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    placeholder="Détails..."
                    rows={2}
                    value={formData.reins?.details || ''}
                    onChange={(e) => setFormData({ ...formData, reins: { ...formData.reins, details: e.target.value } })}
                  />
                )}
              </div>

              {/* Section Hémostase */}
              <div className="p-4 bg-gray-50 rounded-md">
                <h4 className="text-md font-semibold text-[#1e3a8a] mb-4 underline">Hémostase</h4>
                
                <div className="space-y-3">
                  {/* Saignement post-opératoire ou post-traumatique */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Saignement post-opératoire ou post-traumatique</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                  <input
                          type="radio"
                          name="saignementPostOp"
                          value="Non"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.saignementPostOp === false}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, saignementPostOp: false } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Non</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="saignementPostOp"
                          value="Oui"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.saignementPostOp === true}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, saignementPostOp: true } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Oui</span>
                      </label>
                </div>
                  </div>

                  {/* Hémorragie après extraction dentaire */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Hémorragie après extraction dentaire</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="hemorragieExtractionDentaire"
                          value="Non"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.hemorragieExtractionDentaire === false}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, hemorragieExtractionDentaire: false } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Non</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="hemorragieExtractionDentaire"
                          value="Oui"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.hemorragieExtractionDentaire === true}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, hemorragieExtractionDentaire: true } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Oui</span>
                      </label>
                    </div>
                  </div>

                  {/* Antécédents d'hématurie inexpliquée */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Antécédents d'hématurie inexpliquée</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="hematurieInexpliquee"
                          value="Non"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.hematurieInexpliquee === false}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, hematurieInexpliquee: false } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Non</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="hematurieInexpliquee"
                          value="Oui"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.hematurieInexpliquee === true}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, hematurieInexpliquee: true } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Oui</span>
                      </label>
                    </div>
                  </div>

                  {/* Ecchymoses anormales, pétéchies */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Ecchymoses anormales, pétéchies</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="ecchymosesAnormales"
                          value="Non"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.ecchymosesAnormales === false}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, ecchymosesAnormales: false } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Non</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="ecchymosesAnormales"
                          value="Oui"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.ecchymosesAnormales === true}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, ecchymosesAnormales: true } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Oui</span>
                      </label>
                    </div>
                  </div>

                  {/* Maladie hépatique ou hématologique */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Maladie hépatique ou hématologique</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="maladieHepatiqueHematologique"
                          value="Non"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.maladieHepatiqueHematologique === false}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, maladieHepatiqueHematologique: false } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Non</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="maladieHepatiqueHematologique"
                          value="Oui"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.maladieHepatiqueHematologique === true}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, maladieHepatiqueHematologique: true } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Oui</span>
                      </label>
                    </div>
                  </div>

                  {/* Epistaxis */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Epistaxis</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="epistaxis"
                          value="Non"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.epistaxis === false}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, epistaxis: false } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Non</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="epistaxis"
                          value="Oui"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.epistaxis === true}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, epistaxis: true } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Oui</span>
                      </label>
                    </div>
                  </div>

                  {/* Ménorragies */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Ménorragies</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="menorragies"
                          value="Non"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.menorragies === false}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, menorragies: false } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Non</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="menorragies"
                          value="Oui"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.menorragies === true}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, menorragies: true } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Oui</span>
                      </label>
                    </div>
                  </div>

                  {/* Gingivorragies */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Gingivorragies</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gingivorragies"
                          value="Non"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.gingivorragies === false}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, gingivorragies: false } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Non</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gingivorragies"
                          value="Oui"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.gingivorragies === true}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, gingivorragies: true } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Oui</span>
                      </label>
                    </div>
                  </div>

                  {/* Antécédents familiaux hémorragiques */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Antécédents familiaux hémorragiques</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="antecedentsFamiliauxHemorrhagiques"
                          value="Non"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.antecedentsFamiliauxHemorrhagiques === false}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, antecedentsFamiliauxHemorrhagiques: false } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Non</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="antecedentsFamiliauxHemorrhagiques"
                          value="Oui"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.antecedentsFamiliauxHemorrhagiques === true}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, antecedentsFamiliauxHemorrhagiques: true } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Oui</span>
                      </label>
                    </div>
                  </div>

                  {/* Anémie, carence de fer */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Anémie, carence de fer</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="anemieCarenceFer"
                          value="Non"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.anemieCarenceFer === false}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, anemieCarenceFer: false } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Non</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="anemieCarenceFer"
                          value="Oui"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.anemieCarenceFer === true}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, anemieCarenceFer: true } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Oui</span>
                      </label>
                    </div>
                  </div>

                  {/* Transfusions */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Transfusions</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="transfusions"
                          value="Non"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.transfusions === false}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, transfusions: false } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Non</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="transfusions"
                          value="Oui"
                          className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                          checked={formData.hemostase.transfusions === true}
                          onChange={() => setFormData({ ...formData, hemostase: { ...formData.hemostase, transfusions: true } })}
                        />
                        <span className="ml-2 text-sm text-gray-700">Oui</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Questionnaire STOP-BANG */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md border-2 border-gray-200">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Questionnaire STOP-BANG</h3>
            <p className="text-sm text-gray-600 mb-4">Snoring, Tired, Observed apnea, Pression - BMI, Age, Neck, Gender</p>
            
            {/* Section questionnaire dans une boîte grise */}
            <div className="p-4 bg-gray-200 rounded-md mb-4">
              <div className="space-y-3">
              {/* 1. Ronflements bruyants */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Ronflements bruyants
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                <input
                      type="radio"
                      name="ronflement"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.stopBang.ronflement === false}
                      onChange={() => setFormData({ ...formData, stopBang: { ...formData.stopBang, ronflement: false } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="ronflement"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.stopBang.ronflement === true}
                      onChange={() => setFormData({ ...formData, stopBang: { ...formData.stopBang, ronflement: true } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
              </div>
              </div>
              <p className="text-xs text-gray-500 ml-4">être entendu portes closes</p>

              {/* 2. Apnées observées par le conjoint */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Apnées observées par le conjoint
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                <input
                      type="radio"
                      name="apnee"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.stopBang.apnee === false}
                      onChange={() => setFormData({ ...formData, stopBang: { ...formData.stopBang, apnee: false } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="apnee"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.stopBang.apnee === true}
                      onChange={() => setFormData({ ...formData, stopBang: { ...formData.stopBang, apnee: true } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
              </div>
              </div>

              {/* 3. Somnolence diurne */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Somnolence diurne
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                <input
                      type="radio"
                      name="fatigue"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.stopBang.fatigue === false}
                      onChange={() => setFormData({ ...formData, stopBang: { ...formData.stopBang, fatigue: false } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="fatigue"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.stopBang.fatigue === true}
                      onChange={() => setFormData({ ...formData, stopBang: { ...formData.stopBang, fatigue: true } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
              </div>
              </div>

              {/* 4. Traitement (passé ou en cours) pour HTA */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Traitement (passé ou en cours) pour HTA
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                <input
                      type="radio"
                      name="pressionArterielle"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.stopBang.pressionArterielle === false}
                      onChange={() => setFormData({ ...formData, stopBang: { ...formData.stopBang, pressionArterielle: false } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pressionArterielle"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.stopBang.pressionArterielle === true}
                      onChange={() => setFormData({ ...formData, stopBang: { ...formData.stopBang, pressionArterielle: true } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
              </div>
              </div>

              {/* 5. BMI > 35kg/m² */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  BMI &gt; 35kg/m²
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                <input
                      type="radio"
                      name="imc"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.stopBang.imc === false}
                      onChange={() => setFormData({ ...formData, stopBang: { ...formData.stopBang, imc: false } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="imc"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.stopBang.imc === true}
                      onChange={() => setFormData({ ...formData, stopBang: { ...formData.stopBang, imc: true } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
              </div>
              </div>

              {/* 6. Age > 50 ans */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Age &gt; 50 ans
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                <input
                      type="radio"
                      name="age"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.stopBang.age === false}
                      onChange={() => setFormData({ ...formData, stopBang: { ...formData.stopBang, age: false } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="age"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.stopBang.age === true}
                      onChange={() => setFormData({ ...formData, stopBang: { ...formData.stopBang, age: true } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
              </div>
              </div>

              {/* 7. Tour de cou > 40 cm */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Tour de cou &gt; 40 cm
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                <input
                      type="radio"
                      name="tourCou"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.stopBang.tourCou === false}
                      onChange={() => setFormData({ ...formData, stopBang: { ...formData.stopBang, tourCou: false } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="tourCou"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.stopBang.tourCou === true}
                      onChange={() => setFormData({ ...formData, stopBang: { ...formData.stopBang, tourCou: true } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
              </div>
              </div>

              {/* 8. Sexe masculin */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Sexe masculin
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                <input
                      type="radio"
                      name="sexe"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.stopBang.sexe === false}
                      onChange={() => setFormData({ ...formData, stopBang: { ...formData.stopBang, sexe: false } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sexe"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.stopBang.sexe === true}
                      onChange={() => setFormData({ ...formData, stopBang: { ...formData.stopBang, sexe: true } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
              </div>
            </div>
            </div>
            </div>

            {/* Score et recommandations */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Nombre de oui</span>
                <div className="w-12 h-8 border border-blue-300 bg-blue-50 rounded flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-800">{calculateStopBangScore()}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">si nombre de oui &gt; 3, patient à risque</p>

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Risque d'apnées du sommeil</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="risqueApnees"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={calculateStopBangScore() < 3}
                      readOnly
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="risqueApnees"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={calculateStopBangScore() >= 3}
                      readOnly
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
                </div>
              </div>

              {calculateStopBangScore() >= 3 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm font-medium text-yellow-800 mb-2">Si score &gt; ou = 3 :</p>
                  <ul className="text-sm text-yellow-700 space-y-1 ml-4">
                    <li>• prévoir oxymétrie nocturne si patient n'habite pas trop loin (ramène appareil le lendemain)</li>
                    <li>• ou polysomnographie dans un hôpital proche de chez lui</li>
                  </ul>
                </div>
              )}

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Autres :</p>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  placeholder=""
                />
          </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Autres antécédents</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
                  value={formData.autres || ''}
              onChange={(e) => setFormData({ ...formData, autres: e.target.value })}
            />
            </div>
          </div>
        </section>

        {/* Antécédents Chirurgicaux */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#1e3a8a] border-b-2 border-[#0ea5e9] pb-2 mb-4">
            ❖ Antécédents Chirurgicaux
          </h2>
          
          {/* Cases à cocher Non/Oui */}
          <div className="mb-4 p-4 bg-gray-50 rounded-md">
            <div className="flex items-center gap-6 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...getFieldProps()}
                  checked={!formData.hasAntecedentsChirurgicaux}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      hasAntecedentsChirurgicaux: !e.target.checked,
                      antecedentsChirurgicaux: e.target.checked ? [] : formData.antecedentsChirurgicaux
                    });
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Non</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...getFieldProps()}
                  checked={formData.hasAntecedentsChirurgicaux}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      hasAntecedentsChirurgicaux: e.target.checked,
                      antecedentsChirurgicaux: e.target.checked ? formData.antecedentsChirurgicaux : []
                    });
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Oui</span>
              </label>
            </div>
            
            {/* Instructions conditionnelles - apparaissent seulement si "Oui" est coché */}
            {formData.hasAntecedentsChirurgicaux && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-3">Pour chaque intervention, préciser :</p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Année</li>
                  <li>• Intervention</li>
                  <li>• Type d'anesthésie</li>
                  <li>• Difficultés de ventilation et d'intubation</li>
                  <li className="ml-4">o Cormack</li>
                  <li className="ml-4">o Technique utilisée si intubation difficile)</li>
                </ul>
              </div>
            )}
          </div>
          {/* Liste des antécédents chirurgicaux - apparaît seulement si "Oui" est coché */}
          {formData.hasAntecedentsChirurgicaux && (
            <>
              {formData.antecedentsChirurgicaux.map((atcd, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-300">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-700">Intervention #{index + 1}</h4>
                <button
                  onClick={() => removeAntecedentChirurgical(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Année"
                  value={atcd.annee}
                  onChange={(e) => {
                    const updated = [...formData.antecedentsChirurgicaux];
                    updated[index].annee = e.target.value;
                    setFormData({ ...formData, antecedentsChirurgicaux: updated });
                  }}
                />
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Intervention"
                  value={atcd.intervention}
                  onChange={(e) => {
                    const updated = [...formData.antecedentsChirurgicaux];
                    updated[index].intervention = e.target.value;
                    setFormData({ ...formData, antecedentsChirurgicaux: updated });
                  }}
                />
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type d'anesthésie"
                  value={atcd.typeAnesthesie}
                  onChange={(e) => {
                    const updated = [...formData.antecedentsChirurgicaux];
                    updated[index].typeAnesthesie = e.target.value;
                    setFormData({ ...formData, antecedentsChirurgicaux: updated });
                  }}
                />
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Difficultés"
                  value={atcd.difficultes}
                  onChange={(e) => {
                    const updated = [...formData.antecedentsChirurgicaux];
                    updated[index].difficultes = e.target.value;
                    setFormData({ ...formData, antecedentsChirurgicaux: updated });
                  }}
                />
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Score de Cormack"
                  value={atcd.cormack}
                  onChange={(e) => {
                    const updated = [...formData.antecedentsChirurgicaux];
                    updated[index].cormack = e.target.value;
                    setFormData({ ...formData, antecedentsChirurgicaux: updated });
                  }}
                />
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Technique utilisée"
                  value={atcd.technique}
                  onChange={(e) => {
                    const updated = [...formData.antecedentsChirurgicaux];
                    updated[index].technique = e.target.value;
                    setFormData({ ...formData, antecedentsChirurgicaux: updated });
                  }}
                />
              </div>
            </div>
              ))}
              
              {/* Bouton pour ajouter un antécédent chirurgical */}
              <button
                onClick={addAntecedentChirurgical}
                className="flex items-center px-4 py-2 bg-[#0ea5e9] text-white rounded-md hover:bg-[#0284c7] transition shadow-md"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un antécédent chirurgical
              </button>
            </>
          )}
        </section>


        {/* Section Examen physique - Paramètres */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#1e3a8a] border-b-2 border-[#0ea5e9] pb-2 mb-4">
            Examen physique
          </h2>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-4">5. Paramètres</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Poids */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poids</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    value={formData.parametresPhysiques?.poids || ''}
                    onChange={(e) => setFormData({ ...formData, parametresPhysiques: { ...(formData.parametresPhysiques || {}), poids: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-600">kg</span>
                </div>
              </div>

              {/* Perte de poids récente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Perte de poids récente</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pertePoidsRecente"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.parametresPhysiques?.pertePoidsRecente === 'Non'}
                      onChange={(e) => setFormData({ ...formData, parametresPhysiques: { ...(formData.parametresPhysiques || {}), pertePoidsRecente: e.target.value } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pertePoidsRecente"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.parametresPhysiques?.pertePoidsRecente === 'Oui'}
                      onChange={(e) => setFormData({ ...formData, parametresPhysiques: { ...(formData.parametresPhysiques || {}), pertePoidsRecente: e.target.value } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
                </div>
              </div>

              {/* Perte d'appétit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Perte d'appétit</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="perteAppetit"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.parametresPhysiques?.perteAppetit === 'Non'}
                      onChange={(e) => setFormData({ ...formData, parametresPhysiques: { ...(formData.parametresPhysiques || {}), perteAppetit: e.target.value } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="perteAppetit"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.parametresPhysiques?.perteAppetit === 'Oui'}
                      onChange={(e) => setFormData({ ...formData, parametresPhysiques: { ...(formData.parametresPhysiques || {}), perteAppetit: e.target.value } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
                </div>
              </div>

              {/* Taille */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taille</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    value={formData.parametresPhysiques?.taille || ''}
                    onChange={(e) => setFormData({ ...formData, parametresPhysiques: { ...(formData.parametresPhysiques || {}), taille: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-600">cm</span>
                </div>
              </div>

              {/* BMI */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BMI</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    value={formData.parametresPhysiques?.bmi || ''}
                    readOnly
                  />
                  <span className="ml-2 text-sm text-gray-600">kg/m²</span>
                </div>
              </div>

              {/* TA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TA</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    className="w-16 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-center"
                    placeholder="120"
                    value={formData.parametresPhysiques?.taSystolique || ''}
                    onChange={(e) => setFormData({ ...formData, parametresPhysiques: { ...(formData.parametresPhysiques || {}), taSystolique: e.target.value } })}
                  />
                  <span className="mx-2 text-gray-600">/</span>
                  <input
                    type="number"
                    className="w-16 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-center"
                    placeholder="80"
                    value={formData.parametresPhysiques?.taDiastolique || ''}
                    onChange={(e) => setFormData({ ...formData, parametresPhysiques: { ...(formData.parametresPhysiques || {}), taDiastolique: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-600">mmHg</span>
                </div>
              </div>

              {/* Pouls */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pouls</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    value={formData.parametresPhysiques?.pouls || ''}
                    onChange={(e) => setFormData({ ...formData, parametresPhysiques: { ...(formData.parametresPhysiques || {}), pouls: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-600">bpm</span>
                </div>
              </div>

              {/* Fréquence respiratoire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fréquence respiratoire</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    value={formData.parametresPhysiques?.frequenceRespiratoire || ''}
                    onChange={(e) => setFormData({ ...formData, parametresPhysiques: { ...(formData.parametresPhysiques || {}), frequenceRespiratoire: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-600">cpm</span>
                </div>
              </div>
            </div>

            {/* Commentaires */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Commentaires</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                rows={3}
                placeholder="Commentaires sur les paramètres..."
                value={formData.parametresPhysiques?.commentaires || ''}
                onChange={(e) => setFormData({ ...formData, parametresPhysiques: { ...(formData.parametresPhysiques || {}), commentaires: e.target.value } })}
              />
            </div>

            {/* Classification BMI */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-[#1e3a8a] mb-3">Classification</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-green-100">
                        <th className="text-left py-2 font-semibold text-gray-700 px-2">Classification</th>
                        <th className="text-left py-2 font-semibold text-gray-700 px-2">IMC (kg/m²)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-blue-50">
                        <td className="py-1 px-2 font-medium">Maigreur</td>
                        <td className="py-1 px-2">&lt; 18,5</td>
                      </tr>
                      <tr className="bg-green-50">
                        <td className="py-1 px-2 font-medium">Normal</td>
                        <td className="py-1 px-2">18,5 - 24,9</td>
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="py-1 px-2 font-medium">Surpoids</td>
                        <td className="py-1 px-2">25,0 - 29,9</td>
                      </tr>
                      <tr className="bg-green-50">
                        <td className="py-1 px-2 font-medium">Obésité modérée</td>
                        <td className="py-1 px-2">30,0 - 34,9</td>
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="py-1 px-2 font-medium">Obésité sévère</td>
                        <td className="py-1 px-2">35,0 - 39,9</td>
                      </tr>
                      <tr className="bg-green-50">
                        <td className="py-1 px-2 font-medium">Obésité massive</td>
                        <td className="py-1 px-2">≥ 40,0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="bg-green-50 p-4 rounded-md border border-green-200">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    WHO Report of a WHO Consultation on obesity: preventing and managing the global epidemic. WHO, Geneva, 3-5 June 1998
                  </p>
                </div>
              </div>
            </div>

            {/* Section Perte de poids */}
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <h4 className="text-md font-semibold text-[#1e3a8a] mb-3">Perte de poids</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Début de la perte de poids</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    placeholder="Date ou période..."
                    value={formData.parametresPhysiques?.debutPertePoids || ''}
                    onChange={(e) => setFormData({ ...formData, parametresPhysiques: { ...(formData.parametresPhysiques || {}), debutPertePoids: e.target.value } })}
                  />
            </div>
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Poids perdu</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                      value={formData.parametresPhysiques?.poidsPerdu || ''}
                      onChange={(e) => setFormData({ ...formData, parametresPhysiques: { ...(formData.parametresPhysiques || {}), poidsPerdu: e.target.value } })}
                    />
                    <span className="ml-2 text-sm text-gray-600">kg</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Perte de poids volontaire</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="pertePoidsVolontaire"
                        value="Non"
                        className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                        checked={formData.parametresPhysiques?.pertePoidsVolontaire === 'Non'}
                        onChange={(e) => setFormData({ ...formData, parametresPhysiques: { ...(formData.parametresPhysiques || {}), pertePoidsVolontaire: e.target.value } })}
                      />
                      <span className="ml-2 text-sm text-gray-700">Non</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="pertePoidsVolontaire"
                        value="Oui"
                        className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                        checked={formData.parametresPhysiques?.pertePoidsVolontaire === 'Oui'}
                        onChange={(e) => setFormData({ ...formData, parametresPhysiques: { ...(formData.parametresPhysiques || {}), pertePoidsVolontaire: e.target.value } })}
                      />
                      <span className="ml-2 text-sm text-gray-700">Oui</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Examen */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#1e3a8a] border-b-2 border-[#0ea5e9] pb-2 mb-4">
            Examen
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Coeur */}
            <div className="p-4 bg-gray-50 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Coeur</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="coeur"
                    value="Normal"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.examen?.coeur === 'Normal'}
                    onChange={(e) => setFormData({ ...formData, examen: { ...(formData.examen || {}), coeur: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Normal</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="coeur"
                    value="Anormal"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.examen?.coeur === 'Anormal'}
                    onChange={(e) => setFormData({ ...formData, examen: { ...(formData.examen || {}), coeur: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Anormal</span>
                </label>
              </div>
              {formData.examen?.coeur === 'Anormal' && (
                <input
                  type="text"
                  className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  placeholder="Préciser l'anomalie cardiaque..."
                  value={formData.examen?.coeurCommentaire || ''}
                  onChange={(e) => setFormData({ ...formData, examen: { ...(formData.examen || {}), coeurCommentaire: e.target.value } })}
                />
              )}
            </div>

            {/* Poumons */}
            <div className="p-4 bg-gray-50 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Poumons</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="poumons"
                    value="Normal"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.examen?.poumons === 'Normal'}
                    onChange={(e) => setFormData({ ...formData, examen: { ...(formData.examen || {}), poumons: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Normal</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="poumons"
                    value="Anormal"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.examen?.poumons === 'Anormal'}
                    onChange={(e) => setFormData({ ...formData, examen: { ...(formData.examen || {}), poumons: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Anormal</span>
                </label>
              </div>
              {formData.examen?.poumons === 'Anormal' && (
                <input
                  type="text"
                  className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  placeholder="Préciser l'anomalie pulmonaire..."
                  value={formData.examen?.poumonsCommentaire || ''}
                  onChange={(e) => setFormData({ ...formData, examen: { ...(formData.examen || {}), poumonsCommentaire: e.target.value } })}
                />
              )}
            </div>

            {/* Abdomen */}
            <div className="p-4 bg-gray-50 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Abdomen</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="abdomen"
                    value="Normal"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.examen?.abdomen === 'Normal'}
                    onChange={(e) => setFormData({ ...formData, examen: { ...(formData.examen || {}), abdomen: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Normal</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="abdomen"
                    value="Anormal"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.examen?.abdomen === 'Anormal'}
                    onChange={(e) => setFormData({ ...formData, examen: { ...(formData.examen || {}), abdomen: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Anormal</span>
                </label>
              </div>
              {formData.examen?.abdomen === 'Anormal' && (
                <input
                  type="text"
                  className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  placeholder="Préciser l'anomalie abdominale..."
                  value={formData.examen?.abdomenCommentaire || ''}
                  onChange={(e) => setFormData({ ...formData, examen: { ...(formData.examen || {}), abdomenCommentaire: e.target.value } })}
                />
              )}
            </div>

            {/* Membres */}
            <div className="p-4 bg-gray-50 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Membres</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="membres"
                    value="Normal"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.examen?.membres === 'Normal'}
                    onChange={(e) => setFormData({ ...formData, examen: { ...(formData.examen || {}), membres: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Normal</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="membres"
                    value="Anormal"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.examen?.membres === 'Anormal'}
                    onChange={(e) => setFormData({ ...formData, examen: { ...(formData.examen || {}), membres: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Anormal</span>
                </label>
              </div>
              {formData.examen?.membres === 'Anormal' && (
                <input
                  type="text"
                  className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  placeholder="Préciser l'anomalie des membres..."
                  value={formData.examen?.membresCommentaire || ''}
                  onChange={(e) => setFormData({ ...formData, examen: { ...(formData.examen || {}), membresCommentaire: e.target.value } })}
                />
              )}
            </div>

            {/* Varices */}
            <div className="p-4 bg-gray-50 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Varices</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="varices"
                    value="Non"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.examen?.varices === 'Non'}
                    onChange={(e) => setFormData({ ...formData, examen: { ...(formData.examen || {}), varices: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Non</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="varices"
                    value="Oui"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.examen?.varices === 'Oui'}
                    onChange={(e) => setFormData({ ...formData, examen: { ...(formData.examen || {}), varices: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Oui</span>
                </label>
              </div>
            </div>

            {/* Oedèmes */}
            <div className="p-4 bg-gray-50 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Oedèmes</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="oedemes"
                    value="Non"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.examen?.oedemes === 'Non'}
                    onChange={(e) => setFormData({ ...formData, examen: { ...(formData.examen || {}), oedemes: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Non</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="oedemes"
                    value="Oui"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.examen?.oedemes === 'Oui'}
                    onChange={(e) => setFormData({ ...formData, examen: { ...(formData.examen || {}), oedemes: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Oui</span>
                </label>
              </div>
            </div>

            {/* Douleurs autres que celles nécessitant l'hospitalisation */}
            <div className="p-4 bg-gray-50 rounded-md col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Douleurs autres que celles nécessitant l'hospitalisation
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                placeholder="Décrire les douleurs..."
                value={formData.examen?.douleursAutres || ''}
                onChange={(e) => setFormData({ ...formData, examen: { ...(formData.examen || {}), douleursAutres: e.target.value } })}
              />
            </div>

            {/* Autres */}
            <div className="p-4 bg-gray-50 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Autres</label>
              <div className="flex items-center gap-4 mb-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="autres"
                    value="Non"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.examen?.autres === 'Non'}
                    onChange={(e) => setFormData({ ...formData, examen: { ...(formData.examen || {}), autres: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Non</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="autres"
                    value="Oui"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.examen?.autres === 'Oui'}
                    onChange={(e) => setFormData({ ...formData, examen: { ...(formData.examen || {}), autres: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Oui</span>
                </label>
              </div>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                placeholder="Décrire les autres éléments..."
                value={formData.examen?.autresCommentaire || ''}
                onChange={(e) => setFormData({ ...formData, examen: { ...(formData.examen || {}), autresCommentaire: e.target.value } })}
              />
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
            <p className="text-sm text-yellow-800">
              <strong>Note :</strong> Toute anomalie doit être documentée
            </p>
          </div>
        </section>

        {/* Section Critères d'intubation mise à jour */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#1e3a8a] border-b-2 border-[#0ea5e9] pb-2 mb-4">
            Critères d'intubation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Score de Mallampati */}
            <div className="p-4 bg-gray-50 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Score de Mallampati</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="mallampati"
                    value="I"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.criteresIntubation.mallampati === 'I'}
                    onChange={(e) => setFormData({ ...formData, criteresIntubation: { ...formData.criteresIntubation, mallampati: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-700">I</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="mallampati"
                    value="II"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.criteresIntubation.mallampati === 'II'}
                    onChange={(e) => setFormData({ ...formData, criteresIntubation: { ...formData.criteresIntubation, mallampati: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-700">II</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="mallampati"
                    value="III"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.criteresIntubation.mallampati === 'III'}
                    onChange={(e) => setFormData({ ...formData, criteresIntubation: { ...formData.criteresIntubation, mallampati: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-700">III</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="mallampati"
                    value="IV"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.criteresIntubation.mallampati === 'IV'}
                    onChange={(e) => setFormData({ ...formData, criteresIntubation: { ...formData.criteresIntubation, mallampati: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-700">IV</span>
                </label>
              </div>
            </div>

            {/* Ouverture de bouche */}
            <div className="p-4 bg-gray-50 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ouverture de bouche</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                placeholder="En cm..."
                value={formData.criteresIntubation?.ouvertureBouche || ''}
                onChange={(e) => setFormData({ ...formData, criteresIntubation: { ...formData.criteresIntubation, ouvertureBouche: e.target.value } })}
              />
            </div>

            {/* Morsure de la lèvre supérieure */}
            <div className="p-4 bg-gray-50 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Morsure de la lèvre supérieure</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="morsureLevreSup"
                    value="Non"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.criteresIntubation.morsureLevreSup === 'Non'}
                    onChange={(e) => setFormData({ ...formData, criteresIntubation: { ...formData.criteresIntubation, morsureLevreSup: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Non</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="morsureLevreSup"
                    value="Oui"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.criteresIntubation.morsureLevreSup === 'Oui'}
                    onChange={(e) => setFormData({ ...formData, criteresIntubation: { ...formData.criteresIntubation, morsureLevreSup: e.target.value } })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Oui</span>
                </label>
              </div>
            </div>

            {/* Mobilité de la tête */}
            <div className="p-4 bg-gray-50 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobilité de la tête</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                placeholder="Décrire la mobilité..."
                value={formData.criteresIntubation?.mobiliteTete || ''}
                onChange={(e) => setFormData({ ...formData, criteresIntubation: { ...formData.criteresIntubation, mobiliteTete: e.target.value } })}
              />
            </div>

            {/* Distance thyro-mentonnière */}
            <div className="p-4 bg-gray-50 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Distance thyro-mentonnière</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                placeholder="En cm..."
                value={formData.criteresIntubation?.distanceThyroMenton || ''}
                onChange={(e) => setFormData({ ...formData, criteresIntubation: { ...(formData.criteresIntubation || {}), distanceThyroMenton: e.target.value } })}
              />
            </div>

            {/* Dentition */}
            <div className="p-4 bg-gray-50 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Dentition</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                placeholder="Décrire la dentition..."
                value={formData.criteresIntubation?.dentition || ''}
                onChange={(e) => setFormData({ ...formData, criteresIntubation: { ...(formData.criteresIntubation || {}), dentition: e.target.value } })}
              />
            </div>
          </div>
        </section>

        {/* Facteurs de risque */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#1e3a8a] border-b-2 border-[#0ea5e9] pb-2 mb-4">
            Facteurs de Risque
          </h2>
          
          {/* Facteurs de risque - Score d'Apfel */}
          <div className="mb-6 p-4 bg-green-50 rounded-md border-2 border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-1">Facteurs de risque</h3>
            <h4 className="text-md font-medium text-green-800 mb-3">Score d'Apfel</h4>
            
            <div className="bg-gray-100 rounded-md p-3 mb-4">
              <h5 className="text-sm font-semibold text-gray-900 mb-2">Score d'Apfel</h5>
              <p className="text-xs text-gray-700 mb-3">Évaluation du risque de nausées/vomissements postopératoires (PONV)</p>
              
              <div className="space-y-3">
                {/* Sexe féminin */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Sexe féminin</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                <input
                        type="radio"
                        name="sexeFemininApfel"
                        value="Non"
                        className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                        checked={formData.scoreApfel.femme === false}
                        onChange={(e) => setFormData({ ...formData, scoreApfel: { ...formData.scoreApfel, femme: false } })}
                      />
                      <span className="ml-2 text-sm text-gray-700">Non</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="sexeFemininApfel"
                        value="Oui"
                        className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                        checked={formData.scoreApfel.femme === true}
                        onChange={(e) => setFormData({ ...formData, scoreApfel: { ...formData.scoreApfel, femme: true } })}
                      />
                      <span className="ml-2 text-sm text-gray-700">Oui</span>
                    </label>
              </div>
                </div>

                {/* Antécédents de mal des transports ou de PONV */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Antécédents de mal des transports ou de PONV</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                <input
                        type="radio"
                        name="malDesTransportsApfel"
                        value="Non"
                        className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                        checked={formData.scoreApfel.atcdNVPO === false && formData.scoreApfel.atcdCinetose === false}
                        onChange={(e) => setFormData({ ...formData, scoreApfel: { ...formData.scoreApfel, atcdNVPO: false, atcdCinetose: false } })}
                      />
                      <span className="ml-2 text-sm text-gray-700">Non</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="malDesTransportsApfel"
                        value="Oui"
                        className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                        checked={formData.scoreApfel.atcdNVPO === true || formData.scoreApfel.atcdCinetose === true}
                        onChange={(e) => setFormData({ ...formData, scoreApfel: { ...formData.scoreApfel, atcdNVPO: true, atcdCinetose: true } })}
                      />
                      <span className="ml-2 text-sm text-gray-700">Oui</span>
                    </label>
              </div>
                </div>

                {/* Non-fumeur */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Non-fumeur</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                <input
                        type="radio"
                        name="nonFumeurApfel"
                        value="Non"
                        className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                        checked={formData.scoreApfel.nonFumeur === false}
                        onChange={(e) => setFormData({ ...formData, scoreApfel: { ...formData.scoreApfel, nonFumeur: false } })}
                      />
                      <span className="ml-2 text-sm text-gray-700">Non</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="nonFumeurApfel"
                        value="Oui"
                        className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                        checked={formData.scoreApfel.nonFumeur === true}
                        onChange={(e) => setFormData({ ...formData, scoreApfel: { ...formData.scoreApfel, nonFumeur: true } })}
                      />
                      <span className="ml-2 text-sm text-gray-700">Oui</span>
                    </label>
              </div>
                </div>

                {/* Usage d'opioïdes en post-opératoire */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Usage d'opioïdes en post-opératoire</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                <input
                        type="radio"
                        name="opioidesPostopApfel"
                        value="Non"
                        className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                        checked={formData.scoreApfel.opioidesPostop === false}
                        onChange={(e) => setFormData({ ...formData, scoreApfel: { ...formData.scoreApfel, opioidesPostop: false } })}
                      />
                      <span className="ml-2 text-sm text-gray-700">Non</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="opioidesPostopApfel"
                        value="Oui"
                        className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                        checked={formData.scoreApfel.opioidesPostop === true}
                        onChange={(e) => setFormData({ ...formData, scoreApfel: { ...formData.scoreApfel, opioidesPostop: true } })}
                      />
                      <span className="ml-2 text-sm text-gray-700">Oui</span>
                    </label>
              </div>
            </div>
            </div>

              {/* Résultats du calcul */}
              <div className="mt-4 p-3 bg-green-100 rounded-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-900">Nombre de facteurs</span>
                  <input
                    type="number"
                    readOnly
                    value={calculateApfelScore()}
                    className="w-16 px-2 py-1 border border-green-300 rounded-md bg-green-50 text-green-900 font-semibold text-center"
                  />
          </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-900">Risque de PONV</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      readOnly
                      value={calculateApfelScore() === 0 ? 10 : calculateApfelScore() === 1 ? 21 : calculateApfelScore() === 2 ? 39 : calculateApfelScore() === 3 ? 61 : 79}
                      className="w-16 px-2 py-1 border border-green-300 rounded-md bg-green-50 text-green-900 font-semibold text-center"
                    />
                    <span className="text-sm text-green-800">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tableau de référence */}
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-1">Nbre de facteurs</th>
                      <th className="text-left py-1">Risque de NVPO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1">0</td>
                      <td className="py-1">10%</td>
                    </tr>
                    <tr>
                      <td className="py-1">1</td>
                      <td className="py-1">21%</td>
                    </tr>
                    <tr>
                      <td className="py-1">2</td>
                      <td className="py-1">39%</td>
                    </tr>
                    <tr>
                      <td className="py-1">3</td>
                      <td className="py-1">61%</td>
                    </tr>
                    <tr>
                      <td className="py-1">4</td>
                      <td className="py-1">79%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Score de Lee */}
          <div className="mb-6 p-4 bg-gray-50 rounded-md border-2 border-gray-200">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Score de Lee</h3>
            <p className="text-sm text-gray-600 mb-4">Le score de Lee permet de prévenir objectivement le patient du risque de complications cardiovasculaires péri-opératoires</p>
            
            <div className="p-4 bg-gray-200 rounded-md mb-4">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Score de risque de complications cardiovasculaires périopératoires</h4>
            
            <div className="space-y-3">
              {/* Maladie cérébrovasculaire */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Maladie cérébrovasculaire</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                <input
                      type="radio"
                      name="maladieCerebrovasculaire"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.scoreLee.atcdAVC === false}
                      onChange={(e) => setFormData({ ...formData, scoreLee: { ...formData.scoreLee, atcdAVC: false } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="maladieCerebrovasculaire"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.scoreLee.atcdAVC === true}
                      onChange={(e) => setFormData({ ...formData, scoreLee: { ...formData.scoreLee, atcdAVC: true } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
              </div>
              </div>

              {/* Maladie cardiaque ischémique */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Maladie cardiaque ischémique</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                <input
                      type="radio"
                      name="maladieCardiaqueIschemique"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.scoreLee.cardiopathieIschemique === false}
                      onChange={(e) => setFormData({ ...formData, scoreLee: { ...formData.scoreLee, cardiopathieIschemique: false } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="maladieCardiaqueIschemique"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.scoreLee.cardiopathieIschemique === true}
                      onChange={(e) => setFormData({ ...formData, scoreLee: { ...formData.scoreLee, cardiopathieIschemique: true } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
              </div>
              </div>

              {/* Décompensation cardiaque */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Décompensation cardiaque</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                <input
                      type="radio"
                      name="decompensationCardiaque"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.scoreLee.insuffisanceCardiaque === false}
                      onChange={(e) => setFormData({ ...formData, scoreLee: { ...formData.scoreLee, insuffisanceCardiaque: false } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="decompensationCardiaque"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.scoreLee.insuffisanceCardiaque === true}
                      onChange={(e) => setFormData({ ...formData, scoreLee: { ...formData.scoreLee, insuffisanceCardiaque: true } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
              </div>
              </div>

              {/* Diabète traité par insuline */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Diabète traité par insuline</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                <input
                      type="radio"
                      name="diabeteInsuline"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.scoreLee.insulinotherapie === false}
                      onChange={(e) => setFormData({ ...formData, scoreLee: { ...formData.scoreLee, insulinotherapie: false } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="diabeteInsuline"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.scoreLee.insulinotherapie === true}
                      onChange={(e) => setFormData({ ...formData, scoreLee: { ...formData.scoreLee, insulinotherapie: true } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
              </div>
              </div>

              {/* Créatinine > 2 mg/dl */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Créatinine &gt; 2 mg/dl</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                <input
                      type="radio"
                      name="creatinine"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.scoreLee.creatinine === false}
                      onChange={(e) => setFormData({ ...formData, scoreLee: { ...formData.scoreLee, creatinine: false } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="creatinine"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.scoreLee.creatinine === true}
                      onChange={(e) => setFormData({ ...formData, scoreLee: { ...formData.scoreLee, creatinine: true } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
              </div>
              </div>

              {/* Chirurgie de haut risque */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Chirurgie de haut risque</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                <input
                      type="radio"
                      name="chirurgieHautRisque"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.scoreLee.chirurgieRisqueEleve === false}
                      onChange={(e) => setFormData({ ...formData, scoreLee: { ...formData.scoreLee, chirurgieRisqueEleve: false } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="chirurgieHautRisque"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.scoreLee.chirurgieRisqueEleve === true}
                      onChange={(e) => setFormData({ ...formData, scoreLee: { ...formData.scoreLee, chirurgieRisqueEleve: true } })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
              </div>
                <p className="text-xs text-gray-500 mt-1">vasc.majeure, thorax ouvert, abdomin. haute, hémorragique ou long++</p>
            </div>
            </div>
            </div>

            {/* Résultats du calcul */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Nombre de facteurs</span>
                <div className="w-12 h-8 border border-gray-300 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-800">{calculateLeeScore()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Score de Lee</span>
                <div className="w-12 h-8 border border-gray-300 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-800">
                    {calculateLeeScore() === 0 ? 'I' : calculateLeeScore() === 1 ? 'II' : calculateLeeScore() === 2 ? 'III' : 'IV'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Risque de complications</span>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-8 border border-gray-300 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-800">
                      {calculateLeeScore() === 0 ? '0.5' : calculateLeeScore() === 1 ? '1' : calculateLeeScore() === 2 ? '6' : '11'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">%</span>
                </div>
              </div>
            </div>

            {/* Tableau de référence */}
            <div className="mt-4">
              <table className="w-full text-sm border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left py-2 px-3 border-r border-gray-300">Nbre de facteurs</th>
                    <th className="text-left py-2 px-3 border-r border-gray-300">Score de Lee</th>
                    <th className="text-left py-2 px-3">Risque de complications</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="py-2 px-3 border-r border-gray-300">0</td>
                    <td className="py-2 px-3 border-r border-gray-300">I</td>
                    <td className="py-2 px-3">0.5 %</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-2 px-3 border-r border-gray-300">1</td>
                    <td className="py-2 px-3 border-r border-gray-300">II</td>
                    <td className="py-2 px-3">1 %</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-2 px-3 border-r border-gray-300">2</td>
                    <td className="py-2 px-3 border-r border-gray-300">III</td>
                    <td className="py-2 px-3">6 %</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border-r border-gray-300">&gt; 2</td>
                    <td className="py-2 px-3 border-r border-gray-300">IV</td>
                    <td className="py-2 px-3">11 %</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Facteurs prédictifs de douleurs postopératoires sévères */}
          <div className="p-4 bg-orange-50 rounded-md border-2 border-orange-200">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">Facteurs prédictifs de douleurs postopératoires sévères</h3>
            <p className="text-sm text-orange-800 mb-4">Ce score permet d'anticiper une analgésie correcte.</p>
            
            <div className="space-y-3">
              {/* Sexe féminin */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Sexe féminin</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sexeFeminin"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.douleursPostop.sexeFeminin === 'Non'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        douleursPostop: { ...formData.douleursPostop, sexeFeminin: e.target.value, totalScore: calculateDouleursPostopScore() } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sexeFeminin"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.douleursPostop.sexeFeminin === 'Oui'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        douleursPostop: { ...formData.douleursPostop, sexeFeminin: e.target.value, totalScore: calculateDouleursPostopScore() } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
                </div>
              </div>

              {/* Âge */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Âge</label>
                <select
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-sm"
                  value={formData.douleursPostop?.age || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    douleursPostop: { ...(formData.douleursPostop || {}), age: e.target.value, totalScore: calculateDouleursPostopScore() } 
                  })}
                >
                  <option value="">Sélectionner...</option>
                  <option value="< 30 ans">&lt; 30 ans</option>
                  <option value="30 à 65 ans">30 à 65 ans</option>
                  <option value="> 65 ans">&gt; 65 ans</option>
                </select>
              </div>

              {/* Douleur préopératoire au site chirurgical */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Douleur préopératoire au site chirurgical</label>
                <select
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-sm"
                  value={formData.douleursPostop?.douleurPreopSite || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    douleursPostop: { ...(formData.douleursPostop || {}), douleurPreopSite: e.target.value, totalScore: calculateDouleursPostopScore() } 
                  })}
                >
                  <option value="">Sélectionner...</option>
                  <option value="Non">Non</option>
                  <option value="Oui">Oui</option>
                </select>
              </div>

              {/* Usage régulier d'opiacés */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Usage régulier d'opiacés</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="usageOpiaces"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.douleursPostop.usageOpiaces === 'Non'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        douleursPostop: { ...formData.douleursPostop, usageOpiaces: e.target.value, totalScore: calculateDouleursPostopScore() } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="usageOpiaces"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.douleursPostop.usageOpiaces === 'Oui'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        douleursPostop: { ...formData.douleursPostop, usageOpiaces: e.target.value, totalScore: calculateDouleursPostopScore() } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
                </div>
              </div>

              {/* Usage régulier d'antidépresseurs/anxiolytiques */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Usage régulier d'antidépresseurs/anxiolytiques</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="usageAntidepresseurs"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.douleursPostop.usageAntidepresseurs === 'Non'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        douleursPostop: { ...formData.douleursPostop, usageAntidepresseurs: e.target.value, totalScore: calculateDouleursPostopScore() } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="usageAntidepresseurs"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.douleursPostop.usageAntidepresseurs === 'Oui'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        douleursPostop: { ...formData.douleursPostop, usageAntidepresseurs: e.target.value, totalScore: calculateDouleursPostopScore() } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
                </div>
              </div>

              {/* Chirurgie par tomie */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Chirurgie par tomie</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="chirurgieTomie"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.douleursPostop.chirurgieTomie === 'Non'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        douleursPostop: { ...formData.douleursPostop, chirurgieTomie: e.target.value, totalScore: calculateDouleursPostopScore() } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="chirurgieTomie"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.douleursPostop.chirurgieTomie === 'Oui'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        douleursPostop: { ...formData.douleursPostop, chirurgieTomie: e.target.value, totalScore: calculateDouleursPostopScore() } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
                </div>
              </div>

              {/* Type de chirurgie */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Type de chirurgie</label>
                <select
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-sm"
                  value={formData.douleursPostop?.typeChirurgie || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    douleursPostop: { ...(formData.douleursPostop || {}), typeChirurgie: e.target.value, totalScore: calculateDouleursPostopScore() } 
                  })}
                >
                  <option value="">Sélectionner...</option>
                  <option value="Orthopédique">Orthopédique</option>
                  <option value="Thoracique">Thoracique</option>
                  <option value="Abdominale">Abdominale</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              {/* Chirurgie de longue durée */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Chirurgie de longue durée (&gt; 120 minutes)</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="chirurgieLongueDuree"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.douleursPostop.chirurgieLongueDuree === 'Non'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        douleursPostop: { ...formData.douleursPostop, chirurgieLongueDuree: e.target.value, totalScore: calculateDouleursPostopScore() } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="chirurgieLongueDuree"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.douleursPostop.chirurgieLongueDuree === 'Oui'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        douleursPostop: { ...formData.douleursPostop, chirurgieLongueDuree: e.target.value, totalScore: calculateDouleursPostopScore() } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
                </div>
              </div>

              {/* Obésité importante */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Obésité importante (BMI &gt; 30 kg/m²)</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="obesiteImportante"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.douleursPostop.obesiteImportante === 'Non'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        douleursPostop: { ...formData.douleursPostop, obesiteImportante: e.target.value, totalScore: calculateDouleursPostopScore() } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="obesiteImportante"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.douleursPostop.obesiteImportante === 'Oui'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        douleursPostop: { ...formData.douleursPostop, obesiteImportante: e.target.value, totalScore: calculateDouleursPostopScore() } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
                </div>
              </div>

              {/* Patient très anxieux */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Patient très anxieux lors de la visite préopératoire</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="patientTresAnxieux"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.douleursPostop.patientTresAnxieux === 'Non'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        douleursPostop: { ...formData.douleursPostop, patientTresAnxieux: e.target.value, totalScore: calculateDouleursPostopScore() } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="patientTresAnxieux"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.douleursPostop.patientTresAnxieux === 'Oui'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        douleursPostop: { ...formData.douleursPostop, patientTresAnxieux: e.target.value, totalScore: calculateDouleursPostopScore() } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Score total */}
            <div className="mt-4 p-3 bg-orange-100 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-orange-900">TOTAL</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-orange-800">Score maximal = 15 points</span>
                  <span className="text-xs text-orange-800">Risque important si score &gt; 4/15</span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <input
                  type="number"
                  readOnly
                  value={calculateDouleursPostopScore()}
                  className="w-16 px-2 py-1 border border-orange-300 rounded-md bg-orange-50 text-orange-900 font-semibold text-center"
                />
                <span className="text-sm text-orange-800">points</span>
              </div>
            </div>

            {/* Risque de douleurs post-opératoires sévères (automatique) */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Risque de douleurs post-opératoires sévères</label>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-md border text-sm font-medium ${
                  formData.douleursPostop?.risqueDouleursSeveres === 'Oui'
                    ? 'bg-red-50 text-red-700 border-red-300'
                    : 'bg-green-50 text-green-700 border-green-300'
                }`}
              >
                {formData.douleursPostop?.risqueDouleursSeveres || 'Non'}
              </div>
            </div>
          </div>
        </section>

        {/* Médicaments (et dosage) */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#1e3a8a] border-b-2 border-[#0ea5e9] pb-2 mb-4">
            Médicaments (et dosage)
          </h2>
          <textarea
            className="w-full px-3 py-2 border-2 border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={4}
            placeholder="Liste des médicaments actuels avec dosage..."
            value={formData.medicaments}
            onChange={(e) => setFormData({ ...formData, medicaments: e.target.value })}
          />
        </section>

        {/* Examens para-cliniques */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#1e3a8a] border-b-2 border-[#0ea5e9] pb-2 mb-4">
            Examens para-cliniques
          </h2>
          
          <div className="space-y-4">
            {/* Biologie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Biologie</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="biologie"
                    value="Non"
                    {...getFieldProps()}
                    checked={formData.examensParacliniques.biologie === 'Non'}
                    onChange={(e) => setFormData({
                      ...formData,
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        biologie: e.target.value,
                        biologieCommentaire: e.target.value === 'Non' ? '' : formData.examensParacliniques.biologieCommentaire
                      } 
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Non</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="biologie"
                    value="Oui"
                    {...getFieldProps()}
                    checked={formData.examensParacliniques.biologie === 'Oui'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        biologie: e.target.value 
                      } 
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Oui</span>
                </label>
              </div>
              
              {/* Champ de commentaire conditionnel */}
              {formData.examensParacliniques.biologie === 'Oui' && (
                <div className="mt-3">
                  <input
                    type="text"
                    {...getFieldProps()}
                    placeholder="Commentaires sur la biologie..."
                    value={formData.examensParacliniques.biologieCommentaire || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        biologieCommentaire: e.target.value 
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  />
                </div>
              )}
            </div>

            {/* Hémostase */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hémostase</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hemostase"
                    value="Non"
                    {...getFieldProps()}
                    checked={formData.examensParacliniques.hemostase === 'Non'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        hemostase: e.target.value,
                        hemostaseCommentaire: e.target.value === 'Non' ? '' : formData.examensParacliniques.hemostaseCommentaire
                      } 
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Non</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hemostase"
                    value="Oui"
                    {...getFieldProps()}
                    checked={formData.examensParacliniques.hemostase === 'Oui'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        hemostase: e.target.value 
                      } 
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Oui</span>
                </label>
              </div>
              
              {/* Champ de commentaire conditionnel */}
              {formData.examensParacliniques.hemostase === 'Oui' && (
                <div className="mt-3">
                  <input
                    type="text"
                    {...getFieldProps()}
                    placeholder="Commentaires sur l'hémostase..."
                    value={formData.examensParacliniques.hemostaseCommentaire || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        hemostaseCommentaire: e.target.value 
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  />
                </div>
              )}
            </div>

            {/* Groupe sanguin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Groupe sanguin</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="groupeSanguin"
                    value="Non"
                    {...getFieldProps()}
                    checked={formData.examensParacliniques.groupeSanguin === 'Non'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        groupeSanguin: e.target.value,
                        groupeSanguinCommentaire: e.target.value === 'Non' ? '' : formData.examensParacliniques.groupeSanguinCommentaire
                      } 
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Non</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="groupeSanguin"
                    value="Oui"
                    {...getFieldProps()}
                    checked={formData.examensParacliniques.groupeSanguin === 'Oui'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        groupeSanguin: e.target.value 
                      } 
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Oui</span>
                </label>
              </div>
              
              {/* Champ de commentaire conditionnel */}
              {formData.examensParacliniques.groupeSanguin === 'Oui' && (
                <div className="mt-3">
                  <input
                    type="text"
                    {...getFieldProps()}
                    placeholder="Commentaires sur le groupe sanguin..."
                    value={formData.examensParacliniques.groupeSanguinCommentaire || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        groupeSanguinCommentaire: e.target.value 
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  />
                </div>
              )}
            </div>

            {/* ECG repos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ECG repos</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="ecgRepos"
                    value="Non"
                    {...getFieldProps()}
                    checked={formData.examensParacliniques.ecgRepos === 'Non'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        ecgRepos: e.target.value,
                        ecgReposCommentaire: e.target.value === 'Non' ? '' : formData.examensParacliniques.ecgReposCommentaire
                      } 
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Non</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="ecgRepos"
                    value="Oui"
                    {...getFieldProps()}
                    checked={formData.examensParacliniques.ecgRepos === 'Oui'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        ecgRepos: e.target.value 
                      } 
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Oui</span>
                </label>
              </div>
              
              {/* Champ de commentaire conditionnel */}
              {formData.examensParacliniques.ecgRepos === 'Oui' && (
                <div className="mt-3">
                  <input
                    type="text"
                    {...getFieldProps()}
                    placeholder="Commentaires sur l'ECG repos..."
                    value={formData.examensParacliniques.ecgReposCommentaire || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        ecgReposCommentaire: e.target.value 
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  />
                </div>
              )}
            </div>

            {/* RX thorax */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">RX thorax</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="rxThorax"
                    value="Non"
                    {...getFieldProps()}
                    checked={formData.examensParacliniques.rxThorax === 'Non'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        rxThorax: e.target.value,
                        rxThoraxCommentaire: e.target.value === 'Non' ? '' : formData.examensParacliniques.rxThoraxCommentaire
                      } 
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Non</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="rxThorax"
                    value="Oui"
                    {...getFieldProps()}
                    checked={formData.examensParacliniques.rxThorax === 'Oui'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        rxThorax: e.target.value 
                      } 
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Oui</span>
                </label>
              </div>
              
              {/* Champ de commentaire conditionnel */}
              {formData.examensParacliniques.rxThorax === 'Oui' && (
                <div className="mt-3">
                  <input
                    type="text"
                    {...getFieldProps()}
                    placeholder="Commentaires sur la RX thorax..."
                    value={formData.examensParacliniques.rxThoraxCommentaire || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        rxThoraxCommentaire: e.target.value 
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  />
                </div>
              )}
            </div>

            {/* EFR */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">EFR</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="efr"
                    value="Non"
                    {...getFieldProps()}
                    checked={formData.examensParacliniques.efr === 'Non'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        efr: e.target.value,
                        efrCommentaire: e.target.value === 'Non' ? '' : formData.examensParacliniques.efrCommentaire
                      } 
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Non</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="efr"
                    value="Oui"
                    {...getFieldProps()}
                    checked={formData.examensParacliniques.efr === 'Oui'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        efr: e.target.value 
                      } 
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Oui</span>
                </label>
              </div>
              
              {/* Champ de commentaire conditionnel */}
              {formData.examensParacliniques.efr === 'Oui' && (
                <div className="mt-3">
                  <input
                    type="text"
                    {...getFieldProps()}
                    placeholder="Commentaires sur l'EFR..."
                    value={formData.examensParacliniques.efrCommentaire || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        efrCommentaire: e.target.value 
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  />
                </div>
              )}
            </div>

            {/* Test effort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test effort</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="testEffort"
                    value="Non"
                    {...getFieldProps()}
                    checked={formData.examensParacliniques.testEffort === 'Non'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        testEffort: e.target.value,
                        testEffortCommentaire: e.target.value === 'Non' ? '' : formData.examensParacliniques.testEffortCommentaire
                      } 
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Non</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="testEffort"
                    value="Oui"
                    {...getFieldProps()}
                    checked={formData.examensParacliniques.testEffort === 'Oui'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        testEffort: e.target.value 
                      } 
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Oui</span>
                </label>
              </div>
              
              {/* Champ de commentaire conditionnel */}
              {formData.examensParacliniques.testEffort === 'Oui' && (
                <div className="mt-3">
                  <input
                    type="text"
                    {...getFieldProps()}
                    placeholder="Commentaires sur le test effort..."
                    value={formData.examensParacliniques.testEffortCommentaire || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        testEffortCommentaire: e.target.value 
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  />
                </div>
              )}
            </div>

            {/* Autres */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Autres</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="autres"
                    value="Non"
                    {...getFieldProps()}
                    checked={formData.examensParacliniques.autres === 'Non'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        autres: e.target.value,
                        autresCommentaire: e.target.value === 'Non' ? '' : formData.examensParacliniques.autresCommentaire
                      } 
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Non</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="autres"
                    value="Oui"
                    {...getFieldProps()}
                    checked={formData.examensParacliniques.autres === 'Oui'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        autres: e.target.value 
                      } 
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Oui</span>
                </label>
              </div>
              
              {/* Champ de commentaire conditionnel */}
              {formData.examensParacliniques.autres === 'Oui' && (
                <div className="mt-3">
                  <input
                    type="text"
                    {...getFieldProps()}
                    placeholder="Commentaires sur les autres examens..."
                    value={formData.examensParacliniques.autresCommentaire || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      examensParacliniques: { 
                        ...formData.examensParacliniques, 
                        autresCommentaire: e.target.value 
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  />
                </div>
              )}
            </div>

            {/* Commentaires */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Commentaires</label>
                  <input
                    type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                placeholder="Si oui, case commentaire en face de l'item"
                value={formData.examensParacliniques?.commentaires || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                  examensParacliniques: { ...(formData.examensParacliniques || {}), commentaires: e.target.value } 
                    })}
                  />
              <p className="text-xs text-gray-500 mt-1">Si oui, case commentaire en face de l'item</p>
              </div>
          </div>
        </section>

        {/* Avis spécialisés */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#1e3a8a] border-b-2 border-[#0ea5e9] pb-2 mb-4">
            Avis spécialisés
          </h2>
          
          <div className="space-y-4">
            {/* Avis demandés */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Avis demandés</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="avisDemandes"
                    value="Non"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.avisSpecialises.avisDemandes === 'Non'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      avisSpecialises: { ...formData.avisSpecialises, avisDemandes: e.target.value } 
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Non</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="avisDemandes"
                    value="Oui"
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.avisSpecialises.avisDemandes === 'Oui'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      avisSpecialises: { ...formData.avisSpecialises, avisDemandes: e.target.value } 
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Oui</span>
                </label>
              </div>
            </div>

            {/* Commentaires */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Commentaires</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
            placeholder="Cardiologie, pneumologie, endocrinologie, etc."
                value={formData.avisSpecialises?.commentaires || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  avisSpecialises: { ...(formData.avisSpecialises || {}), commentaires: e.target.value } 
                })}
              />
            </div>
          </div>
        </section>

        {/* Check-list Admission Hôpital de Jour */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#1e3a8a] border-b-2 border-[#0ea5e9] pb-2 mb-4">
            Check-list Admission Hôpital de Jour
          </h2>
          
          <div className="bg-gray-100 rounded-lg p-6 border-l-4 border-[#0ea5e9]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#1e3a8a] bg-[#0ea5e9] text-white px-4 py-2 rounded-md">
                12. Checklist admission HospiDay
              </h3>
            </div>

            <div className="space-y-4">
              {/* ASA 3 mal équilibré */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ASA 3 mal équilibré</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center">
              <input
                      type="radio"
                      name="asa3MalEquilibre"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.checklistHDJ.asa3MalEquilibre === 'Non'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        checklistHDJ: { ...formData.checklistHDJ, asa3MalEquilibre: e.target.value } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="asa3MalEquilibre"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.checklistHDJ.asa3MalEquilibre === 'Oui'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        checklistHDJ: { ...formData.checklistHDJ, asa3MalEquilibre: e.target.value } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
            </div>
              </div>

              {/* Souffre d'apnées du sommeil diagnostiquées (calcul automatique) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Souffre d'apnées du sommeil diagnostiquées</label>
                <div
                  className={`inline-flex items-center px-3 py-2 rounded-md border text-sm font-medium ${
                    calculateStopBangScore() >= 3
                      ? 'bg-red-50 text-red-700 border-red-300'
                      : 'bg-green-50 text-green-700 border-green-300'
                  }`}
                >
                  {calculateStopBangScore() >= 3 ? 'Oui (Score ≥ 3)' : 'Non (Score < 3)'}
            </div>
                <p className="mt-2 text-xs text-gray-500">
                  Basé sur le score STOP-BANG: {calculateStopBangScore()}/8
                </p>
              </div>

              {/* Conduit un véhicule après l'intervention */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Conduit un véhicule après l'intervention</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center">
              <input
                      type="radio"
                      name="conduitVehicule"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.checklistHDJ.conduitVehicule === 'Non'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        checklistHDJ: { ...formData.checklistHDJ, conduitVehicule: e.target.value } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="conduitVehicule"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.checklistHDJ.conduitVehicule === 'Oui'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        checklistHDJ: { ...formData.checklistHDJ, conduitVehicule: e.target.value } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
            </div>
              </div>

              {/* Rentre seul à son domicile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rentre seul à son domicile</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center">
              <input
                      type="radio"
                      name="rentreSeul"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.checklistHDJ.rentreSeul === 'Non'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        checklistHDJ: { ...formData.checklistHDJ, rentreSeul: e.target.value } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rentreSeul"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.checklistHDJ.rentreSeul === 'Oui'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        checklistHDJ: { ...formData.checklistHDJ, rentreSeul: e.target.value } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
                </div>
              </div>

              {/* Est non accompagné la première nuit post-opératoire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Est non accompagné la première nuit post-opératoire</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="nonAccompagneNuit"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.checklistHDJ.nonAccompagneNuit === 'Non'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        checklistHDJ: { ...formData.checklistHDJ, nonAccompagneNuit: e.target.value } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="nonAccompagneNuit"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.checklistHDJ.nonAccompagneNuit === 'Oui'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        checklistHDJ: { ...formData.checklistHDJ, nonAccompagneNuit: e.target.value } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
                </div>
              </div>

              {/* A plus de 75 ans */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">A plus de 75 ans</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="plus75Ans"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.checklistHDJ.plus75Ans === 'Non'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        checklistHDJ: { ...formData.checklistHDJ, plus75Ans: e.target.value } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="plus75Ans"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.checklistHDJ.plus75Ans === 'Oui'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        checklistHDJ: { ...formData.checklistHDJ, plus75Ans: e.target.value } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
                </div>
              </div>

              {/* La douleur post-opératoire n'est pas bien contrôlable */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">La douleur post-opératoire n'est pas bien contrôlable</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="douleurNonControllable"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.checklistHDJ.douleurNonControllable === 'Non'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        checklistHDJ: { ...formData.checklistHDJ, douleurNonControllable: e.target.value } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="douleurNonControllable"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.checklistHDJ.douleurNonControllable === 'Oui'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        checklistHDJ: { ...formData.checklistHDJ, douleurNonControllable: e.target.value } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
                </div>
              </div>

              {/* L'intervention peut entraîner un saignement post-opératoire important */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">L'intervention peut entraîner un saignement post-opératoire important</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="saignementImportant"
                      value="Non"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.checklistHDJ.saignementImportant === 'Non'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        checklistHDJ: { ...formData.checklistHDJ, saignementImportant: e.target.value } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Non</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="saignementImportant"
                      value="Oui"
                      className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                      checked={formData.checklistHDJ.saignementImportant === 'Oui'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        checklistHDJ: { ...formData.checklistHDJ, saignementImportant: e.target.value } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Oui</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Admission HospiDay (calcul automatique) */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Admission HospiDay</label>
              <div
                className={`inline-flex items-center px-3 py-2 rounded-md border text-sm font-medium ${
                  formData.checklistHDJ?.admissionHospiDay === 'Admis'
                    ? 'bg-green-50 text-green-700 border-green-300'
                    : formData.checklistHDJ?.admissionHospiDay === 'Non admis'
                    ? 'bg-red-50 text-red-700 border-red-300'
                    : 'bg-yellow-50 text-yellow-700 border-yellow-300'
                }`}
              >
                {formData.checklistHDJ?.admissionHospiDay || 'À évaluer'}
              </div>
            </div>

            {/* Commentaire */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                rows={3}
                placeholder="Commentaires additionnels..."
                value={formData.checklistHDJ?.commentaire || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  checklistHDJ: { ...(formData.checklistHDJ || {}), commentaire: e.target.value } 
                })}
              />
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#1e3a8a] border-b-2 border-[#0ea5e9] pb-2 mb-4">
            Conclusion
          </h2>
          
          {/* Score ASA */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Score ASA</label>
            <div className="flex items-center gap-4">
              {['I', 'II', 'III', 'IV', 'V'].map((score) => (
                <label key={score} className="flex items-center">
                  <input
                    type="radio"
                    name="scoreASA"
                    value={score}
                    className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                    checked={formData.conclusion.scoreASA === score}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      conclusion: { ...formData.conclusion, scoreASA: e.target.value } 
                    })}
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">{score}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Type d'anesthésie proposée */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Type d'anesthésie proposée</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] bg-white"
              value={formData.conclusion?.typeAnesthesie || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                conclusion: { ...(formData.conclusion || {}), typeAnesthesie: e.target.value } 
              })}
            >
              <option value="" disabled>Choisir...</option>
              <option value="Générale">Générale</option>
              <option value="Locorégionale">Locorégionale</option>
              <option value="Combinée">Combinée</option>
            </select>
          </div>

          {/* Adaptation proposée du traitement médicamenteux */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Adaptation proposée du traitement médicamenteux</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] bg-white"
              value={formData.conclusion?.adaptationTraitement || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                conclusion: { ...(formData.conclusion || {}), adaptationTraitement: e.target.value } 
              })}
            >
              <option value="" disabled>Choisir...</option>
              <option value="Arrêt">Arrêt</option>
              <option value="Poursuite">Poursuite</option>
              <option value="Modification">Modification</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          {/* Consentement patient */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Consentement patient ou parents</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="consentement"
                  value="Non"
                  className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                  checked={formData.conclusion.consentement === 'Non'}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    conclusion: { ...formData.conclusion, consentement: e.target.value } 
                  })}
                />
                <span className="ml-2 text-sm text-gray-700">Non</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="consentement"
                  value="Oui"
                  className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                  checked={formData.conclusion.consentement === 'Oui'}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    conclusion: { ...formData.conclusion, consentement: e.target.value } 
                  })}
                />
                <span className="ml-2 text-sm text-gray-700">Oui</span>
              </label>
            </div>
          </div>

          {/* Validation sur base des éléments fournis */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Validation sur base des éléments fournis</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="validation"
                  value="Non"
                  className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                  checked={formData.conclusion.validation === 'Non'}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    conclusion: { ...formData.conclusion, validation: e.target.value } 
                  })}
                />
                <span className="ml-2 text-sm text-gray-700">Non</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="validation"
                  value="Oui"
                  className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                  checked={formData.conclusion.validation === 'Oui'}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    conclusion: { ...formData.conclusion, validation: e.target.value } 
                  })}
                />
                <span className="ml-2 text-sm text-gray-700">Oui</span>
              </label>
            </div>
          </div>

          {/* Compléments nécessaires */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Compléments nécessaires</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="complements"
                  value="Non"
                  className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                  checked={formData.conclusion.complements === 'Non'}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    conclusion: { ...formData.conclusion, complements: e.target.value } 
                  })}
                />
                <span className="ml-2 text-sm text-gray-700">Non</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="complements"
                  value="Oui"
                  className="w-4 h-4 text-[#0ea5e9] border-gray-300 focus:ring-[#0ea5e9]"
                  checked={formData.conclusion.complements === 'Oui'}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    conclusion: { ...formData.conclusion, complements: e.target.value } 
                  })}
                />
                <span className="ml-2 text-sm text-gray-700">Oui</span>
              </label>
            </div>
          </div>

          {/* Conclusion textuelle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Conclusion</label>
          <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
              rows={8}
              placeholder="Synthèse, recommandations anesthésiques, préparation préopératoire, classification ASA..."
              value={formData.conclusion?.texte || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                conclusion: { ...(formData.conclusion || {}), texte: e.target.value } 
              })}
            />
          </div>
        </section>

        {/* Boutons d'action */}
        <div className="no-print flex justify-end space-x-4 pt-6 border-t-2 border-gray-200">
          {editMode && (
            <button 
              onClick={handleReset}
              className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition flex items-center shadow-md"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Réinitialiser
            </button>
          )}
          {editMode && (
            <button 
              onClick={handleSave}
              className="px-6 py-3 bg-[#0ea5e9] text-white rounded-md hover:bg-[#0284c7] transition flex items-center shadow-md"
            >
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </button>
          )}
          <button 
            onClick={handlePrint}
            className="px-6 py-3 bg-[#10b981] text-white rounded-md hover:bg-[#059669] transition flex items-center shadow-md"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </button>
        </div>
        
        {/* Pied de page pour l'impression */}
        <div className="print-only mt-12 pt-6 border-t-2 border-gray-300">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-semibold mb-2">Auteur:</p>
              <p className="text-sm">Nom: _______________________</p>
              <p className="text-sm mt-2">Signature: _______________________</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">Date et Heure:</p>
              <p className="text-sm">{new Date().toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}