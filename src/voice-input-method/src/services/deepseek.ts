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

    const targetLangName = targetLang === "zh" ? "中文" : "English";

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
        },
      );
      return response.data.choices[0]?.message?.content || text;
    } catch (error) {
      console.error("Translation error:", error);
      throw new Error("翻译失败，请重试");
    }
  },

  translateAuto: async (
    text: string,
    targetLang: Language,
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

    const targetLangName = targetLang === "zh" ? "中文" : "English";

    try {
      const response = await axios.post(
        `${DEEPSEEK_API_URL}/chat/completions`,
        {
          model: DEEPSEEK_MODEL,
          messages: [
            {
              role: "system",
              content: `你是一个翻译助手。请将以下文本翻译成${targetLangName}。`,
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
        },
      );
      return response.data.choices[0]?.message?.content || text;
    } catch (error) {
      console.error("Translation error:", error);
      throw new Error("翻译失败，请重试");
    }
  },
};
