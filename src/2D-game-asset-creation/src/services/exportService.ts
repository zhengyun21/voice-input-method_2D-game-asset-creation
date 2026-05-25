import type { GeneratedAsset } from '../types';
import { downloadFile } from '../utils/helpers';

export async function exportAsset(asset: GeneratedAsset): Promise<void> {
  const { config, url, createdAt } = asset;
  
  const timestamp = createdAt.toISOString().split('T')[0];
  const filename = `asset-${config.type}-${config.style}-${timestamp}.${config.format}`;
  
  downloadFile(url, filename);
}
