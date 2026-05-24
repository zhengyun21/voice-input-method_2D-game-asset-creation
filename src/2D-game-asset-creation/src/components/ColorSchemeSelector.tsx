import { COLOR_SCHEMES } from '../types';

interface ColorSchemeSelectorProps {
  colorScheme: string;
  onColorSchemeChange: (scheme: string) => void;
}

export function ColorSchemeSelector({ colorScheme, onColorSchemeChange }: ColorSchemeSelectorProps) {
  return (
    <div>
      <div className="section-label">配色</div>
      <div className="flex gap-1.5">
        {COLOR_SCHEMES.map((scheme) => (
          <button
            key={scheme.value}
            onClick={() => onColorSchemeChange(scheme.value)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-md transition-colors duration-150 ${
              colorScheme === scheme.value
                ? 'bg-surface-4 border border-edge-strong'
                : 'bg-surface-2 border border-transparent hover:bg-surface-3'
            }`}
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: scheme.color }}
            />
            <span className="text-[11px] font-medium text-txt-secondary">{scheme.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
