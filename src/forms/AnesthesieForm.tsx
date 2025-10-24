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

  // Variables pour le dessin (identiques au code original)
  const paramColors = {
    'temperature': 'red',
    'spo2': 'blue',
    'fc': 'green',
    'pa': 'purple'
  };
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentCanvas, setCurrentCanvas] = useState<HTMLCanvasElement | null>(null);
  const [currentGridKey, setCurrentGridKey] = useState<string>('');
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [selectedParam, setSelectedParam] = useState('temperature');
  const [drawingMode, setDrawingMode] = useState('line');
  const [gridPoints, setGridPoints] = useState<Record<string, Record<string, any[]>>>({});

  useEffect(() => {
    initializeCanvases();
    const dataToUse = patientData || formData;
    if (dataToUse) {
      populateForm(dataToUse);
    }
    
    // Exposer les fonctions React au window pour que le HTML puisse les appeler
    (window as any).ReactAnesthesieForm = {
      handleSave,
      handleLoad,
      toggleCheckbox,
      clearAllCanvases: clearAllCanvases,
      newFormulaire: newFormulaire,
      printFormulaire: printFormulaire
    };
    
    return () => {
      // Nettoyer les références au démontage
      delete (window as any).ReactAnesthesieForm;
    };
  }, [patientData, formData]);

  const initializeCanvases = () => {
    const canvases = document.querySelectorAll('canvas');
    
    canvases.forEach(canvas => {
      const canvasId = canvas.id;
      const gridKey = canvasId.replace('Canvas', '');
      
      if (!gridPoints[gridKey]) {
        setGridPoints(prev => ({
          ...prev,
          [gridKey]: {
            'temperature': [],
            'spo2': [],
            'fc': [],
            'pa': []
          }
        }));
      }
      
      resizeCanvas(canvas);
      
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('mouseout', handleMouseUp);
      
      // Support tactile
      canvas.addEventListener('touchstart', function(e: TouchEvent) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
      });
      
      canvas.addEventListener('touchmove', function(e: TouchEvent) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
      });
      
      canvas.addEventListener('touchend', function(e: TouchEvent) {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
      });
    });
  };

  const resizeCanvas = (canvas: HTMLCanvasElement) => {
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    setIsDrawing(true);
    const canvas = e.target as HTMLCanvasElement;
    setCurrentCanvas(canvas);
    setCurrentGridKey(canvas.id.replace('Canvas', ''));
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (drawingMode === 'point') {
      const gridX = Math.floor(x / 20) * 20 + 10;
      const gridY = Math.floor(y / 25) * 25 + 12.5;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawPoint(ctx, gridX, gridY, paramColors[selectedParam as keyof typeof paramColors]);
      }
      
      setGridPoints(prev => ({
        ...prev,
        [currentGridKey]: {
          ...prev[currentGridKey],
          [selectedParam]: [...(prev[currentGridKey]?.[selectedParam] || []), { x: gridX, y: gridY }]
        }
      }));
    } else {
      setLastX(x);
      setLastY(y);
      setGridPoints(prev => ({
        ...prev,
        [currentGridKey]: {
          ...prev[currentGridKey],
          [selectedParam]: [...(prev[currentGridKey]?.[selectedParam] || []), { x, y }]
        }
      }));
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing || !currentCanvas) return;
    
    const rect = currentCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = currentCanvas.getContext('2d');
    if (!ctx) return;
    
    if (drawingMode === 'point') {
      const gridX = Math.floor(x / 20) * 20 + 10;
      const gridY = Math.floor(y / 25) * 25 + 12.5;
      
      const existingPoint = gridPoints[currentGridKey]?.[selectedParam]?.find(
        (point: any) => point.x === gridX && point.y === gridY
      );
      
      if (!existingPoint) {
        drawPoint(ctx, gridX, gridY, paramColors[selectedParam as keyof typeof paramColors]);
        setGridPoints(prev => ({
          ...prev,
          [currentGridKey]: {
            ...prev[currentGridKey],
            [selectedParam]: [...(prev[currentGridKey]?.[selectedParam] || []), { x: gridX, y: gridY }]
          }
        }));
      }
    } else {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = paramColors[selectedParam as keyof typeof paramColors];
      ctx.lineWidth = 2;
      ctx.stroke();
      
      setLastX(x);
      setLastY(y);
      setGridPoints(prev => ({
        ...prev,
        [currentGridKey]: {
          ...prev[currentGridKey],
          [selectedParam]: [...(prev[currentGridKey]?.[selectedParam] || []), { x, y }]
        }
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setCurrentCanvas(null);
    setCurrentGridKey('');
  };

  const drawPoint = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  };

  const toggleCheckbox = (checkboxId: string) => {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox) {
      checkbox.textContent = checkbox.textContent === '□' ? '✓' : '□';
    }
  };

  const collectFormData = () => {
    const data: any = {
      id: currentFormId,
      salle: (document.getElementById('salle') as HTMLInputElement)?.value || '',
      heure: (document.getElementById('heure') as HTMLInputElement)?.value || '',
      date_intervention: (document.getElementById('date_intervention') as HTMLInputElement)?.value || '',
      chirurgien: (document.getElementById('chirurgien') as HTMLInputElement)?.value || '',
      anesthesistes: (document.getElementById('anesthesistes') as HTMLInputElement)?.value || '',
      tsar: (document.getElementById('tsar') as HTMLInputElement)?.value || '',
      checklist: (document.getElementById('checklist') as HTMLInputElement)?.value || '',
      position_patient: (document.getElementById('position_patient') as HTMLInputElement)?.value || '',
      
      // Modes anesthésiques
      mode_sedation: document.getElementById('mode_sedation')?.textContent === '✓',
      mode_ag: document.getElementById('mode_ag')?.textContent === '✓',
      mode_crush: document.getElementById('mode_crush')?.textContent === '✓',
      mode_ra: document.getElementById('mode_ra')?.textContent === '✓',
      mode_apd: document.getElementById('mode_apd')?.textContent === '✓',
      mode_bloc: document.getElementById('mode_bloc')?.textContent === '✓',
      
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
      appareillage_data: collectAppareillageData(),
      
      // Valeurs de monitoring
      sao2_value: (document.getElementById('sao2_value') as HTMLInputElement)?.value || '',
      eto2_value: (document.getElementById('eto2_value') as HTMLInputElement)?.value || '',
      vs_checked: document.getElementById('vs_checked')?.textContent === '✓',
      vs_vi_value: (document.getElementById('vs_vi_value') as HTMLInputElement)?.value || '',
      vc_checked: document.getElementById('vc_checked')?.textContent === '✓',
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
      
      // Données de dessin
      grilles_data: gridPoints
    };
    
    return data;
  };

  const collectAppareillageData = () => {
    const appareillageIds = [
      'app_masque', 'app_mlf', 'app_lto', 'app_orale', 'app_nasale', 'app_armee',
      'app_tracheo', 'app_circuit_ouvert', 'app_circuit_ferme', 'app_bain',
      'app_curarmetre', 'app_fibroscope', 'app_thermometre', 'app_air_pulse',
      'app_accelerateur', 'app_perfusion', 'app_cell_saver', 'app_pas',
      'app_swan_ganz', 'app_vvc', 'app_sonde_gastrique', 'app_sonde_urinaire'
    ];
    
    const data: Record<string, boolean> = {};
    appareillageIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        data[id] = element.textContent === '✓';
      }
    });
    
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
      const currentIdInput = document.getElementById('currentId') as HTMLInputElement;
      if (currentIdInput) {
        currentIdInput.value = result.id.toString();
      }
      setMessage({ text: 'Formulaire sauvegardé avec succès', type: 'success' });
      
      if (onSave) {
        onSave(formData);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setMessage({ text: `Erreur lors de la sauvegarde: ${error.message}`, type: 'error' });
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

  const loadForm = (form: any) => {
    populateForm(form);
    setCurrentFormId(form.id);
    (document.getElementById('currentId') as HTMLInputElement).value = form.id.toString();
    setShowLoadModal(false);
  };

  const populateForm = (data: any) => {
    // Champs texte simples
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
    
    // Cases à cocher - modes anesthésiques
    const checkboxModes = [
      'mode_sedation', 'mode_ag', 'mode_crush', 'mode_ra', 'mode_apd', 'mode_bloc',
      'vs_checked', 'vc_checked'
    ];
    
    checkboxModes.forEach(field => {
      const element = document.getElementById(field);
      if (element) {
        element.textContent = data[field] ? '✓' : '□';
      }
    });
    
    // Appareillage
    if (data.appareillage_data) {
      for (const [key, value] of Object.entries(data.appareillage_data)) {
        const element = document.getElementById(key);
        if (element) {
          element.textContent = value ? '✓' : '□';
        }
      }
    }
    
    // Données de dessin
    if (data.grilles_data) {
      setGridPoints(data.grilles_data);
      // Redessiner les canvas
      setTimeout(() => {
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
          redrawCanvas(canvas);
        });
      }, 100);
    }
  };

  const redrawCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const gridKey = canvas.id.replace('Canvas', '');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (const param in gridPoints[gridKey]) {
      const points = gridPoints[gridKey][param];
      const color = paramColors[param as keyof typeof paramColors];
      
      if (points.length === 0) continue;
      
      if (drawingMode === 'point') {
        points.forEach((point: any) => {
          drawPoint(ctx, point.x, point.y, color);
        });
      } else {
        if (points.length === 1) {
          drawPoint(ctx, points[0].x, points[0].y, color);
          continue;
        }
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  };

  const clearAllCanvases = () => {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
    setGridPoints({});
  };

  const newFormulaire = () => {
    // Effacer tous les champs
    const inputs = document.querySelectorAll('input[type="text"], input[type="time"], input[type="date"], textarea');
    inputs.forEach(input => {
      (input as HTMLInputElement).value = '';
    });
    
    // Réinitialiser les cases à cocher
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.textContent = '□';
    });
    
    // Effacer toutes les grilles
    clearAllCanvases();
    
    // Réinitialiser l'ID
    setCurrentFormId(null);
    (document.getElementById('currentId') as HTMLInputElement).value = '';
    
    setMessage({ text: 'Nouveau formulaire créé', type: 'success' });
  };

  const printFormulaire = () => {
    // Masquer la barre d'outils pour l'impression
    const toolbar = document.querySelector('.toolbar');
    if (toolbar) {
      toolbar.style.display = 'none';
    }
    
    // Lancer l'impression
    window.print();
    
    // Restaurer l'affichage après l'impression
    setTimeout(() => {
      if (toolbar) {
        toolbar.style.display = '';
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bouton retour */}
      {onBack && (
        <div className="p-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`mx-4 mb-4 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Contenu HTML original */}
      <div 
        dangerouslySetInnerHTML={{
          __html: `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Formulaire d'Anesthésie</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 10px;
                        background-color: #f9f9f9;
                    }
                    
                    .toolbar {
                        background-color: white;
                        border: 1px solid #2a4b8d;
                        padding: 10px;
                        margin-bottom: 10px;
                        display: flex;
                        gap: 10px;
                        align-items: center;
                        flex-wrap: wrap;
                    }
                    
                    .toolbar button {
                        background-color: #2a4b8d;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    }
                    
                    .toolbar button:hover {
                        background-color: #1a3b6d;
                    }
                    
                    .toolbar input, .toolbar select {
                        padding: 6px;
                        border: 1px solid #2a4b8d;
                        border-radius: 3px;
                        font-size: 11px;
                    }
                    
                    .status-message {
                        padding: 8px;
                        border-radius: 4px;
                        margin-bottom: 10px;
                        display: none;
                    }
                    
                    .status-success {
                        background-color: #d4edda;
                        color: #155724;
                        border: 1px solid #c3e6cb;
                    }
                    
                    .status-error {
                        background-color: #f8d7da;
                        color: #721c24;
                        border: 1px solid #f5c6cb;
                    }
                    
                    .form-container {
                        background-color: white;
                        width: 100%;
                        max-width: 1200px;
                        margin: 0 auto;
                        border: 1px solid #2a4b8d;
                    }
                    
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    
                    td, th {
                        border: 1px solid #2a4b8d;
                        padding: 2px;
                        font-size: 11px;
                    }
                    
                    .header-row td {
                        height: 65px;
                        vertical-align: middle;
                    }
                    
                    .left-column {
                        width: 400px;
                        vertical-align: top;
                        border-right: 2px solid #2a4b8d;
                    }
                    
                    .info-row td {
                        height: 65px;
                        vertical-align: middle;
                    }
                    
                    .info-label {
                        padding-left: 5px;
                    }
                    
                    .section-title {
                        background-color: #2a4b8d;
                        color: white;
                        text-align: center;
                        padding: 3px;
                        font-weight: bold;
                    }
                    
                    input[type="text"], input[type="time"], input[type="date"] {
                        width: 95%;
                        border: none;
                        border-bottom: 1px dotted #2a4b8d;
                        font-size: 11px;
                        padding: 2px;
                        background: transparent;
                    }
                    
                    input[type="text"]:focus, input[type="time"]:focus, input[type="date"]:focus {
                        outline: none;
                        border-bottom: 1px solid #2a4b8d;
                        background-color: #f0f5ff;
                    }

                    .main-field {
                        width: 100%;
                        border: none;
                        border-bottom: 1px dotted #2a4b8d;
                        font-size: 11px;
                        padding: 2px 5px;
                        background: transparent;
                        height: 18px;
                    }

                    .main-field:focus {
                        outline: none;
                        border-bottom: 1px solid #2a4b8d;
                        background-color: #f0f5ff;
                    }
                    
                    .grid-cell {
                        width: 100%;
                        height: 65px;
                        position: relative;
                    }
                    
                    .grid-background {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-image: linear-gradient(#a8c3e5 1px, transparent 1px), 
                                          linear-gradient(90deg, #a8c3e5 1px, transparent 1px);
                        background-size: 20px 25px;
                        pointer-events: none;
                        background-color: #f2f6fc;
                    }
                    
                    .grid-with-major-lines {
                        background-image: 
                            linear-gradient(#e6f0ff 1px, transparent 1px), 
                            linear-gradient(90deg, #e6f0ff 1px, transparent 1px),
                            linear-gradient(#2a4b8d 2px, transparent 2px),
                            linear-gradient(90deg, #2a4b8d 2px, transparent 2px);
                        background-size: 13px 13px, 13px 13px, 69px 69px, 69px 69px;
                        background-position: 0 0, 0 0, 0 0, 0 0;
                        background-color: white;
                        margin-top: 0px;
                        height: 100%;
                    }
                    
                    .grid-canvas {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 10;
                        cursor: crosshair;
                    }
                    
                    .vertical-text {
                        writing-mode: vertical-lr;
                        transform: rotate(180deg);
                        text-align: center;
                        padding: 5px 0;
                        height: 100%;
                        font-size: 11px;
                        color: #2a4b8d;
                        font-weight: bold;
                    }
                    
                    .checkbox-container {
                        display: flex;
                        align-items: center;
                        margin: 5px;
                        cursor: pointer;
                    }
                    
                    .checkbox {
                        display: inline-block;
                        width: 10px;
                        height: 10px;
                        border: 1px solid #000;
                        margin-right: 5px;
                        text-align: center;
                        line-height: 10px;
                        cursor: pointer;
                        font-family: Arial, sans-serif;
                    }
                    
                    .checkbox-label {
                        font-size: 11px;
                        cursor: pointer;
                    }
                    
                    .comments-section {
                        height: 150px;
                        vertical-align: top;
                    }
                    
                    .dotted-underline {
                        border-bottom: 1px dotted #2a4b8d;
                    }
                    
                    .grid-header td {
                        text-align: center;
                        font-weight: bold;
                    }
                    
                    .grid-values td {
                        text-align: center;
                    }
                    
                    .appareillage {
                        display: flex;
                        flex-wrap: wrap;
                    }
                    
                    .appareillage-column {
                        width: 50%;
                    }
                    
                    .vent-values {
                        font-size: 10px;
                        padding-left: 2px;
                    }
                    
                    .indent {
                        padding-left: 15px;
                    }
                    
                    .color-selector {
                        display: flex;
                        align-items: center;
                        margin: 5px;
                        padding: 5px;
                        background-color: #f2f6fc;
                        border: 1px solid #2a4b8d;
                        border-radius: 3px;
                    }
                    
                    .color-option {
                        width: 15px;
                        height: 65px;
                        border-radius: 50%;
                        margin-right: 10px;
                        cursor: pointer;
                        border: 2px solid transparent;
                    }
                    
                    .color-option.selected {
                        border-color: black;
                    }
                    
                    .control-panel {
                        padding: 5px;
                        background-color: #f2f6fc;
                        border-bottom: 1px solid #2a4b8d;
                        display: flex;
                        align-items: center;
                    }
                    
                    .drawing-mode-switch {
                        margin-left: auto;
                        display: flex;
                        align-items: center;
                    }
                    
                    button {
                        background-color: #2a4b8d;
                        color: white;
                        border: none;
                        padding: 3px 8px;
                        border-radius: 3px;
                        font-size: 11px;
                        cursor: pointer;
                        margin-left: 5px;
                    }
                    
                    button:hover {
                        background-color: #1a3b6d;
                    }
                    
                    .parameter-legend {
                        display: flex;
                        align-items: center;
                        margin-right: 15px;
                    }
                    
                    .legend-color {
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        margin-right: 3px;
                    }
                    
                    .legend-text {
                        font-size: 10px;
                    }
                    
                    textarea {
                        width: 98%;
                        height: 95%;
                        border: none;
                        resize: none;
                        font-size: 11px;
                    }
                    
                    textarea:focus {
                        outline: none;
                        background-color: #f0f5ff;
                    }

                    .modal {
                        display: none;
                        position: fixed;
                        z-index: 1000;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0,0,0,0.5);
                    }

                    .modal-content {
                        background-color: white;
                        margin: 5% auto;
                        padding: 20px;
                        border: 1px solid #2a4b8d;
                        width: 80%;
                        max-width: 800px;
                        border-radius: 5px;
                        max-height: 80vh;
                        overflow-y: auto;
                    }

                    .modal-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid #ddd;
                    }

                    .close {
                        color: #aaa;
                        float: right;
                        font-size: 28px;
                        font-weight: bold;
                        cursor: pointer;
                    }

                    .close:hover,
                    .close:focus {
                        color: #000;
                    }

                    .formulaires-list {
                        max-height: 400px;
                        overflow-y: auto;
                    }

                    .formulaire-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 10px;
                        border: 1px solid #ddd;
                        margin-bottom: 5px;
                        border-radius: 3px;
                        cursor: pointer;
                    }

                    .formulaire-item:hover {
                        background-color: #f5f5f5;
                    }

                    .formulaire-info {
                        flex-grow: 1;
                    }

                    .formulaire-actions {
                        display: flex;
                        gap: 5px;
                    }

                    .btn-small {
                        padding: 3px 8px;
                        font-size: 10px;
                    }
                </style>
            </head>
            <body>
                <!-- Barre d'outils -->
                <div class="toolbar">
                    <button onclick="window.newFormulaire()">Nouveau</button>
                    <button onclick="window.handleSave()">Sauvegarder</button>
                    <button onclick="window.handleLoad()">Charger</button>
                    <button onclick="window.printFormulaire()">Imprimer</button>
                    <input type="text" id="currentId" readonly placeholder="ID du formulaire" style="width: 100px;">
                    <div style="border-left: 1px solid #ccc; height: 65px; margin: 0 10px;"></div>
                    <label for="searchInput">Recherche:</label>
                    <input type="text" id="searchInput" placeholder="Chirurgien, salle..." style="width: 150px;">
                    <button id="searchBtn">Rechercher</button>
                </div>

                <!-- Messages de statut -->
                <div id="statusMessage" class="status-message"></div>

                <div class="form-container">
                    <div class="control-panel">
                        <div class="parameter-legend">
                            <div class="legend-color" style="background-color: red;"></div>
                            <span class="legend-text">T°C</span>
                        </div>
                        <div class="parameter-legend">
                            <div class="legend-color" style="background-color: blue;"></div>
                            <span class="legend-text">SpO₂</span>
                        </div>
                        <div class="parameter-legend">
                            <div class="legend-color" style="background-color: green;"></div>
                            <span class="legend-text">FC</span>
                        </div>
                        <div class="parameter-legend">
                            <div class="legend-color" style="background-color: purple;"></div>
                            <span class="legend-text">PA</span>
                        </div>
                        <div class="color-selector">
                            <div class="color-option selected" style="background-color: red;" data-param="temperature"></div>
                            <div class="color-option" style="background-color: blue;" data-param="spo2"></div>
                            <div class="color-option" style="background-color: green;" data-param="fc"></div>
                            <div class="color-option" style="background-color: purple;" data-param="pa"></div>
                        </div>
                        <div class="drawing-mode-switch">
                            <label for="drawingMode" style="font-size: 11px; margin-right: 5px;">Mode de tracé:</label>
                            <select id="drawingMode" style="font-size: 11px;">
                                <option value="line">Lignes</option>
                                <option value="point">Points</option>
                            </select>
                            <button onclick="window.clearAllCanvases()">Effacer</button>
                        </div>
                    </div>
                    <table>
                        <tr>
                            <td style="width: 60px; border-right: 0; text-align: left; padding: 5px;"><strong>Salle :</strong></td>
                            <td style="width: 100px; border-left: 0; text-align: left; padding: 0;">
                                <input type="text" id="salle" class="main-field" placeholder="Numéro de salle">
                            </td>
                            <td style="width: 8%; text-align: left; padding: 5px;"><strong>Heure :</strong></td>
                            <td colspan="3" style="border-left: 0; text-align: left; padding: 0;">
                                <input type="time" id="heure" class="main-field">
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 60px; text-align: left; padding: 5px; border-right: 0;"><strong>Date :</strong></td>
                            <td style="width: 100px; border-left: 0; padding: 0;">
                                <input type="date" id="date_intervention" class="main-field">
                            </td>
                            <td style="text-align: center; width: 4%;"><strong>T</strong></td>
                            <td style="text-align: center; width: 4%;"><strong>SpO₂</strong></td>
                            <td style="text-align: center; width: 4%;"><strong>FC</strong></td>
                            <td style="text-align: center; width: 4%;"><strong>PA</strong></td>
                        </tr>
                        <tr>
                            <td style="width: 60px; text-align: left; padding: 5px; border-right: 0; vertical-align: middle;"><strong>Chirurgien :</strong></td>
                            <td style="width: 100px; border-left: 0; padding: 0;">
                                <input type="text" id="chirurgien" class="main-field" placeholder="Nom du chirurgien">
                            </td>
                            <td style="text-align: center; height: 65px; padding: 2px;">39</td>
                            <td style="text-align: center; height: 65px; padding: 2px;">100</td>
                            <td style="text-align: center; height: 65px; padding: 2px;">200</td>
                            <td style="text-align: center; height: 65px; padding: 2px;">200</td>
                            <td rowspan="5" style="position: relative; vertical-align: top; padding: 0; height: 335px;">
                                <div class="grid-background grid-with-major-lines" style="height: 335px;"></div>
                                <canvas id="mainCanvas" class="grid-canvas"></canvas>
                            </td>
                        </tr>
                        <tr class="grid-values">
                            <td style="width: 60px; text-align: left; padding: 5px; border-right: 0;"><strong>Anesthésistes :</strong></td>
                            <td style="width: 100px; border-left: 0; padding: 0;">
                                <input type="text" id="anesthesistes" class="main-field" placeholder="Nom des anesthésistes">
                            </td>
                            <td style="text-align: center; height: 65px; padding: 2px;">38</td>
                            <td style="text-align: center; height: 65px; padding: 2px;">90</td>
                            <td style="text-align: center; height: 65px; padding: 2px;">150</td>
                            <td style="text-align: center; height: 65px; padding: 2px;">150</td>
                        </tr>
                        <tr class="grid-values">
                            <td style="width: 60px; text-align: left; padding: 5px; border-right: 0;"><strong>TSAR :</strong></td>
                            <td style="width: 100px; border-left: 0; padding: 0;">
                                <input type="text" id="tsar" class="main-field" placeholder="TSAR">
                            </td>
                            <td style="text-align: center; height: 65px; padding: 2px;">37</td>
                            <td style="text-align: center; height: 65px; padding: 2px;">80</td>
                            <td style="text-align: center; height: 65px; padding: 2px;">100</td>
                            <td style="text-align: center; height: 65px; padding: 2px;">100</td>
                        </tr>
                        <tr class="grid-values">
                            <td style="width: 60px; text-align: left; padding: 5px; border-right: 0;"><strong>CHECKLIST :</strong></td>
                            <td style="width: 100px; border-left: 0; padding: 0;">
                                <input type="text" id="checklist" class="main-field" placeholder="Checklist">
                            </td>
                            <td style="text-align: center; height: 65px; padding: 2px;">36</td>
                            <td style="text-align: center; height: 65px; padding: 2px;">70</td>
                            <td style="text-align: center; height: 65px; padding: 2px;">50</td>
                            <td style="text-align: center; height: 65px; padding: 2px;">50</td>
                        </tr>
                        <tr class="grid-values">
                            <td style="width: 60px; text-align: left; padding: 5px; border-right: 0;"><strong>Position :</strong></td>
                            <td style="width: 100px; border-left: 0; padding: 0;">
                                <input type="text" id="position_patient" class="main-field" placeholder="Position du patient">
                            </td>
                            <td style="text-align: center; height: 65px; padding: 2px;">35</td>
                            <td style="text-align: center; height: 65px; padding: 2px;">60</td>
                            <td style="text-align: center; height: 65px; padding: 2px;">0</td>
                            <td style="text-align: center; height: 65px; padding: 2px;">0</td>
                        </tr>
                        
                        <tr>
                            <td colspan="2" class="left-column" style="width: 160px; vertical-align: top; border-right: 2px solid #2a4b8d; padding: 0;">
                                <table class="mode-appareillage-table" style="width: 100%; border: none; border-collapse: collapse;">
                                    <style>
                                        .mode-appareillage-table td {
                                            border-top: none !important;
                                            border-bottom: none !important;
                                        }
                                        .mode-appareillage-table tr {
                                            border-top: none !important;
                                            border-bottom: none !important;
                                        }
                                    </style>
                                    
                                    <tr>
                                        <td class="section-title" style="">MODE ANESTHESIQUE</td>
                                        <td class="section-title">APPAREILLAGE</td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px; border-right: 1px solid #2a4b8d;">
                                            <div style="display: flex; align-items: center;">
                                                <span>SEDATION</span>
                                                <div class="checkbox" id="mode_sedation" onclick="window.toggleCheckbox('mode_sedation')">□</div>
                                            </div>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_masque" onclick="window.toggleCheckbox('app_masque')">□</div>
                                                <span>Masque</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px; border-right: 1px solid #2a4b8d;">
                                            <div style="display: flex; justify-content: space-between;">
                                                <div style="display: flex; align-items: center;">
                                                    <div class="checkbox" id="mode_ag" onclick="window.toggleCheckbox('mode_ag')">□</div>
                                                    <span style="margin-left: 5px;">AG</span>
                                                </div>
                                                <div style="display: flex; align-items: center;">
                                                    <span style="margin-right: 5px;">CRUSH</span>
                                                    <div class="checkbox" id="mode_crush" onclick="window.toggleCheckbox('mode_crush')">□</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_mlf" onclick="window.toggleCheckbox('app_mlf')">□</div>
                                                <span>MLØ</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px; border-right: 1px solid #2a4b8d;">
                                            <span>ALR</span>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_lto" onclick="window.toggleCheckbox('app_lto')">□</div>
                                                <span>ITØ</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px 3px 25px; border-right: 1px solid #2a4b8d;">
                                            <div style="display: flex; align-items: center;">
                                                <span>RA</span>
                                                <div class="checkbox" id="mode_ra" onclick="window.toggleCheckbox('mode_ra')">□</div>
                                            </div>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_orale" onclick="window.toggleCheckbox('app_orale')">□</div>
                                                <span>Orale</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px 3px 25px; border-right: 1px solid #2a4b8d;">
                                            <div style="display: flex; align-items: center;">
                                                <span>APD</span>
                                                <div class="checkbox" id="mode_apd" onclick="window.toggleCheckbox('mode_apd')">□</div>
                                            </div>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_nasale" onclick="window.toggleCheckbox('app_nasale')">□</div>
                                                <span>Nasale</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px 3px 25px; border-right: 1px solid #2a4b8d;">
                                            <div style="display: flex; align-items: center;">
                                                <span>BLOC</span>
                                                <div class="checkbox" id="mode_bloc" onclick="window.toggleCheckbox('mode_bloc')">□</div>
                                            </div>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_armee" onclick="window.toggleCheckbox('app_armee')">□</div>
                                                <span>Armée</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px; border-right: 1px solid #2a4b8d;">
                                            <div>Site de ponction <span class="dotted-underline" style="width: 60%;">&nbsp;</span></div>
                                            <div><input type="text" id="site_ponction" style="width: 100%; margin-top: 3px;" placeholder=""></div>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_tracheo" onclick="window.toggleCheckbox('app_tracheo')">□</div>
                                                <span>Trachéo</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px; border-right: 1px solid #2a4b8d;">
                                            <div><input type="text" id="alr_complement" style="width: 100%;" placeholder=""></div>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_circuit_ouvert" onclick="window.toggleCheckbox('app_circuit_ouvert')">□</div>
                                                <span>Circuit ouvert</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px; border-right: 1px solid #2a4b8d;">
                                            <div>Aiguille <span class="dotted-underline" style="width: 70%;">&nbsp;</span></div>
                                            <div><input type="text" id="aiguille" style="width: 100%; margin-top: 3px;" placeholder=""></div>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_circuit_ferme" onclick="window.toggleCheckbox('app_circuit_ferme')">□</div>
                                                <span>Circuit fermé</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px; border-right: 1px solid #2a4b8d;">
                                            <div>Profondeur <span class="dotted-underline" style="width: 65%;">&nbsp;</span></div>
                                            <div><input type="text" id="profondeur" style="width: 100%; margin-top: 3px;" placeholder=""></div>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_bain" onclick="window.toggleCheckbox('app_bain')">□</div>
                                                <span>Bain</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px; border-right: 1px solid #2a4b8d;">
                                            <div>intensité mA <span class="dotted-underline" style="width: 65%;">&nbsp;</span></div>
                                            <div><input type="text" id="intensite_ma" style="width: 100%; margin-top: 3px;" placeholder=""></div>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_curarmetre" onclick="window.toggleCheckbox('app_curarmetre')">□</div>
                                                <span>Curamètre</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px; border-right: 1px solid #2a4b8d;">
                                            <div>KT <span class="dotted-underline" style="width: 82%;">&nbsp;</span></div>
                                            <div><input type="text" id="kt" style="width: 100%; margin-top: 3px;" placeholder=""></div>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_fibroscope" onclick="window.toggleCheckbox('app_fibroscope')">□</div>
                                                <span>Fibroscope</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px; border-right: 1px solid #2a4b8d;">
                                            <div>Dose test <span class="dotted-underline" style="width: 70%;">&nbsp;</span></div>
                                            <div><input type="text" id="dose_test" style="width: 100%; margin-top: 3px;" placeholder=""></div>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_thermometre" onclick="window.toggleCheckbox('app_thermometre')">□</div>
                                                <span>Thermomètre</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px; border-right: 1px solid #2a4b8d;">
                                            <div>mélange <span class="dotted-underline" style="width: 72%;">&nbsp;</span></div>
                                            <div><input type="text" id="melange" style="width: 100%; margin-top: 3px;" placeholder=""></div>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_air_pulse" onclick="window.toggleCheckbox('app_air_pulse')">□</div>
                                                <span>Air pulsé</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px; border-right: 1px solid #2a4b8d;">
                                            <div>Incident: sang/LCR/paresthésie <span class="dotted-underline" style="width: 30%;">&nbsp;</span></div>
                                            <div><input type="text" id="incident_alr" style="width: 100%; margin-top: 3px;" placeholder=""></div>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_accelerateur" onclick="window.toggleCheckbox('app_accelerateur')">□</div>
                                                <span>Accélérateur</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px; border-right: 1px solid #2a4b8d;">
                                            <div>bloc obtenu <span class="dotted-underline" style="width: 65%;">&nbsp;</span></div>
                                            <div><input type="text" id="bloc_obtenu" style="width: 100%; margin-top: 3px;" placeholder=""></div>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_perfusion" onclick="window.toggleCheckbox('app_perfusion')">□</div>
                                                <span>de perfusion</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px; border-right: 1px solid #2a4b8d;">
                                            <div><input type="text" id="alr_autre1" style="width: 100%;" placeholder=""></div>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_cell_saver" onclick="window.toggleCheckbox('app_cell_saver')">□</div>
                                                <span>Cell saver</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px; border-right: 1px solid #2a4b8d;">
                                            <div><input type="text" id="alr_autre2" style="width: 100%;" placeholder=""></div>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_pas" onclick="window.toggleCheckbox('app_pas')">□</div>
                                                <span>PAS</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px; border-right: 1px solid #2a4b8d;">
                                            <div><input type="text" id="alr_autre3" style="width: 100%;" placeholder=""></div>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_swan_ganz" onclick="window.toggleCheckbox('app_swan_ganz')">□</div>
                                                <span>Swan Ganz</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px; border-right: 1px solid #2a4b8d;">
                                            <div><input type="text" id="alr_autre4" style="width: 100%;" placeholder=""></div>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_vvc" onclick="window.toggleCheckbox('app_vvc')">□</div>
                                                <span>VVC</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px; border-right: 1px solid #2a4b8d;">
                                            <div><input type="text" id="alr_autre5" style="width: 100%;" placeholder=""></div>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_sonde_gastrique" onclick="window.toggleCheckbox('app_sonde_gastrique')">□</div>
                                                <span>Sonde gastrique</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 3px 5px; border-right: 1px solid #2a4b8d;">
                                            <div><input type="text" id="alr_autre6" style="width: 100%;" placeholder=""></div>
                                        </td>
                                        <td style="padding: 3px 5px;">
                                            <div style="display: flex; align-items: center;">
                                                <div class="checkbox" id="app_sonde_urinaire" onclick="window.toggleCheckbox('app_sonde_urinaire')">□</div>
                                                <span>Sonde urinaire</span>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td colspan="2" class="section-title">COMMENTAIRES / INCIDENTS</td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" style="height: 150px; vertical-align: top; padding: 3px;">
                                            <textarea id="commentaires" placeholder="Commentaires et incidents..."></textarea>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td colspan="6" style="padding: 0; vertical-align: top;">
                                <table style="width: 95%; border: none;">
                                    
                                    <tr>
                                        <td style="vertical-align: middle; text-align: left; padding-left: 5px;  width: 6%;">
                                            Sa O₂
                                        </td>
                                        <td colspan="3" style="vertical-align: middle; text-align: left; padding-left: 5px; width: 14%;">
                                            <input type="text" id="sao2_value" style="width: 70%; border: none; text-align: left; float: left;" placeholder="Valeur">
                                            <span style="display: inline-block; width: 20%; text-align: right; font-size: 10px;">%</span>
                                        </td>
                                        <td class="grid-cell" id="grid-spo2" style="height: 65px; width: 39%;">
                                            <div class="grid-background"></div>
                                            <canvas id="spo2Canvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="vertical-align: middle; text-align: left; padding-left: 5px;  width: 6%;">
                                            Et O₂
                                        </td>
                                        <td colspan="3" style="vertical-align: middle; text-align: left; padding-left: 5px; width: 14%;">
                                            <input type="text" id="eto2_value" style="width: 70%; border: none; text-align: left; float: left;" placeholder="Valeur">
                                            <span style="display: inline-block; width: 20%; text-align: right; font-size: 10px;">mmHg</span>
                                        </td>
                                        <td class="grid-cell" id="grid-eto2" style="height: 65px; width: 39%;">
                                            <div class="grid-background"></div>
                                            <canvas id="eto2Canvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 0;" rowspan="8">
                                            <div class="vertical-text">VENTILATION</div>
                                        </td>
                                        <td style="vertical-align: middle; text-align: left; padding-left: 5px;  width: 6%;">
                                            <div class="checkbox-container">
                                                <div class="checkbox" id="vs_checked" onclick="window.toggleCheckbox('vs_checked')">□</div>
                                                <span class="checkbox-label">VS</span>
                                            </div>
                                        </td>
                                        <td colspan="2" style="vertical-align: middle; text-align: left; padding-left: 5px; width: 14%;">
                                            <span style="display: inline-block; width: 25px; text-align: left;">Vi</span>
                                            <input type="text" id="vs_vi_value" style="width: 60%; border: none;" placeholder="Valeur">
                                        </td>
                                        <td class="grid-cell" id="grid-vs" style="height: 65px; width: 39%;">
                                            <div class="grid-background"></div>
                                            <canvas id="vsCanvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="vertical-align: middle; text-align: left; padding-left: 5px; ">
                                            <div class="checkbox-container">
                                                <div class="checkbox" id="vc_checked" onclick="window.toggleCheckbox('vc_checked')">□</div>
                                                <span class="checkbox-label">VC</span>
                                            </div>
                                        </td>
                                        <td colspan="2" style="vertical-align: middle; text-align: left; padding-left: 5px;">
                                            <span style="display: inline-block; width: 25px; text-align: left;">FR</span>
                                            <input type="text" id="vc_fr_value" style="width: 60%; border: none;" placeholder="Valeur">
                                        </td>
                                        <td class="grid-cell" id="grid-vc" style="height: 65px; width: 200px;">
                                            <div class="grid-background"></div>
                                            <canvas id="vcCanvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style=""></td>
                                        <td colspan="2" style="vertical-align: middle; text-align: left; padding-left: 5px;">
                                            <span style="display: inline-block; width: 25px; text-align: left;">Pi</span>
                                            <input type="text" id="pi_value" style="width: 60%; border: none;" placeholder="Valeur">
                                        </td>
                                        <td class="grid-cell" id="grid-pi" style="height: 65px; width: 200px;">
                                            <div class="grid-background"></div>
                                            <canvas id="piCanvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="vertical-align: middle; text-align: left; padding-left: 5px;">
                                            Fi O₂/N₂O/Air
                                            <input type="text" id="fio2_n2o_air" style="width: 60%; border: none; margin-left: 10px;" placeholder="Valeur">
                                        </td>
                                        <td class="grid-cell" id="grid-vent1" style="height: 65px; width: 200px;">
                                            <div class="grid-background"></div>
                                            <canvas id="vent1Canvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="vertical-align: middle; text-align: left; padding-left: 5px;">
                                            HALOGÉNÉ
                                            <input type="text" id="halogene" style="width: 60%; border: none; margin-left: 10px;" placeholder="Valeur">
                                        </td>
                                        <td class="grid-cell" id="grid-vent2" style="height: 65px; width: 200px;">
                                            <div class="grid-background"></div>
                                            <canvas id="vent2Canvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="vertical-align: middle; text-align: left; padding-left: 5px; border-bottom: 1px dotted #2a4b8d;">
                                            Fi
                                            <input type="text" id="fi_value" style="width: 80%; border: none; margin-left: 10px;" placeholder="Valeur">
                                        </td>
                                        <td class="grid-cell" id="grid-fi" style="height: 65px; width: 200px;">
                                            <div class="grid-background"></div>
                                            <canvas id="fiCanvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="vertical-align: middle; text-align: left; padding-left: 5px; border-bottom: 1px dotted #2a4b8d;">
                                            Fe
                                            <input type="text" id="fe_value" style="width: 80%; border: none; margin-left: 10px;" placeholder="Valeur">
                                        </td>
                                        <td class="grid-cell" id="grid-fe" style="height: 65px; width: 200px;">
                                            <div class="grid-background"></div>
                                            <canvas id="feCanvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3"></td>
                                        <td class="grid-cell" id="grid-vent3" style="height: 65px; width: 200px;">
                                            <div class="grid-background"></div>
                                            <canvas id="vent3Canvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="4" style="vertical-align: middle; text-align: left; padding-left: 5px; border-bottom: 1px dotted #2a4b8d;">
                                            T.O.F./Niveau A.L.R.
                                            <input type="text" id="tof_alr" style="width: 60%; border: none; margin-left: 10px;" placeholder="Valeur">
                                        </td>
                                        <td class="grid-cell" id="grid-tof" style="height: 65px;">
                                            <div class="grid-background"></div>
                                            <canvas id="tofCanvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="4" style="vertical-align: middle; text-align: left; padding-left: 5px; border-bottom: 1px dotted #2a4b8d;">
                                            Hématocrite/Dextro
                                            <input type="text" id="hematocrite_dextro" style="width: 60%; border: none; margin-left: 10px;" placeholder="Valeur">
                                        </td>
                                        <td class="grid-cell" id="grid-hema">
                                            <div class="grid-background"></div>
                                            <canvas id="hemaCanvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 0;" rowspan="5">
                                            <div class="vertical-text">DROGUES</div>
                                        </td>
                                        <td colspan="3" style="height: 65px; border-bottom: 1px solid #2a4b8d;">
                                            <input type="text" id="drogue1" style="width: 100%; border: none;" placeholder="Entrée">
                                        </td>
                                        <td class="grid-cell" id="grid-drogues1">
                                            <div class="grid-background"></div>
                                            <canvas id="drogues1Canvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="height: 65px; border-bottom: 1px solid #2a4b8d;">
                                            <input type="text" id="drogue2" style="width: 100%; border: none;" placeholder="Entrée">
                                        </td>
                                        <td class="grid-cell" id="grid-drogues2">
                                            <div class="grid-background"></div>
                                            <canvas id="drogues2Canvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="height: 65px; border-bottom: 1px solid #2a4b8d;">
                                            <input type="text" id="drogue3" style="width: 100%; border: none;" placeholder="Entrée">
                                        </td>
                                        <td class="grid-cell" id="grid-drogues3">
                                            <div class="grid-background"></div>
                                            <canvas id="drogues3Canvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="height: 65px; border-bottom: 1px solid #2a4b8d;">
                                            <input type="text" id="drogue4" style="width: 100%; border: none;" placeholder="Entrée">
                                        </td>
                                        <td class="grid-cell" id="grid-drogues4">
                                            <div class="grid-background"></div>
                                            <canvas id="drogues4Canvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="height: 65px; border-bottom: 1px solid #2a4b8d;">
                                            <input type="text" id="drogue5" style="width: 100%; border: none;" placeholder="Entrée">
                                        </td>
                                        <td class="grid-cell" id="grid-drogues5">
                                            <div class="grid-background"></div>
                                            <canvas id="drogues5Canvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 0;" rowspan="5">
                                            <div class="vertical-text">PERFUSIONS</div>
                                        </td>
                                        <td colspan="3" style="height: 65px; border-bottom: 1px solid #2a4b8d;">
                                            <input type="text" id="perfusion1" style="width: 100%; border: none;" placeholder="Entrée">
                                        </td>
                                        <td class="grid-cell" id="grid-perf1">
                                            <div class="grid-background"></div>
                                            <canvas id="perf1Canvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="height: 65px; border-bottom: 1px solid #2a4b8d;">
                                            <input type="text" id="perfusion2" style="width: 100%; border: none;" placeholder="Entrée">
                                        </td>
                                        <td class="grid-cell" id="grid-perf2">
                                            <div class="grid-background"></div>
                                            <canvas id="perf2Canvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="height: 65px; border-bottom: 1px solid #2a4b8d;">
                                            <input type="text" id="perfusion3" style="width: 100%; border: none;" placeholder="Entrée">
                                        </td>
                                        <td class="grid-cell" id="grid-perf3">
                                            <div class="grid-background"></div>
                                            <canvas id="perf3Canvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="height: 65px; border-bottom: 1px solid #2a4b8d;">
                                            <input type="text" id="perfusion4" style="width: 100%; border: none;" placeholder="Entrée">
                                        </td>
                                        <td class="grid-cell" id="grid-perf4">
                                            <div class="grid-background"></div>
                                            <canvas id="perf4Canvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="height: 65px; border-bottom: 1px solid #2a4b8d;">
                                            <input type="text" id="perfusion5" style="width: 100%; border: none;" placeholder="Entrée">
                                        </td>
                                        <td class="grid-cell" id="grid-perf5">
                                            <div class="grid-background"></div>
                                            <canvas id="perf5Canvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 0;" rowspan="4">
                                            <div class="vertical-text">BILANS</div>
                                        </td>
                                        <td colspan="3" style="text-align: center; vertical-align: middle; ">SANG</td>
                                        <td class="grid-cell" id="grid-sang">
                                            <div class="grid-background"></div>
                                            <canvas id="sangCanvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="text-align: center; vertical-align: middle; ">Diurèse</td>
                                        <td class="grid-cell" id="grid-diurese">
                                            <div class="grid-background"></div>
                                            <canvas id="diureseCanvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="text-align: center; vertical-align: middle; ">Saignement</td>
                                        <td class="grid-cell" id="grid-saignement">
                                            <div class="grid-background"></div>
                                            <canvas id="saignementCanvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="text-align: left; vertical-align: middle; padding-left: 5px; ">
                                            Autres :
                                            <input type="text" id="autres_bilans" style="width: 70%; border: none; margin-left: 5px;" placeholder="Précisez">
                                        </td>
                                        <td class="grid-cell" id="grid-autres">
                                            <div class="grid-background"></div>
                                            <canvas id="autresCanvas" class="grid-canvas"></canvas>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Modal pour charger les formulaires -->
                <div id="loadModal" class="modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Charger un formulaire</h3>
                            <span class="close">&times;</span>
                        </div>
                        <div class="formulaires-list" id="formulairesList">
                            <!-- Les formulaires seront chargés ici -->
                        </div>
                    </div>
                </div>
            </body>
            </html>
          `
        }}
      />

      {/* Modal de chargement */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Charger un formulaire</h3>
              <button
                onClick={() => setShowLoadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="space-y-2">
              {savedForms.map((form) => (
                <div
                  key={form.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      ID: {form.id} - Salle {form.salle} - {form.chirurgien}
                    </div>
                    <div className="text-sm text-gray-500">
                      Date: {form.date_intervention} - Créé le: {form.created_at ? new Date(form.created_at).toLocaleString('fr-FR') : 'N/A'}
                    </div>
                  </div>
                  <button
                    onClick={() => loadForm(form)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                  >
                    Charger
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scripts pour les fonctions globales */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.toggleCheckbox = function(checkboxId) {
              const checkbox = document.getElementById(checkboxId);
              if (checkbox) {
                checkbox.textContent = checkbox.textContent === '□' ? '✓' : '□';
              }
            };
            
            window.newFormulaire = function() {
              // Effacer tous les champs
              const inputs = document.querySelectorAll('input[type="text"], input[type="time"], input[type="date"], textarea');
              inputs.forEach(input => {
                input.value = '';
              });
              
              // Réinitialiser les cases à cocher
              const checkboxes = document.querySelectorAll('.checkbox');
              checkboxes.forEach(checkbox => {
                checkbox.textContent = '□';
              });
              
              // Effacer toutes les grilles
              window.clearAllCanvases();
              
              // Réinitialiser l'ID
              document.getElementById('currentId').value = '';
            };
            
            window.handleSave = function() {
              // Cette fonction sera appelée par React
              window.ReactAnesthesieForm?.handleSave();
            };
            
            window.handleLoad = function() {
              // Cette fonction sera appelée par React
              window.ReactAnesthesieForm?.handleLoad();
            };
            
            window.printFormulaire = function() {
              // Masquer la barre d'outils pour l'impression
              const toolbar = document.querySelector('.toolbar');
              if (toolbar) {
                toolbar.style.display = 'none';
              }
              
              // Lancer l'impression
              window.print();
              
              // Restaurer l'affichage après l'impression
              setTimeout(() => {
                if (toolbar) {
                  toolbar.style.display = '';
                }
              }, 1000);
            };
            
            window.clearAllCanvases = function() {
              const canvases = document.querySelectorAll('canvas');
              canvases.forEach(canvas => {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
              });
            };
          `
        }}
      />
    </div>
  );
};

export default AnesthesieForm;