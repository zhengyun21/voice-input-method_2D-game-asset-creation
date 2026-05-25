# UI 重设计计划：侧边栏导航 + 文档/图片翻译功能

## 现有项目分析

**技术栈：** React 18 + TypeScript + Vite + Tailwind CSS
**设计风格：** 深色主题（#09090b 背景），琥珀色强调色（#f59e0b），DM Sans + Bricolage Grotesque 字体
**当前布局：** 单列居中（max-w-3xl），header + main + footer，所有功能在同一页面

**现有组件：**

* `VoiceRecorder` — 语音录制按钮

* `TranscriptDisplay` — 语音识别结果展示

* `ManualTextInput` — 手动文本输入

* `LanguageSelector` — 语言选择器

* `TranslationPanel` — 翻译结果面板

**现有 Hooks：**

* `useVoiceRecognition` — 讯飞语音识别

* `useTranslation` — DeepSeek 翻译

***

## 重设计方案

### 整体布局变更

从单列居中布局 → **左侧边栏 + 右侧内容区** 的双栏布局

```
┌──────────────────────────────────────────────┐
│  ┌─────────┐  ┌────────────────────────────┐ │
│  │ Sidebar │  │      Content Area          │ │
│  │         │  │                            │ │
│  │ 🎙 语音 │  │  (当前选中功能的界面)       │ │
│  │ ✏ 手动 │  │                            │ │
│  │ 📄 文档 │  │                            │ │
│  │ 🖼 图片 │  │                            │ │
│  │         │  │                            │ │
│  │ ─────── │  │                            │ │
│  │ 设置    │  │                            │ │
│  └─────────┘  └────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

### 侧边栏设计

* 宽度：64px（图标模式）/ 220px（展开模式），默认图标模式

* 顶部：应用 Logo + 名称

* 导航项：

  1. **语音翻译** — 麦克风图标，对应现有语音功能
  2. **手动翻译** — 编辑图标，对应现有手动输入功能
  3. **文档翻译** — 文档图标，新增功能
  4. **图片翻译** — 图片图标，新增功能（OCR）

* 底部：设置入口（预留）

* 当前选中项：左侧琥珀色竖条 + 背景高亮

* 悬停效果：背景微亮

### 各功能页面设计

#### 1. 语音翻译页面（复用现有组件）

* VoiceRecorder 居中

* 语言选择器

* 识别结果 + 翻译结果 双栏布局

#### 2. 手动翻译页面（复用现有组件）

* 左侧：文本输入区

* 右侧：翻译结果区

* 顶部：语言选择器

#### 3. 文档翻译页面（新增）

* 拖拽上传区域（支持 .txt/.docx/.pdf/.pptx）

* 文件信息展示（文件名、大小、页数）

* 提取的文本预览（可折叠）

* 翻译结果展示

* 语言选择器

#### 4. 图片翻译页面（新增）

* 拖拽/点击上传图片区域

* 图片预览（带 OCR 识别区域标注）

* 识别文本展示

* 翻译结果展示

* 语言选择器

***

## 实施步骤

### 第一阶段：路由与布局重构

1. **添加路由依赖** — 安装 `react-router-dom`
2. **创建 Sidebar 组件** — `src/components/Sidebar.tsx`

   * 导航项列表，图标 + 文字

   * 选中状态管理

   * 折叠/展开功能
3. **创建 AppLayout 组件** — `src/components/AppLayout.tsx`

   * 左侧 Sidebar + 右侧内容区

   * 响应式布局
4. **重构 App.tsx** — 从单页面改为路由容器

   * 使用 react-router-dom 配置路由

   * `/voice` → 语音翻译

   * `/manual` → 手动翻译

   * `/document` → 文档翻译

   * `/image` → 图片翻译

   * 默认重定向到 `/voice`

### 第二阶段：功能页面拆分

1. **创建 VoiceTranslationPage** — `src/pages/VoiceTranslationPage.tsx`

   * 从 App.tsx 提取语音翻译相关逻辑

   * 复用 VoiceRecorder、TranscriptDisplay、TranslationPanel
2. **创建 ManualTranslationPage** — `src/pages/ManualTranslationPage.tsx`

   * 从 App.tsx 提取手动翻译相关逻辑

   * 复用 ManualTextInput、TranslationPanel
3. **创建 TranslationPageLayout** — `src/components/TranslationPageLayout.tsx`

   * 共用的页面外壳：标题 + 语言选择器 + 内容区

   * 减少重复代码

### 第三阶段：文档翻译功能

1. **添加文档解析依赖** — `mammoth`（docx）、`pdfjs-dist`（pdf）、`pptx2json`（pptx）
2. **创建文档解析服务** — `src/services/documentParser.ts`

   * `parseTxt(file: File): Promise<string>`

   * `parseDocx(file: File): Promise<string>`

   * `parsePdf(file: File): Promise<string>`

   * `parsePptx(file: File): Promise<string>`

   * 统一入口 `parseDocument(file: File): Promise<string>`
3. **创建 FileUploader 组件** — `src/components/FileUploader.tsx`

   * 拖拽上传区域

   * 文件类型校验

   * 上传进度/状态
4. **创建 DocumentTranslationPage** — `src/pages/DocumentTranslationPage.tsx`

   * 文件上传 → 文本提取 → 翻译 → 结果展示

### 第四阶段：图片 OCR 翻译功能

1. **添加 OCR 依赖** — 使用 DeepSeek Vision API（项目已有 DeepSeek 集成，无需额外依赖）
2. **创建 OCR 服务** — `src/services/ocrService.ts`

   * 调用 DeepSeek Vision API 识别图片中的文字

   * `recognizeText(imageBase64: string): Promise<string>`
3. **创建 ImageUploader 组件** — `src/components/ImageUploader.tsx`

   * 拖拽/点击上传

   * 图片预览
4. **创建 ImageTranslationPage** — `src/pages/ImageTranslationPage.tsx`

   * 图片上传 → OCR 识别 → 翻译 → 结果展示

### 第五阶段：样式与交互优化

1. **更新 Tailwind 配置** — 添加侧边栏相关的设计 token
2. **更新全局样式** — `index.css` 适配新布局
3. **添加页面切换动画** — fade-in-up 过渡效果
4. **响应式适配** — 移动端侧边栏折叠为底部导航

***

## 新增文件清单

```
src/
├── components/
│   ├── Sidebar.tsx              # 侧边栏导航
│   ├── AppLayout.tsx            # 应用布局容器
│   ├── TranslationPageLayout.tsx # 翻译页面共用布局
│   ├── FileUploader.tsx         # 文件上传组件
│   └── ImageUploader.tsx        # 图片上传组件
├── pages/
│   ├── VoiceTranslationPage.tsx # 语音翻译页面
│   ├── ManualTranslationPage.tsx# 手动翻译页面
│   ├── DocumentTranslationPage.tsx # 文档翻译页面
│   └── ImageTranslationPage.tsx # 图片翻译页面
├── services/
│   ├── documentParser.ts        # 文档解析服务
│   └── ocrService.ts            # OCR 识别服务
```

## 修改文件清单

```
src/App.tsx                      # 重构为路由容器
src/index.css                    # 适配新布局样式
tailwind.config.js               # 添加新设计 token
package.json                     # 添加新依赖
.env.example                     # 添加 OCR 相关环境变量说明
```

## 新增依赖

| 包名                 | 用途         |
| ------------------ | ---------- |
| `react-router-dom` | 客户端路由      |
| `mammoth`          | .docx 文件解析 |
| `pdfjs-dist`       | .pdf 文件解析  |
| `pptx2json`        | .pptx 文件解析 |

> OCR 功能使用现有 DeepSeek Vision API，无需额外依赖。

## 设计风格延续

* 保持深色主题：`#09090b` 背景、`#1a1a1f` 卡片、`#f59e0b` 强调色

* 保持字体：Bricolage Grotesque（标题）+ DM Sans（正文）

* 保持组件风格：`dark-card`、`dark-input` 类名复用

* 保持动画：`fade-in-up`、`pulse-ring`、`wave-bar`、`dot-pulse`

* 侧边栏新增 `border-r border-surface-border-subtle` 分隔线

