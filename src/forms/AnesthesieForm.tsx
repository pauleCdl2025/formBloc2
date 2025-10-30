import React, { useState, useRef, useEffect } from 'react';

export default function AnesthesieForm() {
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

  const [currentTool, setCurrentTool] = useState<'tension' | 'frequence' | 'temperature' | 'saturation'>('tension');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [points, setPoints] = useState<Record<'tension' | 'frequence' | 'temperature' | 'saturation', Array<{x: number, y: number}>>>(
    {
      tension: [],
      frequence: [],
      temperature: [],
      saturation: []
    }
  );
  const [headerHours, setHeaderHours] = useState<string[]>(
    Array.from({ length: 12 }, () => '')
  );
  const [gridColumnLabels, setGridColumnLabels] = useState<string[]>(
    Array.from({ length: 72 }, () => '')
  );

  const colors: Record<'tension' | 'frequence' | 'temperature' | 'saturation', string> = {
    tension: '#0000FF',
    frequence: '#FF0000',
    temperature: '#00FF00',
    saturation: '#000000'
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    (Object.keys(points) as Array<keyof typeof points>).forEach(tool => {
      const toolPoints = points[tool];
      if (toolPoints.length < 2) return;
      ctx.strokeStyle = colors[tool];
      ctx.lineWidth = 2;

      if (tool === 'tension') {
        // Draw independent segments linking each pair of points only
        for (let i = 0; i + 1 < toolPoints.length; i += 2) {
      ctx.beginPath();
          ctx.moveTo(toolPoints[i].x, toolPoints[i].y);
          ctx.lineTo(toolPoints[i + 1].x, toolPoints[i + 1].y);
      ctx.stroke();
    }
        // If odd point remaining, render a small dot
        if (toolPoints.length % 2 === 1) {
          const last = toolPoints[toolPoints.length - 1];
      ctx.beginPath();
          ctx.arc(last.x, last.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = colors[tool];
          ctx.fill();
        }
      } else {
        // Default: connect all points in sequence
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
      [currentTool]: [...prev[currentTool], { x, y }]
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
      [currentTool]: [...prev[currentTool], { x, y }]
    }));
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const clearCurve = (tool: keyof typeof points) => {
    setPoints(prev => ({ ...prev, [tool]: [] }));
  };

  const clearAll = () => {
    setPoints({ tension: [], frequence: [], temperature: [], saturation: [] });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-yellow-100" style={{fontFamily: 'Courier New, monospace', fontSize: '10px'}}>
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
            <div className="text-[9px] mb-1">SERVICE D ANESTHESIOLOGIE / CHUQ</div>
              <input
                type="text"
              value={formData.patientName}
              onChange={(e) => handleInputChange('patientName', e.target.value)}
              className="w-full border-b border-black bg-transparent h-6 mb-2 text-sm font-bold px-1"
              placeholder="Nom du patient"
            />
            <div className="text-center text-[9px] pb-1">Identité Patient</div>
              <input
                type="text"
              value={formData.diagnosis}
              onChange={(e) => handleInputChange('diagnosis', e.target.value)}
              className="w-full border-b border-black bg-transparent h-8 mt-1 text-center font-bold px-1"
              placeholder="Diagnostic"
            />
          </div>

          {/* Middle columns */}
          <div className="col-span-5 border-r-2 border-black p-2">
            <div className="grid grid-cols-4 gap-x-2 gap-y-1 text-[9px]">
              <div>Chirurgien</div>
              <input type="text" value={formData.surgeon} onChange={(e) => handleInputChange('surgeon', e.target.value)} className="col-span-3 border-b border-black bg-transparent px-1" />
              <div>Anesthésiste</div>
              <input type="text" value={formData.anesthetist} onChange={(e) => handleInputChange('anesthetist', e.target.value)} className="col-span-3 border-b border-black bg-transparent px-1" />
              <div>Date (début)</div>
              <input type="text" value={formData.dateDebut} onChange={(e) => handleInputChange('dateDebut', e.target.value)} className="border-b border-black bg-transparent px-1" />
              <div>Heure début</div>
              <input type="text" value={formData.heureDebut} onChange={(e) => handleInputChange('heureDebut', e.target.value)} className="border-b border-black bg-transparent px-1" />
                    </div>
            <div className="mt-3 text-[9px]">
              <div>Traitement en cours</div>
              <input type="text" value={formData.traitement} onChange={(e) => handleInputChange('traitement', e.target.value)} className="w-full border-b border-black bg-transparent h-6 mt-1 px-1" />
            </div>
          </div>

          {/* Right columns */}
          <div className="col-span-4 p-2">
            <div className="grid grid-cols-4 gap-x-2 gap-y-1 text-[9px]">
              <div>Préliminaire</div>
              <input type="text" className="col-span-3 border-b border-black bg-transparent px-1" />
              <div>Heure fin</div>
              <input type="text" value={formData.heureFin} onChange={(e) => handleInputChange('heureFin', e.target.value)} className="border-b border-black bg-transparent px-1" />
              <div>Début op</div>
              <input type="text" className="border-b border-black bg-transparent px-1" />
              <div>Fin op</div>
              <input type="text" className="border-b border-black bg-transparent px-1" />
                    </div>
            <div className="mt-3">
              <div className="text-[9px]">Prémédication</div>
              <input type="text" value={formData.premedication} onChange={(e) => handleInputChange('premedication', e.target.value)} className="w-full border-b border-black bg-transparent h-6 px-1" />
              <div className="text-[9px] mt-2">Fin anesthé</div>
              <input type="text" className="w-full border-b border-black bg-transparent h-6 px-1" />
                  </div>
            </div>
          </div>

        {/* État pathologique section */}
        <div className="grid grid-cols-12 border-b-2 border-black">
          <div className="col-span-4 border-r-2 border-black p-2">
            <div className="font-bold text-[9px] mb-2">État pathologique<span className="ml-4">ASA</span></div>
            <div className="grid grid-cols-2 gap-x-3 text-[8px]">
              <div className="space-y-0.5">
                <div>A <input type="checkbox" className="mr-1" /> RAS</div>
                <div>B <input type="checkbox" className="mr-1" /> Allergie</div>
                <div>C <input type="checkbox" className="mr-1" /> Angor</div>
                <div>D <input type="checkbox" className="mr-1" /> Arthropathie</div>
                <div>E <input type="checkbox" className="mr-1" /> Arythmie</div>
                <div>F <input type="checkbox" className="mr-1" /> BPCO</div>
                <div>G <input type="checkbox" className="mr-1" /> Cardiopathie</div>
                <div>H <input type="checkbox" className="mr-1" /> Cachexie</div>
                <div>I <input type="checkbox" className="mr-1" /> Diabète</div>
                <div>J <input type="checkbox" className="mr-1" /> Obésité hémo</div>
                <div>K <input type="checkbox" className="mr-1" /> Eau de choc</div>
                <div>L <input type="checkbox" className="mr-1" /> Hypertension</div>
              </div>
              <div className="space-y-0.5">
                <div>M <input type="checkbox" className="mr-1" /> HyperThyroïdie</div>
                <div>N <input type="checkbox" className="mr-1" /> Infarctus</div>
                <div>O <input type="checkbox" className="mr-1" /> Infection</div>
                <div>P <input type="checkbox" className="mr-1" /> Insuff. hépatique</div>
                <div>Q <input type="checkbox" className="mr-1" /> Insuff. rénale</div>
                <div>R <input type="checkbox" className="mr-1" /> Obésité</div>
                <div>S <input type="checkbox" className="mr-1" /> Asthme</div>
                <div>T <input type="checkbox" className="mr-1" /> Tabagisme</div>
                <div>U <input type="checkbox" className="mr-1" /> Troubles nerveu</div>
                <div>V <input type="checkbox" className="mr-1" /> PTT Anesthésie</div>
                <div>W <input type="checkbox" className="mr-1" /> TTT stéroïdes</div>
                <div>Z <input type="checkbox" className="mr-1" /> Autre</div>
              </div>
              </div>
            <div className="mt-3">
              <div className="font-bold text-[9px]">Indication(s) opératoire(s)</div>
              <input type="text" value={formData.indications} onChange={(e) => handleInputChange('indications', e.target.value)} className="w-full border-b border-black bg-transparent mt-1 h-6 px-1" />
              </div>
            </div>
            
          {/* Observations */}
          <div className="col-span-4 border-r-2 border-black p-2">
            <div className="font-bold text-[9px] mb-2">Observations</div>
            <textarea className="w-full border border-black bg-transparent text-[8px] p-1" rows={8}></textarea>
            <div className="mt-2 text-[8px]">
              <div className="mb-1">En salle à :</div>
              <div className="grid grid-cols-2 gap-1">
                <div>Ouverture de bouche <input type="text" className="border-b border-black bg-transparent w-8" /> cm</div>
                <div>Etat dentaire <input type="text" className="border-b border-black bg-transparent w-16" /></div>
              </div>
              <div className="mt-1">Remarques <input type="text" className="border-b border-black bg-transparent w-32" /></div>
            </div>
          </div>

          {/* Vital signs */}
          <div className="col-span-4 p-2">
            <div className="grid grid-cols-4 gap-1 text-[8px] mb-1">
              <div>TA pré</div>
              <div>Puls</div>
              <div>Labo Nat</div>
              <div>K+</div>
              <input type="text" className="border-b border-black bg-transparent px-1" />
              <input type="text" className="border-b border-black bg-transparent px-1" />
              <input type="text" className="border-b border-black bg-transparent px-1" />
              <input type="text" className="border-b border-black bg-transparent px-1" />
              <div>TA post</div>
              <div>Puls</div>
              <div>Hb</div>
              <div>TP</div>
              <input type="text" className="border-b border-black bg-transparent px-1" />
              <input type="text" className="border-b border-black bg-transparent px-1" />
              <input type="text" className="border-b border-black bg-transparent px-1" />
              <input type="text" className="border-b border-black bg-transparent px-1" />
              <div>Dernière injection</div>
              <div>Hb</div>
              <div></div>
              <div>PTT</div>
              <input type="text" className="col-span-2 border-b border-black bg-transparent px-1" />
              <input type="text" className="border-b border-black bg-transparent px-1" />
              <input type="text" className="border-b border-black bg-transparent px-1" />
                </div>
                </div>
                </div>
              </div>
              
      {/* Main monitoring grid */}
        <div className="border-2 border-t-0 border-black bg-green-100 relative" style={{height: '560px'}}>
       
              
        {/* Time header grid removed (no vertical lines) */}
                
        {/* Time header */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-yellow-100 border-b-2 border-black flex text-xs font-bold z-30">
          <div style={{width: '90px'}} className="border-r-2 border-black p-1">
            <div className="text-[7px] font-bold">Spécial Oeso</div>
            <div className="text-[8px] font-bold text-center mt-1">TA/Puls 200</div>
            
              </div>
          {Array.from({length: 12}).map((_, i) => (
            <div key={i} className="flex-1 text-center p-1">
                <input
                  type="text"
                className="w-full text-center bg-transparent border-none font-bold text-xs focus:outline-none"
                value={headerHours[i]}
                onChange={(e) => {
                  const next = [...headerHours];
                  next[i] = e.target.value;
                  setHeaderHours(next);
                }}
                />
              </div>
          ))}
              </div>

        {/* Editable labels above each minor grid column (6 per hour → 72) */}
        <div className="absolute top-0 right-0 z-40" style={{ height: '10px', left: '92px' }}>
          {Array.from({ length: 72 }).map((_, k) => (
            <div key={`tick-input-${k}`} className="absolute" style={{ left: `${(k / 72) * 100}%`, width: `${100 / 72}%`, top: 0 }}>
                <input
                  type="text"
                className="w-full bg-transparent border-none text-[9px] leading-3 text-center focus:outline-none"
                value={gridColumnLabels[k]}
                onChange={(e) => {
                  const next = [...gridColumnLabels];
                  next[k] = e.target.value;
                  setGridColumnLabels(next);
                }}
                />
              </div>
          ))}
            </div>

        {/* Prolonger les lignes verticales fines jusque dans l'en-tête */}
        <div className="absolute top-0 right-0 z-20 pointer-events-none" style={{height: '40px', left: '92px'}}>
          {Array.from({ length: 72 }).map((_, k) => (
            <div
              key={`header-prolong-minor-v-${k}`}
              className="absolute top-0 bottom-0 border-r border-gray-400"
              style={{ left: `${(k / 72) * 100}%` }}
            />
          ))}
            </div>

        {/* Grid with Y-axis labels */}
         <div className="absolute left-0 right-0 z-0" style={{top: '10px', bottom: '30px'}}>
          {/* Y-axis labels - only filled rows */}
          {[
            {left: 'R O 38°', right: 'SaO2 PCO2 180'},
             {left: 'R O 38°', right: ' SaO2 PCO2 180'},
            {left: '36°', right: '160'},
            {left: '34°', right: '140'},
            {left: '32°', right: '120'},
            {left: '30°', right: '100'},
            {left: '28°', right: '80'},
            {left: '26°', right: '60'},
            {left: '24°', right: 'Diurese PVC 40'},
            
          ].map((item, i) => (
            <div
              key={i}
              className={`absolute left-0 right-0 ${i === 0 ? '' : 'border-b border-gray-500'}`}
              style={{ top: `${(i / 13) * 100}%`, height: `${100 / 13}%` }}
            >
              <div className="absolute left-0 bg-green-100 border-r-2 border-black text-[7px] z-10 grid grid-cols-2 h-full" style={{width: '90px'}}>
                <div className="border-r border-black px-1 flex items-center font-bold">{item.left}</div>
                <div className="px-1 flex items-center">{item.right}</div>
                  </div>
              {/* Lignes fines (mineures) uniquement dans les sections hautes */}
              {i >= 1 && i <= 9 && (
                <div className="absolute left-[92px] right-0 top-0 bottom-0">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div
                      key={`minor-h-${i}-${j}`}
                      className="absolute left-0 right-0 border-b border-gray-400"
                      style={{ top: `${((j + 1) / 5) * 100}%` }}
                    />
                  ))}
                </div>
              )}
                  </div>
          ))}

          {/* Lignes horizontales: majeures alignées aux libellés + mineures régulières */}
          <div className="absolute left-[92px] right-0 top-0 bottom-0">
            {/* Lignes majeures (14, y compris haut et bas) */}
            {Array.from({ length: 14 }).map((_, i) => {
              // Conserver jusqu'au 9e palier inclus et la toute dernière (i === 13)
              if (!(i <= 9 || i === 13)) return null;
              const topPercent = i === 1 ? (0.6 / 13) * 100 : (i / 13) * 100;
              return (
                <div
                  key={`major-h-${i}`}
                  className="absolute left-0 right-0 border-b-2 border-black"
                  style={{ top: `${topPercent}%` }}
                />
              );
            })}

            {/* Lignes verticales dans la zone haute (mineures + majeures par heure) */}
            <div className="absolute top-0" style={{ left: '92px', right: 0, bottom: `${(4 / 13) * 100}%` }}>
              {Array.from({ length: 72 }).map((_, k) => (
                <div
                  key={`top-only-minor-v-${k}`}
                  className="absolute top-0 bottom-0 border-r border-gray-400"
                  style={{ left: `${(k / 72) * 100}%` }}
                />
              ))}
                </div>

            {/* Grille carrée dans la grande zone inférieure */}
            <div
              className="absolute left-0 right-0"
              style={{ top: `${(9 / 13) * 100}%`, bottom: 0 }}
            >
              {/* largeur de la colonne de gauche (en px) */}
              {/* Séparateur entre la colonne gauche (sans grille) et la colonne droite (avec grille) */}
              <div className="absolute top-0 bottom-0 border-r-2 border-black" style={{ left: '90px', width: 0 }} />

              {/* lignes horizontales fines (maillage plus dense) - colonne gauche */}
              {Array.from({ length: 24 }).map((_, j) => (
                <div
                  key={`bottom-left-minor-h-${j}`}
                  className="absolute border-b border-gray-400"
                  style={{ left: 0, width: '90px', top: `${((j + 1) / 25) * 100}%` }}
                />
              ))}
              {/* lignes horizontales fines (maillage plus dense) - colonne droite */}
              {Array.from({ length: 24 }).map((_, j) => (
                <div
                  key={`bottom-right-minor-h-${j}`}
                  className="absolute right-0 border-b border-gray-400"
                  style={{ left: '92px', top: `${((j + 1) / 25) * 100}%` }}
                />
              ))}

              {/* conteneur pour les lignes verticales à droite de la colonne gauche */}
              {/* Quadrillage uniquement dans la colonne droite */}
              <div className="absolute top-0 bottom-0" style={{ left: '92px', right: 0 }}>
                {/* lignes verticales fines (6 par heure → 72 lignes) */}
                {Array.from({ length: 73 }).map((_, k) => (
                  <div
                    key={`bottom-minor-v-${k}`}
                    className="absolute top-0 bottom-0 border-r border-gray-400"
                    style={{ left: `${(k / 72) * 100}%` }}
                  />
                ))}

                {/* lignes verticales majeures à chaque heure (retirées) */}
                {/* bordure ferme la toute extrémité droite */}
                <div className="absolute top-0 bottom-0 right-0 border-r-2 border-black" />
                  </div>
                </div>

          {/* Suppression des grilles mineures à droite */}
                  </div>
                </div>

        {/* Canvas for drawing */}
                  <canvas
          ref={canvasRef}
          className="absolute cursor-crosshair"
          style={{top: '70px', left: '90px', right: 0, bottom: '80px', width: 'calc(100% - 90px)', height: 'calc(100% - 150px)'}}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
        />

        {/* Bottom section with medication circles */}
        <div className="absolute bottom-0 left-0 right-0 bg-yellow-100 border-t-2 border-black p-2 text-[8px] z-10" style={{height: '80px'}}>
          <div className="grid grid-cols-12">
            <div className="col-span-1 flex items-center">
              <div className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center font-bold">SD</div>
                  </div>
            <div className="col-span-11">
              <input type="text" className="w-full border-b border-black bg-transparent h-5" />
                </div>
              </div>
          <div className="grid grid-cols-12 mt-1">
            <div className="col-span-1 flex items-center gap-1">
              <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center text-[7px] font-bold">F</div>
              <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center text-[7px] font-bold">H</div>
                      </div>
            <div className="col-span-11">
              <input type="text" className="w-full border-b border-black bg-transparent h-5" />
                    </div>
                </div>
          <div className="mt-1">
            <div className="font-bold">RINGER-LACTATE</div>
            <input type="text" className="w-full border-b border-black bg-transparent h-5" />
              </div>
                </div>
              </div>

      {/* Bottom section */}
      <div className="border-2 border-t-0 border-black p-2">
        <div className="grid grid-cols-12 gap-2 text-[9px]">
          {/* Left column */}
          <div className="col-span-4">
            <div className="font-bold">TECHNIQUE D ANESTHÉSIE</div>
            <div className="mt-1 text-[8px]">
              <div>Type Anesth <input type="text" className="border-b border-black bg-transparent w-32 px-1" /></div>
              <div className="mt-1">Echec de <input type="text" className="border-b border-black bg-transparent w-16" /> SG / SV</div>
              <div className="mt-1">Intub I NT/Tube/Timsh No <input type="text" className="border-b border-black bg-transparent w-12" /></div>
              <div className="mt-1">Vent Spont / Cont / Ass / Jet <input type="text" className="border-b border-black bg-transparent w-16" /></div>
              <div className="mt-1">Vt <input type="text" className="w-16 border-b border-black bg-transparent" /> P insp <input type="text" className="w-12 border-b border-black bg-transparent" /></div>
              <div className="mt-1">Fréq <input type="text" className="w-16 border-b border-black bg-transparent" /> Peep <input type="text" className="w-12 border-b border-black bg-transparent" /></div>
              <div className="mt-1">Ventilpn(o) <input type="text" className="border-b border-black bg-transparent w-20" /></div>
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center font-bold">N</div>
                  <div>TAR <input type="text" className="border-b border-black bg-transparent w-32" /></div>
                      </div>
                    </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center font-bold">O</div>
                <div>DLG / DLD / DV / Gyné / Trenol</div>
              </div>
            </div>
          </div>

          {/* Middle column */}
          <div className="col-span-4">
            <div className="font-bold mb-1">Problèmes per-anesthésiques</div>
            <div className="text-[8px] space-y-0.5">
              <div>A <input type="checkbox" /> Aucun</div>
              <div>B <input type="checkbox" /> Arythmie myocarel</div>
              <div>C <input type="checkbox" /> Allergie</div>
              <div>D <input type="checkbox" /> Arythmie</div>
              <div>E <input type="checkbox" /> Dysfonction matériel</div>
              <div>F <input type="checkbox" /> Technique inadif</div>
              <div>G <input type="checkbox" /> Erreur drogue</div>
              <div>H <input type="checkbox" /> Difficulté technique</div>
              <div>I <input type="checkbox" /> Hémorrhagies 30%</div>
              <div>J <input type="checkbox" /> Hypotension 30%</div>
              <div>K <input type="checkbox" /> Bronchospasme</div>
              <div>L <input type="checkbox" /> Indisponibilité anesth</div>
              <div>M <input type="checkbox" /> Insufflation</div>
            </div>
          </div>

          {/* Right column */}
          <div className="col-span-4">
            <div className="font-bold mb-1">Observations<span className="ml-20">Coeff sévérité</span></div>
            <div className="text-[8px] space-y-0.5">
              <div>N <input type="checkbox" /> Hypotension 30%</div>
              <div>O <input type="checkbox" /> Hypothermie 33.5C</div>
              <div>P <input type="checkbox" /> Hypoxémie</div>
              <div>Q <input type="checkbox" /> Intubation difficile</div>
              <div>R <input type="checkbox" /> Laryngospasme</div>
              <div>S <input type="checkbox" /> Lésion dentaire</div>
              <div>T <input type="checkbox" /> Instabilité hémodyh</div>
              <div>U <input type="checkbox" /> Prémédication</div>
              <div>V <input type="checkbox" /> Ventus bronchiques</div>
              <div>W <input type="checkbox" /> Agitation réveil</div>
              <div>X <input type="checkbox" /> Réveil prolongé</div>
              <div>Y <input type="checkbox" /> Indisponibilité opérat</div>
              <div>Z <input type="checkbox" /> Autre</div>
              </div>
            <div className="mt-2">
              <div className="font-bold">Classe risque <input type="text" className="w-8 border border-black bg-transparent" /></div>
              <div className="mt-1">Pertes sanguines</div>
              <div className="mt-2 font-bold">Opération</div>
              <textarea className="w-full border border-black bg-transparent mt-1 text-[8px] p-1" rows={3}></textarea>
              </div>
              </div>
              </div>
      </div>
    </div>
  );
}
