# 语音输入法项目实现计划

## 1. 需求分析

### 1.1 目标平台

* **平台**: Web 端应用

* **部署位置**: `d:\Maven\voice-input-method_2D-game-asset-creation\src\voice-input-method`

### 1.2 核心功能需求

| 功能     | 描述        | 优先级 |
| ------ | --------- | --- |
| 实时语音识别 | 边说话边转换文字  | 高   |
| 离线音频转写 | 先录制音频再转换  | 高   |
| 多语言支持  | 中文、英文     | 高   |
| 翻译功能   | 语音转写后自动翻译 | 中   |
| 文本编辑   | 支持编辑识别结果  | 高   |
| 快捷键支持  | 方便快捷操作    | 中   |

### 1.3 技术方案

| 组件   | 方案                 | 说明           |
| ---- | ------------------ | ------------ |
| 语音识别 | DeepSeek API       | 通过大模型实现高质量识别 |
| 翻译服务 | DeepSeek API       | 利用大模型的翻译能力   |
| 前端框架 | React + TypeScript | 现代、类型安全      |
| 语音采集 | Web Audio API      | 浏览器原生支持      |
| 样式框架 | TailwindCSS 3      | 快速开发、响应式     |

***

## 2. 项目结构

```
src/voice-input-method/
├── .gitignore              # Git 忽略配置
├── package.json            # 项目依赖配置
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 构建配置
├── tailwind.config.js      # TailwindCSS 配置
├── postcss.config.js       # PostCSS 配置
├── public/                 # 静态资源
│   └── index.html
└── src/
    ├── main.tsx            # 应用入口
    ├── App.tsx             # 主应用组件
    ├── index.css           # 全局样式
    ├── components/         # UI 组件
    │   ├── VoiceRecorder.tsx    # 录音组件
    │   ├── TranscriptDisplay.tsx # 转写结果展示
    │   ├── LanguageSelector.tsx  # 语言选择器
    │   └── TranslationPanel.tsx  # 翻译面板
    ├── hooks/              # 自定义 Hooks
    │   ├── useVoiceRecognition.ts # 语音识别 Hook
    │   └── useTranslation.ts       # 翻译 Hook
    ├── services/           # API 服务
    │   ├── deepseek.ts      # DeepSeek API 封装
    │   └── speechToText.ts  # 语音转文字服务
    ├── types/              # 类型定义
    │   └── index.ts
    └── utils/              # 工具函数
        └── audioUtils.ts    # 音频处理工具
```

***

## 3. 核心功能设计

### 3.1 语音采集模块

**功能**: 使用 Web Audio API 采集麦克风音频

* 支持实时流式传输

* 支持录音后离线转写

* 音频格式转换（PCM → base64）

### 3.2 语音识别模块

**功能**: 调用 DeepSeek API 进行语音识别

* 实时识别模式：流式传输音频片段

* 离线转写模式：上传完整音频文件

* 支持中英文切换

### 3.3 翻译模块

**功能**: 将识别结果翻译为目标语言

* 支持中↔英互译

* 可扩展支持其他语言

* 翻译结果与原文对比展示

### 3.4 UI 组件

| 组件                | 功能             |
| ----------------- | -------------- |
| VoiceRecorder     | 录音按钮、状态显示、录音时长 |
| TranscriptDisplay | 转写文本展示、编辑功能    |
| LanguageSelector  | 源语言和目标语言选择     |
| TranslationPanel  | 翻译结果展示         |

***

## 4. API 集成方案

### 4.1 DeepSeek API 配置

需要用户提供 API Key，存储在环境变量中：

```bash
# .env 文件
VITE_DEEPSEEK_API_KEY=your_api_key_here
VITE_DEEPSEEK_API_URL=https://api.deepseek.com/v1
```

### 4.2 接口调用

**语音转文字** (`POST /v1/audio/transcriptions`)

* 支持流式和非流式模式

* 返回识别文本

**翻译** (`POST /v1/chat/completions`)

* 利用大模型进行翻译

* 支持多语言

***

## 5. 安全性考虑

1. **API Key 保护**: 使用环境变量，不暴露在前端代码中
2. **音频数据传输**: 使用 HTTPS
3. **用户隐私**: 不在本地存储音频数据
4. **输入验证**: 对用户输入进行安全验证

***

## 6. 部署方案

### 6.1 开发环境

```bash
npm install
npm run dev
```

### 6.2 生产构建

```bash
npm run build
```

### 6.3 部署方式

* 可部署到 Vercel、Netlify、GitHub Pages 等平台

* 需要配置环境变量

***

## 7. 实施步骤

| 阶段 | 任务         | 预计时间 |
| -- | ---------- | ---- |
| 1  | 项目初始化与依赖安装 | 1 天  |
| 2  | 核心服务层开发    | 2 天  |
| 3  | UI 组件开发    | 2 天  |
| 4  | 集成测试与调试    | 1 天  |
| 5  | 文档与部署      | 1 天  |

***

## 8. 潜在风险与应对

| 风险       | 应对方案               |
| -------- | ------------------ |
| API 调用费用 | 提供使用量统计，设置调用限制     |
| 网络延迟     | 实现加载状态和重试机制        |
| 浏览器兼容性   | 使用 polyfill，提供降级方案 |
| 识别准确率    | 提供手动编辑功能，支持结果修正    |

***

## 9. 后续扩展计划

1. 添加更多语言支持
2. 支持方言识别
3. 实现语音命令功能
4. 添加快捷键支持
5. 支持导出识别结果

***

## 10. 所需资源

1. DeepSeek API Key（用户提供）
2. 域名和 HTTPS 证书（部署时需要）

