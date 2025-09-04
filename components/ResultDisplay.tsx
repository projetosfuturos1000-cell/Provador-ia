import React, { useState } from 'react';
import type { GeneratedLook } from '../types';
import { ImageZoomModal } from './ImageZoomModal';

interface ResultDisplayProps {
  look: GeneratedLook;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ look, onReset }) => {
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  return (
    <>
      <div className="w-full max-w-lg mx-auto flex flex-col items-center animate-fade-in">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-4 md:p-6 w-full">
          <h2 className="text-3xl font-bold text-center mb-4 text-indigo-400">Seu Novo Look!</h2>
          {look.image ? (
            <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-700 mb-4 group relative">
              <img 
                  src={look.image} 
                  alt="Look gerado por IA" 
                  className="w-full h-full object-contain"
              />
              <button
                onClick={() => setIsZoomModalOpen(true)}
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center cursor-zoom-in"
                aria-label="Ampliar imagem"
              >
                <span className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">
                    Ampliar
                </span>
              </button>
            </div>
          ) : (
            <div className="w-full aspect-[3/4] rounded-lg bg-gray-700 flex items-center justify-center mb-4">
              <p className="text-gray-400">Imagem não disponível.</p>
            </div>
          )}
          {look.text && (
            <p className="text-gray-300 text-center mb-6 bg-gray-900/50 p-4 rounded-md">
              {look.text}
            </p>
          )}
        </div>
        <button
          onClick={onReset}
          className="mt-8 px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-gray-500 transition-all duration-300 transform hover:scale-105"
        >
          Experimentar Outro Look
        </button>
      </div>
      {isZoomModalOpen && look.image && (
        <ImageZoomModal
          imageUrl={look.image}
          onClose={() => setIsZoomModalOpen(false)}
        />
      )}
    </>
  );
};