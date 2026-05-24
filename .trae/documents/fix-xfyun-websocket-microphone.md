# 修复讯飞语音听写 WebSocket 连接失败 & 麦克风权限问题

## 问题诊断

### 问题 1: WebSocket 连接失败 (根本原因)

**当前代码使用了错误的 API 端点。** `xfyunVoice.ts` 中 `generateAuthUrl()` 使用的 host 是 `spark-api-open.xf-yun.com`，这不是讯飞语音听写(IAT)服务的有效端点。

根据讯飞官方文档，语音听写流式版 API 的正确端点为：
- **推荐**: `wss://iat-api.xfyun.cn/v2/iat`
- 备用: `wss://ws-api.xfyun.cn/v2/iat`
- 小语种: `wss://iat-niche-api.xfyun.cn/v2/iat`

`spark-api-open.xf-yun.com` 是星火大模型对话 API 的域名，不是语音听写服务。

### 问题 2: 消息格式错误

当前代码使用 `header/parameter/payload` 格式（大模型 API 格式），但传统语音听写 API 使用 `common/business/data` 格式：

```javascript
// 正确的传统 IAT 格式
{
  "common": { "app_id": "..." },
  "business": { "language": "zh_cn", "domain": "iat", "accent": "mandarin" },
  "data": { "status": 0, "format": "audio/L16;rate=16000", "audio": "base64..." }
}
```

### 问题 3: 错误信息误导

`useVoiceRecognition.ts:86-88` 的 catch 块对所有错误统一显示 "无法访问麦克风，请检查权限设置"。当 WebSocket 连接失败时，麦克风从未被请求，但用户看到的是麦克风权限错误。

### 问题 4: 执行顺序不当

`start()` 方法先连接 WebSocket，再请求麦克风。如果 WebSocket 失败，麦克风权限从未被请求，导致用户无法区分是网络问题还是权限问题。

---

## 修复计划

### Step 1: 修改 `xfyunVoice.ts` — 修正 API 端点和鉴权

- 将 `generateAuthUrl()` 中的 host 从 `spark-api-open.xf-yun.com` 改为 `iat-api.xfyun.cn`
- 将请求行从 `GET /v2/iat HTTP/1.1` 保持不变（路径正确）
- 确保签名中的 host 与新端点一致

**文件**: `src/services/xfyunVoice.ts`
**改动**: `generateAuthUrl()` 方法，第 79-88 行

### Step 2: 修改 `xfyunVoice.ts` — 修正 WebSocket 消息格式

将 `sendAudioFrame()` 方法中的 `header/parameter/payload` 格式改为 `common/business/data` 格式：

- 第一帧 (`status=0`): 发送 `common` + `business` + `data`
- 中间帧 (`status=1`): 只发送 `data`
- 最后一帧 (`status=2`): 只发送 `data`（status=2）

同时修改 `stop()` 方法中的结束消息格式。

**文件**: `src/services/xfyunVoice.ts`
**改动**: `sendAudioFrame()` 方法（第 100-138 行），`stop()` 方法（第 295-372 行）

### Step 3: 修改 `xfyunVoice.ts` — 调整执行顺序

将 `start()` 方法中的执行顺序改为：
1. 先请求麦克风权限
2. 再连接 WebSocket
3. 连接成功后初始化音频处理

这样麦克风权限错误和 WebSocket 连接错误可以被分别捕获和处理。

**文件**: `src/services/xfyunVoice.ts`
**改动**: `start()` 方法（第 220-293 行）

### Step 4: 修改 `useVoiceRecognition.ts` — 区分错误类型

在 catch 块中根据错误类型显示不同的错误信息：
- WebSocket 连接失败 → "语音服务连接失败，请检查网络和 API 配置"
- 麦克风权限被拒 → "无法访问麦克风，请检查权限设置"
- 其他错误 → 显示具体错误信息

**文件**: `src/hooks/useVoiceRecognition.ts`
**改动**: `startRecording()` 回调（第 73-90 行）

### Step 5: 修改 `xfyunVoice.ts` — 修正结果解析

传统 IAT API 的响应格式为：
```json
{
  "code": 0,
  "message": "success",
  "sid": "iat000xxxxx@xxxx",
  "data": {
    "result": {
      "bg": 0,
      "ls": false,
      "pgs": "apd",
      "rg": [0, 10],
      "sn": 1,
      "ws": [{ "bg": 0, "cw": [{ "w": "今天", "wpg": "今" }] }]
    }
  }
}
```

当前 `parseResult()` 方法的解析逻辑基本正确，但需要确认响应字段路径。当前代码检查 `data.header.code`，但传统 IAT 的错误码在 `data.code`（顶层），不在 `data.header.code`。

**文件**: `src/services/xfyunVoice.ts`
**改动**: `parseResult()` 和 `onmessage` 处理逻辑

### Step 6: 验证

- 启动开发服务器
- 点击录音按钮，确认麦克风权限请求正常弹出
- 确认 WebSocket 连接成功建立
- 说话测试，确认识别结果正常返回
