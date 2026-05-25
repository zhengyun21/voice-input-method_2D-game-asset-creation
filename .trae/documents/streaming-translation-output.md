# 译文流式输出计划

## 目标

为 `voice-input-method` 项目的翻译功能添加流式输出效果——使译文像打字机一样逐字/逐词渐进显示，提升用户交互体验。

## 现状分析

| 模块 | 当前行为 | 问题 |
|------|----------|------|
| `services/deepseek.ts` | 使用 `axios.post` 非流式调用 DeepSeek API | 每次都等完整响应才展示 |
| `translateAutoChunked` | 大文本分块翻译，`onPartialResult` 逐块回调 | 只支持 chunk 级粒度，不在 chunk 内流式输出 |
| `hooks/useTranslation.ts` | `setTranslation(result)` 一次性覆盖 | 无流式状态更新支持 |
| `components/TranslationPanel.tsx` | 要么显示 loading 动画，要么显示完整译文 | 无法展示渐进生成效果 |
| `types/index.ts` | `TranslationState.translation: string` | 类型定义不支持流式标记 |

## 实施方案

### 第 1 步：在 `deepseek.ts` 中新增流式翻译方法

**文件：** `src/services/deepseek.ts`

- 新增 `translateStream()` 方法
- 使用原生 `fetch`（axios 不支持 ReadableStream 的逐块读取）向 DeepSeek API 发送 `stream: true` 请求
- 读取 SSE 格式的响应流，解析 `data: {"choices":[{"delta":{"content":"..."}}]}` 格式的 chunk
- 每收到 token chunk 调用回调 `onToken(token: string)`
- 返回 Promise<string>（完整译文）

**关键点：**
- API 端点：`${DEEPSEEK_API_URL}/chat/completions`
- 请求参数中添加 `stream: true`
- 响应是 text/event-stream（SSE 格式）
- 每行格式为 `data: {"id":"...","choices":[{"delta":{"content":"片段"}}]}`
- 最后一行是 `data: [DONE]`

### 第 2 步：在 `useTranslation` hook 中支持流式状态更新

**文件：** `src/hooks/useTranslation.ts`

- 新增 `translateStream` 方法（或修改现有 `translate`/`autoTranslate` 使其内部使用流式 API）
- 在 token 回调中通过 `setTranslation(prev => prev + token)` 渐进拼接译文
- 流式结束前保持 `isTranslating: true`
- 流式结束后 `setIsTranslating(false)`
- 保留现有的 `cancelPending` 机制支持中止

### 第 3 步：更新 `TranslationPanel` 组件

**文件：** `src/components/TranslationPanel.tsx`

- 移除翻译中时的大面积 loading 动画（wave-bar），改为直接展示正在生成的译文
- 在译文末尾添加闪烁光标（blinking cursor）指示流式生成状态
- 保留 `isTranslating` 时的 header 提示（小圆点 + "翻译中"）
- 从 TranslationPanelProps 中移除 `isTranslating` 对内容区域的 loading 控制——改为始终展示 `translation` 内容

### 第 4 步：新增 CSS 动画

**文件：** `src/index.css`（或 tailwind.config.js）

- 添加 `animate-blink-cursor` 动画：一个闪烁的光标 `|`，用于译文末尾指示生成中
- 在 `tailwind.config.js` 的 `keyframes` 和 `animation` 中添加对应配置

### 第 5 步：验证

**验证清单：**
- [ ] 手动翻译页面：输入文本 → 翻译 → 译文逐字出现，末尾闪烁光标
- [ ] 语音翻译页面：录音 → 识别 → 翻译 → 译文流式生成
- [ ] 图片翻译页面：上传图片 → OCR → 确认翻译 → 译文流式生成
- [ ] 文档翻译页面：上传文档 → 提取 → 确认翻译 → 译文流式生成（大文档分块也流畅）
- [ ] 中止翻译：流式生成中切换页面/清空 → 请求正确中止
- [ ] 切换目标语言：译文实时重新流式生成
- [ ] `npm run build` 通过（TypeScript 编译无错误）

## 文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/services/deepseek.ts` | 修改 | 新增 `translateStream()` 方法 |
| `src/hooks/useTranslation.ts` | 修改 | 新增流式翻译方法，渐进更新 state |
| `src/components/TranslationPanel.tsx` | 修改 | 移除 loading 动画，展示流式内容 + 闪烁光标 |
| `tailwind.config.js` | 修改 | 新增 `blink-cursor` 动画关键帧 |
