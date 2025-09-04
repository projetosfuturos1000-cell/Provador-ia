import type { ImageBase64 } from './types';

export const fileToBase64 = (file: File): Promise<ImageBase64> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      try {
        const mimeType = result.split(',')[0].split(':')[1].split(';')[0];
        const data = result.split(',')[1];
        if (!mimeType || !data) {
          throw new Error("Invalid file format");
        }
        resolve({ mimeType, data });
      } catch (error) {
        reject(new Error("Could not parse file data."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};