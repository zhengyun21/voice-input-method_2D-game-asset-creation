import type { VisualStyle } from '../types';
import { VISUAL_STYLES } from '../types';

interface StyleSelectorProps {
  value: VisualStyle;
  onChange: (style: VisualStyle) => void;
}

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <div>
      <div className="section-label">视觉风格</div>
      <div className="space-y-1">
        {VISUAL_STYLES.map((style) => {
          const active = value === style.value;
          return (
            <button
              key={style.value}
              onClick={() => onChange(style.value)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150 ${
                active
                  ? 'bg-surface-4 text-txt-primary'
                  : 'text-txt-secondary hover:text-txt-primary hover:bg-surface-3'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: style.color, opacity: active ? 1 : 0.5 }}
              />
              <div className="flex-1 text-left">
                <span className="text-xs font-medium">{style.label}</span>
              </div>
              <span className="text-[10px] font-mono text-txt-tertiary">{style.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
