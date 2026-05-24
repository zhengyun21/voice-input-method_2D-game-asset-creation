import axios from 'axios';

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const MODEL = import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-v4-flash';

const SYSTEM_PROMPT = `You are an expert 2D game asset prompt engineer. Your task is to refine and enhance image generation prompts for AI art models.

Rules:
1. Output ONLY the refined English prompt. No explanations, no markdown, no quotes, no preamble.
2. Preserve ALL information from the input (asset type, style, size, detail level, color scheme, description).
3. Enhance the prompt with specific visual details, lighting, composition, and artistic techniques that improve AI image generation quality.
4. Use comma-separated descriptive phrases, which is the standard format for AI image generation prompts.
5. Keep the prompt concise but rich in visual detail (aim for 50-100 words).
6. Always output in English regardless of the input language.`;

export async function polishPrompt(rawPrompt: string): Promise<string> {
  if (!API_KEY || API_KEY === 'your_deepseek_api_key_here') {
    throw new Error('请先配置 VITE_DEEPSEEK_API_KEY 环境变量');
  }

  const response = await axios.post(
    '/api/deepseek/chat/completions',
    {
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: rawPrompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    },
  );

  const polished = response.data.choices?.[0]?.message?.content?.trim();
  if (!polished) {
    throw new Error('DeepSeek 返回为空');
  }

  return polished;
}
