# 语音识别修复方案：切换为科大讯飞 ASR

## 问题根因

DeepSeek API **不提供语音识别（ASR）服务**。官方文档仅有 `/chat/completions` 等文本接口，`/audio/transcriptions` 端点不存在（返回 404）。

国内 ASR 服务中，**科大讯飞**是唯一支持浏览器端直接调用的服务（有 `xfyun-sdk` npm 包）。

## 技术选型

使用 [xfyun-sdk](https://www.npmjs.com/package/xfyun-sdk)（v1.5.1+）：
- 科大讯飞语音识别 Web SDK，纯 TypeScript
- 基于 WebSocket 实时流式识别
- 内置麦克风采集、VAD 静音检测、自动重连
- 支持普通话、粤语、英语
- 免费额度：500 次/天

## 实施计划

### 步骤 1：安装 xfyun-sdk 依赖

```bash
npm install xfyun-sdk
```

**文件**：`src/voice-input-method/package.json`

### 步骤 2：创建科大讯飞 ASR 服务封装

**文件**：`src/voice-input-method/src/services/xfyun.ts`（新建）

将 `XfyunASR` 封装为与现有 Hook 兼容的接口：

```typescript
import { XfyunASR } from 'xfyun-sdk';

export interface XfyunConfig {
  appId: string;
  apiKey: string;
  apiSecret: string;
}

export const createXfyunASR = (config: XfyunConfig) => {
  return new XfyunASR({
    appId: config.appId,
    apiKey: config.apiKey,
    apiSecret: config.apiSecret,
    language: 'zh-cn',
  });
};
```

### 步骤 3：重写 useVoiceRecognition Hook

**文件**：`src/voice-input-method/src/hooks/useVoiceRecognition.ts`

改为使用 `XfyunASR` 替代 MediaRecorder + DeepSeek API：

```typescript
import { useState, useCallback, useRef, useEffect } from 'react';
import { XfyunASR } from 'xfyun-sdk';

const APP_ID = import.meta.env.VITE_XFYUN_APP_ID || '';
const API_KEY = import.meta.env.VITE_XFYUN_API_KEY || '';
const API_SECRET = import.meta.env.VITE_XFYUN_API_SECRET || '';

export const useVoiceRecognition = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);

  const asrRef = useRef<XfyunASR | null>(null);
  const timerRef = useRef<number | null>(null);
  const partialTextRef = useRef('');

  useEffect(() => {
    if (!APP_ID || !API_KEY || !API_SECRET) return;

    const asr = new XfyunASR({
      appId: APP_ID,
      apiKey: API_KEY,
      apiSecret: API_SECRET,
      language: 'zh-cn',
      onResult: (text, isFinal) => {
        if (isFinal) {
          setTranscript(prev => prev + text);
          partialTextRef.current = '';
        } else {
          partialTextRef.current = text;
        }
      },
      onError: (err) => {
        setError(`语音识别失败: ${err.message}`);
        setIsRecording(false);
      },
    });

    asrRef.current = asr;

    return () => {
      asr.destroy();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setTranscript('');
      partialTextRef.current = '';
      
      const asr = asrRef.current;
      if (!asr) {
        setError('讯飞 ASR 未初始化，请检查 API 配置');
        return;
      }

      await asr.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      setError('无法访问麦克风，请检查权限设置');
      console.error('Recording error:', err);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    const asr = asrRef.current;
    if (!asr) return;

    setIsRecording(false);
    setIsProcessing(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    try {
      await asr.stop();
    } catch (err) {
      setError(err instanceof Error ? err.message : '识别失败');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
    setDuration(0);
  }, []);

  return {
    isRecording,
    isProcessing,
    transcript,
    error,
    duration,
    startRecording,
    stopRecording,
    clearTranscript,
  };
};
```

### 步骤 4：更新 App.tsx

**文件**：`src/voice-input-method/src/App.tsx`

移除 `RecognitionMode` 类型依赖，`useVoiceRecognition` 不再需要参数：

```typescript
// 修改前
const { ... } = useVoiceRecognition('offline');

// 修改后
const { ... } = useVoiceRecognition();
```

### 步骤 5：更新环境变量

**文件**：`src/voice-input-method/.env.example`（更新）

```env
# 科大讯飞 API 配置（必填）
# 获取地址：https://console.xfyun.cn/app/myapp
VITE_XFYUN_APP_ID=your_app_id
VITE_XFYUN_API_KEY=your_api_key
VITE_XFYUN_API_SECRET=your_api_secret
```

### 步骤 6：清理不再需要的代码

**文件**：`src/voice-input-method/src/services/deepseek.ts`
- 删除 `transcribe` 方法（不再使用），保留 `translate` 方法

**文件**：`src/voice-input-method/src/hooks/useVoiceRecognition.ts`
- 移除 `RecognitionMode` 导入
- 移除 `deepseekApi` 导入
- 移除 `audioUtils` 导入

## 影响范围

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `package.json` | 修改 | 新增 `xfyun-sdk` 依赖 |
| `src/services/xfyun.ts` | 新建 | 讯飞 ASR 服务封装 |
| `src/services/deepseek.ts` | 修改 | 删除 `transcribe` 方法 |
| `src/hooks/useVoiceRecognition.ts` | 重写 | 使用 XfyunASR 替代 MediaRecorder |
| `src/App.tsx` | 修改 | 移除 `RecognitionMode` 参数 |
| `.env.example` | 修改 | 更新为讯飞配置项 |

## 使用前准备

1. 注册 [科大讯飞开放平台](https://console.xfyun.cn/)
2. 创建应用 → 选择「语音听写」服务
3. 获取 APP ID、API Key、API Secret
4. 在 `.env` 中填入 `VITE_XFYUN_APP_ID`、`VITE_XFYUN_API_KEY`、`VITE_XFYUN_API_SECRET`
5. 运行 `npm install && npm run dev`

## 验证方法

1. 配置好讯飞 API 密钥后启动项目
2. 点击录音按钮 → 说话 → 停止录音
3. 确认识别结果正常显示
