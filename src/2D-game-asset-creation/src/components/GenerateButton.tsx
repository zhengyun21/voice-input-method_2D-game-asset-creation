import { Sparkles, Loader2 } from 'lucide-react';

interface GenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function GenerateButton({ onClick, disabled, isLoading }: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
        disabled || isLoading
          ? 'bg-surface-3 text-txt-tertiary cursor-not-allowed border border-edge'
          : 'bg-amber text-txt-inverse hover:bg-amber-bright active:scale-[0.98]'
      }`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin-slow" />
          <span>生成中...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          <span>生成素材</span>
        </>
      )}
    </button>
  );
}
