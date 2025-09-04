import React from 'react';

type InputMode = 'image' | 'text';

interface InputModeSelectorProps {
  mode: InputMode;
  setMode: (mode: InputMode) => void;
}

export const InputModeSelector: React.FC<InputModeSelectorProps> = ({ mode, setMode }) => {
  const baseClasses = "w-full py-2 text-sm font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500";
  const activeClasses = "bg-indigo-600 text-white shadow";
  const inactiveClasses = "bg-gray-600 text-gray-300 hover:bg-gray-500";

  return (
    <div className="w-full grid grid-cols-2 gap-2 bg-gray-700 p-1 rounded-lg">
      <button
        onClick={() => setMode('image')}
        className={`${baseClasses} ${mode === 'image' ? activeClasses : inactiveClasses}`}
      >
        Imagem
      </button>
      <button
        onClick={() => setMode('text')}
        className={`${baseClasses} ${mode === 'text' ? activeClasses : inactiveClasses}`}
      >
        Texto
      </button>
    </div>
  );
};