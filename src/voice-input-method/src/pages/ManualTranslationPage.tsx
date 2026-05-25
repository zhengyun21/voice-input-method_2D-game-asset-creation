import { useState, useCallback } from "react";
import type { Language } from "../types";
import { ManualTextInput } from "../components/ManualTextInput";
import { TranslationPanel } from "../components/TranslationPanel";
import { TranslationPageLayout } from "../components/TranslationPageLayout";
import { useTranslation } from "../hooks/useTranslation";

export const ManualTranslationPage = () => {
  const [sourceLanguage, setSourceLanguage] = useState<Language>("zh");
  const [targetLanguage, setTargetLanguage] = useState<Language>("en");

  const {
    isTranslating,
    translation,
    error: translationError,
    autoTranslate,
    clearTranslation,
  } = useTranslation();

  const handleTranslate = useCallback(
    (text: string) => {
      autoTranslate(text, targetLanguage);
    },
    [autoTranslate, targetLanguage],
  );

  return (
    <TranslationPageLayout
      title="手动翻译"
      subtitle="Manual Translation"
      icon={
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
      }
      sourceLanguage={sourceLanguage}
      targetLanguage={targetLanguage}
      onSourceChange={setSourceLanguage}
      onTargetChange={setTargetLanguage}
      languageMode="target-only"
    >
      <div className="max-w-3xl mx-auto grid gap-4">
        <ManualTextInput
          onTranslate={handleTranslate}
          isTranslating={isTranslating}
        />
        <TranslationPanel
          translation={translation}
          isTranslating={isTranslating}
          error={translationError}
          onClear={clearTranslation}
        />
        <div className="text-center text-xs text-text-muted pt-4">
          <p>输入文本后点击翻译按钮 · 支持 Ctrl + Enter 快捷翻译</p>
        </div>
      </div>
    </TranslationPageLayout>
  );
};
