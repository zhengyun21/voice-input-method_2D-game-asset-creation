/// <reference types="vite/client" />

import axios from "axios";
import type { Language } from "../types";

const DEEPSEEK_API_URL = import.meta.env.VITE_DEEPSEEK_API_URL;
const DEEPSEEK_MODEL = import.meta.env.VITE_DEEPSEEK_MODEL;
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

export const deepseekApi = {
  translate: async (
    text: string,
    sourceLang: Language,
    targetLang: Language,
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
      en: "English",
      ja: "日本語",
      fr: "Français",
      ko: "한국어",
    };
    const targetLangName = langNames[targetLang];

    try {
      const response = await axios.post(
        `${DEEPSEEK_API_URL}/chat/completions`,
        {
          model: DEEPSEEK_MODEL,
          messages: [
            {
              role: "system",
              content: `你是一个翻译助手。请将以下文本从${sourceLang === "zh" ? "中文" : "English"}翻译成${targetLangName}。`,
            },
            {
              role: "user",
              content: text,
            },
          ],
          temperature: 0.3,
        },
        {
          headers: {
            Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json",
          },
          signal,
        },
      );
      return response.data.choices[0]?.message?.content || text;
    } catch (error) {
      if (axios.isCancel(error) || (error as any)?.code === "ERR_CANCELED") {
        throw new DOMException("Aborted", "AbortError");
      }
      console.error("Translation error:", error);
      throw new Error("翻译失败，请重试");
    }
  },

  translateAuto: async (
    text: string,
    targetLang: Language,
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
      en: "English",
      ja: "日本語",
      fr: "Français",
      ko: "한국어",
    };
    const targetLangName = langNames[targetLang];

    try {
      const response = await axios.post(
        `${DEEPSEEK_API_URL}/chat/completions`,
        {
          model: DEEPSEEK_MODEL,
          messages: [
            {
              role: "system",
              content: `你是一个专业翻译助手。请直接将用户输入的文本翻译成${targetLangName}，仅返回翻译结果，不要添加任何额外解释或说明。`,
            },
            {
              role: "user",
              content: text,
            },
          ],
          temperature: 0.3,
        },
        {
          headers: {
            Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json",
          },
          signal,
        },
      );
      return response.data.choices[0]?.message?.content || text;
    } catch (error) {
      if (axios.isCancel(error) || (error as any)?.code === "ERR_CANCELED") {
        throw new DOMException("Aborted", "AbortError");
      }
      console.error("Translation error:", error);
      throw new Error("翻译失败，请重试");
    }
  },
};
