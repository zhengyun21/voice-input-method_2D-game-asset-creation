# 修复文档翻译功能 — 长文本翻译被截断

## 问题描述

传入长文本文档时，文字正常识别提取，但翻译结果是原始的被截断文本，而非完整翻译。

## 根因分析

追踪完整调用链：

1. `DocumentTranslationPage` → `autoTranslate(extractedText, targetLang)` — 传入完整提取文本 ✅
2. `useTranslation.autoTranslate` → `deepseekApi.translateAuto(text, targetLang, signal)` — 传入完整文本 ✅
3. `deepseekApi.translateAuto` — **⚠️ 问题所在**

**根本原因**：长文档作为单次 API 请求发送给 DeepSeek，存在两个问题：

1. **未设置 `max_tokens`**：API 请求未指定 `max_tokens` 参数，使用默认值（通常较小，如 4096），长文档翻译输出被截断
2. **未分块翻译**：整篇长文档一次性发送，超出模型单次输出能力，导致翻译不完整

当输出被截断时，模型可能回退输出原文片段或只翻译了部分内容，用户看到的就是"原始的被截断文本"。

## 修复方案

### 方案：分块翻译 + 段落感知 + max_tokens 设置

1. **设置合理的 `max_tokens`**：在 API 请求中添加 `max_tokens` 参数（如 8192），减少截断风险
2. **分块翻译**：将长文本按段落/换行符拆分为多个块，每块单独翻译，最后合并结果
3. **段落感知分块**：优先按双换行符（段落边界）拆分，避免在句子中间截断；若单段落过长，再按单换行符或句号拆分
4. **并发控制**：分块翻译时使用串行请求（避免 API 速率限制），逐块翻译并实时更新翻译结果

## 实现步骤

### Step 1: 修改 `deepseek.ts` — 添加 `max_tokens` 参数

在 `translateAuto` 和 `translate` 方法的请求体中添加 `max_tokens: 8192`。

**文件**: `src/services/deepseek.ts`

### Step 2: 在 `deepseek.ts` 中新增分块翻译方法 `translateAutoChunked`

- 添加辅助函数 `splitTextIntoChunks(text, maxChunkChars)`：按段落边界将文本拆分为块
- 添加 `translateAutoChunked(text, targetLang, signal, onPartialResult?)` 方法：
  - 将文本分块
  - 逐块调用 `translateAuto` 翻译
  - 通过 `onPartialResult` 回调实时返回部分翻译结果
  - 合并所有块的翻译结果返回

**文件**: `src/services/deepseek.ts`

### Step 3: 修改 `useTranslation.ts` — 支持分块翻译的流式更新

- 在 `autoTranslate` 中判断文本长度，短文本直接翻译，长文本使用分块翻译
- 分块翻译时，每完成一块就更新 `translation` 状态，实现渐进式显示
- 阈值设定：文本超过 3000 字符时使用分块翻译

**文件**: `src/hooks/useTranslation.ts`

### Step 4: 验证

- 确保短文本翻译行为不变
- 确保长文本翻译能完整输出
- 确保取消翻译时能正确中止所有分块请求

## 涉及文件

| 文件 | 修改内容 |
|------|---------|
| `src/services/deepseek.ts` | 添加 `max_tokens`；新增分块拆分函数和分块翻译方法 |
| `src/hooks/useTranslation.ts` | `autoTranslate` 支持长文本分块翻译和渐进式更新 |
