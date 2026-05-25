import axios from "axios";

const DEEPSEEK_API_URL = import.meta.env.VITE_DEEPSEEK_API_URL;
const DEEPSEEK_MODEL = import.meta.env.VITE_DEEPSEEK_MODEL;
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

export async function recognizeText(
  imageBase64: string,
  signal?: AbortSignal,
): Promise<string> {
  if (!DEEPSEEK_API_URL) {
    throw new Error("DeepSeek API URL not configured");
  }
  if (!DEEPSEEK_MODEL) {
    throw new Error("DeepSeek Model not configured");
  }
  if (!DEEPSEEK_API_KEY) {
    throw new Error("DeepSeek API Key not configured");
  }

  try {
    const response = await axios.post(
      `${DEEPSEEK_API_URL}/chat/completions`,
      {
        model: DEEPSEEK_MODEL,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: '请识别并提取这张图片中的所有文字内容，仅返回识别出的文字，不要添加任何解释或说明。如果图片中没有文字，请返回"未检测到文字"。',
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        temperature: 0.1,
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        signal,
      },
    );
    return response.data.choices[0]?.message?.content || "";
  } catch (error) {
    if (axios.isCancel(error) || (error as any)?.code === "ERR_CANCELED") {
      throw new DOMException("Aborted", "AbortError");
    }
    console.error("OCR error:", error);
    throw new Error("图片识别失败，请重试");
  }
}
