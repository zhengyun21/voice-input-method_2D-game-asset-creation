import { Loader2 } from 'lucide-react';
import type { GeneratedAsset } from '../types';

interface PreviewPanelProps {
  asset: GeneratedAsset | null;
  isLoading: boolean;
  error: string | null;
}

export function PreviewPanel({
  asset,
  isLoading,
  error,
}: PreviewPanelProps) {
  return (
    <div>
      <div className="section-label">预览</div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber animate-spin-slow mb-3" />
          <p className="text-sm text-txt-secondary">生成中...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-sm text-rose mb-3">{error}</p>
        </div>
      ) : asset ? (
        <div className="animate-fade-in">
          <div className="relative bg-surface-2 border border-edge rounded-lg overflow-hidden flex items-center justify-center p-6">
            <img
              src={asset.url}
              alt="Generated asset"
              className="max-w-full max-h-72 object-contain"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-txt-tertiary">
          <div className="w-12 h-12 border border-edge rounded-lg flex items-center justify-center mb-3">
            <span className="font-mono text-lg text-txt-tertiary">PF</span>
          </div>
          <p className="text-xs font-mono">输入描述，点击生成</p>
        </div>
      )}
    </div>
  );
}
