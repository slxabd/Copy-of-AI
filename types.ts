export interface ImageAsset {
  id: string;
  url: string; // Base64 or URL
  type: 'person' | 'cloth' | 'result';
}

export enum AppStep {
  SELECT_PERSON = 1,
  SELECT_CLOTHES = 2,
  RESULT = 3,
}

export interface HistoryItem {
  id: string;
  personImage: string;
  clothesImage: string;
  resultImage: string;
  timestamp: number;
}