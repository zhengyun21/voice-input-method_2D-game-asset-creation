# 修复语音识别失败问题

## 问题诊断

用户点击录音按钮后，能正常录音（录音时长显示正常），但停止录音后显示"语音识别失败，请重试"。

### 根因分析

当前代码在 [deepseek.ts:L20-L34](file:///d:/Maven/voice-input-method_2D-game-asset-creation/src/voice-input-method/src/services/deepseek.ts#L20-L34) 中，将录制的音频以 **JSON 格式**（`Content-Type: application/json`）发送 Base64 编码的音频数据给 DeepSeek Whisper API：

```typescript
// 当前错误的调用方式
axios.post(
  `${DEEPSEEK_API_URL}/audio/transcriptions`,
  {
    model: "whisper-large-v3",
    audio: audioBase64,       // ❌ Base64 字符串放在 JSON body 中
    language: language,
    response_format: "json",
  },
  {
    headers: {
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json",  // ❌ 错误的内容类型
    },
  },
);
```

但 OpenAI Whisper API（DeepSeek 遵循此规范）要求：

1. **`Content-Type` 必须是 `multipart/form-data`**，不是 `application/json`
2. 音频数据必须以 **文件上传** 方式发送（FormData 中的 `file` 字段），不能用 Base64 字符串
3. 支持的音频格式包括 `webm`（浏览器 MediaRecorder 的默认输出格式）

参考：OpenAI 和 SambaNova 的 Whisper API 文档确认此格式要求。

### 次要问题

1. **错误信息丢失**：[deepseek.ts:L36-L39](file:///d:/Maven/voice-input-method_2D-game-asset-creation/src/voice-input-method/src/services/deepseek.ts#L36-L39) 中 catch 块丢弃了 API 返回的具体错误信息，只抛出通用消息，导致无法排查具体原因
2. **缺少环境变量模板**：项目没有 `.env.example` 文件，用户不知道需要配置什么

---

## 修复计划

### 步骤 1：修复 API 请求格式 → 改为 multipart/form-data

**文件**：`src/voice-input-method/src/services/deepseek.ts`

将 `transcribe` 方法从 JSON body 改为 FormData：

```typescript
transcribe: async (audioBlob: Blob, language: Language): Promise<string> => {
  // ...
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');
  formData.append('model', 'whisper-large-v3');
  formData.append('language', language);
  formData.append('response_format', 'json');

  const response = await axios.post(
    `${DEEPSEEK_API_URL}/audio/transcriptions`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data.text;
};
```

同时需要修改调用方：将 Blob 直接传入（不再需要 Base64 转换）。

**验证方式**：检查 API 调用格式与 OpenAI/SambaNova Whisper 文档一致。

### 步骤 2：修改 Hook 层 → 传入 Blob 而非 Base64

**文件**：`src/voice-input-method/src/hooks/useVoiceRecognition.ts`

删除 Base64 转换步骤，直接将 audioBlob 传给 `deepseekApi.transcribe`：

```typescript
// 修改前
const base64 = await audioUtils.blobToBase64(audioBlob);
const result = await deepseekApi.transcribe(base64, 'zh');

// 修改后
const result = await deepseekApi.transcribe(audioBlob, 'zh');
```

**验证方式**：检查类型匹配，`transcribe` 的参数类型从 `string` 变为 `Blob`。

### 步骤 3：改进错误处理 → 保留 API 错误详情

**文件**：`src/voice-input-method/src/services/deepseek.ts`

在 catch 块中提取 API 返回的错误信息：

```typescript
} catch (error) {
  console.error("Transcription error:", error);
  if (axios.isAxiosError(error) && error.response) {
    const detail = error.response.data?.error?.message || JSON.stringify(error.response.data);
    throw new Error(`语音识别失败: ${detail}`);
  }
  throw new Error("语音识别失败，请重试");
}
```

**验证方式**：错误信息包含 API 返回的具体原因，便于排查问题。

### 步骤 4：添加 .env.example 模板

**文件**：`src/voice-input-method/.env.example`（新建）

```env
# DeepSeek API Key（必填）
# 获取地址：https://platform.deepseek.com/api_keys
VITE_DEEPSEEK_API_KEY=your_api_key_here

# DeepSeek API URL（可选，默认 https://api.deepseek.com/v1）
# VITE_DEEPSEEK_API_URL=https://api.deepseek.com/v1
```

**验证方式**：检查文件存在且内容正确。

---

## 影响范围

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `src/services/deepseek.ts` | 修改 | API 调用格式从 JSON 改为 FormData；改进错误处理 |
| `src/hooks/useVoiceRecognition.ts` | 修改 | 移除 Base64 转换，直接传 Blob |
| `src/utils/audioUtils.ts` | 不变 | `blobToBase64` 保留（其他地方可能用到） |
| `.env.example` | 新建 | 环境变量模板 |

不涉及 UI 层变更（`VoiceRecorder.tsx`、`TranscriptDisplay.tsx`、`App.tsx`），UI 逻辑保持不变。

---

## 验证方法

1. 确保 `.env` 文件已配置正确的 `VITE_DEEPSEEK_API_KEY`
2. 运行 `npm run dev` 启动开发服务器
3. 点击录音按钮 → 说话 → 停止录音
4. 确认识别结果正常显示，不再出现"语音识别失败"错误
5. 如有问题，根据改进后的错误信息排查
