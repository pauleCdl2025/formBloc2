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

    // Configuration du canvas
    canvas.width = width;
    canvas.height = height;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Fonction pour obtenir les coordonnées
    const getCoordinates = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      if ('touches' in e) {
        return {
          x: (e.touches[0].clientX - rect.left) * scaleX,
          y: (e.touches[0].clientY - rect.top) * scaleY
        };
      } else {
        return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY
        };
      }
    };

    // Fonction de démarrage du dessin
    const startDrawing = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      setIsDrawing(true);
      const coords = getCoordinates(e);
      setLastX(coords.x);
      setLastY(coords.y);
    };

    // Fonction de dessin
    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      
      const coords = getCoordinates(e);
      
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
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
    const stopDrawing = () => {
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
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
