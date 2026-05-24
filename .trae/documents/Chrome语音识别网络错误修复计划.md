# Chrome 语音识别网络错误修复计划

## 问题分析

### 现象
- ✅ Edge 浏览器正常工作
- ❌ Chrome 浏览器报 "Speech recognition error: network"
- ✅ 计时器停止功能正常

### 根本原因
Chrome 浏览器使用 Google 云端语音识别服务，需要连接到 Google 服务器。在某些网络环境下（如中国大陆），Google 服务可能无法访问，导致 `network` 错误。

Edge 浏览器使用 Microsoft 自己的语音识别服务，因此不受影响。

## 解决方案

### 方案 1：恢复讯飞语音识别 API（推荐）
由于项目最初设计使用讯飞语音识别，且用户已有相关配置，恢复使用讯飞 API 是最佳方案。

**步骤**：
1. 恢复 `xfyunVoice.ts` 服务文件
2. 更新 `useVoiceRecognition.ts` 使用讯飞服务
3. 确保依赖（crypto-js）已安装

### 方案 2：添加错误提示（备用）
如果用户网络环境确实无法使用任何云端服务，添加友好的错误提示。

## 实施步骤

### 步骤 1：创建讯飞语音识别服务
恢复并修复 `src/services/xfyunVoice.ts`

### 步骤 2：更新 useVoiceRecognition Hook
修改 `src/hooks/useVoiceRecognition.ts` 使用讯飞服务

### 步骤 3：测试验证
确保在所有浏览器中都能正常工作

## 代码修改说明

### 文件：`src/services/xfyunVoice.ts`（新建）
实现完整的讯飞语音识别服务，包括：
- WebSocket 连接和鉴权
- 音频采集和 PCM 转换
- 状态管理和错误处理

### 文件：`src/hooks/useVoiceRecognition.ts`（修改）
替换为使用讯飞语音识别服务

## 注意事项
1. 需要确保 `.env` 文件中配置了正确的讯飞 API 凭证
2. 需要确保 `crypto-js` 依赖已安装