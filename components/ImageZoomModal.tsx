import React, { useState, useRef, useEffect, useCallback } from 'react';
import { XIcon, PlusIcon, MinusIcon, UndoIcon } from './Icon';

interface ImageZoomModalProps {
  imageUrl: string;
  onClose: () => void;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 8;

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({ imageUrl, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const isPanningRef = useRef(false);
  const startPanPointRef = useRef({ x: 0, y: 0 });

  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleZoom = (direction: 'in' | 'out') => {
    const factor = direction === 'in' ? 1.2 : 1 / 1.2;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * factor));

    if (imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        // Zoom towards the center of the container
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const newX = centerX - (centerX - position.x) * (newScale / scale);
        const newY = centerY - (centerY - position.y) * (newScale / scale);
        
        setPosition({ x: newX, y: newY });
        setScale(newScale);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const { deltaY } = e;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale - deltaY * 0.005));

    if (imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newX = mouseX - (mouseX - position.x) * (newScale / scale);
      const newY = mouseY - (mouseY - position.y) * (newScale / scale);
      
      setPosition({ x: newX, y: newY });
      setScale(newScale);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isPanningRef.current = true;
    startPanPointRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    if (imageContainerRef.current) {
        imageContainerRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanningRef.current) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - startPanPointRef.current.x,
      y: e.clientY - startPanPointRef.current.y,
    });
  };

  const handleMouseUpOrLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    isPanningRef.current = false;
    if (imageContainerRef.current) {
        imageContainerRef.current.style.cursor = 'grab';
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Visualizador de imagem ampliada"
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()} 
      >
        <div
          ref={imageContainerRef}
          className="w-full h-full overflow-hidden cursor-grab touch-none"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          <img
            src={imageUrl}
            alt="Look gerado por IA - Zoom"
            className="w-full h-full object-contain"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'top left',
              maxWidth: 'none',
              maxHeight: 'none',
              transition: isPanningRef.current ? 'none' : 'transform 0.1s ease-out',
            }}
          />
        </div>
        
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 sm:top-2 sm:right-2 z-10 p-2 bg-gray-800 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
          aria-label="Fechar"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm p-2 rounded-lg shadow-lg">
          <button onClick={() => handleZoom('out')} className="p-2 rounded-md hover:bg-gray-700" aria-label="Diminuir zoom"><MinusIcon className="w-5 h-5"/></button>
          <span className="w-16 text-center font-mono text-sm">{Math.round(scale * 100)}%</span>
          <button onClick={() => handleZoom('in')} className="p-2 rounded-md hover:bg-gray-700" aria-label="Aumentar zoom"><PlusIcon className="w-5 h-5"/></button>
          <div className="w-px h-5 bg-gray-600 mx-1"></div>
          <button onClick={handleReset} className="p-2 rounded-md hover:bg-gray-700" aria-label="Redefinir zoom"><UndoIcon className="w-5 h-5"/></button>
        </div>
      </div>
    </div>
  );
};