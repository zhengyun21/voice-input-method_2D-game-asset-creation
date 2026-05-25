# 翻译功能只能使用一次 — 修复计划

## 问题描述

用户反馈：翻译功能有异常，只能翻译一次，第二次点击翻译按钮后并不能进行翻译功能。

## 根因分析

经过对代码的深入分析，发现以下问题：

### 问题 1：`useEffect` 在手动模式下错误调用 `clearTranslation()`

**文件**: [App.tsx](file:///d:/Maven/voice-input-method_2D-game-asset-creation/src/voice-input-method/src/App.tsx#L36-L42)

```tsx
useEffect(() => {
    if (enableVoiceTranslation && transcript) {
        translate(transcript, sourceLanguage, targetLanguage);
    } else if (!transcript || !enableVoiceTranslation) {
        clearTranslation();  // ← 当 enableVoiceTranslation=false 时，此条件永远为 true
    }
}, [transcript, sourceLanguage, targetLanguage, enableVoiceTranslation, translate, clearTranslation]);
```

当 `enableVoiceTranslation` 为 `false`（手动模式）时，`!enableVoiceTranslation` 始终为 `true`，导致每次 effect 重新运行时都会调用 `clearTranslation()`。这意味着：

- 用户切换到手动模式时，`clearTranslation()` 被调用
- 用户更改目标语言时，`clearTranslation()` 被调用
- 任何依赖项变化时，`clearTranslation()` 都会被调用

### 问题 2：`clearTranslation` 不重置 `isTranslating` 状态

**文件**: [useTranslation.ts](file:///d:/Maven/voice-input-method_2D-game-asset-creation/src/voice-input-method/src/hooks/useTranslation.ts#L55-L58)

```tsx
const clearTranslation = useCallback(() => {
    setTranslation('');
    setError(null);
    // ← 缺少 setIsTranslating(false)
}, []);
```

`clearTranslation` 只清除了 `translation` 和 `error`，但没有重置 `isTranslating`。这导致：

- 如果从语音模式切换到手动模式时，语音翻译正在进行中（`isTranslating = true`），`clearTranslation()` 不会重置 `isTranslating`
- 翻译按钮会因为 `isTranslating = true` 而保持禁用状态
- 用户无法进行第二次翻译

### 问题 3：并发翻译竞态条件

`translate` 和 `autoTranslate` 共享同一个 `isTranslating` 状态。如果多个翻译并发触发（例如 `useEffect` 触发语音翻译的同时用户点击手动翻译按钮），`isTranslating` 状态会变得不一致：

1. 语音翻译开始 → `isTranslating = true`
2. 用户切换到手动模式 → `clearTranslation()` 被调用（不重置 `isTranslating`）
3. 语音翻译完成 → `isTranslating = false`（但此时用户可能已经开始了手动翻译）
4. 手动翻译的 `finally` 块可能提前将 `isTranslating` 设为 `false`

## 修复步骤

### 步骤 1：修复 `useEffect` — 仅在语音模式下管理翻译

修改 `App.tsx` 中的 `useEffect`，使其仅在语音模式下调用 `clearTranslation()`：

```tsx
useEffect(() => {
    if (enableVoiceTranslation && transcript) {
        translate(transcript, sourceLanguage, targetLanguage);
    } else if (enableVoiceTranslation && !transcript) {
        clearTranslation();
    }
    // 手动模式下，effect 不做任何操作，由用户控制翻译
}, [transcript, sourceLanguage, targetLanguage, enableVoiceTranslation, translate, clearTranslation]);
```

### 步骤 2：修复 `clearTranslation` — 重置 `isTranslating`

修改 `useTranslation.ts` 中的 `clearTranslation`，增加 `isTranslating` 的重置：

```tsx
const clearTranslation = useCallback(() => {
    setTranslation('');
    setError(null);
    setIsTranslating(false);
}, []);
```

### 步骤 3：添加翻译请求取消机制

在 `useTranslation.ts` 中添加 `AbortController` 引用，在发起新翻译时取消进行中的翻译，避免竞态条件：

```tsx
const abortRef = useRef<AbortController | null>(null);

const translate = useCallback(async (text, sourceLang, targetLang) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    // ... 使用 abortRef.current.signal 传递给 API
}, []);
```

同时在 `deepseek.ts` 的 API 调用中支持 `AbortSignal`。

### 步骤 4：模式切换时重置翻译状态

在 `App.tsx` 中，当 `enableVoiceTranslation` 变化时，确保翻译状态被正确重置：

```tsx
useEffect(() => {
    if (!enableVoiceTranslation) {
        clearTranslation();
    }
}, [enableVoiceTranslation]);
```

这与步骤 1 的修改配合，确保切换到手动模式时翻译状态被完全重置（包括 `isTranslating`）。

## 修改文件清单

| 文件 | 修改内容 |
|------|----------|
| `src/hooks/useTranslation.ts` | 1. `clearTranslation` 增加 `setIsTranslating(false)`<br>2. 添加 `AbortController` 引用<br>3. `translate` 和 `autoTranslate` 支持取消机制 |
| `src/services/deepseek.ts` | API 调用支持 `AbortSignal` 参数 |
| `src/App.tsx` | 1. 修改 `useEffect` 条件逻辑<br>2. 添加模式切换时的状态重置 |

## 验证方式

1. 手动模式下连续点击翻译按钮两次，确认第二次翻译正常工作
2. 语音模式下连续录音两次，确认翻译正常工作
3. 从语音模式切换到手动模式，确认翻译按钮可用
4. 翻译进行中切换模式，确认状态正确重置
5. 翻译进行中再次点击翻译，确认前一次翻译被取消
