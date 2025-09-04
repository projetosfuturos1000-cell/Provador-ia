import { GoogleGenAI, Modality, Part } from "@google/genai";
import type { ImageBase64, GeneratedLook } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image-preview';

interface GenerateLookOptions {
  style: string;
  clothingImage?: ImageBase64;
  clothingPrompt?: string;
}

export const generateLook = async (
  userImage: ImageBase64,
  options: GenerateLookOptions
): Promise<GeneratedLook> => {
  const { style, clothingImage, clothingPrompt } = options;

  let prompt: string;
  const parts: Part[] = [
    { inlineData: { mimeType: userImage.mimeType, data: userImage.data } },
  ];

  if (clothingImage) {
    prompt = `Sua tarefa é simples: pegue a pessoa da primeira imagem e a vista com a roupa da segunda imagem, adaptando para um estilo ${style}. A roupa deve ser claramente a da segunda imagem, mas o look final deve refletir um ambiente e atitude ${style}. Crie uma imagem nova e realista, mantendo as características da pessoa e o fundo original. Retorne a imagem e um texto curto e amigável sobre o novo look ${style}.`;
    parts.push({ inlineData: { mimeType: clothingImage.mimeType, data: clothingImage.data } });
  } else if (clothingPrompt) {
    prompt = `Sua tarefa é simples: pegue a pessoa da imagem e a vista com a seguinte peça de roupa: "${clothingPrompt}". Adapte o look final para um estilo ${style}, refletindo um ambiente e atitude adequados. Crie uma imagem nova e realista, mantendo as características da pessoa e o fundo original. Retorne a imagem e um texto curto e amigável sobre o novo look ${style}.`;
  } else {
    throw new Error("É necessário fornecer uma imagem ou uma descrição da roupa.");
  }

  // Adiciona o prompt de texto como a primeira parte para melhor contexto
  parts.unshift({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const result: GeneratedLook = { image: null, text: null };
    const candidate = response.candidates?.[0];

    if (candidate && candidate.content && candidate.content.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          result.image = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        } else if (part.text) {
          result.text = part.text;
        }
      }
    }

    if (!result.image) {
      if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
         console.error(`Geração bloqueada por: ${candidate.finishReason}`, candidate.safetyRatings);
         throw new Error(`A geração da imagem foi bloqueada por motivos de segurança (${candidate.finishReason}). Por favor, tente usar outras imagens.`);
      }
      throw new Error("A API não retornou uma imagem. O modelo pode não ter conseguido processar o seu pedido. Tente novamente com imagens diferentes.");
    }

    return result;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Falha ao se comunicar com a API do Gemini. Verifique sua conexão e tente novamente.");
  }
};