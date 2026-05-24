import { useState } from 'react';

interface TranscriptDisplayProps {
  transcript: string;
  error: string | null;
  onClear: () => void;
}

export const TranscriptDisplay = ({ transcript, error, onClear }: TranscriptDisplayProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(transcript);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(transcript);
    setIsEditing(false);
  };

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

  if (!transcript) {
    return (
      <div className="dark-card p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
          <p className="text-sm text-text-muted">识别结果</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark-card animate-fade-in-up">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border-subtle">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">识别结果</span>
        <div className="flex items-center gap-1">
          {isEditing && (
            <>
              <button
                onClick={handleSave}
                className="px-2.5 py-1 text-xs text-accent hover:bg-accent-muted rounded-md transition-colors"
              >
                保存
              </button>
              <button
                onClick={handleCancel}
                className="px-2.5 py-1 text-xs text-text-muted hover:text-text-secondary hover:bg-surface-elevated rounded-md transition-colors"
              >
                取消
              </button>
            </>
          )}
          <button
            onClick={onClear}
            className="px-2.5 py-1 text-xs text-text-muted hover:text-text-secondary hover:bg-surface-elevated rounded-md transition-colors"
          >
            清空
          </button>
        </div>
      </div>
      <div className="p-4">
        {isEditing ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full h-32 p-3 bg-surface-base border border-surface-border rounded-lg resize-none text-text-primary text-sm leading-relaxed focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
            autoFocus
          />
        ) : (
          <div
            className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap cursor-text hover:text-text-primary/90"
            onClick={() => setIsEditing(true)}
          >
            {transcript}
          </div>
        )}
      </div>
    </div>
  );
};
