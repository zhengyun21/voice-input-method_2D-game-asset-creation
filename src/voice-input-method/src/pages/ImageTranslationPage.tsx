import { useState, useCallback, useRef } from 'react';
import type { Language } from '../types';
import { TranslationPageLayout } from '../components/TranslationPageLayout';
import { ImageUploader } from '../components/ImageUploader';
import { TranslationPanel } from '../components/TranslationPanel';
import { useTranslation } from '../hooks/useTranslation';
import { recognizeText } from '../services/ocrService';

export const ImageTranslationPage = () => {
  const [sourceLanguage, setSourceLanguage] = useState<Language>('zh');
  const [targetLanguage, setTargetLanguage] = useState<Language>('en');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [recognizedText, setRecognizedText] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognizeError, setRecognizeError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const {
    isTranslating,
    translation,
    error: translationError,
    autoTranslate,
    clearTranslation,
  } = useTranslation();

  const handleImageSelect = useCallback(async (file: File, base64: string) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setRecognizedText('');
    setRecognizeError(null);
    clearTranslation();
    setIsRecognizing(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const text = await recognizeText(base64, controller.signal);
      if (!controller.signal.aborted) {
        setRecognizedText(text);
        if (text.trim() && text.trim() !== '未检测到文字') {
          autoTranslate(text, targetLanguage);
        }
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      setRecognizeError(err instanceof Error ? err.message : '图片识别失败');
    } finally {
      if (!controller.signal.aborted) {
        setIsRecognizing(false);
      }
    }
  }, [targetLanguage, autoTranslate, clearTranslation]);

  const handleTargetChange = useCallback((lang: Language) => {
    setTargetLanguage(lang);
    if (recognizedText.trim() && recognizedText.trim() !== '未检测到文字') {
      autoTranslate(recognizedText, lang);
    }
  }, [recognizedText, autoTranslate]);

  return (
    <TranslationPageLayout
      title="图片翻译"
      subtitle="Image OCR Translation"
      icon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 18V6a2.25 2.25 0 012.25-2.25h15A2.25 2.25 0 0121.75 6v12A2.25 2.25 0 0119.5 20.25H4.5A2.25 2.25 0 012.25 18z" />
        </svg>
      }
      sourceLanguage={sourceLanguage}
      targetLanguage={targetLanguage}
      onSourceChange={setSourceLanguage}
      onTargetChange={handleTargetChange}
      languageMode="target-only"
    >
      <div className="max-w-3xl mx-auto grid gap-6">
        <ImageUploader
          onImageSelect={handleImageSelect}
          isProcessing={isRecognizing}
          previewUrl={previewUrl}
        />

        {isRecognizing && (
          <div className="dark-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-accent rounded-full animate-dot-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <span className="text-sm text-accent">正在识别图片文字...</span>
            </div>
          </div>
        )}

        {recognizeError && (
          <div className="dark-card p-4">
            <div className="flex items-center gap-2 text-red-400">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span className="text-sm">{recognizeError}</span>
            </div>
          </div>
        )}

        {recognizedText && !isRecognizing && (
          <div className="dark-card">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border-subtle">
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">识别结果</span>
            </div>
            <div className="p-4">
              <div className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap animate-fade-in-up">
                {recognizedText}
              </div>
            </div>
          </div>
        )}

        <TranslationPanel
          translation={translation}
          isTranslating={isTranslating}
          error={translationError}
          onClear={clearTranslation}
        />
      </div>
    </TranslationPageLayout>
  );
};
