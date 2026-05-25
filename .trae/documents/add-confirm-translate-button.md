# 文档翻译和图片翻译添加确认按钮计划

## 需求分析

当前问题：
1. 文档翻译和图片翻译功能在解析/识别完成后会自动触发翻译
2. 用户希望自己控制何时进行翻译，而不是自动翻译

期望行为：
1. 文件解析/OCR识别完成后，显示"确认翻译"按钮
2. 用户点击按钮后才触发翻译
3. 翻译完成后可以重新选择目标语言并再次翻译

## 修改文件

### 1. `src/pages/DocumentTranslationPage.tsx`
- 移除 `autoTranslate` 调用
- 添加 `confirmTranslate` 状态/逻辑
- 添加"确认翻译"按钮

### 2. `src/pages/ImageTranslationPage.tsx`
- 移除 `autoTranslate` 调用
- 添加 `confirmTranslate` 状态/逻辑
- 添加"确认翻译"按钮

## 实现步骤

1. 修改 DocumentTranslationPage：
   - 文件解析完成后，显示"确认翻译"按钮
   - 用户点击按钮后才调用 `autoTranslate`
   - 目标语言改变时，如果已有识别文本，更新翻译按钮状态

2. 修改 ImageTranslationPage：
   - OCR识别完成后，显示"确认翻译"按钮
   - 用户点击按钮后才调用 `autoTranslate`
   - 目标语言改变时，如果已有识别文本，更新翻译按钮状态

## 关键逻辑

```typescript
// DocumentTranslationPage
const handleConfirmTranslate = useCallback(() => {
  if (extractedText.trim()) {
    autoTranslate(extractedText, targetLanguage);
  }
}, [extractedText, targetLanguage, autoTranslate]);

// ImageTranslationPage  
const handleConfirmTranslate = useCallback(() => {
  if (recognizedText.trim() && recognizedText.trim() !== "未检测到文字") {
    autoTranslate(recognizedText, targetLanguage);
  }
}, [recognizedText, targetLanguage, autoTranslate]);
```

## UI 设计

在识别结果下方添加按钮：
```tsx
<button
  onClick={handleConfirmTranslate}
  disabled={isTranslating || !extractedText.trim()}
  className="w-full py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isTranslating ? '翻译中...' : '确认翻译'}
</button>
```
