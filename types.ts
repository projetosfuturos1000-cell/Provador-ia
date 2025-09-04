export interface ImageBase64 {
  mimeType: string;
  data: string;
}

export interface GeneratedLook {
  image: string | null;
  text: string | null;
}