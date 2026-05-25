import { useState, useCallback, useRef } from 'react';
import type { Language } from '../types';
import { deepseekApi } from '../services/deepseek';

export const useTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translation, setTranslation] = useState('');
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const cancelPending = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const translate = useCallback(async (
    text: string,
    sourceLang: Language,
    targetLang: Language
  ) => {
    if (!text.trim()) {
      setTranslation('');
      return;
    }

    cancelPending();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setIsTranslating(true);
      setError(null);
      const result = await deepseekApi.translate(text, sourceLang, targetLang, controller.signal);
      if (!controller.signal.aborted) {
        setTranslation(result);
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(err instanceof Error ? err.message : '翻译失败');
      console.error('Translation error:', err);
    } finally {
      if (!controller.signal.aborted) {
        setIsTranslating(false);
      }
    }
  }, [cancelPending]);

  const autoTranslate = useCallback(async (
    text: string,
    targetLang: Language,
    sourceLang?: Language,
  ) => {
    if (!text.trim()) {
      setTranslation('');
      return;
    }

    cancelPending();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setIsTranslating(true);
      setError(null);

      const result = await deepseekApi.translateAutoChunked(
        text,
        targetLang,
        controller.signal,
        (partial) => {
          if (!controller.signal.aborted) {
            setTranslation(partial);
          }
        },
        sourceLang,
      );
      if (!controller.signal.aborted) {
        setTranslation(result);
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(err instanceof Error ? err.message : '翻译失败');
      console.error('Translation error:', err);
    } finally {
      if (!controller.signal.aborted) {
        setIsTranslating(false);
      }
    }
  }, [cancelPending]);

  const clearTranslation = useCallback(() => {
    cancelPending();
    setTranslation('');
    setError(null);
    setIsTranslating(false);
  }, [cancelPending]);

  return {
    isTranslating,
    translation,
    error,
    translate,
    autoTranslate,
    clearTranslation,
  };
};
