import { useState, useCallback } from 'react';
import type { Language } from '../types';
import { TranslationPageLayout } from '../components/TranslationPageLayout';
import { FileUploader, FileInfo } from '../components/FileUploader';
import { TranslationPanel } from '../components/TranslationPanel';
import { useTranslation } from '../hooks/useTranslation';
import { parseDocument } from '../services/documentParser';

export const DocumentTranslationPage = () => {
  const [sourceLanguage, setSourceLanguage] = useState<Language>('zh');
  const [targetLanguage, setTargetLanguage] = useState<Language>('en');
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  const {
    isTranslating,
    translation,
    error: translationError,
    autoTranslate,
    clearTranslation,
  } = useTranslation();

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setExtractedText('');
    setExtractError(null);
    clearTranslation();
    setIsExtracting(true);

    try {
      const text = await parseDocument(selectedFile);
      setExtractedText(text);
    } catch (err) {
      setExtractError(err instanceof Error ? err.message : '文件解析失败');
    } finally {
      setIsExtracting(false);
    }
  }, [clearTranslation]);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setExtractedText('');
    setExtractError(null);
    clearTranslation();
  }, [clearTranslation]);

  const handleConfirmTranslate = useCallback(() => {
    if (extractedText.trim()) {
      autoTranslate(extractedText, targetLanguage, sourceLanguage);
    }
  }, [extractedText, targetLanguage, sourceLanguage, autoTranslate]);

  const handleTargetChange = useCallback((lang: Language) => {
    setTargetLanguage(lang);
    if (translation) {
      setFile(null);
      setExtractedText('');
      setExtractError(null);
      clearTranslation();
    }
  }, [translation, clearTranslation]);

  return (
    <TranslationPageLayout
      title="文档翻译"
      subtitle="Document Translation"
      icon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      }
      sourceLanguage={sourceLanguage}
      targetLanguage={targetLanguage}
      onSourceChange={setSourceLanguage}
      onTargetChange={handleTargetChange}
      languageMode="target-only"
    >
      <div className="max-w-3xl mx-auto grid gap-6">
        {!file ? (
          <FileUploader onFileSelect={handleFileSelect} isProcessing={isExtracting} />
        ) : (
          <>
            <FileInfo file={file} onRemove={handleRemoveFile} />

            {isExtracting && (
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
                  <span className="text-sm text-accent">正在提取文本...</span>
                </div>
              </div>
            )}

            {extractError && (
              <div className="dark-card p-4">
                <div className="flex items-center gap-2 text-red-400">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <span className="text-sm">{extractError}</span>
                </div>
              </div>
            )}

            {extractedText && !isExtracting && (
              <>
                <div className="dark-card">
                  <div className="px-4 py-2.5 border-b border-surface-border-subtle">
                    <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">提取文本</span>
                  </div>
                  <div className="p-4">
                    <div className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
                      {extractedText}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleConfirmTranslate}
                  disabled={isTranslating || !extractedText.trim()}
                  className="w-full py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTranslating ? '翻译中...' : '确认翻译'}
                </button>
              </>
            )}

            <TranslationPanel
              translation={translation}
              isTranslating={isTranslating}
              error={translationError}
              onClear={clearTranslation}
            />
          </>
        )}
      </div>
    </TranslationPageLayout>
  );
};
