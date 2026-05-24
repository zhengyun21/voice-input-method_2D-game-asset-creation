import type { GeneratedAsset, OutputFormat } from '../types';
import { downloadFile } from '../utils/helpers';

export async function exportAsset(asset: GeneratedAsset): Promise<void> {
  const { config, url, createdAt } = asset;
  
  const timestamp = createdAt.toISOString().split('T')[0];
  const filename = `asset-${config.type}-${config.style}-${timestamp}.${config.format}`;
  
  downloadFile(url, filename);
}

export async function exportAssets(assets: GeneratedAsset[]): Promise<void> {
  for (const asset of assets) {
    await exportAsset(asset);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

export async function exportAsSpriteSheet(
  assets: GeneratedAsset[]
): Promise<void> {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `sprite-sheet-${timestamp}.png`;
  
  const firstAsset = assets[0];
  if (firstAsset) {
    downloadFile(firstAsset.url, filename);
  }
}

export function getFormatExtension(format: OutputFormat): string {
  const extensions: Record<OutputFormat, string> = {
    png: '.png',
    jpg: '.jpg',
    svg: '.svg',
    wav: '.wav',
    mp3: '.mp3',
    psd: '.psd',
  };
  return extensions[format];
}
