import type { OutputFormat } from '../types';
import { OUTPUT_FORMATS } from '../types';
import { FileImage } from 'lucide-react';

interface FormatSelectorProps {
  value: OutputFormat;
  onChange: (format: OutputFormat) => void;
}

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <div>
      <div className="section-label">输出格式</div>
      <div className="grid grid-cols-2 gap-1.5">
        {OUTPUT_FORMATS.map((format) => {
          const active = value === format.value;
          return (
            <button
              key={format.value}
              onClick={() => onChange(format.value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-150 ${
                active
                  ? 'bg-amber/10 border border-amber/30 text-amber'
                  : 'bg-surface-3 border border-transparent text-txt-secondary hover:text-txt-primary hover:bg-surface-4'
              }`}
            >
              <FileImage className="w-3.5 h-3.5" />
              <div className="text-left">
                <span className="text-xs font-mono font-medium">{format.label}</span>
                <span className="text-[10px] text-txt-tertiary ml-1.5">{format.description}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
