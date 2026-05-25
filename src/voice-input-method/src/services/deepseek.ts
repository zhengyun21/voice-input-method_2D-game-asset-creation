/// <reference types="vite/client" />

import type { Language } from "../types";

const DEEPSEEK_API_URL = import.meta.env.VITE_DEEPSEEK_API_URL;
const DEEPSEEK_MODEL = import.meta.env.VITE_DEEPSEEK_MODEL;
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_MAX_TOKENS =
  Number(import.meta.env.VITE_DEEPSEEK_MAX_TOKENS) || 8192;

const CHUNK_MAX_CHARS = 4000;

export function splitTextIntoChunks(
  text: string,
  maxChars: number = CHUNK_MAX_CHARS,
): string[] {
  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    if (paragraph.length > maxChars) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }
      const lines = paragraph.split(/\n/);
      for (const line of lines) {
        if (line.length > maxChars) {
          const sentences = line.split(/(?<=[。！？.!?])/);
          for (const sentence of sentences) {
            if ((currentChunk + "\n" + sentence).trim().length > maxChars) {
              if (currentChunk.trim()) chunks.push(currentChunk.trim());
              currentChunk = sentence;
            } else {
              currentChunk = currentChunk
                ? currentChunk + "\n" + sentence
                : sentence;
            }
          }
        } else if ((currentChunk + "\n" + line).trim().length > maxChars) {
          if (currentChunk.trim()) chunks.push(currentChunk.trim());
          currentChunk = line;
        } else {
          currentChunk = currentChunk ? currentChunk + "\n" + line : line;
        }
      }
    } else if ((currentChunk + "\n\n" + paragraph).trim().length > maxChars) {
      if (currentChunk.trim()) chunks.push(currentChunk.trim());
      currentChunk = paragraph;
    } else {
      currentChunk = currentChunk
        ? currentChunk + "\n\n" + paragraph
        : paragraph;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.length > 0 ? chunks : [text];
}

export const deepseekApi = {
  translateStream: async (
    text: string,
    sourceLang: Language,
    targetLang: Language,
    onToken: (token: string) => void,
    signal?: AbortSignal,
  ): Promise<string> => {
    if (!DEEPSEEK_API_URL) {
      throw new Error("DeepSeek API URL not configured");
    }
    if (!DEEPSEEK_MODEL) {
      throw new Error("DeepSeek Model not configured");
    }
    if (!DEEPSEEK_API_KEY) {
      throw new Error("DeepSeek API Key not configured");
    }

    const langNames: Record<Language, string> = {
      zh: "中文",
      en: "英语",
      ja: "日语",
      fr: "法语",
      ko: "韩语",
    };

    const response = await fetch(`${DEEPSEEK_API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          {
            role: "system",
            content: `你是一个专业翻译助手，你需要遵循以下重要规则：
                      1. 仅输出翻译结果，不要添加任何解释、说明或原文。
                      2. 仅纯数学公式（如 $E=mc^2$）和独立的数字保持原样。对话、描述、说明等自然语言内容必须完整翻译。
                      3. 保持原文的段落结构和格式。
                      请将以下文本从${langNames[sourceLang]}翻译成${langNames[targetLang]}。`,
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 0.3,
        max_tokens: DEEPSEEK_MAX_TOKENS,
        stream: true,
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error("翻译失败，请重试");
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("翻译失败，请重试");
    }

    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;

        const data = trimmed.slice(6);
        if (data === "[DONE]") break;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            fullText += content;
            onToken(content);
          }
        } catch {
          continue;
        }
      }
    }

    return fullText;
  },

  translateAutoStream: async (
    text: string,
    targetLang: Language,
    onToken: (token: string) => void,
    signal?: AbortSignal,
    sourceLang?: Language,
  ): Promise<string> => {
    if (!DEEPSEEK_API_URL) {
      throw new Error("DeepSeek API URL not configured");
    }
    if (!DEEPSEEK_MODEL) {
      throw new Error("DeepSeek Model not configured");
    }
    if (!DEEPSEEK_API_KEY) {
      throw new Error("DeepSeek API Key not configured");
    }

    const langNames: Record<Language, string> = {
      zh: "中文",
      en: "英语",
      ja: "日语",
      fr: "法语",
      ko: "韩语",
    };
    const targetLangName = langNames[targetLang];
    const sourcePart = sourceLang ? `从${langNames[sourceLang]}` : "从中文";

    const response = await fetch(`${DEEPSEEK_API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          {
            role: "system",
            content: `你是一个专业翻译助手。请将以下文本${sourcePart}翻译成${targetLangName}。重要规则：1. 仅输出翻译结果，不要添加任何解释、说明或原文。2. 仅纯数学公式（如 $E=mc^2$）和独立的数字保持原样。对话、描述、说明等自然语言内容必须完整翻译。3. 保持原文的段落结构和格式。`,
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 0.8,
        max_tokens: DEEPSEEK_MAX_TOKENS,
        stream: true,
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error("翻译失败，请重试");
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("翻译失败，请重试");
    }

    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;

        const data = trimmed.slice(6);
        if (data === "[DONE]") break;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            fullText += content;
            onToken(content);
          }
        } catch {
          continue;
        }
      }
    }

    return fullText;
  },

  translateAutoStreamChunked: async (
    text: string,
    targetLang: Language,
    onToken: (token: string) => void,
    signal?: AbortSignal,
    sourceLang?: Language,
  ): Promise<string> => {
    const chunks = splitTextIntoChunks(text, CHUNK_MAX_CHARS);
    if (chunks.length === 1) {
      return deepseekApi.translateAutoStream(
        chunks[0],
        targetLang,
        onToken,
        signal,
        sourceLang,
      );
    }

    const translatedChunks: string[] = [];
    let previousContext = "";

    for (let i = 0; i < chunks.length; i++) {
      if (signal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }

      if (i > 0) {
        onToken("\n\n");
      }

      const chunk = chunks[i];
      const hasContext = i > 0 && previousContext.length > 0;
      const textWithContext = hasContext
        ? `参考上下文翻译：\n${previousContext}\n\n需要翻译的内容：\n${chunk}`
        : chunk;

      const translated = await deepseekApi.translateAutoStream(
        textWithContext,
        targetLang,
        onToken,
        signal,
        sourceLang,
      );
      translatedChunks.push(translated);
      previousContext = chunk.slice(-1000);
    }

    return translatedChunks.join("\n\n");
  },
};
