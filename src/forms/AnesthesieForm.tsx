import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  Save, 
  Printer, 
  FileText, 
  Download, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  Calendar,
  MapPin,
  Stethoscope,
  Search,
  Plus,
  Trash2
} from 'lucide-react';

interface AnesthesieFormData {
  id?: number;
  salle: string;
  heure: string;
  date_intervention: string;
  chirurgien: string;
  anesthesistes: string;
  tsar: string;
  checklist: string;
  position_patient: string;
  
  // Modes anesthésiques
  mode_sedation: boolean;
  mode_ag: boolean;
  mode_crush: boolean;
  mode_ra: boolean;
  mode_apd: boolean;
  mode_bloc: boolean;
  
  // Détails ALR
  site_ponction: string;
  aiguille: string;
  profondeur: string;
  intensite_ma: string;
  kt: string;
  dose_test: string;
  melange: string;
  incident_alr: string;
  bloc_obtenu: string;
  
  // Appareillage
  appareillage_data: Record<string, boolean>;
  
  // Valeurs de monitoring
  sao2_value: string;
  eto2_value: string;
  vs_checked: boolean;
  vs_vi_value: string;
  vc_checked: boolean;
  vc_fr_value: string;
  pi_value: string;
  fio2_n2o_air: string;
  halogene: string;
  fi_value: string;
  fe_value: string;
  tof_alr: string;
  hematocrite_dextro: string;
  
  // Drogues
  drogue1: string;
  drogue2: string;
  drogue3: string;
  drogue4: string;
  drogue5: string;
  
  // Perfusions
  perfusion1: string;
  perfusion2: string;
  perfusion3: string;
  perfusion4: string;
  perfusion5: string;
  
  // Autres
  autres_bilans: string;
  commentaires: string;
  
  // Données de dessin
  grilles_data: Record<string, any>;
  
  created_at?: string;
  updated_at?: string;
}

interface AnesthesieFormProps {
  formData?: AnesthesieFormData;
  editMode?: boolean;
  onBack?: () => void;
  onSave?: (data: AnesthesieFormData) => void;
}

