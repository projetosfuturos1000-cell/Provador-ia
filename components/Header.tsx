import React from 'react';
import { WardrobeIcon } from './Icon';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 md:mb-12">
      <div className="flex justify-center items-center gap-4 mb-4">
        <WardrobeIcon className="w-10 h-10 text-indigo-400" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          Provador Virtual <span className="text-indigo-400">AI</span>
        </h1>
      </div>
      <p className="max-w-2xl mx-auto text-lg text-gray-400">
        Experimente um novo look em segundos. Envie sua foto e a roupa que deseja provar.
      </p>
    </header>
  );
};