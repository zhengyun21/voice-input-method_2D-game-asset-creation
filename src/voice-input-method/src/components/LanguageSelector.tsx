import type { Language } from '../types';
import { LANGUAGES } from '../types';

interface LanguageSelectorFullProps {
  mode: 'full';
  sourceLanguage: Language;
  targetLanguage: Language;
  onSourceChange: (lang: Language) => void;
  onTargetChange: (lang: Language) => void;
  disabled?: boolean;
}

interface LanguageSelectorTargetOnlyProps {
  mode: 'target-only';
  targetLanguage: Language;
  onTargetChange: (lang: Language) => void;
  disabled?: boolean;
}

type LanguageSelectorProps = LanguageSelectorFullProps | LanguageSelectorTargetOnlyProps;

export const LanguageSelector = (props: LanguageSelectorProps) => {
  const { mode, targetLanguage, onTargetChange, disabled = false } = props;

  const selectClass = "dark-input text-sm py-1.5 appearance-none cursor-pointer pr-8 bg-[length:16px_16px] bg-[right_6px_center] bg-no-repeat";
  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2371717a' stroke-width='1.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`,
  };

  if (mode === 'target-only') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-muted">翻译至</span>
        <select
          value={targetLanguage}
          onChange={(e) => onTargetChange(e.target.value as Language)}
          disabled={disabled}
          className={selectClass}
          style={selectStyle}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  const { sourceLanguage, onSourceChange } = props;

  const handleSwap = () => {
    onSourceChange(targetLanguage);
    onTargetChange(sourceLanguage);
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={sourceLanguage}
        onChange={(e) => onSourceChange(e.target.value as Language)}
        disabled={disabled}
        className={selectClass}
        style={selectStyle}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>

      <button
        onClick={handleSwap}
        disabled={disabled}
        className={`p-1.5 rounded-md transition-colors ${
          disabled
            ? 'text-text-muted cursor-not-allowed'
            : 'text-text-secondary hover:text-accent hover:bg-accent-muted'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      </button>

      <select
        value={targetLanguage}
        onChange={(e) => onTargetChange(e.target.value as Language)}
        disabled={disabled}
        className={selectClass}
        style={selectStyle}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};
