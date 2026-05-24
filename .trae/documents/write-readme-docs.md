# Plan: 编写 README 文档并提交到 GitHub

## 目标

1. 为 `voice-input-method` 子项目编写详细的 README.md
2. 为整个仓库编写顶层 README.md
3. 清除 `.env` 中的真实密钥，创建 `.env.example` 模板
4. 补全 `.gitignore`，确保密钥文件不会被提交
5. 将所有文件提交到 GitHub，附带详细的 commit message

---

## 步骤 1: 清除敏感信息 & 补全 .gitignore

### 1.1 创建 `src/voice-input-method/.env.example`

将现有 `.env` 中的真实密钥替换为占位符，生成 `.env.example` 模板文件：

```
# 科大讯飞 API 配置（必填）
# 1. 注册并登录：https://console.xfyun.cn/
# 2. 创建应用 → 选择「语音听写」服务
# 3. 在控制台获取以下三个值
VITE_XFYUN_APP_ID=your_xfyun_app_id
VITE_XFYUN_API_KEY=your_xfyun_api_key
VITE_XFYUN_API_SECRET=your_xfyun_api_secret

# DeepSeek API 配置（翻译功能使用）
# 获取地址：https://platform.deepseek.com/api_keys
VITE_DEEPSEEK_API_URL=https://api.deepseek.com/v1
VITE_DEEPSEEK_MODEL=deepseek-v4-flash
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key
```

### 1.2 创建 `src/2D-game-asset-creation/.env.example`

现有 `2D-game-asset-creation/.env` 已经是占位符，直接复制为 `.env.example` 即可。

### 1.3 清除 `.env` 中的真实密钥

- `src/voice-input-method/.env`：将真实密钥替换为占位符（与 `.env.example` 一致），保留文件方便本地开发
- `src/2D-game-asset-creation/.env`：已经是占位符，无需修改

### 1.4 为 `src/2D-game-asset-creation/` 创建 `.gitignore`

该目录目前没有 `.gitignore`，需要创建：

```
node_modules/
dist/
.env
.env.local
.env.production
.DS_Store
```

### 1.5 创建根目录 `.gitignore`

仓库根目录没有 `.gitignore`，需要创建：

```
node_modules/
dist/
.env
.env.local
.env.production
.DS_Store
```

---

## 步骤 2: 编写 `src/voice-input-method/README.md`

参考已有的 `src/2D-game-asset-creation/README.md` 的风格和结构，为语音输入法子项目编写 README。

### 内容大纲

- **标题**: 语音输入法 - Voice Input Method
- **项目简介**: 基于讯飞语音识别 (ASR) 和 DeepSeek 大模型翻译的语音输入工具
- **功能特性**:
  - 语音识别（讯飞 iAT 实时流式识别，中英文支持）
  - 实时翻译（DeepSeek 大模型驱动，中英互译）
  - 手动文本输入模式（关闭语音翻译后可手动输入文本进行翻译）
  - 双语支持（中文/English）
  - 暗色主题现代 UI（Tailwind CSS 自定义主题，动画效果）
  - 语音翻译开关（可切换纯翻译模式）
  - 识别结果可点击编辑

- **技术栈**:
  | 分类 | 技术 | 版本 |
  |------|------|------|
  | 框架 | React | ^18.2.0 |
  | 语言 | TypeScript | ^5.3.0 |
  | 构建工具 | Vite | ^5.4.0 |
  | 样式 | Tailwind CSS | ^3.4.0 |
  | HTTP 客户端 | Axios | ^1.6.0 |
  | 加密 | crypto-js | ^4.2.0 |

- **快速开始**:
  - 环境要求: Node.js >= 18.0.0, npm >= 9.0.0
  - 安装: `cd src/voice-input-method && npm install`
  - 环境变量配置说明（参考 `.env.example`）
  - 获取 API Key: 讯飞开放平台 + DeepSeek 开放平台
  - 开发运行: `npm run dev`
  - 构建: `npm run build`

- **使用说明**:
  - 语音翻译模式: 点击麦克风 → 开始录音 → 再次点击停止 → 自动识别并翻译
  - 手动翻译模式: 关闭"启用语音翻译" → 输入文本 → 点击翻译或 Ctrl+Enter
  - 语言切换: 源语言/目标语言下拉选择，支持中英互换按钮

- **项目结构**: 列出目录树（components, hooks, services, types, utils）

