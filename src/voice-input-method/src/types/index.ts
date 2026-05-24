export type Language = 'zh' | 'en';

export interface Transcript {
  id: string;
  text: string;
  language: Language;
  timestamp: Date;
}

export interface Translation {
  id: string;
  sourceText: string;
  targetText: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  timestamp: Date;
}

export interface RecognitionState {
  isRecording: boolean;
  isProcessing: boolean;
  transcript: string;
  error: string | null;
}

export interface TranslationState {
  isTranslating: boolean;
  translation: string;
  error: string | null;
}

export type RecognitionMode = 'realtime' | 'offline';

export interface LanguageOption {
  code: Language;
  label: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
];
