# Voice Input Method & 2D Game Asset Creation

双项目仓库，包含语音输入法和 2D 游戏素材生成工具，均基于 React + TypeScript + Vite + Tailwind CSS 构建。

## 📦 项目列表

### 🎤 voice-input-method（语音输入法）

基于讯飞语音识别 (iAT) 和 DeepSeek 大模型的语音输入翻译工具。

- 实时流式语音识别（WebSocket）
- 中英双向智能翻译
- 语音翻译 / 手动翻译双模式
- 识别结果可编辑
- 暗色主题现代 UI

👉 [查看详细文档](src/voice-input-method/README.md)

### 🎮 2D-game-asset-creation（PIXEL FORGE）

通过文本描述高效生成 2D 游戏素材的工具。

- 角色 / 场景 / 道具 / UI 四种素材类型
- 卡通 / 像素 / 写实 / 手绘 / 赛博朋克等视觉风格
- DeepSeek 提示词润色 + 智谱 CogView 3 图像生成
- 生成历史记录和一键下载导出

👉 [查看详细文档](src/2D-game-asset-creation/README.md)

## 📁 仓库结构

```
.
├── src/
│   ├── voice-input-method/        # 语音输入法项目
│   │   ├── src/
│   │   │   ├── components/        # React 组件
│   │   │   ├── hooks/             # 自定义 Hooks
│   │   │   ├── services/          # API 服务层
│   │   │   ├── types/             # 类型定义
│   │   │   └── utils/             # 工具函数
│   │   ├── .env.example           # 环境变量模板
│   │   └── README.md              # 项目文档
│   │
│   └── 2D-game-asset-creation/    # 2D 游戏素材生成项目
│       ├── src/
│       │   ├── components/        # React 组件
│       │   ├── services/          # API 服务层
│       │   ├── types/             # 类型定义
│       │   └── utils/             # 工具函数
│       ├── .env.example           # 环境变量模板
│       └── README.md              # 项目文档
│
├── docs/                          # 项目文档
├── .gitignore                     # Git 忽略配置
└── README.md                      # 本文件
```

## 🚀 快速开始

两个子项目独立运行，各自安装依赖和配置环境变量。

### 语音输入法

```bash
cd src/voice-input-method
npm install
cp .env.example .env
# 编辑 .env 填入讯飞和 DeepSeek API Key
npm run dev
```

### 2D 游戏素材生成

```bash
cd src/2D-game-asset-creation
npm install
cp .env.example .env
# 编辑 .env 填入智谱和 DeepSeek API Key
npm run dev
```

## 🛠️ 技术栈对比

| 技术 | voice-input-method | 2D-game-asset-creation |
|------|-------------------|----------------------|
| 框架 | React ^18.2.0 | React ^18.2.0 |
| 语言 | TypeScript ^5.3.0 | TypeScript ^5.3.0 |
| 构建工具 | Vite ^5.4.0 | Vite ^5.0.0 |
| 样式 | Tailwind CSS ^3.4.0 | Tailwind CSS ^3.4.0 |
| HTTP 客户端 | Axios ^1.6.0 | Axios ^1.6.0 |
| 图标 | SVG 内联 | Lucide React ^0.290.0 |
| 加密 | crypto-js ^4.2.0 | - |
| 语音识别 | 讯飞 iAT (WebSocket) | - |
| AI 翻译 | DeepSeek Chat Completions | - |
| 提示词润色 | - | DeepSeek Chat Completions |
| 图像生成 | - | 智谱 CogView 3 |

## 📝 License

MIT License
