import { useState } from 'react';
import { Clock, Download, Trash2, Eye, X } from 'lucide-react';
import type { GeneratedAsset } from '../types';
import { formatDate } from '../utils/helpers';

interface HistoryPanelProps {
  history: GeneratedAsset[];
  onSelect: (asset: GeneratedAsset) => void;
  onDownload: (asset: GeneratedAsset) => void;
  onDelete: (id: string) => void;
}

function AssetDetailModal({ asset, onClose }: { asset: GeneratedAsset; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative bg-surface-1 border border-edge rounded-xl p-5 w-[360px] max-h-[80vh] overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-txt-primary">素材参数</span>
          <button
            onClick={onClose}
            className="p-1 text-txt-tertiary hover:text-rose transition-colors duration-150"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-surface-2 border border-edge rounded-lg overflow-hidden flex items-center justify-center p-4 mb-4">
          <img
            src={asset.url}
            alt="Generated asset"
            className="max-w-full max-h-48 object-contain"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-mono text-txt-tertiary">TYPE</span>
            <span className="font-mono text-txt-secondary">{asset.config.type}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="font-mono text-txt-tertiary">STYLE</span>
            <span className="font-mono text-txt-secondary">{asset.config.style}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="font-mono text-txt-tertiary">SIZE</span>
            <span className="font-mono text-txt-secondary">{asset.config.width}x{asset.config.height}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="font-mono text-txt-tertiary">DETAIL</span>
            <span className="font-mono text-txt-secondary">{asset.config.detailLevel}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="font-mono text-txt-tertiary">COLOR</span>
            <span className="font-mono text-txt-secondary">{asset.config.colorScheme}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="font-mono text-txt-tertiary">FORMAT</span>
            <span className="font-mono text-txt-secondary">{asset.config.format}</span>
          </div>
          {asset.config.description && (
            <div className="pt-1">
              <span className="font-mono text-txt-tertiary text-xs block mb-1">DESC</span>
              <p className="text-xs text-txt-secondary">{asset.config.description}</p>
            </div>
          )}
          <div className="flex justify-between text-xs">
            <span className="font-mono text-txt-tertiary">TIME</span>
            <span className="font-mono text-txt-secondary">{formatDate(asset.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HistoryPanel({ history, onSelect, onDownload, onDelete }: HistoryPanelProps) {
  const [viewingAsset, setViewingAsset] = useState<GeneratedAsset | null>(null);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="section-label mb-0">历史</div>
        <span className="text-[10px] font-mono text-txt-tertiary bg-surface-3 px-1.5 py-0.5 rounded">
          {history.length}
        </span>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-txt-tertiary">
          <Clock className="w-6 h-6 mb-2 opacity-40" />
          <p className="text-[11px] font-mono">暂无记录</p>
        </div>
      ) : (
        <div className="space-y-1">
          {history.map((asset) => (
            <div
              key={asset.id}
              className="group flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-3 transition-colors duration-150 cursor-pointer"
              onClick={() => onSelect(asset)}
            >
              <div className="w-9 h-9 bg-surface-4 rounded border border-edge overflow-hidden shrink-0">
                <img
                  src={asset.url}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-txt-primary truncate">
                  {asset.config.description || '未命名'}
                </p>
                <p className="text-[10px] font-mono text-txt-tertiary">
                  {asset.config.width}x{asset.config.height} / {asset.config.style}
                </p>
              </div>
              <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button
                  onClick={(e) => { e.stopPropagation(); setViewingAsset(asset); }}
                  className="p-1 text-txt-tertiary hover:text-amber rounded transition-colors duration-150"
                >
                  <Eye className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDownload(asset); }}
                  className="p-1 text-txt-tertiary hover:text-emerald rounded transition-colors duration-150"
                >
                  <Download className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(asset.id); }}
                  className="p-1 text-txt-tertiary hover:text-rose rounded transition-colors duration-150"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewingAsset && (
        <AssetDetailModal asset={viewingAsset} onClose={() => setViewingAsset(null)} />
      )}
    </div>
  );
}
