# 语音输入法 - Voice Input Method

基于讯飞语音识别 (ASR) 和 DeepSeek 大模型翻译的语音输入工具，支持多种翻译模式和主题切换。

## ✨ 功能特性

- **实时语音识别** - 集成讯飞 iAT 语音听写服务，WebSocket 实时流式识别，支持中文和英文
- **智能翻译** - 基于 DeepSeek 大模型，支持中英双向翻译，语音识别后自动翻译
- **手动文本输入** - 手动输入文本进行翻译，支持 Ctrl + Enter 快捷翻译
- **文档翻译** - 支持上传文档文件进行解析和翻译
- **图片翻译 (OCR)** - 上传图片识别文字并翻译
- **双语支持** - 源语言和目标语言可自由切换，支持一键互换
- **识别结果编辑** - 语音识别结果可点击编辑，修正识别错误后重新翻译
- **主题切换** - 支持明暗主题切换，自动保存用户偏好
- **侧边导航** - 响应式侧边栏，支持鼠标悬停展开/收起动画

## 🛠️ 技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| 框架 | React | ^18.2.0 |
| 语言 | TypeScript | ^5.3.0 |
| 构建工具 | Vite | ^5.4.0 |
| 样式 | Tailwind CSS | ^3.4.0 |
| 路由 | React Router DOM | ^6.20.0 |
| HTTP 客户端 | Axios | ^1.6.0 |
| 加密 | crypto-js | ^4.2.0 |

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
cd src/voice-input-method
npm install
```

### 配置环境变量

1. 复制 `.env.example` 为 `.env` 并填入您的 API Key：

```bash
cp .env.example .env
```

2. `.env` 文件内容：

```bash
# 科大讯飞 API 配置（必填）
VITE_XFYUN_APP_ID=your_xfyun_app_id
VITE_XFYUN_API_KEY=your_xfyun_api_key
VITE_XFYUN_API_SECRET=your_xfyun_api_secret

# DeepSeek API 配置（翻译功能使用）
VITE_DEEPSEEK_API_URL=https://api.deepseek.com/v1
VITE_DEEPSEEK_MODEL=deepseek-v4-flash
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key
```

3. 获取 API Key：
   - **讯飞 API Key**: 前往 [讯飞开放平台](https://console.xfyun.cn/) 注册，创建应用并开通「语音听写」服务
   - **DeepSeek API Key**: 前往 [DeepSeek 开放平台](https://platform.deepseek.com/api_keys) 注册获取

### 开发模式

```bash
npm run dev
```

启动后访问 `http://localhost:5173` 即可使用。

### 生产构建

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览构建结果

```bash
npm run preview
```

## 📖 使用说明

### 语音翻译模式

1. 点击左侧导航栏「语音翻译」
2. 选择源语言和目标语言
3. 点击麦克风按钮开始录音
4. 再次点击停止录音，系统自动识别并翻译
5. 识别结果可点击编辑，修正后自动重新翻译

### 手动翻译模式

1. 点击左侧导航栏「手动翻译」
2. 选择目标语言
3. 在文本输入框中输入要翻译的内容
4. 点击「翻译」按钮或按 Ctrl + Enter 快捷翻译

### 文档翻译模式

1. 点击左侧导航栏「文档翻译」
2. 上传文档文件（支持常见格式）
3. 等待文档解析完成
4. 查看翻译结果

### 图片翻译模式

1. 点击左侧导航栏「图片翻译」
2. 上传图片文件
3. 等待 OCR 识别完成
4. 查看识别结果和翻译

### 主题切换

1. 点击左侧导航栏底部「设置」按钮
2. 在弹出的设置面板中点击主题切换按钮
3. 系统自动保存主题偏好

## 📁 项目结构

```
src/
├── components/                  # React 组件
│   ├── AppLayout.tsx           # 应用主布局（集成路由）
│   ├── Sidebar.tsx             # 侧边导航栏（支持展开/收起）
│   ├── SettingsPopover.tsx     # 设置弹窗组件
│   ├── TranslationPageLayout.tsx # 翻译页面通用布局
│   ├── VoiceRecorder.tsx       # 录音按钮组件（脉冲动画/波形可视化）
│   ├── TranscriptDisplay.tsx   # 识别结果展示组件（支持编辑）
│   ├── TranslationPanel.tsx    # 翻译结果展示组件
│   ├── ManualTextInput.tsx     # 手动文本输入组件
│   ├── LanguageSelector.tsx    # 语言选择器组件（支持互换）
│   ├── FileUploader.tsx        # 文档文件上传组件
│   └── ImageUploader.tsx       # 图片上传组件
├── pages/                      # 页面组件
│   ├── VoiceTranslationPage.tsx    # 语音翻译页面
│   ├── ManualTranslationPage.tsx   # 手动翻译页面
│   ├── DocumentTranslationPage.tsx # 文档翻译页面
│   └── ImageTranslationPage.tsx    # 图片翻译页面（OCR）
├── hooks/                      # React Hooks
│   ├── useVoiceRecognition.ts  # 语音识别 Hook（讯飞 iAT 集成）
│   ├── useTranslation.ts       # 翻译 Hook（DeepSeek 集成）
│   └── useTheme.ts             # 主题切换 Hook
├── services/                   # 服务层
│   ├── xfyunVoice.ts           # 讯飞语音识别服务（WebSocket 实时流式）
│   ├── deepseek.ts             # DeepSeek 翻译服务（Chat Completions API）
│   ├── documentParser.ts       # 文档解析服务
│   └── ocrService.ts           # OCR 图片文字识别服务
├── types/                      # TypeScript 类型定义
│   └── index.ts                # 语言/识别/翻译相关类型
├── utils/                      # 工具函数
│   └── audioUtils.ts           # 音频处理工具（Base64/时长格式化）
├── App.tsx                     # 主应用组件（路由配置）
├── main.tsx                    # 应用入口
└── index.css                   # 全局样式（Tailwind + 自定义组件类）
```

## 🌐 API 服务说明

### 讯飞语音听写 (iAT v2)

通过 WebSocket 协议实现实时流式语音识别，支持中文和英文。使用 HMAC-SHA256 签名鉴权，音频格式为 16kHz 16bit 单声道 PCM，实时发送音频帧并接收识别结果。

### DeepSeek Chat Completions

基于 DeepSeek 大语言模型的翻译服务，通过 Chat Completions API 实现高质量中英互译，temperature 设为 0.3 以保证翻译稳定性和准确性。

## 📝 License

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题或建议，欢迎提交 Issue。
