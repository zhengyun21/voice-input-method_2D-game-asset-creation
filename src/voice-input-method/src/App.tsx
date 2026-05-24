import { useState, useEffect, useCallback } from 'react';
import type { Language } from './types';
import { VoiceRecorder } from './components/VoiceRecorder';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { ManualTextInput } from './components/ManualTextInput';
import { LanguageSelector } from './components/LanguageSelector';
import { TranslationPanel } from './components/TranslationPanel';
import { useVoiceRecognition } from './hooks/useVoiceRecognition';
import { useTranslation } from './hooks/useTranslation';

function App() {
  const [sourceLanguage, setSourceLanguage] = useState<Language>('zh');
  const [targetLanguage, setTargetLanguage] = useState<Language>('en');
  const [enableVoiceTranslation, setEnableVoiceTranslation] = useState(true);

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
    autoTranslate,
    clearTranslation,
  } = useTranslation();

  useEffect(() => {
    if (enableVoiceTranslation && transcript) {
      translate(transcript, sourceLanguage, targetLanguage);
    } else if (!transcript || !enableVoiceTranslation) {
      clearTranslation();
    }
  }, [transcript, sourceLanguage, targetLanguage, enableVoiceTranslation, translate, clearTranslation]);

  const handleManualTranslate = useCallback((text: string) => {
    autoTranslate(text, targetLanguage);
  }, [autoTranslate, targetLanguage]);

  const handleClearAll = () => {
    clearTranscript();
    clearTranslation();
  };

  return (
    <div className="min-h-screen bg-surface-bg font-body">
      <header className="bg-surface-base/80 backdrop-blur-md border-b border-surface-border-subtle sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-display font-semibold text-text-primary tracking-tight">语音输入法</h1>
              <p className="text-xs text-text-muted">Voice Input Method</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="grid gap-8">
          <div className="flex justify-center">
            <VoiceRecorder
              isRecording={isRecording}
              isProcessing={isProcessing}
              duration={duration}
              disabled={!enableVoiceTranslation}
              onStart={startRecording}
              onStop={stopRecording}
            />
          </div>

          <div className="flex justify-center">
            <div className="flex items-center gap-5">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={enableVoiceTranslation}
                    onChange={(e) => setEnableVoiceTranslation(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-9 h-5 bg-surface-elevated rounded-full peer-checked:bg-accent/30 transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-text-muted rounded-full peer-checked:bg-accent peer-checked:translate-x-4 transition-all" />
                </div>
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">启用语音翻译</span>
              </label>
              {enableVoiceTranslation ? (
                <LanguageSelector
                  mode="full"
                  sourceLanguage={sourceLanguage}
                  targetLanguage={targetLanguage}
                  onSourceChange={setSourceLanguage}
                  onTargetChange={setTargetLanguage}
                  disabled={isRecording || isProcessing}
                />
              ) : (
                <LanguageSelector
                  mode="target-only"
                  targetLanguage={targetLanguage}
                  onTargetChange={setTargetLanguage}
                />
              )}
              {(transcript || translation) && (
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1.5 text-sm text-text-muted hover:text-text-secondary bg-surface-elevated hover:bg-surface-card rounded-lg transition-colors"
                >
                  清空
                </button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {enableVoiceTranslation ? (
              <TranscriptDisplay
                transcript={transcript}
                error={recognitionError}
                onClear={handleClearAll}
              />
            ) : (
              <ManualTextInput
                onTranslate={handleManualTranslate}
                isTranslating={isTranslating}
              />
            )}

            <TranslationPanel
              translation={translation}
              isTranslating={isTranslating}
              error={translationError}
              onClear={clearTranslation}
            />
          </div>

          <div className="text-center text-xs text-text-muted space-y-1 pt-4">
            {enableVoiceTranslation ? (
              <p>点击麦克风开始录音 · 再次点击结束并识别 · 识别结果可点击编辑</p>
            ) : (
              <p>输入文本后点击翻译按钮 · 支持 Ctrl + Enter 快捷翻译</p>
            )}
            <p>语音识别由讯飞驱动 · 翻译由 DeepSeek 驱动 · 使用前请配置 API Key</p>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-surface-border-subtle">
        <div className="max-w-3xl mx-auto px-6 text-center text-xs text-text-muted">
          <p>语音输入法 · 讯飞 ASR + DeepSeek</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
