export type AssetType = 'character' | 'item' | 'ui' | 'scene';

export type VisualStyle = 'pixel' | 'cartoon' | 'hand-drawn' | 'flat';

export type OutputFormat = 'png' | 'jpg' | 'svg' | 'wav' | 'mp3' | 'psd';

export type GenerationStepStatus = 'pending' | 'active' | 'done' | 'error';

export interface GenerationStep {
  label: string;
  content: string;
  status: GenerationStepStatus;
}

export interface GenerationProcess {
  steps: GenerationStep[];
  isActive: boolean;
}

export interface AssetConfig {
  type: AssetType;
  style: VisualStyle;
  format: OutputFormat;
  width: number;
  height: number;
  description: string;
  detailLevel: 'low' | 'medium' | 'high';
  colorScheme: string;
}

export interface GeneratedAsset {
  id: string;
  url: string;
  config: AssetConfig;
  createdAt: Date;
}

export interface StyleOption {
  value: VisualStyle;
  label: string;
  description: string;
  color: string;
}

export interface FormatOption {
  value: OutputFormat;
  label: string;
  description: string;
  extension: string;
  category: 'image' | 'audio';
}

export interface AssetTypeOption {
  value: AssetType;
  label: string;
  description: string;
  icon: string;
}

export const ASSET_TYPES: AssetTypeOption[] = [
  { value: 'character', label: '角色', description: '角色、怪物、NPC', icon: 'users' },
  { value: 'item', label: '道具', description: '武器、装备、消耗品', icon: 'package' },
  { value: 'ui', label: 'UI', description: '图标、按钮、界面', icon: 'layout' },
  { value: 'scene', label: '场景', description: '背景、地形、建筑', icon: 'landmark' },
];

export const VISUAL_STYLES: StyleOption[] = [
  { value: 'pixel', label: '像素', description: '复古像素艺术', color: '#22d3ee' },
  { value: 'cartoon', label: '卡通', description: '活泼卡通画风', color: '#f472b6' },
  { value: 'hand-drawn', label: '手绘', description: '手绘插画风格', color: '#a78bfa' },
  { value: 'flat', label: '扁平', description: '简约扁平设计', color: '#34d399' },
];

export const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'png', label: 'PNG', description: '透明背景', extension: '.png', category: 'image' },
  { value: 'jpg', label: 'JPG', description: '背景图片', extension: '.jpg', category: 'image' },
  { value: 'svg', label: 'SVG', description: '矢量无损', extension: '.svg', category: 'image' },
  { value: 'psd', label: 'PSD', description: 'Unity兼容', extension: '.psd', category: 'image' },
];

export const PRESET_SIZES = [
  { label: '1024²', width: 1024, height: 1024 },
  { label: '768×1344', width: 768, height: 1344 },
  { label: '864×1152', width: 864, height: 1152 },
  { label: '1344×768', width: 1344, height: 768 },
  { label: '1152×864', width: 1152, height: 864 },
  { label: '1440×720', width: 1440, height: 720 },
  { label: '720×1440', width: 720, height: 1440 },
];

export const DETAIL_LEVELS = [
  { value: 'low', label: '低', description: '快速原型' },
  { value: 'medium', label: '中', description: '平衡质量' },
  { value: 'high', label: '高', description: '最终素材' },
] as const;

export const COLOR_SCHEMES = [
  { value: 'vibrant', label: '鲜艳', color: '#f59e0b' },
  { value: 'pastel', label: '柔和', color: '#c4b5fd' },
  { value: 'dark', label: '深色', color: '#6b7280' },
  { value: 'mono', label: '单色', color: '#9ca3af' },
];
