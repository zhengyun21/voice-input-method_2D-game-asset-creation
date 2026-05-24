import { Users, Package, Layout, Landmark } from 'lucide-react';
import type { AssetType } from '../types';
import { ASSET_TYPES } from '../types';

interface AssetTypeSelectorProps {
  value: AssetType;
  onChange: (type: AssetType) => void;
}

const iconMap = {
  users: Users,
  package: Package,
  layout: Layout,
  landmark: Landmark,
};

export function AssetTypeSelector({ value, onChange }: AssetTypeSelectorProps) {
  return (
    <div>
      <div className="section-label">素材类型</div>
      <div className="grid grid-cols-2 gap-1.5">
        {ASSET_TYPES.map((type) => {
          const IconComponent = iconMap[type.icon as keyof typeof iconMap];
          const active = value === type.value;
          return (
            <button
              key={type.value}
              onClick={() => onChange(type.value)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-lg transition-colors duration-150 ${
                active
                  ? 'bg-amber/10 border border-amber/30 text-amber'
                  : 'bg-surface-3 border border-transparent text-txt-secondary hover:text-txt-primary hover:bg-surface-4'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-xs font-medium">{type.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
