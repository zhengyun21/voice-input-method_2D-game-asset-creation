# Plan: 提交代码变更到远程并更新 README 文档

## 代码变更分析

### 新增功能模块

根据 `git status` 和文件分析，项目新增了以下功能：

#### 1. 页面路由系统
- `src/voice-input-method/src/pages/VoiceTranslationPage.tsx` - 语音翻译页面
- `src/voice-input-method/src/pages/ManualTranslationPage.tsx` - 手动翻译页面  
- `src/voice-input-method/src/pages/DocumentTranslationPage.tsx` - 文档翻译页面
- `src/voice-input-method/src/pages/ImageTranslationPage.tsx` - 图片翻译页面（OCR）

#### 2. 布局组件
- `src/voice-input-method/src/components/AppLayout.tsx` - 应用主布局，集成路由 Outlet
- `src/voice-input-method/src/components/Sidebar.tsx` - 侧边导航栏，支持展开/收起动画
- `src/voice-input-method/src/components/SettingsPopover.tsx` - 设置弹窗组件
- `src/voice-input-method/src/components/TranslationPageLayout.tsx` - 翻译页面通用布局

#### 3. 上传组件
- `src/voice-input-method/src/components/FileUploader.tsx` - 文件上传组件（文档翻译）
- `src/voice-input-method/src/components/ImageUploader.tsx` - 图片上传组件（OCR）

#### 4. Hooks
- `src/voice-input-method/src/hooks/useTheme.ts` - 主题切换 Hook（支持明暗主题）

#### 5. 服务层
- `src/voice-input-method/src/services/documentParser.ts` - 文档解析服务
- `src/voice-input-method/src/services/ocrService.ts` - OCR 图片文字识别服务

### 修改的文件
- `src/voice-input-method/.env.example` - 添加新的环境变量配置
- `src/voice-input-method/package.json` - 添加新依赖（react-router-dom、lucide-react 等）
- `src/voice-input-method/src/App.tsx` - 重构为路由模式
- `src/voice-input-method/src/index.css` - 添加主题样式
- `src/voice-input-method/tailwind.config.js` - 更新主题配置

---

## 执行计划

### 步骤 1: 更新 README 文档

更新 `src/voice-input-method/README.md`，添加以下内容：
- 新增功能特性说明（文档翻译、图片翻译、主题切换）
- 更新项目结构（添加 pages 目录）
- 更新技术栈（添加 react-router-dom）

### 步骤 2: 提交代码到远程

```bash
git add .
git commit -m "详细的 commit message"
git push origin master
```

### Commit Message 内容

```
feat: 新增文档翻译和图片翻译功能，重构 UI 布局

一、新增功能

1. 页面路由系统：
   - 语音翻译页面 (VoiceTranslationPage) - 语音转文字 + 翻译
   - 手动翻译页面 (ManualTranslationPage) - 文本输入翻译
   - 文档翻译页面 (DocumentTranslationPage) - 支持上传文档解析翻译
   - 图片翻译页面 (ImageTranslationPage) - OCR 图片文字识别翻译

2. 布局组件：
   - AppLayout - 应用主布局，集成 React Router Outlet
   - Sidebar - 侧边导航栏，支持鼠标悬停展开/收起动画
   - SettingsPopover - 设置弹窗组件
   - TranslationPageLayout - 翻译页面通用布局

3. 上传组件：
   - FileUploader - 文档文件上传组件
   - ImageUploader - 图片上传组件

4. Hooks：
   - useTheme - 主题切换 Hook，支持明暗主题切换

5. 服务层：
   - documentParser - 文档解析服务
   - ocrService - OCR 图片文字识别服务

二、修改内容

1. 依赖更新：
   - 添加 react-router-dom 路由库
   - 添加 lucide-react 图标库

2. 配置更新：
   - .env.example 添加 OCR API 配置
   - tailwind.config.js 更新主题配色
   - index.css 添加主题切换样式

3. 重构：
   - App.tsx 重构为路由模式

三、UI 改进

- 新增侧边导航栏，支持四个翻译功能入口
- 添加主题切换按钮（明暗主题）
- 响应式布局优化
- 动画过渡效果增强
```

---

## 验证

1. 确认 README 文档更新完整
2. 确认 `git status` 显示所有变更已添加
3. 确认 `git push` 成功