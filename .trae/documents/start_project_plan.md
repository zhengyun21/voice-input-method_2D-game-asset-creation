# 项目启动计划

## 项目概述

本仓库包含两个独立项目：

1. **voice-input-method** - 基于 DeepSeek 大模型的语音输入法
2. **2D-game-asset-creation** - 通过文本输入生成游戏素材的工具

## 启动步骤

### 步骤 1: 安装 voice-input-method 依赖

* 进入目录: `src/voice-input-method`

* 执行: `npm install`

### 步骤 2: 启动 voice-input-method 开发服务器

* 执行: `npm run dev`

* 默认端口: 5173

### 步骤 3: 安装 2D-game-asset-creation 依赖

* 进入目录: `src/2D-game-asset-creation`

* 执行: `npm install`

### 步骤 4: 启动 2D-game-asset-creation 开发服务器

* 执行: `npm run dev`

* 默认端口: 5174 (自动分配)

## 访问地址

| 项目       | 地址                      |
| -------- | ----------------------- |
| 语音输入法    | <http://localhost:5173> |
| 2D游戏素材生成 | <http://localhost:5174> |

## 风险说明

* 需要确保 Node.js 和 npm 已安装

* 两个项目需要使用不同端口，Vite 会自动处理端口冲突

* 首次安装依赖可能需要较长时间

