import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Language } from "../types";
import { LANGUAGES, TARGET_LANGUAGES } from "../types";

interface LanguageSelectorFullProps {
  mode: "full";
  sourceLanguage: Language;
  targetLanguage: Language;
  onSourceChange: (lang: Language) => void;
  onTargetChange: (lang: Language) => void;
  disabled?: boolean;
}

interface LanguageSelectorTargetOnlyProps {
  mode: "target-only";
  targetLanguage: Language;
  onTargetChange: (lang: Language) => void;
  disabled?: boolean;
}

type LanguageSelectorProps =
  | LanguageSelectorFullProps
  | LanguageSelectorTargetOnlyProps;

interface DropdownProps {
  options: { code: Language; label: string }[];
  value: Language;
  onChange: (lang: Language) => void;
  disabled?: boolean;
}

const LanguageDropdown = ({ options, value, onChange, disabled }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.code === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (lang: Language) => {
    onChange(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : isOpen
            ? "bg-accent/15 text-accent"
            : "bg-surface-elevated text-text-secondary hover:bg-surface-border hover:text-text-primary"
        }`}
      >
        <span>{selectedOption?.label}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen &&
        !disabled &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed bg-surface-card border border-surface-border rounded-xl shadow-lg shadow-black/20 py-1.5 z-50 animate-fade-in-up"
            style={{
              top: buttonRef.current
                ? buttonRef.current.getBoundingClientRect().bottom + 6
                : 0,
              left: buttonRef.current
                ? buttonRef.current.getBoundingClientRect().left
                : 0,
              minWidth: buttonRef.current?.offsetWidth || 120,
            }}
          >
            {options.map((opt) => (
              <button
                key={opt.code}
                onClick={() => handleSelect(opt.code)}
                className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                  opt.code === value
                    ? "text-accent bg-accent/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};

export const LanguageSelector = (props: LanguageSelectorProps) => {
  const { mode, targetLanguage, onTargetChange, disabled = false } = props;

  if (mode === "target-only") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-muted">翻译至</span>
        <LanguageDropdown
          options={TARGET_LANGUAGES}
          value={targetLanguage}
          onChange={onTargetChange}
          disabled={disabled}
        />
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
      <LanguageDropdown
        options={LANGUAGES}
        value={sourceLanguage}
        onChange={onSourceChange}
        disabled={disabled}
      />

      <button
        onClick={handleSwap}
        disabled={disabled}
        className={`p-1.5 rounded-lg transition-colors ${
          disabled
            ? "text-text-muted cursor-not-allowed opacity-50"
            : "text-text-secondary hover:text-accent hover:bg-accent/10"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
          />
        </svg>
      </button>

      <LanguageDropdown
        options={TARGET_LANGUAGES}
        value={targetLanguage}
        onChange={onTargetChange}
        disabled={disabled}
      />
    </div>
  );
};
