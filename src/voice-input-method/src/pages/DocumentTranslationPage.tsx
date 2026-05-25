import { useState, useCallback } from 'react';
import type { Language } from '../types';
import { TranslationPageLayout } from '../components/TranslationPageLayout';
import { FileUploader } from '../components/FileUploader';
import { useTranslation } from '../hooks/useTranslation';
import { parseDocument, formatFileSize } from '../services/documentParser';

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

  const renderTranslationPanel = () => {
    if (translationError) {
      return (
        <div className="dark-card h-full flex items-center justify-center p-6">
          <div className="flex items-center gap-2 text-red-400">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span className="text-sm">{translationError}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="dark-card h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border-subtle flex-shrink-0">
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">译文</span>
          <div className="flex items-center gap-1">
            {isTranslating && (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1 h-1 bg-accent rounded-full animate-dot-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
                <span className="text-xs text-accent">翻译中</span>
              </div>
            )}
            {translation && !isTranslating && (
              <button
                onClick={clearTranslation}
                className="px-2.5 py-1 text-xs text-text-muted hover:text-text-secondary hover:bg-surface-elevated rounded-md transition-colors"
              >
                清空
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {translation ? (
            <div className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap animate-fade-in-up">
              {translation}
              {isTranslating && (
                <span className="inline-block w-0.5 h-4 bg-accent ml-0.5 align-text-bottom animate-blink-cursor" />
              )}
            </div>
          ) : isTranslating ? (
            <div className="flex justify-center py-10">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-[3px] h-4 bg-accent/40 rounded-full animate-wave-bar"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="flex flex-col items-center gap-3">
                <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                </svg>
                <p className="text-sm text-text-muted">等待翻译</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

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
      {!file ? (
        <div className="max-w-xl mx-auto">
          <FileUploader onFileSelect={handleFileSelect} isProcessing={isExtracting} />
        </div>
      ) : (
        <div className="h-full flex gap-4">
          <div className="flex-1 flex flex-col min-w-0">
            <div className="dark-card p-4 flex-shrink-0">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-accent">
                      {file.name.split('.').pop()?.toUpperCase() || 'FILE'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-text-primary truncate">{file.name}</p>
                    <p className="text-xs text-text-muted">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleConfirmTranslate}
                    disabled={isTranslating || isExtracting || !extractedText.trim()}
                    className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isTranslating ? (
                      <>
                        <div className="flex items-center gap-0.5">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="w-1 h-1 bg-white rounded-full animate-dot-pulse"
                              style={{ animationDelay: `${i * 0.2}s` }}
                            />
                          ))}
                        </div>
                        <span>翻译中</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                        <span>翻译</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleRemoveFile}
                    disabled={isTranslating}
                    className="p-2 text-text-muted hover:text-text-secondary hover:bg-surface-elevated rounded-lg transition-colors disabled:opacity-50"
                    title="移除文件"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="dark-card flex-1 mt-4 flex flex-col min-h-0">
              <div className="px-4 py-2.5 border-b border-surface-border-subtle flex-shrink-0">
                <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">源文本</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {isExtracting ? (
                  <div className="flex items-center justify-center py-10">
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
                ) : extractError ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="flex items-center gap-2 text-red-400">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                      <span className="text-sm">{extractError}</span>
                    </div>
                  </div>
                ) : extractedText ? (
                  <div className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
                    {extractedText}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-sm text-text-muted">等待提取文本</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {renderTranslationPanel()}
          </div>
        </div>
      )}
    </TranslationPageLayout>
  );
};
