import React, { useState, useEffect } from 'react';
import { PersonIcon, ShirtIcon, UploadIcon, TrashIcon } from './Icon';

interface ImageUploaderProps {
  id: string;
  label: string;
  onImageUpload: (file: File | null) => void;
  currentFile: File | null;
  compact?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onImageUpload, currentFile, compact = false }) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!currentFile) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(currentFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [currentFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onImageUpload(file);
  };
  
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();
    onImageUpload(null);
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  };

  const Icon = id === 'user-image' ? PersonIcon : ShirtIcon;

  const containerClasses = compact
    ? "w-full h-full bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-xl p-4 text-center flex flex-col justify-center transition-all duration-300 hover:border-indigo-500"
    : "w-full bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl p-6 text-center flex flex-col justify-between transition-all duration-300 hover:border-indigo-500 hover:bg-gray-700/50";

  return (
    <div className={containerClasses}>
      <div>
        {!compact && <Icon className="mx-auto h-12 w-12 text-gray-500 mb-2" />}
        <h3 className={`font-semibold text-white ${compact ? 'text-base mb-2' : 'text-lg mb-4'}`}>{label}</h3>
      </div>
      {preview ? (
        <div className={`relative group w-full ${compact ? 'aspect-square' : 'aspect-[3/4]'} rounded-lg overflow-hidden mx-auto mt-2`}>
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
           <button 
             onClick={handleRemoveImage} 
             className="absolute top-2 right-2 p-2 bg-black bg-opacity-60 rounded-full text-white hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100"
             aria-label="Remover imagem"
           >
             <TrashIcon className="w-5 h-5" />
           </button>
        </div>
      ) : (
        <div className={`${compact ? 'mt-2' : 'mt-4'} flex justify-center`}>
            <label htmlFor={id} className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-indigo-300 font-semibold rounded-md hover:bg-gray-600 transition-colors">
                <UploadIcon className="w-5 h-5"/>
                <span>Escolher Arquivo</span>
            </label>
            <input
                id={id}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="sr-only"
            />
        </div>
      )}
    </div>
  );
};