import type { AssetConfig, VisualStyle, AssetType } from '../types';

export function generatePrompt(config: AssetConfig): string {
  const typePrompts: Record<AssetType, string> = {
    character: '2D game character sprite',
    item: '2D game item icon',
    ui: '2D game UI icon element',
    scene: '2D game background scene',
  };

  const stylePrompts: Record<VisualStyle, string> = {
    pixel: 'pixel art style, 16-bit retro, clean pixel edges, limited color palette',
    cartoon: 'cartoon style, cel shaded, bright colors, bold outlines, cute',
    'hand-drawn': 'hand-drawn illustration style, sketchy lines, watercolor texture',
    flat: 'flat design style, minimal shading, solid colors, clean geometric shapes, vector art',
  };

  const detailPrompts: Record<string, string> = {
    low: 'simple, minimal details',
    medium: 'moderate detail',
    high: 'highly detailed, intricate',
  };

  const colorPrompts: Record<string, string> = {
    vibrant: 'vibrant saturated colors',
    pastel: 'soft pastel colors, gentle tones',
    dark: 'dark theme, moody atmosphere',
    mono: 'monochromatic color scheme',
  };

  const base = `${typePrompts[config.type]}, ${stylePrompts[config.style]}, ${detailPrompts[config.detailLevel]}`;
  const subject = config.description.trim() ? `, ${config.description}` : '';
  const color = colorPrompts[config.colorScheme] ? `, ${colorPrompts[config.colorScheme]}` : '';
  const technical = `, ${config.width}x${config.height}, game asset, centered, clean background, standalone, professional quality`;

  return base + subject + color + technical;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
