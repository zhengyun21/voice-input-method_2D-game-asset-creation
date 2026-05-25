import type { ReactNode } from 'react';
import type { Language } from '../types';
import { LanguageSelector } from './LanguageSelector';

interface TranslationPageLayoutProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  sourceLanguage: Language;
  targetLanguage: Language;
  onSourceChange: (lang: Language) => void;
  onTargetChange: (lang: Language) => void;
  languageMode?: 'full' | 'target-only';
  languageDisabled?: boolean;
  children: ReactNode;
}

export const TranslationPageLayout = ({
  title,
  subtitle,
  icon,
  sourceLanguage,
  targetLanguage,
  onSourceChange,
  onTargetChange,
  languageMode = 'full',
  languageDisabled = false,
  children,
}: TranslationPageLayoutProps) => {
  return (
    <div className="h-full flex flex-col">
      <header className="px-8 py-5 border-b border-surface-border-subtle flex-shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
              {icon}
            </div>
            <div>
              <h2 className="text-lg font-display font-semibold text-text-primary tracking-tight">{title}</h2>
              <p className="text-xs text-text-muted">{subtitle}</p>
            </div>
          </div>
          <LanguageSelector
            mode={languageMode}
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
            onSourceChange={onSourceChange}
            onTargetChange={onTargetChange}
            disabled={languageDisabled}
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        {children}
      </div>
    </div>
  );
};
