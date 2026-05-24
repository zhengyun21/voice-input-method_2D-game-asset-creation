import { useState } from 'react';

interface ManualTextInputProps {
  onTranslate: (text: string) => void;
  isTranslating: boolean;
}

export const ManualTextInput = ({ onTranslate, isTranslating }: ManualTextInputProps) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim() && !isTranslating) {
      onTranslate(text.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="dark-card">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border-subtle">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">输入文本</span>
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || isTranslating}
          className={`px-3 py-1 text-xs rounded-md transition-colors ${
            text.trim() && !isTranslating
              ? 'text-accent hover:bg-accent-muted'
              : 'text-text-muted cursor-not-allowed'
          }`}
        >
          翻译
        </button>
      </div>
      <div className="p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入文本进行翻译..."
          className="w-full h-32 p-3 bg-surface-base border border-surface-border rounded-lg resize-none text-text-primary text-sm leading-relaxed placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
        />
        <p className="mt-2 text-xs text-text-muted">Ctrl + Enter 快捷翻译</p>
      </div>
    </div>
  );
};
