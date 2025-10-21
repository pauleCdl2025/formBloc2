import React, { useRef, useEffect, useState } from 'react';

interface SignaturePadProps {
  onSignatureChange?: (signatureData: string) => void;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
}

export default function SignaturePad({ 
  onSignatureChange, 
  width = 400, 
  height = 200, 
  className = '',
  placeholder = "Signez dans cette zone"
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuration du canvas avec DPI scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Fonction pour obtenir les coordonnées
    const getCoordinates = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      
      if ('touches' in e) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      } else {
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      }
    };

    // Fonction de démarrage du dessin
    const startDrawing = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDrawing(true);
      const coords = getCoordinates(e);
      setLastX(coords.x);
      setLastY(coords.y);
      
      // Commencer un nouveau chemin
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    };

    // Fonction de dessin
    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      e.stopPropagation();
      
      const coords = getCoordinates(e);
      
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
      
      setLastX(coords.x);
      setLastY(coords.y);
      setHasSignature(true);
      
      // Notifier le changement
      if (onSignatureChange) {
        onSignatureChange(canvas.toDataURL());
      }
    };

    // Fonction d'arrêt du dessin
    const stopDrawing = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDrawing(false);
    };

    // Événements souris
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Événements tactiles
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [isDrawing, lastX, lastY, width, height, onSignatureChange]);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Remplir avec un fond blanc
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    setHasSignature(false);
    
    if (onSignatureChange) {
      onSignatureChange('');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair bg-white"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
      {!hasSignature && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-2">✍️</div>
            <div className="text-sm italic">{placeholder}</div>
          </div>
        </div>
      )}
      <div className="mt-2 flex justify-between items-center">
        <div className="text-sm">
          <span className={hasSignature ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
            {hasSignature ? "Signature présente" : "Aucune signature"}
          </span>
        </div>
        <button
          onClick={clearSignature}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
        >
          Effacer
        </button>
      </div>
    </div>
  );
}
