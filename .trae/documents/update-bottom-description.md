# 修改底部描述 — 反映实际 AI 模型

## 现状

项目涉及两个 AI 服务：
- **讯飞语音听写** (`xfyunVoice.ts` + `useVoiceRecognition.ts`) — 语音识别，需配置 `VITE_XFYUN_APP_ID` / `VITE_XFYUN_API_KEY` / `VITE_XFYUN_API_SECRET`
- **DeepSeek** (`deepseek.ts` + `useTranslation.ts`) — 翻译，需配置 `VITE_DEEPSEEK_API_KEY`

当前 App.tsx 底部描述（第 129-132 行）：
```
点击麦克风开始录音 · 再次点击结束并识别 · 识别结果可点击编辑
使用前请配置 DeepSeek API Key
```

问题：只提了 DeepSeek，未提及讯飞。

## 修改方案

修改 [App.tsx](file:///d:/Maven/voice-input-method_2D-game-asset-creation/src/voice-input-method/src/App.tsx) 第 129-132 行，将底部描述改为：

```tsx
<div className="text-center text-xs text-text-muted space-y-1 pt-4">
  <p>点击麦克风开始录音 · 再次点击结束并识别 · 识别结果可点击编辑</p>
  <p>语音识别由讯飞驱动 · 翻译由 DeepSeek 驱动 · 使用前请配置 API Key</p>
</div>
```

同时修改 footer（第 137-139 行）：
```tsx
<p>语音输入法 · 讯飞 ASR + DeepSeek</p>
```

## 涉及文件

仅 `src/App.tsx`，两处文本修改。
