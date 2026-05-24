import { DETAIL_LEVELS } from '../types';

interface DetailSelectorProps {
  detailLevel: 'low' | 'medium' | 'high';
  onDetailLevelChange: (level: 'low' | 'medium' | 'high') => void;
}

export function DetailSelector({ detailLevel, onDetailLevelChange }: DetailSelectorProps) {
  return (
    <div>
      <div className="section-label">细节</div>
      <div className="flex gap-1.5">
        {DETAIL_LEVELS.map((level) => (
          <button
            key={level.value}
            onClick={() => onDetailLevelChange(level.value)}
            className={`flex-1 px-2 py-2 rounded-md transition-colors duration-150 ${
              detailLevel === level.value
                ? 'bg-surface-4 border border-edge-strong text-txt-primary'
                : 'bg-surface-2 border border-transparent text-txt-secondary hover:text-txt-primary hover:bg-surface-3'
            }`}
          >
            <p className="text-xs font-medium">{level.label}</p>
            <p className="text-[10px] text-txt-tertiary mt-0.5">{level.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
