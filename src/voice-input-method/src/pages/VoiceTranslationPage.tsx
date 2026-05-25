import { useState, useEffect, useCallback } from 'react';
import type { Language } from '../types';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { TranscriptDisplay } from '../components/TranscriptDisplay';
import { TranslationPanel } from '../components/TranslationPanel';
import { TranslationPageLayout } from '../components/TranslationPageLayout';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useTranslation } from '../hooks/useTranslation';

export const VoiceTranslationPage = () => {
  const [sourceLanguage, setSourceLanguage] = useState<Language>('zh');
  const [targetLanguage, setTargetLanguage] = useState<Language>('en');

  const {
    isRecording,
    isProcessing,
    transcript,
    error: recognitionError,
    duration,
    startRecording,
    stopRecording,
    clearTranscript,
  } = useVoiceRecognition();

  const {
    isTranslating,
    translation,
    error: translationError,
    translate,
    clearTranslation,
  } = useTranslation();

  useEffect(() => {
    if (transcript) {
      translate(transcript, sourceLanguage, targetLanguage);
    } else {
      clearTranslation();
    }
  }, [transcript, sourceLanguage, targetLanguage, translate, clearTranslation]);

  const handleClearAll = useCallback(() => {
    clearTranscript();
    clearTranslation();
  }, [clearTranscript, clearTranslation]);

  return (
    <TranslationPageLayout
      title="语音翻译"
      subtitle="Voice Translation"
      icon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      }
      sourceLanguage={sourceLanguage}
      targetLanguage={targetLanguage}
      onSourceChange={setSourceLanguage}
      onTargetChange={setTargetLanguage}
      languageDisabled={isRecording || isProcessing}
    >
      <div className="max-w-3xl mx-auto grid gap-8">
        <div className="flex justify-center">
          <VoiceRecorder
            isRecording={isRecording}
            isProcessing={isProcessing}
            duration={duration}
            onStart={startRecording}
            onStop={stopRecording}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <TranscriptDisplay
            transcript={transcript}
            error={recognitionError}
            onClear={handleClearAll}
          />
          <TranslationPanel
            translation={translation}
            isTranslating={isTranslating}
            error={translationError}
            onClear={clearTranslation}
          />
        </div>

        <div className="text-center text-xs text-text-muted space-y-1 pt-4">
          <p>点击麦克风开始录音 · 再次点击结束并识别 · 识别结果可点击编辑</p>
          <p>语音识别由讯飞驱动 · 翻译由 DeepSeek 驱动</p>
        </div>
      </div>
    </TranslationPageLayout>
  );
};