- **API 服务说明**:
  - 讯飞语音识别 (iAT v2 WebSocket API): 实时流式语音转文字
  - DeepSeek API: Chat Completions 用于翻译

---

## 步骤 3: 编写顶层 `README.md`

仓库根目录 `d:\Maven\voice-input-method_2D-game-asset-creation\README.md`

### 内容大纲

- **标题**: Voice Input Method & 2D Game Asset Creation
- **简介**: 双项目仓库，包含语音输入法和 2D 游戏素材生成工具
- **项目列表**:
  - voice-input-method: 语音输入法，讯飞 ASR + DeepSeek 翻译
  - 2D-game-asset-creation (PIXEL FORGE): 2D 游戏素材生成，DeepSeek 提示词润色 + 智谱 CogView 图像生成
- **项目结构**: 仓库目录树概览
- **快速开始**: 简要说明各自独立安装运行
- **技术栈对比表**

---

## 步骤 4: Git 提交并推送

### 4.1 检查暂存区，确认 `.env` 不会被提交

执行 `git status` 确认 `.env` 文件被 `.gitignore` 排除。

### 4.2 添加文件并提交

```bash
git add .
git commit -m "详细 commit message"
```

### 4.3 Commit Message

按用户要求的三个部分组织：

```
feat: 初始化项目仓库，添加 README 文档和环境配置模板

一、项目功能概述

1. voice-input-method（语音输入法）：
   - 功能：基于讯飞语音识别 (iAT) 实现实时流式语音转文字，集成 DeepSeek 大模型
     进行中英互译，支持语音翻译和手动文本翻译两种模式，识别结果可点击编辑
   - UI 设计：暗色主题现代风格，自定义 Tailwind CSS 色彩系统（琥珀色 accent），
     录音按钮带脉冲动画和波形可视化，卡片式布局，Bricolage Grotesque + DM Sans 字体

2. 2D-game-asset-creation（PIXEL FORGE - 2D 游戏素材生成）：
   - 功能：通过文本描述生成 2D 游戏素材，支持角色/场景/道具/UI 四种素材类型，
     提供卡通/像素/写实/手绘/赛博朋克等视觉风格，集成 DeepSeek 提示词润色和
     智谱 CogView 3 图像生成，支持生成历史记录和一键下载导出
   - UI 设计：暗色主题，左侧配置面板 + 右侧预览区布局，卡片式组件，
     生成过程可视化动画

二、README 文档与安全配置

1. voice-input-method README：
   - 编写 src/voice-input-method/README.md，包含项目简介、功能特性、技术栈、
     快速开始、环境变量配置、使用说明、项目结构和 API 服务说明

2. 2D-game-asset-creation README（已有）：
   - 已包含项目简介、功能特性、技术栈、快速开始、环境变量配置、使用说明、
     项目结构、开发指南和 API 服务说明

3. 仓库顶层 README：
   - 编写根目录 README.md，概述双项目仓库结构、项目列表与简介、
     仓库目录结构、快速开始指引和技术栈对比表

4. 安全配置：
   - 创建 src/voice-input-method/.env.example，提供环境变量配置模板（占位符）
   - 创建 src/2D-game-asset-creation/.env.example，提供环境变量配置模板
   - 清除 src/voice-input-method/.env 中的真实 API 密钥，替换为占位符
   - 创建 src/2D-game-asset-creation/.gitignore，排除 node_modules/dist/.env 等
   - 创建根目录 .gitignore，统一排除敏感文件和构建产物
   - 确保 .env 文件不会被提交到版本控制

三、项目执行步骤

1. 安全配置：创建 .gitignore 文件 → 创建 .env.example 模板 → 清除 .env 真实密钥
2. 文档编写：编写 voice-input-method/README.md → 编写根目录 README.md
3. 版本控制：git add 添加文件 → git status 确认 .env 已排除 → git commit 提交
4. 远程推送：检查远程仓库配置 → git push 推送到 GitHub
```

### 4.4 推送到远程

检查远程仓库配置，若已配置则 `git push`。

---

## 验证

- 确认 `.env` 文件不在 `git status` 的暂存列表中
- 确认 `.env.example` 文件内容使用占位符，无真实密钥
- 确认两个 README.md 文件内容完整、格式正确
- 确认 `git commit` 成功
- 确认 `git push` 成功（如有远程仓库）
