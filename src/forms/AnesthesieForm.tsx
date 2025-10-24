import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft } from 'lucide-react';

interface AnesthesieFormProps {
  formData?: any;
  patientData?: any;
  editMode?: boolean;
  onBack?: () => void;
  onSave?: (data: any) => void;
}

const AnesthesieForm: React.FC<AnesthesieFormProps> = ({ 
  formData, 
  patientData,
  editMode = false, 
  onBack,
  onSave 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [savedForms, setSavedForms] = useState<any[]>([]);
  const [currentFormId, setCurrentFormId] = useState<number | null>(null);

  // États pour les modes anesthésiques
  const [modes, setModes] = useState({
    sedation: false,
    ag: false,
    crush: false,
    ra: false,
    apd: false,
    bloc: false
  });

  // États pour l'appareillage (tous les éléments du HTML original)
  const [appareillage, setAppareillage] = useState({
    masque: false,
    mlf: false,
    lto: false,
    orale: false,
    nasale: false,
    armee: false,
    tracheo: false,
    circuit_ouvert: false,
    circuit_ferme: false,
    bain: false,
    curarmetre: false,
    fibroscope: false,
    thermometre: false,
    air_pulse: false,
    accelerateur: false,
    perfusion: false,
    cell_saver: false,
    pas: false,
    swan_ganz: false,
    vvc: false,
    sonde_gastrique: false,
    sonde_urinaire: false
  });

  // États pour les grilles de dessin (tous les canvas du HTML original)
  const [gridData, setGridData] = useState<Record<string, any[]>>({
    main: [],
    spo2: [],
    eto2: [],
    vs: [],
    vc: [],
    pi: [],
    vent1: [],
    vent2: [],
    fi: [],
    fe: [],
    vent3: [],
    tof: [],
    hema: [],
    drogues1: [],
    drogues2: [],
    drogues3: [],
    drogues4: [],
    drogues5: [],
    perf1: [],
    perf2: [],
    perf3: [],
    perf4: [],
    perf5: [],
    sang: [],
    diurese: [],
    saignement: [],
    autres: []
  });

  // États pour le dessin
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedParam, setSelectedParam] = useState('temperature');
  const [drawingMode, setDrawingMode] = useState('line');
  const [lastPoint, setLastPoint] = useState<{x: number, y: number} | null>(null);

  // Références pour les canvas
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});

  useEffect(() => {
    const dataToUse = patientData || formData;
    if (dataToUse) {
      populateForm(dataToUse);
    }
  }, [patientData, formData]);

  const populateForm = (data: any) => {
    // Remplir les champs texte
    const textFields = [
      'salle', 'heure', 'date_intervention', 'chirurgien', 'anesthesistes',
      'tsar', 'checklist', 'position_patient', 'site_ponction', 'aiguille',
      'profondeur', 'intensite_ma', 'kt', 'dose_test', 'melange',
      'incident_alr', 'bloc_obtenu', 'alr_complement', 'alr_autre1', 'alr_autre2',
      'alr_autre3', 'alr_autre4', 'alr_autre5', 'alr_autre6', 'sao2_value', 'eto2_value',
      'vs_vi_value', 'vc_fr_value', 'pi_value', 'fio2_n2o_air',
      'halogene', 'fi_value', 'fe_value', 'tof_alr', 'hematocrite_dextro',
      'drogue1', 'drogue2', 'drogue3', 'drogue4', 'drogue5',
      'perfusion1', 'perfusion2', 'perfusion3', 'perfusion4', 'perfusion5',
      'autres_bilans', 'commentaires'
    ];
    
    textFields.forEach(field => {
      const element = document.getElementById(field) as HTMLInputElement | HTMLTextAreaElement;
      if (element && data[field]) {
        element.value = data[field];
      }
    });

    // Remplir les modes anesthésiques
    if (data.mode_sedation) setModes(prev => ({ ...prev, sedation: true }));
    if (data.mode_ag) setModes(prev => ({ ...prev, ag: true }));
    if (data.mode_crush) setModes(prev => ({ ...prev, crush: true }));
    if (data.mode_ra) setModes(prev => ({ ...prev, ra: true }));
    if (data.mode_apd) setModes(prev => ({ ...prev, apd: true }));
    if (data.mode_bloc) setModes(prev => ({ ...prev, bloc: true }));

    // Remplir l'appareillage (tous les éléments)
    if (data.appareillage_data) {
      setAppareillage(prev => ({
        ...prev,
        masque: data.appareillage_data.app_masque || false,
        mlf: data.appareillage_data.app_mlf || false,
        lto: data.appareillage_data.app_lto || false,
        orale: data.appareillage_data.app_orale || false,
        nasale: data.appareillage_data.app_nasale || false,
        armee: data.appareillage_data.app_armee || false,
        tracheo: data.appareillage_data.app_tracheo || false,
        circuit_ouvert: data.appareillage_data.app_circuit_ouvert || false,
        circuit_ferme: data.appareillage_data.app_circuit_ferme || false,
        bain: data.appareillage_data.app_bain || false,
        curarmetre: data.appareillage_data.app_curarmetre || false,
        fibroscope: data.appareillage_data.app_fibroscope || false,
        thermometre: data.appareillage_data.app_thermometre || false,
        air_pulse: data.appareillage_data.app_air_pulse || false,
        accelerateur: data.appareillage_data.app_accelerateur || false,
        perfusion: data.appareillage_data.app_perfusion || false,
        cell_saver: data.appareillage_data.app_cell_saver || false,
        pas: data.appareillage_data.app_pas || false,
        swan_ganz: data.appareillage_data.app_swan_ganz || false,
        vvc: data.appareillage_data.app_vvc || false,
        sonde_gastrique: data.appareillage_data.app_sonde_gastrique || false,
        sonde_urinaire: data.appareillage_data.app_sonde_urinaire || false
      }));
    }

    // Remplir les grilles
    if (data.grilles_data) {
      setGridData(data.grilles_data);
    }
  };

  const collectFormData = () => {
    const data: any = {
      // Informations générales
      salle: (document.getElementById('salle') as HTMLInputElement)?.value || '',
      heure: (document.getElementById('heure') as HTMLInputElement)?.value || '',
      date_intervention: (document.getElementById('date_intervention') as HTMLInputElement)?.value || '',
      chirurgien: (document.getElementById('chirurgien') as HTMLInputElement)?.value || '',
      anesthesistes: (document.getElementById('anesthesistes') as HTMLInputElement)?.value || '',
      tsar: (document.getElementById('tsar') as HTMLInputElement)?.value || '',
      checklist: (document.getElementById('checklist') as HTMLInputElement)?.value || '',
      position_patient: (document.getElementById('position_patient') as HTMLInputElement)?.value || '',
      
      // Modes anesthésiques
      mode_sedation: modes.sedation,
      mode_ag: modes.ag,
      mode_crush: modes.crush,
      mode_ra: modes.ra,
      mode_apd: modes.apd,
      mode_bloc: modes.bloc,
      
      // Détails ALR
      site_ponction: (document.getElementById('site_ponction') as HTMLInputElement)?.value || '',
      aiguille: (document.getElementById('aiguille') as HTMLInputElement)?.value || '',
      profondeur: (document.getElementById('profondeur') as HTMLInputElement)?.value || '',
      intensite_ma: (document.getElementById('intensite_ma') as HTMLInputElement)?.value || '',
      kt: (document.getElementById('kt') as HTMLInputElement)?.value || '',
      dose_test: (document.getElementById('dose_test') as HTMLInputElement)?.value || '',
      melange: (document.getElementById('melange') as HTMLInputElement)?.value || '',
      incident_alr: (document.getElementById('incident_alr') as HTMLInputElement)?.value || '',
      bloc_obtenu: (document.getElementById('bloc_obtenu') as HTMLInputElement)?.value || '',
      alr_complement: (document.getElementById('alr_complement') as HTMLInputElement)?.value || '',
      alr_autre1: (document.getElementById('alr_autre1') as HTMLInputElement)?.value || '',
      alr_autre2: (document.getElementById('alr_autre2') as HTMLInputElement)?.value || '',
      alr_autre3: (document.getElementById('alr_autre3') as HTMLInputElement)?.value || '',
      alr_autre4: (document.getElementById('alr_autre4') as HTMLInputElement)?.value || '',
      alr_autre5: (document.getElementById('alr_autre5') as HTMLInputElement)?.value || '',
      alr_autre6: (document.getElementById('alr_autre6') as HTMLInputElement)?.value || '',
      
      // Appareillage
      appareillage_data: appareillage,
      
      // Valeurs de monitoring
      sao2_value: (document.getElementById('sao2_value') as HTMLInputElement)?.value || '',
      eto2_value: (document.getElementById('eto2_value') as HTMLInputElement)?.value || '',
      vs_checked: (document.getElementById('vs_checked') as HTMLInputElement)?.checked || false,
      vs_vi_value: (document.getElementById('vs_vi_value') as HTMLInputElement)?.value || '',
      vc_checked: (document.getElementById('vc_checked') as HTMLInputElement)?.checked || false,
      vc_fr_value: (document.getElementById('vc_fr_value') as HTMLInputElement)?.value || '',
      pi_value: (document.getElementById('pi_value') as HTMLInputElement)?.value || '',
      fio2_n2o_air: (document.getElementById('fio2_n2o_air') as HTMLInputElement)?.value || '',
      halogene: (document.getElementById('halogene') as HTMLInputElement)?.value || '',
      fi_value: (document.getElementById('fi_value') as HTMLInputElement)?.value || '',
      fe_value: (document.getElementById('fe_value') as HTMLInputElement)?.value || '',
      tof_alr: (document.getElementById('tof_alr') as HTMLInputElement)?.value || '',
      hematocrite_dextro: (document.getElementById('hematocrite_dextro') as HTMLInputElement)?.value || '',
      
      // Drogues
      drogue1: (document.getElementById('drogue1') as HTMLInputElement)?.value || '',
      drogue2: (document.getElementById('drogue2') as HTMLInputElement)?.value || '',
      drogue3: (document.getElementById('drogue3') as HTMLInputElement)?.value || '',
      drogue4: (document.getElementById('drogue4') as HTMLInputElement)?.value || '',
      drogue5: (document.getElementById('drogue5') as HTMLInputElement)?.value || '',
      
      // Perfusions
      perfusion1: (document.getElementById('perfusion1') as HTMLInputElement)?.value || '',
      perfusion2: (document.getElementById('perfusion2') as HTMLInputElement)?.value || '',
      perfusion3: (document.getElementById('perfusion3') as HTMLInputElement)?.value || '',
      perfusion4: (document.getElementById('perfusion4') as HTMLInputElement)?.value || '',
      perfusion5: (document.getElementById('perfusion5') as HTMLInputElement)?.value || '',
      
      // Autres
      autres_bilans: (document.getElementById('autres_bilans') as HTMLInputElement)?.value || '',
      commentaires: (document.getElementById('commentaires') as HTMLTextAreaElement)?.value || '',
      
      // Grilles de dessin
      grilles_data: gridData
    };

    if (currentFormId) {
      data.id = currentFormId;
    }
    
    return data;
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formData = collectFormData();
      
      console.log('Données à sauvegarder:', formData);
      
      const { data: result, error } = await supabase
        .from('anesthesie_form')
        .upsert(formData)
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      console.log('Résultat sauvegarde:', result);
      
      setCurrentFormId(result.id);
      setMessage({ text: 'Formulaire sauvegardé avec succès', type: 'success' });
      
      if (onSave) {
        onSave(formData);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setMessage({ text: `Erreur lors de la sauvegarde: ${errorMessage}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = async () => {
    try {
      const { data: forms, error } = await supabase
        .from('anesthesie_form')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSavedForms(forms || []);
      setShowLoadModal(true);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setMessage({ text: 'Erreur lors du chargement des formulaires', type: 'error' });
    }
  };

  const handleLoadForm = (form: any) => {
    populateForm(form);
    setCurrentFormId(form.id);
    setShowLoadModal(false);
  };

  const handleNewForm = () => {
    // Réinitialiser tous les champs
    const textFields = [
      'salle', 'heure', 'date_intervention', 'chirurgien', 'anesthesistes',
      'tsar', 'checklist', 'position_patient', 'site_ponction', 'aiguille',
      'profondeur', 'intensite_ma', 'kt', 'dose_test', 'melange',
      'incident_alr', 'bloc_obtenu', 'alr_complement', 'alr_autre1', 'alr_autre2',
      'alr_autre3', 'alr_autre4', 'alr_autre5', 'alr_autre6', 'sao2_value', 'eto2_value',
      'vs_vi_value', 'vc_fr_value', 'pi_value', 'fio2_n2o_air',
      'halogene', 'fi_value', 'fe_value', 'tof_alr', 'hematocrite_dextro',
      'drogue1', 'drogue2', 'drogue3', 'drogue4', 'drogue5',
      'perfusion1', 'perfusion2', 'perfusion3', 'perfusion4', 'perfusion5',
      'autres_bilans', 'commentaires'
    ];
    
    textFields.forEach(field => {
      const element = document.getElementById(field) as HTMLInputElement | HTMLTextAreaElement;
      if (element) {
        element.value = '';
      }
    });

    // Réinitialiser les états
    setModes({
      sedation: false,
      ag: false,
      crush: false,
      ra: false,
      apd: false,
      bloc: false
    });

    setAppareillage({
      masque: false,
      mlf: false,
      lto: false,
      orale: false,
      nasale: false,
      armee: false,
      tracheo: false,
      circuit_ouvert: false,
      circuit_ferme: false,
      bain: false,
      curarmetre: false,
      fibroscope: false,
      thermometre: false,
      air_pulse: false,
      accelerateur: false,
      perfusion: false,
      cell_saver: false,
      pas: false,
      swan_ganz: false,
      vvc: false,
      sonde_gastrique: false,
      sonde_urinaire: false
    });

    setGridData({
      main: [],
      spo2: [],
      eto2: [],
      vs: [],
      vc: [],
      pi: [],
      vent1: [],
      vent2: [],
      fi: [],
      fe: [],
      vent3: [],
      tof: [],
      hema: [],
      drogues1: [],
      drogues2: [],
      drogues3: [],
      drogues4: [],
      drogues5: [],
      perf1: [],
      perf2: [],
      perf3: [],
      perf4: [],
      perf5: [],
      sang: [],
      diurese: [],
      saignement: [],
      autres: []
    });

    setCurrentFormId(null);
    setMessage({ text: 'Nouveau formulaire créé', type: 'success' });
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleMode = (mode: keyof typeof modes) => {
    setModes(prev => ({ ...prev, [mode]: !prev[mode] }));
  };

  const toggleAppareillage = (app: keyof typeof appareillage) => {
    setAppareillage(prev => ({ ...prev, [app]: !prev[app] }));
  };

  // Fonctions de dessin
  const initializeCanvas = (param: string) => {
    const canvas = canvasRefs.current[param];
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Définir la taille du canvas
    canvas.width = 400;
    canvas.height = 300;

    // Dessiner la grille
    drawGrid(ctx, canvas.width, canvas.height, param);
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, param: string) => {
    ctx.clearRect(0, 0, width, height);
    
    // Couleur de fond
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    // Couleur des lignes de grille
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 1;

    // Lignes verticales
    for (let x = 0; x <= width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Lignes horizontales
    for (let y = 0; y <= height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Dessiner les courbes existantes
    const points = gridData[param] || [];
    if (points.length > 0) {
      drawCurve(ctx, points, param);
    }
  };

  const drawCurve = (ctx: CanvasRenderingContext2D, points: any[], param: string) => {
    if (points.length === 0) return;

    // Couleur selon le paramètre
    const colors = {
      temperature: '#dc2626', // Rouge
      spo2: '#2563eb',        // Bleu
      fc: '#16a34a',          // Vert
      pa: '#9333ea'           // Violet
    };

    ctx.strokeStyle = colors[param as keyof typeof colors];
    ctx.lineWidth = 2;
    ctx.beginPath();

    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });

    ctx.stroke();

    // Dessiner les points
    ctx.fillStyle = colors[param as keyof typeof colors];
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const getMousePos = (canvas: HTMLCanvasElement, e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>, param: string) => {
    const canvas = canvasRefs.current[param];
    if (!canvas) return;

    const pos = getMousePos(canvas, e);
    setIsDrawing(true);
    setSelectedParam(param);
    setLastPoint(pos);

    // Ajouter le point
    const newPoints = [...(gridData[param] || []), pos];
    setGridData(prev => ({ ...prev, [param]: newPoints }));

    // Redessiner
    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawGrid(ctx, canvas.width, canvas.height, param);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>, param: string) => {
    if (!isDrawing || selectedParam !== param) return;

    const canvas = canvasRefs.current[param];
    if (!canvas) return;

    const pos = getMousePos(canvas, e);
    
    // Ajouter le point si on dessine
    if (drawingMode === 'line') {
      const newPoints = [...(gridData[param] || []), pos];
      setGridData(prev => ({ ...prev, [param]: newPoints }));
      setLastPoint(pos);

      // Redessiner
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawGrid(ctx, canvas.width, canvas.height, param);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearCanvas = (param: string) => {
    const canvas = canvasRefs.current[param];
    if (!canvas) return;

    setGridData(prev => ({ ...prev, [param]: [] }));
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawGrid(ctx, canvas.width, canvas.height, param);
    }
  };

  const clearAllCanvases = () => {
    Object.keys(gridData).forEach(param => {
      clearCanvas(param);
    });
  };

  // Initialiser les canvas au montage
  useEffect(() => {
    Object.keys(gridData).forEach(param => {
      initializeCanvas(param);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Retour</span>
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Formulaire d'Anesthésie</h1>
                <p className="text-gray-600">Enregistrement des paramètres peropératoires</p>
              </div>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleNewForm}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Nouveau
              </button>
              <button
                onClick={handleLoad}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Charger
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Imprimer
              </button>
              <button
                onClick={clearAllCanvases}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Effacer grilles
              </button>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Formulaire principal */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
              <input
                type="text"
                id="salle"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Bloc 1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
              <input
                type="time"
                id="heure"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date intervention</label>
              <input
                type="date"
                id="date_intervention"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chirurgien</label>
              <input
                type="text"
                id="chirurgien"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom du chirurgien"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Anesthésistes</label>
              <input
                type="text"
                id="anesthesistes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom des anesthésistes"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TSAR</label>
              <input
                type="text"
                id="tsar"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="TSAR"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Checklist</label>
              <input
                type="text"
                id="checklist"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Checklist"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position patient</label>
              <input
                type="text"
                id="position_patient"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Position du patient"
              />
            </div>
          </div>

          {/* Modes anesthésiques */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Modes anesthésiques</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(modes).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => toggleMode(key as keyof typeof modes)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    value 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{value ? '✓' : '○'}</div>
                    <div className="text-sm font-medium">
                      {key === 'sedation' && 'Sédation'}
                      {key === 'ag' && 'AG'}
                      {key === 'crush' && 'CRUSH'}
                      {key === 'ra' && 'RA'}
                      {key === 'apd' && 'APD'}
                      {key === 'bloc' && 'BLOC'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Appareillage complet */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Appareillage</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Object.entries(appareillage).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => toggleAppareillage(key as keyof typeof appareillage)}
                  className={`p-2 rounded-lg border-2 transition-colors ${
                    value 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xl mb-1">{value ? '✓' : '○'}</div>
                    <div className="text-xs font-medium">
                      {key === 'masque' && 'Masque'}
                      {key === 'mlf' && 'MLØ'}
                      {key === 'lto' && 'LTO'}
                      {key === 'orale' && 'Orale'}
                      {key === 'nasale' && 'Nasale'}
                      {key === 'armee' && 'Armée'}
                      {key === 'tracheo' && 'Trachéo'}
                      {key === 'circuit_ouvert' && 'Circuit Ouvert'}
                      {key === 'circuit_ferme' && 'Circuit Fermé'}
                      {key === 'bain' && 'Bain'}
                      {key === 'curarmetre' && 'Curarmètre'}
                      {key === 'fibroscope' && 'Fibroscope'}
                      {key === 'thermometre' && 'Thermomètre'}
                      {key === 'air_pulse' && 'Air Pulse'}
                      {key === 'accelerateur' && 'Accélérateur'}
                      {key === 'perfusion' && 'Perfusion'}
                      {key === 'cell_saver' && 'Cell Saver'}
                      {key === 'pas' && 'PAS'}
                      {key === 'swan_ganz' && 'Swan-Ganz'}
                      {key === 'vvc' && 'VVC'}
                      {key === 'sonde_gastrique' && 'Sonde Gastrique'}
                      {key === 'sonde_urinaire' && 'Sonde Urinaire'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section ALR */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Détails ALR</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site de ponction</label>
                <input
                  type="text"
                  id="site_ponction"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Site de ponction"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aiguille</label>
                <input
                  type="text"
                  id="aiguille"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type d'aiguille"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profondeur</label>
                <input
                  type="text"
                  id="profondeur"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Profondeur (cm)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Intensité MA</label>
                <input
                  type="text"
                  id="intensite_ma"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Intensité MA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">KT</label>
                <input
                  type="text"
                  id="kt"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="KT"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dose test</label>
                <input
                  type="text"
                  id="dose_test"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dose test"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mélange</label>
                <input
                  type="text"
                  id="melange"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mélange"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Incident ALR</label>
                <input
                  type="text"
                  id="incident_alr"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Incident ALR"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bloc obtenu</label>
                <input
                  type="text"
                  id="bloc_obtenu"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Bloc obtenu"
                />
              </div>
            </div>
            
            {/* Champs ALR supplémentaires */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ALR Complément</label>
                <input
                  type="text"
                  id="alr_complement"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ALR Complément"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Autre 1</label>
                <input
                  type="text"
                  id="alr_autre1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Autre 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Autre 2</label>
                <input
                  type="text"
                  id="alr_autre2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Autre 2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Autre 3</label>
                <input
                  type="text"
                  id="alr_autre3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Autre 3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Autre 4</label>
                <input
                  type="text"
                  id="alr_autre4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Autre 4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Autre 5</label>
                <input
                  type="text"
                  id="alr_autre5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Autre 5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Autre 6</label>
                <input
                  type="text"
                  id="alr_autre6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Autre 6"
                />
              </div>
            </div>
          </div>

          {/* Section Monitoring */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Monitoring</h3>
            
            {/* Valeurs de monitoring */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SaO₂</label>
                <input
                  type="text"
                  id="sao2_value"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SaO₂ (%)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">EtO₂</label>
                <input
                  type="text"
                  id="eto2_value"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="EtO₂ (%)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VS VI</label>
                <input
                  type="text"
                  id="vs_vi_value"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VS VI"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VC FR</label>
                <input
                  type="text"
                  id="vc_fr_value"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VC FR"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pi</label>
                <input
                  type="text"
                  id="pi_value"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Pi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FiO₂/N₂O/Air</label>
                <input
                  type="text"
                  id="fio2_n2o_air"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="FiO₂/N₂O/Air"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Halogéné</label>
                <input
                  type="text"
                  id="halogene"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Halogéné"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fi</label>
                <input
                  type="text"
                  id="fi_value"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Fi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fe</label>
                <input
                  type="text"
                  id="fe_value"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Fe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TOF ALR</label>
                <input
                  type="text"
                  id="tof_alr"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="TOF ALR"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hématocrite/Dextro</label>
                <input
                  type="text"
                  id="hematocrite_dextro"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hématocrite/Dextro"
                />
              </div>
            </div>

            {/* Checkboxes VS et VC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="vs_checked"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="vs_checked" className="text-sm font-medium text-gray-700">VS</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="vc_checked"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="vc_checked" className="text-sm font-medium text-gray-700">VC</label>
              </div>
            </div>

            {/* Grilles de dessin complètes (toutes du HTML original) */}
            <div className="space-y-6">
              {/* Canvas principal */}
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-md font-medium text-gray-700">Canvas Principal</h4>
                  <button
                    onClick={() => clearCanvas('main')}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    Effacer
                  </button>
                </div>
                <canvas
                  ref={(el) => canvasRefs.current.main = el}
                  onMouseDown={(e) => handleMouseDown(e, 'main')}
                  onMouseMove={(e) => handleMouseMove(e, 'main')}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="border border-gray-200 rounded cursor-crosshair w-full"
                  style={{ maxWidth: '400px', height: '200px' }}
                />
              </div>

              {/* Grilles de monitoring */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* SpO₂ */}
                <div className="border border-gray-300 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-blue-600">SpO₂</h4>
                    <button
                      onClick={() => clearCanvas('spo2')}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Effacer
                    </button>
                  </div>
                  <canvas
                    ref={(el) => canvasRefs.current.spo2 = el}
                    onMouseDown={(e) => handleMouseDown(e, 'spo2')}
                    onMouseMove={(e) => handleMouseMove(e, 'spo2')}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="border border-gray-200 rounded cursor-crosshair w-full"
                    style={{ height: '150px' }}
                  />
                </div>

                {/* EtO₂ */}
                <div className="border border-gray-300 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-green-600">EtO₂</h4>
                    <button
                      onClick={() => clearCanvas('eto2')}
                      className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      Effacer
                    </button>
                  </div>
                  <canvas
                    ref={(el) => canvasRefs.current.eto2 = el}
                    onMouseDown={(e) => handleMouseDown(e, 'eto2')}
                    onMouseMove={(e) => handleMouseMove(e, 'eto2')}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="border border-gray-200 rounded cursor-crosshair w-full"
                    style={{ height: '150px' }}
                  />
                </div>

                {/* VS */}
                <div className="border border-gray-300 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-purple-600">VS</h4>
                    <button
                      onClick={() => clearCanvas('vs')}
                      className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                    >
                      Effacer
                    </button>
                  </div>
                  <canvas
                    ref={(el) => canvasRefs.current.vs = el}
                    onMouseDown={(e) => handleMouseDown(e, 'vs')}
                    onMouseMove={(e) => handleMouseMove(e, 'vs')}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="border border-gray-200 rounded cursor-crosshair w-full"
                    style={{ height: '150px' }}
                  />
                </div>

                {/* VC */}
                <div className="border border-gray-300 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-orange-600">VC</h4>
                    <button
                      onClick={() => clearCanvas('vc')}
                      className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                    >
                      Effacer
                    </button>
                  </div>
                  <canvas
                    ref={(el) => canvasRefs.current.vc = el}
                    onMouseDown={(e) => handleMouseDown(e, 'vc')}
                    onMouseMove={(e) => handleMouseMove(e, 'vc')}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="border border-gray-200 rounded cursor-crosshair w-full"
                    style={{ height: '150px' }}
                  />
                </div>

                {/* Pi */}
                <div className="border border-gray-300 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-red-600">Pi</h4>
                    <button
                      onClick={() => clearCanvas('pi')}
                      className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Effacer
                    </button>
                  </div>
                  <canvas
                    ref={(el) => canvasRefs.current.pi = el}
                    onMouseDown={(e) => handleMouseDown(e, 'pi')}
                    onMouseMove={(e) => handleMouseMove(e, 'pi')}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="border border-gray-200 rounded cursor-crosshair w-full"
                    style={{ height: '150px' }}
                  />
                </div>

                {/* Ventilation 1 */}
                <div className="border border-gray-300 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-indigo-600">Ventilation 1</h4>
                    <button
                      onClick={() => clearCanvas('vent1')}
                      className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
                    >
                      Effacer
                    </button>
                  </div>
                  <canvas
                    ref={(el) => canvasRefs.current.vent1 = el}
                    onMouseDown={(e) => handleMouseDown(e, 'vent1')}
                    onMouseMove={(e) => handleMouseMove(e, 'vent1')}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="border border-gray-200 rounded cursor-crosshair w-full"
                    style={{ height: '150px' }}
                  />
                </div>

                {/* Ventilation 2 */}
                <div className="border border-gray-300 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-teal-600">Ventilation 2</h4>
                    <button
                      onClick={() => clearCanvas('vent2')}
                      className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded hover:bg-teal-200 transition-colors"
                    >
                      Effacer
                    </button>
                  </div>
                  <canvas
                    ref={(el) => canvasRefs.current.vent2 = el}
                    onMouseDown={(e) => handleMouseDown(e, 'vent2')}
                    onMouseMove={(e) => handleMouseMove(e, 'vent2')}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="border border-gray-200 rounded cursor-crosshair w-full"
                    style={{ height: '150px' }}
                  />
                </div>

                {/* Fi */}
                <div className="border border-gray-300 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-pink-600">Fi</h4>
                    <button
                      onClick={() => clearCanvas('fi')}
                      className="text-xs px-2 py-1 bg-pink-100 text-pink-700 rounded hover:bg-pink-200 transition-colors"
                    >
                      Effacer
                    </button>
                  </div>
                  <canvas
                    ref={(el) => canvasRefs.current.fi = el}
                    onMouseDown={(e) => handleMouseDown(e, 'fi')}
                    onMouseMove={(e) => handleMouseMove(e, 'fi')}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="border border-gray-200 rounded cursor-crosshair w-full"
                    style={{ height: '150px' }}
                  />
                </div>

                {/* Fe */}
                <div className="border border-gray-300 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-yellow-600">Fe</h4>
                    <button
                      onClick={() => clearCanvas('fe')}
                      className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                    >
                      Effacer
                    </button>
                  </div>
                  <canvas
                    ref={(el) => canvasRefs.current.fe = el}
                    onMouseDown={(e) => handleMouseDown(e, 'fe')}
                    onMouseMove={(e) => handleMouseMove(e, 'fe')}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="border border-gray-200 rounded cursor-crosshair w-full"
                    style={{ height: '150px' }}
                  />
                </div>

                {/* Ventilation 3 */}
                <div className="border border-gray-300 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-cyan-600">Ventilation 3</h4>
                    <button
                      onClick={() => clearCanvas('vent3')}
                      className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded hover:bg-cyan-200 transition-colors"
                    >
                      Effacer
                    </button>
                  </div>
                  <canvas
                    ref={(el) => canvasRefs.current.vent3 = el}
                    onMouseDown={(e) => handleMouseDown(e, 'vent3')}
                    onMouseMove={(e) => handleMouseMove(e, 'vent3')}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="border border-gray-200 rounded cursor-crosshair w-full"
                    style={{ height: '150px' }}
                  />
                </div>

                {/* TOF */}
                <div className="border border-gray-300 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-lime-600">TOF</h4>
                    <button
                      onClick={() => clearCanvas('tof')}
                      className="text-xs px-2 py-1 bg-lime-100 text-lime-700 rounded hover:bg-lime-200 transition-colors"
                    >
                      Effacer
                    </button>
                  </div>
                  <canvas
                    ref={(el) => canvasRefs.current.tof = el}
                    onMouseDown={(e) => handleMouseDown(e, 'tof')}
                    onMouseMove={(e) => handleMouseMove(e, 'tof')}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="border border-gray-200 rounded cursor-crosshair w-full"
                    style={{ height: '150px' }}
                  />
                </div>

                {/* Hématocrite */}
                <div className="border border-gray-300 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-amber-600">Hématocrite</h4>
                    <button
                      onClick={() => clearCanvas('hema')}
                      className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors"
                    >
                      Effacer
                    </button>
                  </div>
                  <canvas
                    ref={(el) => canvasRefs.current.hema = el}
                    onMouseDown={(e) => handleMouseDown(e, 'hema')}
                    onMouseMove={(e) => handleMouseMove(e, 'hema')}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="border border-gray-200 rounded cursor-crosshair w-full"
                    style={{ height: '150px' }}
                  />
                </div>
              </div>

              {/* Grilles Drogues */}
              <div className="border border-gray-300 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Drogues</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map(num => (
                    <div key={num} className="border border-gray-200 rounded p-2">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-medium text-gray-700">Drogue {num}</h5>
                        <button
                          onClick={() => clearCanvas(`drogues${num}`)}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        >
                          Effacer
                        </button>
                      </div>
                      <canvas
                        ref={(el) => canvasRefs.current[`drogues${num}`] = el}
                        onMouseDown={(e) => handleMouseDown(e, `drogues${num}`)}
                        onMouseMove={(e) => handleMouseMove(e, `drogues${num}`)}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        className="border border-gray-200 rounded cursor-crosshair w-full"
                        style={{ height: '120px' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Grilles Perfusions */}
              <div className="border border-gray-300 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Perfusions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map(num => (
                    <div key={num} className="border border-gray-200 rounded p-2">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-medium text-gray-700">Perfusion {num}</h5>
                        <button
                          onClick={() => clearCanvas(`perf${num}`)}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        >
                          Effacer
                        </button>
                      </div>
                      <canvas
                        ref={(el) => canvasRefs.current[`perf${num}`] = el}
                        onMouseDown={(e) => handleMouseDown(e, `perf${num}`)}
                        onMouseMove={(e) => handleMouseMove(e, `perf${num}`)}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        className="border border-gray-200 rounded cursor-crosshair w-full"
                        style={{ height: '120px' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Grilles Bilans */}
              <div className="border border-gray-300 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Bilans</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { key: 'sang', label: 'Sang' },
                    { key: 'diurese', label: 'Diurèse' },
                    { key: 'saignement', label: 'Saignement' },
                    { key: 'autres', label: 'Autres' }
                  ].map(({ key, label }) => (
                    <div key={key} className="border border-gray-200 rounded p-2">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-medium text-gray-700">{label}</h5>
                        <button
                          onClick={() => clearCanvas(key)}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        >
                          Effacer
                        </button>
                      </div>
                      <canvas
                        ref={(el) => canvasRefs.current[key] = el}
                        onMouseDown={(e) => handleMouseDown(e, key)}
                        onMouseMove={(e) => handleMouseMove(e, key)}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        className="border border-gray-200 rounded cursor-crosshair w-full"
                        style={{ height: '120px' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section Drogues */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Drogues</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Drogue 1</label>
                <input
                  type="text"
                  id="drogue1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Drogue 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Drogue 2</label>
                <input
                  type="text"
                  id="drogue2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Drogue 2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Drogue 3</label>
                <input
                  type="text"
                  id="drogue3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Drogue 3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Drogue 4</label>
                <input
                  type="text"
                  id="drogue4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Drogue 4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Drogue 5</label>
                <input
                  type="text"
                  id="drogue5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Drogue 5"
                />
              </div>
            </div>
          </div>

          {/* Section Perfusions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Perfusions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Perfusion 1</label>
                <input
                  type="text"
                  id="perfusion1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Perfusion 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Perfusion 2</label>
                <input
                  type="text"
                  id="perfusion2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Perfusion 2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Perfusion 3</label>
                <input
                  type="text"
                  id="perfusion3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Perfusion 3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Perfusion 4</label>
                <input
                  type="text"
                  id="perfusion4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Perfusion 4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Perfusion 5</label>
                <input
                  type="text"
                  id="perfusion5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Perfusion 5"
                />
              </div>
            </div>
          </div>

          {/* Section Bilans */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Bilans</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Autres bilans</label>
                <input
                  type="text"
                  id="autres_bilans"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Autres bilans"
                />
              </div>
            </div>
          </div>

          {/* Commentaires */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Commentaires</label>
            <textarea
              id="commentaires"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Commentaires additionnels..."
            />
          </div>
        </div>

        {/* Modal de chargement */}
        {showLoadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Charger un formulaire</h3>
                <button
                  onClick={() => setShowLoadModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              {savedForms.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucun formulaire sauvegardé</p>
              ) : (
                <div className="space-y-2">
                  {savedForms.map((form) => (
                    <div
                      key={form.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleLoadForm(form)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">ID: {form.id}</div>
                          <div className="text-sm text-gray-500">
                            {form.salle && `Salle: ${form.salle}`}
                            {form.chirurgien && ` | Chirurgien: ${form.chirurgien}`}
                            {form.date_intervention && ` | Date: ${form.date_intervention}`}
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(form.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnesthesieForm;