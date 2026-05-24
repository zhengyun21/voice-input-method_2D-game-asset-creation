interface TranslationPanelProps {
  translation: string;
  isTranslating: boolean;
  error: string | null;
  onClear: () => void;
}

export const TranslationPanel = ({
  translation,
  isTranslating,
  error,
  onClear,
}: TranslationPanelProps) => {
  if (error) {
    return (
      <div className="dark-card p-4">
        <div className="flex items-center gap-2 text-red-400">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dark-card">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border-subtle">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">翻译结果</span>
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
              onClick={onClear}
              className="px-2.5 py-1 text-xs text-text-muted hover:text-text-secondary hover:bg-surface-elevated rounded-md transition-colors"
            >
              清空
            </button>
          )}
        </div>
      </div>
      <div className="p-4">
        {isTranslating ? (
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
        ) : translation ? (
          <div className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap animate-fade-in-up">
            {translation}
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
