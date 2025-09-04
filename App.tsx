import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { Loader } from './components/Loader';
import { ResultDisplay } from './components/ResultDisplay';
import { generateLook } from './services/geminiService';
import { fileToBase64 } from './utils/imageUtils';
import type { GeneratedLook, ImageBase64 } from './types';
import { StyleSelector } from './components/StyleSelector';
import { InputModeSelector } from './components/InputModeSelector';

type InputMode = 'image' | 'text';

const App: React.FC = () => {
  const [userImageFile, setUserImageFile] = useState<File | null>(null);
  const [clothingImageFile, setClothingImageFile] = useState<File | null>(null);
  const [clothingPrompt, setClothingPrompt] = useState<string>('');
  const [generatedLook, setGeneratedLook] = useState<GeneratedLook | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('Casual');
  const [inputMode, setInputMode] = useState<InputMode>('image');

  const handleReset = () => {
    setUserImageFile(null);
    setClothingImageFile(null);
    setClothingPrompt('');
    setGeneratedLook(null);
    setError(null);
    setIsLoading(false);
    setSelectedStyle('Casual');
    setInputMode('image');
  };

  const handleGenerateClick = useCallback(async () => {
    if (!userImageFile) {
      setError("Por favor, envie sua foto antes de continuar.");
      return;
    }
    if (inputMode === 'image' && !clothingImageFile) {
      setError("Por favor, envie a imagem da peça de roupa.");
      return;
    }
    if (inputMode === 'text' && !clothingPrompt.trim()) {
      setError("Por favor, descreva a peça de roupa.");
      return;
    }


    setIsLoading(true);
    setError(null);
    setGeneratedLook(null);

    try {
      const userImageBase64: ImageBase64 = await fileToBase64(userImageFile);
      
      const options = {
        style: selectedStyle,
        clothingImage: inputMode === 'image' && clothingImageFile ? await fileToBase64(clothingImageFile) : undefined,
        clothingPrompt: inputMode === 'text' ? clothingPrompt : undefined,
      };

      const result = await generateLook(userImageBase64, options);
      setGeneratedLook(result);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Ocorreu um erro desconhecido. Por favor, verifique sua conexão ou tente novamente com outras imagens."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [userImageFile, clothingImageFile, inputMode, clothingPrompt, selectedStyle]);
  
  const isGenerateButtonDisabled = 
    !userImageFile || 
    isLoading || 
    (inputMode === 'image' && !clothingImageFile) || 
    (inputMode === 'text' && !clothingPrompt.trim());

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (generatedLook) {
      return <ResultDisplay look={generatedLook} onReset={handleReset} />;
    }
    return (
      <>
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <ImageUploader
            id="user-image"
            label="1. Sua Foto de Corpo Inteiro"
            onImageUpload={setUserImageFile}
            currentFile={userImageFile}
          />
           <div className="w-full bg-gray-800 rounded-xl p-6 text-center flex flex-col justify-start">
              <h3 className="text-lg font-semibold text-white mb-4">2. Detalhes da Roupa</h3>
              <InputModeSelector mode={inputMode} setMode={setInputMode} />
              <div className="mt-4 flex-grow flex flex-col">
                {inputMode === 'image' ? (
                  <ImageUploader
                    id="clothing-image"
                    label="Envie a Peça de Roupa"
                    onImageUpload={setClothingImageFile}
                    currentFile={clothingImageFile}
                    compact
                  />
                ) : (
                  <div className="w-full h-full flex flex-col">
                     <label htmlFor="clothing-prompt" className="text-gray-400 mb-2 text-sm">Descreva o item que você quer vestir:</label>
                     <textarea
                      id="clothing-prompt"
                      value={clothingPrompt}
                      onChange={(e) => setClothingPrompt(e.target.value)}
                      placeholder="Ex: Uma jaqueta de couro preta com zíperes prateados e gola alta."
                      className="w-full h-full flex-grow bg-gray-700 border-2 border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      rows={5}
                    />
                  </div>
                )}
              </div>
           </div>
        </div>
        <StyleSelector 
          selectedStyle={selectedStyle}
          onStyleChange={setSelectedStyle}
        />
        {error && <p className="text-red-400 text-center mb-4 max-w-lg mx-auto">{error}</p>}
        <button
          onClick={handleGenerateClick}
          disabled={isGenerateButtonDisabled}
          className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
        >
          {isLoading ? 'Gerando...' : 'Gerar Look Virtual'}
        </button>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <Header />
      <main className="flex flex-col items-center justify-center text-center w-full flex-grow">
        {renderContent()}
      </main>
      <footer className="text-center py-4 mt-8">
        <p className="text-sm text-gray-500">Powered by Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;