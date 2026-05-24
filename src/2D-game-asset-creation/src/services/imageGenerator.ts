import axios from 'axios';
import type { AssetConfig, GeneratedAsset, GenerationStep } from '../types';
import { generateId, generatePrompt } from '../utils/helpers';
import { polishPrompt } from './promptPolisher';

const API_KEY = import.meta.env.VITE_ZHIPU_API_KEY;
const MODEL = import.meta.env.VITE_ZHIPU_MODEL || 'cogview-3-flash';

const SIZE_PRESETS: { w: number; h: number }[] = [
  { w: 1024, h: 1024 },
  { w: 768, h: 1344 },
  { w: 864, h: 1152 },
  { w: 1344, h: 768 },
  { w: 1152, h: 864 },
  { w: 1440, h: 720 },
  { w: 720, h: 1440 },
];

function nearestSize(width: number, height: number): string {
  let best: { w: number; h: number } = SIZE_PRESETS[0];
  let minDiff = Infinity;

  for (const size of SIZE_PRESETS) {
    const diff = Math.abs(size.w - width) + Math.abs(size.h - height);
    if (diff < minDiff) {
      minDiff = diff;
      best = size;
    }
  }
  return `${best.w}x${best.h}`;
}

export type StepUpdateCallback = (steps: GenerationStep[]) => void;

function makeSteps(): GenerationStep[] {
  return [
    { label: '用户输入', content: '', status: 'pending' },
    { label: '拼接提示词', content: '', status: 'pending' },
    { label: 'DeepSeek 润色', content: '', status: 'pending' },
    { label: '智谱生图', content: '', status: 'pending' },
  ];
}

function updateStep(
  steps: GenerationStep[],
  index: number,
  partial: Partial<GenerationStep>
): GenerationStep[] {
  return steps.map((s, i) => i === index ? { ...s, ...partial } : s);
}

export async function generateImage(
  config: AssetConfig,
  onStepUpdate?: StepUpdateCallback
): Promise<GeneratedAsset> {
  if (!API_KEY) {
    throw new Error('请先配置 VITE_ZHIPU_API_KEY 环境变量');
  }

  let steps = makeSteps();

  steps = updateStep(steps, 0, { content: config.description || '(无描述)', status: 'active' });
  onStepUpdate?.(steps);

  steps = updateStep(steps, 0, { status: 'done' });
  steps = updateStep(steps, 1, { status: 'active' });
  onStepUpdate?.(steps);

  const rawPrompt = generatePrompt(config);

  steps = updateStep(steps, 1, { content: rawPrompt, status: 'done' });
  steps = updateStep(steps, 2, { status: 'active' });
  onStepUpdate?.(steps);

  let prompt: string;
  try {
    prompt = await polishPrompt(rawPrompt);
    steps = updateStep(steps, 2, { content: prompt, status: 'done' });
  } catch {
    prompt = rawPrompt;
    steps = updateStep(steps, 2, { content: '润色失败，降级使用原始提示词', status: 'error' });
  }
  onStepUpdate?.(steps);

  steps = updateStep(steps, 3, { status: 'active' });
  onStepUpdate?.(steps);

  const size = nearestSize(config.width, config.height);

  try {
    const response = await axios.post(
      '/api/zhipu/images/generations',
      {
        model: MODEL,
        prompt,
        size,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const imageUrl = response.data.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error('AI 未返回有效图片');
    }

    steps = updateStep(steps, 3, { content: '图片生成完成', status: 'done' });
    onStepUpdate?.(steps);

    return {
      id: generateId(),
      url: imageUrl,
      config,
      createdAt: new Date(),
    };
  } catch (error) {
    steps = updateStep(steps, 3, { content: '生图失败', status: 'error' });
    onStepUpdate?.(steps);

    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 401) {
        throw new Error('API Key 无效，请检查 VITE_ZHIPU_API_KEY');
      }
      throw new Error(`API 请求失败 (${status})，请重试`);
    }
    throw error instanceof Error ? error : new Error('图像生成失败，请重试');
  }
}

export async function generateMultipleImages(
  config: AssetConfig,
  count: number
): Promise<GeneratedAsset[]> {
  const results: GeneratedAsset[] = [];

  for (let i = 0; i < count; i++) {
    const asset = await generateImage(config);
    results.push(asset);
  }

  return results;
}
