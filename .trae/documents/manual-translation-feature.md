# 手动翻译功能实现方案

## 需求理解

1. 将"启用翻译"开关改名为"启用语音翻译"
2. 开关**开启**（语音翻译模式）：保持现有流程 — 录音 → 讯飞ASR → DeepSeek翻译
3. 开关**关闭**（手动翻译模式）：用户手动输入文本 → 直接经DeepSeek翻译 → 显示结果，不经过讯飞
4. 手动翻译模式下，录音按钮被禁用

## 当前架构分析

- `App.tsx`: `enableTranslation` 状态控制翻译开关，`useEffect` 监听 `transcript` 变化自动触发翻译
- `useVoiceRecognition.ts`: 讯飞ASR语音识别 hook
- `useTranslation.ts`: DeepSeek翻译 hook，`translate(text, sourceLang, targetLang)` 可直接调用
- `VoiceRecorder.tsx`: 录音按钮组件，接受 `disabled` 语义通过 `isProcessing` 控制
- `TranscriptDisplay.tsx`: 显示识别结果，有编辑功能

## 实施步骤

### Step 1: App.tsx — 状态与逻辑调整

- 将 `enableTranslation` 重命名为 `enableVoiceTranslation`
- 开关文案改为"启用语音翻译"
- 手动翻译模式下（`enableVoiceTranslation=false`）：
  - VoiceRecorder 传入 `disabled={true}`
  - TranscriptDisplay 替换为手动文本输入区域（新增 `ManualTextInput` 组件）
  - LanguageSelector 始终显示（不受 `enableVoiceTranslation` 控制）
  - TranslationPanel 始终显示
- 修改 `useEffect` 逻辑：
  - 语音模式下：`transcript` 变化时自动翻译（现有逻辑）
  - 手动模式下：不监听 `transcript`，由用户点击"翻译"按钮触发

### Step 2: 新建 ManualTextInput 组件

- 路径: `src/components/ManualTextInput.tsx`
- 功能: 文本输入区域 + "翻译"按钮
- Props: `onTranslate: (text: string) => void`, `isTranslating: boolean`
- 样式: 与 TranscriptDisplay 风格一致的深色卡片，内含 textarea 和提交按钮
- 空状态提示: "输入文本进行翻译"

### Step 3: VoiceRecorder.tsx — 支持 disabled 状态

- 新增 `disabled` prop
- disabled 时：按钮灰显、不可点击、显示禁用态图标
- 状态文字改为"语音已关闭"

### Step 4: App.tsx — 布局调整

- 语音翻译模式（开关ON）：
  - 显示 VoiceRecorder
  - 显示 TranscriptDisplay（识别结果）
  - 显示 TranslationPanel（翻译结果）
  - 显示 LanguageSelector
- 手动翻译模式（开关OFF）：
  - VoiceRecorder 禁用（灰显不可点击）
  - 显示 ManualTextInput（替代 TranscriptDisplay）
  - 显示 TranslationPanel（翻译结果）
  - 显示 LanguageSelector

### Step 5: 验证

- 运行 `npm run build` 确认无编译错误
