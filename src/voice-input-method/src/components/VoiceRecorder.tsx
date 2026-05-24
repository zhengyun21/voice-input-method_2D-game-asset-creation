import { audioUtils } from '../utils/audioUtils';

interface VoiceRecorderProps {
  isRecording: boolean;
  isProcessing: boolean;
  duration: number;
  disabled?: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const VoiceRecorder = ({
  isRecording,
  isProcessing,
  duration,
  disabled = false,
  onStart,
  onStop,
}: VoiceRecorderProps) => {
  const formattedDuration = audioUtils.formatDuration(duration);

  const handleClick = () => {
    if (disabled) return;
    if (isRecording) {
      onStop();
    } else if (!isProcessing) {
      onStart();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        {isRecording && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-pulse-ring" />
            <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-pulse-ring [animation-delay:0.5s]" />
          </>
        )}
        <button
          onClick={handleClick}
          disabled={isProcessing || disabled}
          className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
            disabled
              ? 'bg-surface-base border border-surface-border-subtle cursor-not-allowed opacity-40'
              : isRecording
              ? 'bg-accent shadow-[0_0_40px_rgba(245,158,11,0.3)]'
              : isProcessing
              ? 'bg-surface-elevated cursor-wait'
              : 'bg-surface-card border border-surface-border hover:border-accent/40 hover:shadow-[0_0_24px_rgba(245,158,11,0.1)]'
          }`}
        >
          {disabled ? (
            <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
          ) : isRecording ? (
            <div className="flex items-center gap-[3px]">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-[3px] h-5 bg-surface-bg rounded-full animate-wave-bar"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          ) : isProcessing ? (
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-text-muted rounded-full animate-dot-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          ) : (
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-xl font-mono tabular-nums ${
          isRecording ? 'text-accent' : 'text-text-muted'
        }`}>
          {isRecording ? formattedDuration : '--:--'}
        </span>
        <span className={`text-xs tracking-wide uppercase ${
          disabled
            ? 'text-text-muted'
            : isProcessing
            ? 'text-accent'
            : isRecording
            ? 'text-accent/70'
            : 'text-text-muted'
        }`}>
          {disabled ? '语音已关闭' : isProcessing ? '识别中' : isRecording ? '录音中' : '点击录音'}
        </span>
      </div>
    </div>
  );
};
