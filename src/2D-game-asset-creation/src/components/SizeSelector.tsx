import { PRESET_SIZES } from '../types';

interface SizeSelectorProps {
  width: number;
  height: number;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
}

function isSizeInvalid(w: number, h: number): boolean {
  return w < 512 || w > 2048 || h < 512 || h > 2048;
}

export function SizeSelector({ width, height, onWidthChange, onHeightChange }: SizeSelectorProps) {
  const invalid = isSizeInvalid(width, height);

  return (
    <div>
      <div className="section-label">尺寸</div>
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {PRESET_SIZES.map((size) => (
          <button
            key={size.label}
            onClick={() => {
              onWidthChange(size.width);
              onHeightChange(size.height);
            }}
            className={`px-2 py-1.5 rounded-md text-[11px] font-mono font-medium transition-colors duration-150 ${
              width === size.width && height === size.height
                ? 'bg-amber text-txt-inverse'
                : 'bg-surface-3 text-txt-secondary hover:text-txt-primary hover:bg-surface-4'
            }`}
          >
            {size.label}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-[10px] font-mono text-txt-tertiary mb-1">W</label>
          <input
            type="number"
            value={width}
            onChange={(e) => onWidthChange(Number(e.target.value))}
            className={`input-field font-mono text-xs ${invalid ? 'border-rose focus:border-rose focus:ring-rose/30' : ''}`}
            min="512"
            max="2048"
          />
        </div>
        <div className="flex-1">
          <label className="block text-[10px] font-mono text-txt-tertiary mb-1">H</label>
          <input
            type="number"
            value={height}
            onChange={(e) => onHeightChange(Number(e.target.value))}
            className={`input-field font-mono text-xs ${invalid ? 'border-rose focus:border-rose focus:ring-rose/30' : ''}`}
            min="512"
            max="2048"
          />
        </div>
      </div>
      {invalid && (
        <p className="text-[10px] font-mono text-rose mt-2">
          尺寸超出可生成范围 (512-2048px)
        </p>
      )}
    </div>
  );
}

export { isSizeInvalid };
