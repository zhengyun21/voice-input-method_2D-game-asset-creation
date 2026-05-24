# PIXEL FORGE - 2D Game Asset Creation

一个强大的 2D 游戏素材生成工具，通过文本输入高效生成高质量游戏素材。

## ✨ 功能特性

- **多种素材类型** - 支持角色、场景、道具、UI 界面等多种素材类型
- **丰富的视觉风格** - 提供卡通、像素、写实、手绘、赛博朋克等多种风格
- **灵活的尺寸配置** - 支持自定义输出尺寸，适配各种游戏分辨率
- **多种输出格式** - 支持 PNG、JPG、WebP 等常用图片格式
- **智能提示词润色** - 基于 DeepSeek 大语言模型优化提示词质量
- **高质量图像生成** - 集成智谱 CogView 3 模型生成精美图像
- **生成历史记录** - 自动保存最近 20 条生成记录，方便回溯和管理
- **一键下载导出** - 支持快速下载生成的素材文件

## 🛠️ 技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| 框架 | React | ^18.2.0 |
| 语言 | TypeScript | ^5.3.0 |
| 构建工具 | Vite | ^5.0.0 |
| 样式 | Tailwind CSS | ^3.4.0 |
| 图标 | Lucide React | ^0.290.0 |
| HTTP 客户端 | Axios | ^1.6.0 |

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
# 进入项目目录
cd src/2d-game-asset-creation

# 安装依赖
npm install
```

### 配置环境变量

1. 复制 `.env` 文件并填入您的 API Key：

```bash
# .env 文件内容
VITE_ZHIPU_API_KEY=your_zhipu_api_key_here
VITE_ZHIPU_MODEL=cogview-3-flash

VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
VITE_DEEPSEEK_MODEL=deepseek-v4-flash
```

2. 获取 API Key：
   - **智谱 API Key**: 前往 [智谱开放平台](https://open.bigmodel.cn/) 注册获取
   - **DeepSeek API Key**: 前往 [DeepSeek 开放平台](https://platform.deepseek.com/) 注册获取

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

### 基本流程

1. **选择素材类型** - 在左侧面板选择要生成的素材类型（角色、场景、道具、UI）
2. **选择视觉风格** - 选择适合的艺术风格
3. **选择配色方案** - 选择颜色主题
4. **设置尺寸** - 输入自定义宽度和高度
5. **设置细节级别** - 选择低/中/高细节
6. **选择输出格式** - 选择 PNG/JPG/WebP
7. **输入描述** - 在描述框中详细描述您想要的素材
8. **点击生成** - 等待生成完成即可预览和下载

### 示例提示词

```
# 角色
一个可爱的像素风格小狐狸角色，橙色毛发，大眼睛，穿着蓝色斗篷，站在草地上

# 场景
一个像素风格的森林场景，有树木、花朵、小溪，阳光透过树叶，宁静的氛围

# 道具
一把像素风格的魔法剑，剑身闪耀着蓝色光芒，剑柄镶嵌着宝石

# UI
一个像素风格的游戏按钮，金色边框，红色背景，上面有"开始游戏"字样
```

## 📁 项目结构

```
src/
├── components/          # React 组件
│   ├── AssetTypeSelector.tsx    # 素材类型选择器
│   ├── StyleSelector.tsx        # 风格选择器
│   ├── FormatSelector.tsx       # 格式选择器
│   ├── ColorSchemeSelector.tsx  # 配色方案选择器
│   ├── SizeSelector.tsx         # 尺寸选择器
│   ├── DetailSelector.tsx       # 细节级别选择器
│   ├── DescriptionInput.tsx     # 描述输入框
│   ├── PreviewPanel.tsx         # 预览面板
│   ├── HistoryPanel.tsx         # 历史记录面板
│   ├── GenerateButton.tsx       # 生成按钮
│   └── GenerationProcessPanel.tsx # 生成过程面板
├── services/            # 服务层
│   ├── imageGenerator.ts        # 图像生成服务
│   ├── exportService.ts         # 导出服务
│   └── promptPolisher.ts        # 提示词润色服务
├── types/               # TypeScript 类型定义
│   └── index.ts
├── utils/               # 工具函数
│   └── helpers.ts
├── App.tsx              # 主应用组件
├── main.tsx             # 应用入口
└── index.css            # 全局样式
```

## 🔧 开发指南

### 添加新的素材类型

1. 在 `src/types/index.ts` 中添加新类型
2. 在 `src/components/AssetTypeSelector.tsx` 中添加选项
3. 在 `src/services/promptPolisher.ts` 中添加对应的提示词模板

### 添加新的视觉风格

1. 在 `src/types/index.ts` 中添加新风格
2. 在 `src/components/StyleSelector.tsx` 中添加选项

### 自定义配色方案

编辑 `src/components/ColorSchemeSelector.tsx` 添加新的配色方案。

## 🌐 API 服务说明

### 智谱 CogView 3

用于图像生成，支持多种风格和尺寸，生成质量高。

### DeepSeek

用于提示词润色，优化用户输入的描述，提高生成效果。

## 📝 License

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题或建议，欢迎提交 Issue。
