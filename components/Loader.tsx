import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './Icon';

const loadingMessages = [
  "Analisando suas fotos...",
  "Consultando nossos estilistas virtuais...",
  "Provando a roupa no seu corpo...",
  "Ajustando os últimos detalhes...",
  "Quase pronto para o desfile!",
];

export const Loader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-800/50 rounded-xl">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <SparklesIcon className="w-10 h-10 text-indigo-400 animate-pulse" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Criando seu novo look...</h2>
      <p className="text-gray-400 text-lg transition-opacity duration-500">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};