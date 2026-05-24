# 语音输入法前端设计优化方案

## 问题诊断

当前设计存在以下典型的"AI生成感"问题：

| 问题 | 具体表现 |
|------|---------|
| 蓝紫渐变背景 | `bg-gradient-to-br from-blue-50 via-white to-purple-50` — AI设计的头号标志 |
| 通用系统字体 | `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto` — 毫无个性 |
| 千篇一律的白色卡片 | `bg-white border border-gray-200 rounded-lg shadow-sm` — 最模板化的模式 |
| 编号步骤圆圈 | `bg-blue-100 text-blue-600 rounded-full` — 典型AI教程风格 |
| 默认Tailwind配色 | 无自定义主题、无设计令牌、无品牌感 |
| 零动效 | 页面完全静态，录音状态仅靠 `animate-pulse` |
| 琥珀色警告框 | 标准模板组件 |
| 无视觉层次 | 所有元素权重相同，没有焦点 |

## 设计方向：Sound Studio

**视觉论点**：深色、精致、音频工程灵感 — 像专业音频工具（Logic Pro / Ableton）或高端通讯应用（Discord Dark / Telegram）那样的暗色工作空间。

### 色彩系统

```
背景:     #09090b (近黑)
表面:     #131316
卡片:     #1a1a1f
边框:     #27272a
文字主:   #fafafa
文字次:   #71717a
强调色:   #f59e0b (琥珀金 — 呼应音频VU表、温暖、声音)
强调悬停: #fbbf24
```

### 字体

- **标题**: Bricolage Grotesque (Google Fonts) — 独特、温暖、编辑感
- **正文**: DM Sans (Google Fonts) — 干净、几何、精致

### 布局变化

- 移除编号步骤列表，改为极简提示文字
- 移除琥珀色警告框，改为内联提示
- 录音按钮增加声波动画
- 翻译/识别面板采用深色卡片，减少边框装饰
- 整体布局更紧凑，突出核心交互

## 实施步骤

### Step 1: 基础设施更新
- **index.html**: 添加 Google Fonts 引入 (Bricolage Grotesque + DM Sans)
- **tailwind.config.js**: 添加自定义色彩系统、字体配置、动画关键帧
- **index.css**: 重写为暗色主题基础样式，添加 CSS 变量和自定义动画

### Step 2: App.tsx 重构
- 深色背景替换蓝紫渐变
- Header 改为暗色半透明毛玻璃
- 移除编号步骤列表，改为极简提示
- 移除琥珀色警告框
- Footer 简化
- 整体布局调整

### Step 3: VoiceRecorder.tsx 重设计
- 暗色录音按钮，琥珀金强调色
- 录音状态增加声波脉冲动画（CSS keyframes）
- 计时器样式优化
- 状态文字优化

### Step 4: TranscriptDisplay.tsx 重设计
- 深色卡片样式
- 优化编辑态样式
- 空状态重设计
- 错误状态适配暗色主题

### Step 5: TranslationPanel.tsx 重设计
- 深色卡片匹配 TranscriptDisplay
- 加载动画优化（脉冲点替代旋转圈）
- 空状态重设计

### Step 6: LanguageSelector.tsx 重设计
- 暗色 select 样式
- 交换按钮优化
- 标签样式调整

### Step 7: 验证
- 运行 `npm run build` 确认无编译错误
- 本地预览确认视觉效果
