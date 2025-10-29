import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface AnesthesieFormProps {
  formData?: any;
  patientData?: any;
  editMode?: boolean;
  onBack?: () => void;
  onSave?: (data: any) => void;
}

export default function AnesthesieForm({ 
  patientData,
  editMode = false,
  onBack,
  onSave 
}: AnesthesieFormProps) {
  const [formData, setFormData] = useState({
    patientName: '',
    diagnosis: '',
    surgeon: '',
    anesthetist: '',
    dateDebut: '',
    heureDebut: '',
    dateFin: '',
    heureFin: '',
    age: '',
    premedication: '',
    traitement: '',
    indications: ''
  });

  const [currentTool, setCurrentTool] = useState('tension'); // tension, frequence, temperature, saturation
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<{
    tension: {x: number, y: number}[],
    frequence: {x: number, y: number}[],
    temperature: {x: number, y: number}[],
    saturation: {x: number, y: number}[]
  }>({
    tension: [],
    frequence: [],
    temperature: [],
    saturation: []
  });

  const colors = {
    tension: '#0000FF',      // Bleu
    frequence: '#FF0000',    // Rouge
    temperature: '#00FF00',  // Vert
    saturation: '#000000'    // Noir
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Redessiner toutes les courbes
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    (Object.keys(points) as Array<keyof typeof points>).forEach(tool => {
      const toolPoints = points[tool];
      if (toolPoints.length > 1) {
        ctx.strokeStyle = colors[tool];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(toolPoints[0].x, toolPoints[0].y);
        for (let i = 1; i < toolPoints.length; i++) {
          ctx.lineTo(toolPoints[i].x, toolPoints[i].y);
        }
        ctx.stroke();
      }
    });
  }, [points]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints(prev => ({
      ...prev,
      [currentTool]: [...prev[currentTool as keyof typeof prev], {x, y}]
    }));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints(prev => ({
      ...prev,
      [currentTool]: [...prev[currentTool as keyof typeof prev], {x, y}]
    }));
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const clearCurve = (tool: string) => {
    setPoints(prev => ({...prev, [tool]: []}));
  };

  const clearAll = () => {
    setPoints({tension: [], frequence: [], temperature: [], saturation: []});
  };

  const handleSaveClick = () => {
    if (onSave) {
      const dataToSave = {
        ...formData,
        points,
        patientData
      };
      onSave(dataToSave);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header with back button */}
      {onBack && (
        <div className="mb-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors px-4 py-2 bg-white rounded-lg shadow"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          {onSave && (
            <button
              onClick={handleSaveClick}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Sauvegarder
            </button>
          )}
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto bg-yellow-100" style={{fontFamily: 'Courier New, monospace', fontSize: '10px'}}>
        {/* Toolbar */}
        <div className="mb-4 p-3 bg-white border-2 border-black rounded flex items-center gap-4 flex-wrap">
          <div className="font-bold text-sm">Outils de traçage:</div>
          <button 
            onClick={() => setCurrentTool('tension')}
            className={`px-4 py-2 rounded font-bold ${currentTool === 'tension' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Tension (Bleu)
          </button>
          <button 
            onClick={() => setCurrentTool('frequence')}
            className={`px-4 py-2 rounded font-bold ${currentTool === 'frequence' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          >
            Fréquence (Rouge)
          </button>
          <button 
            onClick={() => setCurrentTool('temperature')}
            className={`px-4 py-2 rounded font-bold ${currentTool === 'temperature' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Température (Vert)
          </button>
          <button 
            onClick={() => setCurrentTool('saturation')}
            className={`px-4 py-2 rounded font-bold ${currentTool === 'saturation' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
          >
            Saturation (Noir)
          </button>
          <button 
            onClick={() => clearCurve(currentTool)}
            className="px-4 py-2 rounded bg-orange-500 text-white font-bold ml-4"
          >
            Effacer courbe actuelle
          </button>
          <button 
            onClick={clearAll}
            className="px-4 py-2 rounded bg-red-700 text-white font-bold"
          >
            Tout effacer
          </button>
        </div>

        {/* Header Section */}
        <div className="border-2 border-black">
          <div className="grid grid-cols-12 border-b-2 border-black">
            {/* Left column - Patient info */}
            <div className="col-span-3 border-r-2 border-black p-2">
              <div className="text-[9px] mb-1">SERVICE D'ANESTHESIOLOGIE / CHUQ</div>
              <input 
                type="text" 
                value={formData.patientName}
                onChange={(e) => handleInputChange('patientName', e.target.value)}
                className="w-full border-b border-black bg-transparent h-6 mb-2 text-sm font-bold"
                placeholder="Nom du patient"
              />
              <div className="text-center text-[9px] pb-1">Diagnostic Préopérat</div>
              <input 
                type="text" 
                value={formData.diagnosis}
                onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                className="w-full border-b border-black bg-transparent h-8 mt-1 text-center font-bold"
                placeholder="Diagnostic"
              />
            </div>
            
            {/* Middle columns - Medical staff and timing */}
            <div className="col-span-5 border-r-2 border-black p-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px]">
                <div>Chirurgien</div>
                <input type="text" value={formData.surgeon} onChange={(e) => handleInputChange('surgeon', e.target.value)} className="border-b border-black bg-transparent" />
                <div>Anesthésiste</div>
                <input type="text" value={formData.anesthetist} onChange={(e) => handleInputChange('anesthetist', e.target.value)} className="border-b border-black bg-transparent" />
                <div>Date début</div>
                <input type="text" value={formData.dateDebut} onChange={(e) => handleInputChange('dateDebut', e.target.value)} className="border-b border-black bg-transparent" />
                <div>Heure début</div>
                <input type="text" value={formData.heureDebut} onChange={(e) => handleInputChange('heureDebut', e.target.value)} className="border-b border-black bg-transparent" />
              </div>
              <div className="mt-3 text-[9px]">
                <div>Traitement en cours</div>
                <input type="text" value={formData.traitement} onChange={(e) => handleInputChange('traitement', e.target.value)} className="w-full border-b border-black bg-transparent h-6 mt-1" />
              </div>
            </div>
            
            {/* Right columns - Patient details */}
            <div className="col-span-4 p-2">
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px]">
                <div>Préliminaire</div>
                <input type="text" className="border-b border-black bg-transparent" />
                <div>Date fin</div>
                <input type="text" value={formData.dateFin} onChange={(e) => handleInputChange('dateFin', e.target.value)} className="border-b border-black bg-transparent" />
                <div>Heure fin</div>
                <input type="text" value={formData.heureFin} onChange={(e) => handleInputChange('heureFin', e.target.value)} className="border-b border-black bg-transparent" />
                <div>Age</div>
                <input type="text" value={formData.age} onChange={(e) => handleInputChange('age', e.target.value)} className="border-b border-black bg-transparent" />
              </div>
              <div className="mt-3">
                <div className="text-[9px]">Prémédication</div>
                <input type="text" value={formData.premedication} onChange={(e) => handleInputChange('premedication', e.target.value)} className="w-full border-b border-black bg-transparent h-6" />
              </div>
            </div>
          </div>

          {/* État pathologique section */}
          <div className="grid grid-cols-12 border-b-2 border-black">
            <div className="col-span-4 border-r-2 border-black p-2">
              <div className="font-bold text-[9px] mb-2">État pathologique</div>
              <div className="grid grid-cols-2 gap-x-3 text-[8px]">
                <div className="space-y-0.5">
                  <div><input type="checkbox" /> A ASA</div>
                  <div><input type="checkbox" /> B HBS</div>
                  <div><input type="checkbox" /> C Allergie</div>
                  <div><input type="checkbox" /> D Angor</div>
                  <div><input type="checkbox" /> E IDM récent</div>
                  <div><input type="checkbox" /> F Arythmie</div>
                  <div><input type="checkbox" /> G BPCO</div>
                  <div><input type="checkbox" /> H Asthme sévère</div>
                  <div><input type="checkbox" /> I Cachexie</div>
                  <div><input type="checkbox" /> J Diabète</div>
                  <div><input type="checkbox" /> K Obésité sévère</div>
                  <div><input type="checkbox" /> L Tare de choc</div>
                  <div><input type="checkbox" /> M ATCD chirurgicaux</div>
                </div>
                <div className="space-y-0.5">
                  <div><input type="checkbox" /> N Intubation</div>
                  <div><input type="checkbox" /> O Infection</div>
                  <div><input type="checkbox" /> P Infectious</div>
                  <div><input type="checkbox" /> Q Dénutrition sévère</div>
                  <div><input type="checkbox" /> R Insuff. rénale</div>
                  <div><input type="checkbox" /> S Obésité</div>
                  <div className="mt-2"><input type="checkbox" /> T Asthme</div>
                  <div><input type="checkbox" /> U Emphysème</div>
                  <div><input type="checkbox" /> V Troubles nerveu</div>
                  <div><input type="checkbox" /> W PTT Anesthésie</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="font-bold text-[9px]">Indication(s) opératoire(s)</div>
                <input type="text" value={formData.indications} onChange={(e) => handleInputChange('indications', e.target.value)} className="w-full border-b border-black bg-transparent mt-1 h-6" />
              </div>
            </div>
            
            {/* Observations */}
            <div className="col-span-4 border-r-2 border-black p-2">
              <div className="font-bold text-[9px] mb-2">Observations</div>
              <div className="text-[8px]">
                <div className="mb-3">En salle à : <input type="text" className="border-b border-black bg-transparent w-20" /></div>
                <div className="grid grid-cols-2 gap-1 mb-2">
                  <div>Ouverture de bouche <input type="text" className="border-b border-black bg-transparent w-8" /> cm</div>
                  <div>Etat dentaire <input type="text" className="border-b border-black bg-transparent w-16" /></div>
                </div>
                <div>Mallampati <input type="text" className="border-b border-black bg-transparent w-16" /></div>
              </div>
            </div>
            
            {/* Vital signs */}
            <div className="col-span-4 p-2">
              <div className="grid grid-cols-4 gap-1 text-[8px] mb-2">
                <div>TA pré</div>
                <div>Pouls</div>
                <div>[Label] Stat</div>
                <div>Ke</div>
                <input type="text" className="border-b border-black bg-transparent" />
                <input type="text" className="border-b border-black bg-transparent" />
                <input type="text" className="border-b border-black bg-transparent" />
                <input type="text" className="border-b border-black bg-transparent" />
                <div>TA post</div>
                <div>Pouls</div>
                <div>Hb</div>
                <div>TP</div>
                <input type="text" className="border-b border-black bg-transparent" />
                <input type="text" className="border-b border-black bg-transparent" />
                <input type="text" className="border-b border-black bg-transparent" />
                <input type="text" className="border-b border-black bg-transparent" />
                <div>Groupe sanguin</div>
                <div>Hb</div>
                <div>Hb</div>
                <div>PTT</div>
                <input type="text" className="border-b border-black bg-transparent" />
                <input type="text" className="border-b border-black bg-transparent" />
                <input type="text" className="border-b border-black bg-transparent" />
                <input type="text" className="border-b border-black bg-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Main monitoring grid */}
        <div className="border-2 border-t-0 border-black bg-green-100 relative" style={{height: '700px'}}>
          {/* Top left corner labels */}
          <div className="absolute top-0 left-0 border-r-2 border-b-2 border-black bg-yellow-100 text-[8px] p-1 z-10" style={{width: '100px', height: '80px'}}>
            <div className="font-bold">Spécial: Dose TA Pouls 200</div>
            <div className="mt-1 grid grid-cols-2">
              <div className="border-r border-black text-center">R</div>
              <div className="text-center">O</div>
            </div>
            <div className="mt-2 grid grid-cols-3 text-center border-t border-black pt-1">
              <div className="border-r border-black">38°</div>
              <div className="border-r border-black">SaO2</div>
              <div>180</div>
            </div>
            <div className="grid grid-cols-3 text-center border-t border-black">
              <div className="border-r border-black"></div>
              <div className="border-r border-black">PCO2</div>
              <div>180</div>
            </div>
          </div>

          {/* Time header */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-yellow-100 border-b-2 border-black flex text-xs font-bold z-10">
            <div style={{width: '100px'}} className="border-r-2 border-black"></div>
            <div className="flex-1 border-r-2 border-black text-center pt-1">8H</div>
            <div className="flex-1 border-r-2 border-black text-center pt-1">9H</div>
            <div className="flex-1 border-r-2 border-black text-center pt-1">10H</div>
            <div className="flex-1 border-r-2 border-black text-center pt-1">11H</div>
            <div className="flex-1 border-r-2 border-black text-center pt-1">12H</div>
            <div className="flex-1 text-center pt-1">13H</div>
          </div>

          {/* Grid with Y-axis labels */}
          <div className="absolute left-0 right-0 z-0" style={{top: '80px', bottom: '60px'}}>
            {/* Y-axis labels and horizontal lines */}
            {[
              {label: '36°', right: 'TA 140'},
              {label: '34°', right: '120 140'},
              {label: 'Deb op 22', right: '100 130'},
              {label: '30°', right: '80 100'},
              {label: '28°', right: '60 80'},
              {label: '26°', right: '40 60'},
              {label: '', right: 'Diurèse'},
              {label: '24°', right: 'PVC 20 40'},
              {label: 'PEP', right: '0 20'},
              {label: '22°', right: ''},
              {label: 'FIO2/ABG/SAT/HDS', right: '0'},
              {label: 'PEEP/HYPNOT/MORP', right: ''},
              {label: 'PAV/NOM/TRA/MIV', right: ''},
              {label: 'LEPTA/BARI/GTN', right: ''}
            ].map((item, i) => (
              <div key={i} className="absolute left-0 right-0 border-b border-gray-500" style={{top: `${(i / 14) * 100}%`}}>
                <div className="absolute left-0 bg-green-100 border-r-2 border-black text-[8px] px-1 flex justify-between z-10" style={{width: '100px'}}>
                  <span>{item.label}</span>
                  <span>{item.right}</span>
                </div>
              </div>
            ))}

            {/* Vertical grid lines */}
            <div className="absolute top-0 bottom-0" style={{left: '100px', right: 0}}>
              {/* Major hour lines */}
              {Array.from({length: 6}).map((_, i) => (
                <div key={`major${i}`} className="absolute top-0 bottom-0 border-r-2 border-black" style={{left: `${(i / 6) * 100}%`}}></div>
              ))}
              {/* Minor 10-minute lines */}
              {Array.from({length: 36}).map((_, i) => (
                <div key={`minor${i}`} className="absolute top-0 bottom-0 border-r border-gray-400" style={{left: `${(i / 36) * 100}%`}}></div>
              ))}
            </div>
          </div>

          {/* Canvas for drawing */}
          <canvas
            ref={canvasRef}
            className="absolute cursor-crosshair"
            style={{top: '80px', left: '100px', right: 0, bottom: '60px', width: 'calc(100% - 100px)', height: 'calc(100% - 140px)'}}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          {/* Bottom section */}
          <div className="absolute bottom-0 left-0 right-0 bg-yellow-100 border-t-2 border-black p-2 text-[8px] z-10" style={{height: '60px'}}>
            <input type="text" className="w-full border-b border-black bg-transparent h-4" />
            <input type="text" className="w-full border-b border-black bg-transparent h-4 mt-1" />
            <input type="text" className="w-full border-b border-black bg-transparent h-4 mt-1" />
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-2 border-t-0 border-black p-2">
          <div className="grid grid-cols-12 gap-2 text-[9px]">
            {/* Left column */}
            <div className="col-span-4">
              <div><span className="font-bold">RINGER-LACTATE</span></div>
              <div className="mt-1"><span className="font-bold">ATÉEP-PROSP-ELISA</span></div>
              <div className="mt-2 font-bold">TECHNIQUE D'ANESTHÉSIE</div>
              <div className="mt-1">Type anesthésie/Nom: <input type="text" className="border-b border-black bg-transparent w-32" /></div>
              <div>ALR Bloc/Type: <input type="text" className="border-b border-black bg-transparent w-32" /></div>
              <div>Mode (I) NT/Tube/Timsh bi: <input type="text" className="border-b border-black bg-transparent w-20" /></div>
              <div>Taille masque/Lary/Mask N° <input type="text" className="border-b border-black bg-transparent w-16" /></div>
              <div className="mt-1">Prég: <input type="text" className="border-b border-black bg-transparent w-24" /></div>
              <div className="mt-1">Ventilation</div>
              <input type="text" className="border-b border-black bg-transparent w-full h-4" />
              <div className="mt-2">TAR:</div>
              <input type="text" className="border-b border-black bg-transparent w-full h-4" />
            </div>

            {/* Middle column */}
            <div className="col-span-4">
              <div className="font-bold mb-1">Problèmes per-anesthésiques</div>
              <div className="text-[8px] space-y-0.5">
                <div><input type="checkbox" /> A Choc hémorragique</div>
                <div><input type="checkbox" /> B Arythmie épid/sept</div>
                <div><input type="checkbox" /> C Allergie</div>
                <div><input type="checkbox" /> D Convulsion</div>
                <div><input type="checkbox" /> E Dysfonction matériel</div>
                <div><input type="checkbox" /> F Technique inadé</div>
                <div><input type="checkbox" /> G Douleur</div>
                <div><input type="checkbox" /> H Difficulté technique</div>
                <div><input type="checkbox" /> I Hypothermie{'>'}30%</div>
                <div><input type="checkbox" /> J Hypotension{'>'}30%</div>
                <div><input type="checkbox" /> K Bronchospasme</div>
                <div><input type="checkbox" /> L Ventilabilité assist</div>
                <div><input type="checkbox" /> M IDT-DEI difficile</div>
                <div><input type="checkbox" /> N Ventilation</div>
              </div>
            </div>

            {/* Right column */}
            <div className="col-span-4">
              <div className="font-bold mb-1">Observations / Coeff. sévérité</div>
              <div className="text-[8px] space-y-0.5">
                <div><input type="checkbox" /> Hypotension{'>'}30%</div>
                <div><input type="checkbox" /> IDT difficile/ 3 essais</div>
                <div><input type="checkbox" /> Hypoxémie</div>
                <div><input type="checkbox" /> Bronchospasme</div>
                <div><input type="checkbox" /> Laryngospasme</div>
                <div><input type="checkbox" /> Lésion dentaire</div>
                <div><input type="checkbox" /> ACR</div>
                <div><input type="checkbox" /> Prémédication</div>
                <div><input type="checkbox" /> Ventus bronchiques</div>
              </div>
              <div className="mt-2 font-bold">Opération</div>
              <textarea className="w-full border border-black bg-transparent mt-1 text-[8px] p-1" rows={4}></textarea>
              <div className="mt-2">Pertes sanguines</div>
              <input type="text" className="w-full border-b border-black bg-transparent h-4 mt-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
