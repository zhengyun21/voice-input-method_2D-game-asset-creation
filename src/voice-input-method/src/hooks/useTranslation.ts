import { useState, useCallback } from 'react';
import type { Language } from '../types';
import { deepseekApi } from '../services/deepseek';

export const useTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translation, setTranslation] = useState('');
  const [error, setError] = useState<string | null>(null);

  const translate = useCallback(async (
    text: string,
    sourceLang: Language,
    targetLang: Language
  ) => {
    if (!text.trim()) {
      setTranslation('');
      return;
    }

    try {
      setIsTranslating(true);
      setError(null);
      const result = await deepseekApi.translate(text, sourceLang, targetLang);
      setTranslation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '翻译失败');
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const autoTranslate = useCallback(async (
    text: string,
    targetLang: Language
  ) => {
    if (!text.trim()) {
      setTranslation('');
      return;
    }

    try {
      setIsTranslating(true);
      setError(null);
      const result = await deepseekApi.translateAuto(text, targetLang);
      setTranslation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '翻译失败');
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const clearTranslation = useCallback(() => {
    setTranslation('');
    setError(null);
  }, []);

  return {
    isTranslating,
    translation,
    error,
    translate,
    autoTranslate,
    clearTranslation,
  };
};
