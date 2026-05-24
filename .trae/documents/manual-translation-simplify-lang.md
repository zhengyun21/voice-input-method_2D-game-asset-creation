# 手动翻译模式：简化语言选择

## 需求理解

手动翻译模式下，用户输入的文本语言不确定（可能中文、英文或其他），让 DeepSeek 自动识别源语言。因此：

- **手动模式**：去掉源语言选择器和交换按钮，只保留一个"翻译目标语言"选择器。提示词改为"将以下文本翻译成{目标语言}"，不指定源语言
- **语音模式**：保持不变（源语言+目标语言+交换按钮），因为讯飞ASR需要明确指定源语言

## 实施步骤

### Step 1: deepseek.ts — 新增自动检测源语言的翻译方法

在 `deepseekApi` 中新增 `translateAuto` 方法，system prompt 不指定源语言：
```
"你是一个翻译助手。请将以下文本翻译成{目标语言}。"
```
保留原有 `translate` 方法供语音模式使用。

### Step 2: useTranslation.ts — 新增 autoTranslate 方法

新增 `autoTranslate(text, targetLang)` 方法，调用 `deepseekApi.translateAuto`。保留原有 `translate` 供语音模式。

### Step 3: LanguageSelector.tsx — 支持仅目标语言模式

新增 `mode` prop：
- `'full'`（默认）：显示源语言+交换+目标语言（语音模式用）
- `'target-only'`：只显示目标语言选择器（手动模式用）

### Step 4: App.tsx — 根据模式切换 LanguageSelector 和翻译逻辑

- 语音模式：`<LanguageSelector mode="full" ... />`，调用 `translate(text, sourceLang, targetLang)`
- 手动模式：`<LanguageSelector mode="target-only" ... />`，调用 `autoTranslate(text, targetLang)`

### Step 5: 运行 build 验证