const AnesthesieForm: React.FC<AnesthesieFormProps> = ({ 
  formData, 
  editMode = false, 
  onBack,
  onSave 
}) => {
  const [data, setData] = useState<AnesthesieFormData>({
    salle: '',
    heure: '',
    date_intervention: '',
    chirurgien: '',
    anesthesistes: '',
    tsar: '',
    checklist: '',
    position_patient: '',
    mode_sedation: false,
    mode_ag: false,
    mode_crush: false,
    mode_ra: false,
    mode_apd: false,
    mode_bloc: false,
    site_ponction: '',
    aiguille: '',
    profondeur: '',
    intensite_ma: '',
    kt: '',
    dose_test: '',
    melange: '',
    incident_alr: '',
    bloc_obtenu: '',
    appareillage_data: {},
    sao2_value: '',
    eto2_value: '',
    vs_checked: false,
    vs_vi_value: '',
    vc_checked: false,
    vc_fr_value: '',
    pi_value: '',
    fio2_n2o_air: '',
    halogene: '',
    fi_value: '',
    fe_value: '',
    tof_alr: '',
    hematocrite_dextro: '',
    drogue1: '',
    drogue2: '',
    drogue3: '',
    drogue4: '',
    drogue5: '',
    perfusion1: '',
    perfusion2: '',
    perfusion3: '',
    perfusion4: '',
    perfusion5: '',
    autres_bilans: '',
    commentaires: '',
    grilles_data: {}
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [savedForms, setSavedForms] = useState<AnesthesieFormData[]>([]);

  // Variables pour le dessin
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentCanvas, setCurrentCanvas] = useState<HTMLCanvasElement | null>(null);
  const [currentGridKey, setCurrentGridKey] = useState<string>('');
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [selectedParam, setSelectedParam] = useState('temperature');
  const [drawingMode, setDrawingMode] = useState('line');
  const [gridPoints, setGridPoints] = useState<Record<string, Record<string, any[]>>>({});

  const paramColors = {
    'temperature': 'red',
    'spo2': 'blue',
    'fc': 'green',
    'pa': 'purple'
  };

  useEffect(() => {
    if (formData) {
      setData(formData);
    }
    initializeCanvases();
  }, [formData]);

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

  const toggleCheckbox = (field: keyof AnesthesieFormData) => {
    setData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleInputChange = (field: keyof AnesthesieFormData, value: string | boolean) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const dataToSave = {
        ...data,
        grilles_data: gridPoints
      };

      const { error } = await supabase
        .from('anesthesie_form')
        .upsert(dataToSave);

      if (error) throw error;

      setMessage({ text: 'Formulaire sauvegardé avec succès', type: 'success' });
      if (onSave) {
        onSave(dataToSave);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setMessage({ text: 'Erreur lors de la sauvegarde', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const loadSavedForms = async () => {
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

  const loadForm = (form: AnesthesieFormData) => {
    setData(form);
    if (form.grilles_data) {
      setGridPoints(form.grilles_data);
    }
    setShowLoadModal(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
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
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Formulaire d'Anesthésie</h1>
                  <p className="text-gray-600">Enregistrement des paramètres peropératoires</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={loadSavedForms}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Charger</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Barre d'outils de dessin */}
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">T°C</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">SpO₂</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">FC</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">PA</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {Object.entries(paramColors).map(([param, color]) => (
                    <button
                      key={param}
                      onClick={() => setSelectedParam(param)}
                      className={`w-6 h-6 rounded-full border-2 ${
                        selectedParam === param ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <select
                  value={drawingMode}
                  onChange={(e) => setDrawingMode(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="line">Lignes</option>
                  <option value="point">Points</option>
                </select>
                <button
                  onClick={clearAllCanvases}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                >
                  Effacer
                </button>
              </div>
            </div>
          </div>

          {/* Contenu du formulaire */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne gauche - Informations générales */}
              <div className="lg:col-span-1 space-y-6">
                {/* Informations de base */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Générales</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
                      <input
                        type="text"
                        value={data.salle}
                        onChange={(e) => handleInputChange('salle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Numéro de salle"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                      <input
                        type="time"
                        value={data.heure}
                        onChange={(e) => handleInputChange('heure', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={data.date_intervention}
                        onChange={(e) => handleInputChange('date_intervention', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chirurgien</label>
                      <input
                        type="text"
                        value={data.chirurgien}
                        onChange={(e) => handleInputChange('chirurgien', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nom du chirurgien"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Anesthésistes</label>
                      <input
                        type="text"
                        value={data.anesthesistes}
                        onChange={(e) => handleInputChange('anesthesistes', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nom des anesthésistes"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">TSAR</label>
                      <input
                        type="text"
                        value={data.tsar}
                        onChange={(e) => handleInputChange('tsar', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="TSAR"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                      <input
                        type="text"
                        value={data.position_patient}
                        onChange={(e) => handleInputChange('position_patient', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Position du patient"
                      />
                    </div>
                  </div>
                </div>

                {/* Modes anesthésiques */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mode Anesthésique</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'mode_sedation', label: 'Sédation' },
                      { key: 'mode_ag', label: 'AG' },
                      { key: 'mode_crush', label: 'CRUSH' },
                      { key: 'mode_ra', label: 'RA' },
                      { key: 'mode_apd', label: 'APD' },
                      { key: 'mode_bloc', label: 'BLOC' }
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data[key as keyof AnesthesieFormData] as boolean}
                          onChange={() => toggleCheckbox(key as keyof AnesthesieFormData)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Commentaires */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Commentaires / Incidents</h3>
                  <textarea
                    value={data.commentaires}
                    onChange={(e) => handleInputChange('commentaires', e.target.value)}
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Commentaires et incidents..."
                  />
                </div>
              </div>

              {/* Colonne droite - Grilles de monitoring */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monitoring Peropératoire</h3>
                  
                  {/* Grille principale */}
                  <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center font-semibold text-gray-700">T</div>
                      <div className="text-center font-semibold text-gray-700">SpO₂</div>
                      <div className="text-center font-semibold text-gray-700">FC</div>
                      <div className="text-center font-semibold text-gray-700">PA</div>
                    </div>
                    <div className="relative h-80 bg-gray-50 border border-gray-200 rounded">
                      <canvas
                        id="mainCanvas"
                        className="absolute inset-0 w-full h-full cursor-crosshair"
                        style={{
                          backgroundImage: `
                            linear-gradient(#e6f0ff 1px, transparent 1px),
                            linear-gradient(90deg, #e6f0ff 1px, transparent 1px),
                            linear-gradient(#2a4b8d 2px, transparent 2px),
                            linear-gradient(90deg, #2a4b8d 2px, transparent 2px)
                          `,
                          backgroundSize: '13px 13px, 13px 13px, 69px 69px, 69px 69px'
                        }}
                      />
                    </div>
                  </div>

                  {/* Grilles spécialisées */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* SaO₂ */}
                    <div className="bg-white border border-gray-300 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Sa O₂</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={data.sao2_value}
                            onChange={(e) => handleInputChange('sao2_value', e.target.value)}
                            className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                            placeholder="Valeur"
                          />
                          <span className="text-xs text-gray-500">%</span>
                        </div>
                      </div>
                      <div className="relative h-16 bg-gray-50 border border-gray-200 rounded">
                        <canvas
                          id="spo2Canvas"
                          className="absolute inset-0 w-full h-full cursor-crosshair"
                        />
                      </div>
                    </div>

                    {/* EtO₂ */}
                    <div className="bg-white border border-gray-300 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Et O₂</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={data.eto2_value}
                            onChange={(e) => handleInputChange('eto2_value', e.target.value)}
                            className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                            placeholder="Valeur"
                          />
                          <span className="text-xs text-gray-500">mmHg</span>
                        </div>
                      </div>
                      <div className="relative h-16 bg-gray-50 border border-gray-200 rounded">
                        <canvas
                          id="eto2Canvas"
                          className="absolute inset-0 w-full h-full cursor-crosshair"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default AnesthesieForm;
