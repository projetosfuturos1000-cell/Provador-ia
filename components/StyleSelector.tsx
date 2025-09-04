import React from 'react';

const styles = ['Casual', 'Formal', 'Esportivo', 'Festa'];

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleChange }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8 text-center">
      <h3 className="text-lg font-semibold text-white mb-4">3. Escolha um Estilo</h3>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {styles.map((style) => (
          <button
            key={style}
            onClick={() => onStyleChange(style)}
            className={`px-5 py-2 text-sm sm:text-base rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 ${
              selectedStyle === style
                ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            }`}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
};