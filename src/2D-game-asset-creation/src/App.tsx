import { useState, useCallback } from 'react';
import { Gamepad2, Zap, Download, RefreshCw, X } from 'lucide-react';
import { AssetTypeSelector } from './components/AssetTypeSelector';
import { StyleSelector } from './components/StyleSelector';
import { FormatSelector } from './components/FormatSelector';
import { ColorSchemeSelector } from './components/ColorSchemeSelector';
import { SizeSelector } from './components/SizeSelector';
import { DetailSelector } from './components/DetailSelector';
import { DescriptionInput } from './components/DescriptionInput';
import { PreviewPanel } from './components/PreviewPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { GenerateButton } from './components/GenerateButton';
import { GenerationProcessPanel } from './components/GenerationProcessPanel';
import { isSizeInvalid } from './components/SizeSelector';
import type { AssetType, VisualStyle, OutputFormat, GeneratedAsset, GenerationProcess } from './types';
import { generateImage } from './services/imageGenerator';
import { exportAsset } from './services/exportService';

const INITIAL_PROCESS: GenerationProcess = {
  steps: [
    { label: '用户输入', content: '', status: 'pending' },
    { label: '拼接提示词', content: '', status: 'pending' },
    { label: 'DeepSeek 润色', content: '', status: 'pending' },
    { label: '智谱生图', content: '', status: 'pending' },
  ],
  isActive: false,
};

function App() {
  const [assetType, setAssetType] = useState<AssetType>('character');
  const [style, setStyle] = useState<VisualStyle>('cartoon');
  const [format, setFormat] = useState<OutputFormat>('png');
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [description, setDescription] = useState('');
  const [detailLevel, setDetailLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [colorScheme, setColorScheme] = useState('vibrant');

  const [currentAsset, setCurrentAsset] = useState<GeneratedAsset | null>(null);
  const [history, setHistory] = useState<GeneratedAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationProcess, setGenerationProcess] = useState<GenerationProcess>(INITIAL_PROCESS);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const config = {
        type: assetType,
        style,
        format,
        width,
        height,
        description,
        detailLevel,
        colorScheme,
      };

      const asset = await generateImage(config, (steps) => {
        setGenerationProcess({ steps, isActive: true });
      });
      setCurrentAsset(asset);
      setHistory(prev => [asset, ...prev].slice(0, 20));
      setGenerationProcess(prev => ({ ...prev, isActive: false }));
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
      setGenerationProcess(prev => ({ ...prev, isActive: false }));
    } finally {
      setIsLoading(false);
    }
  }, [assetType, style, format, width, height, description, detailLevel, colorScheme]);

  const handleDownload = useCallback(async () => {
    if (currentAsset) {
      await exportAsset(currentAsset);
    }
  }, [currentAsset]);

  const handleClear = useCallback(() => {
    setCurrentAsset(null);
    setError(null);
    setGenerationProcess(INITIAL_PROCESS);
  }, []);

  const handleHistorySelect = useCallback((asset: GeneratedAsset) => {
    setCurrentAsset(asset);
    setError(null);
  }, []);

  const handleHistoryDownload = useCallback(async (asset: GeneratedAsset) => {
    await exportAsset(asset);
  }, []);

  const handleHistoryDelete = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    if (currentAsset?.id === id) {
      setCurrentAsset(null);
    }
  }, [currentAsset]);

  return (
    <div className="h-screen flex flex-col bg-surface-0">
      <header className="h-12 flex items-center justify-between px-5 border-b border-edge bg-surface-1 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber" />
            <Gamepad2 className="w-4 h-4 text-amber" />
          </div>
          <span className="font-mono font-semibold text-sm tracking-wide text-txt-primary">
            PIXEL FORGE
          </span>
          <span className="text-[10px] font-mono text-txt-tertiary ml-1">v1.0</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-txt-tertiary">2D Asset Generator</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-60 border-r border-edge bg-surface-1 overflow-y-auto shrink-0">
          <div className="p-4 space-y-6">
            <AssetTypeSelector value={assetType} onChange={setAssetType} />
            <StyleSelector value={style} onChange={setStyle} />
            <ColorSchemeSelector colorScheme={colorScheme} onColorSchemeChange={setColorScheme} />
            <SizeSelector width={width} height={height} onWidthChange={setWidth} onHeightChange={setHeight} />
            <DetailSelector detailLevel={detailLevel} onDetailLevelChange={setDetailLevel} />
            <FormatSelector value={format} onChange={setFormat} />
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                <PreviewPanel
                  asset={currentAsset}
                  isLoading={isLoading}
                  error={error}
                />

                <div className="flex gap-2">
                  <GenerateButton
                    onClick={handleGenerate}
                    disabled={!description.trim() || isSizeInvalid(width, height)}
                    isLoading={isLoading}
                  />
                  {currentAsset && (
                    <>
                      <button
                        onClick={handleDownload}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald text-txt-inverse rounded-lg text-sm font-semibold hover:bg-emerald-dim transition-colors duration-150"
                      >
                        <Download className="w-4 h-4" />
                        下载
                      </button>
                      <button
                        onClick={handleGenerate}
                        className="flex items-center justify-center gap-1.5 px-4 py-3 bg-surface-3 border border-edge rounded-lg text-sm font-medium text-txt-secondary hover:text-txt-primary hover:bg-surface-4 transition-colors duration-150"
                      >
                        <RefreshCw className="w-4 h-4" />
                        重新生成
                      </button>
                      <button
                        onClick={handleClear}
                        className="flex items-center justify-center px-3 py-3 bg-surface-3 border border-edge rounded-lg text-txt-tertiary hover:text-rose hover:border-rose/30 transition-colors duration-150"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                <DescriptionInput description={description} onDescriptionChange={setDescription} />

                <GenerationProcessPanel process={generationProcess} />
              </div>
            </div>

            <aside className="w-72 border-l border-edge bg-surface-1 overflow-y-auto shrink-0">
              <HistoryPanel
                history={history}
                onSelect={handleHistorySelect}
                onDownload={handleHistoryDownload}
                onDelete={handleHistoryDelete}
              />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
