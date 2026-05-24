# DeepSeek 润色 + 智谱生图 接口集成计划

## 需求概述

用户输入描述 → 结合按钮参数生成原始提示词 → 发送给 DeepSeek 润色为英文提示词 → 将润色后的提示词发送给智谱生图 → 直接展示图片

润色过程对用户透明，用户只看到 loading → 图片结果。

## 当前流程

```
用户输入 → generatePrompt() 拼接原始提示词 → 直接发智谱 API → 返回图片
```

## 目标流程

```
用户输入 → generatePrompt() 拼接原始提示词 → DeepSeek API 润色为英文 → 智谱 API 生图 → 返回图片
```

***

## 实施步骤

### Step 1: 配置 DeepSeek API Key 环境变量

**文件：** `.env`

添加 `VITE_DEEPSEEK_API_KEY` 占位（用户后续填入真实 Key）：

```
VITE_ZHIPU_API_KEY=f7638a0d932046079d9900bda54cdde9.79EtThsVS0IEdssm
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### Step 2: 添加 DeepSeek API 代理

**文件：** `vite.config.ts`

在 `server.proxy` 中添加 DeepSeek 代理规则：

```ts
'/api/deepseek': {
  target: 'https://api.deepseek.com',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api\/deepseek/, ''),
},
```

前端请求 `/api/deepseek/chat/completions` → 代理到 `https://api.deepseek.com/chat/completions`

### Step 3: 创建提示词润色服务

**文件：** `src/services/promptPolisher.ts`（新建）

功能：

* 接收 `generatePrompt()` 生成的原始提示词

* 调用 DeepSeek Chat API（模型 `deepseek-v4-flash`）

* System Prompt 指示 DeepSeek 将原始提示词润色为高质量英文生图提示词

* 返回润色后的英文提示词

核心逻辑：

1. 读取 `VITE_DEEPSEEK_API_KEY`
2. POST `/api/deepseek/chat/completions`，body 包含 system + user 消息
3. System 消息：指导模型作为 2D 游戏素材提示词专家，将输入润色为适合 AI 生图的英文提示词，保留所有参数信息，增强描述细节
4. User 消息：原始提示词
5. 提取 `response.data.choices[0].message.content` 作为润色结果
6. 错误处理：API Key 缺失、网络错误、返回为空等

### Step 4: 修改 imageGenerator.ts — 集成润色流程

**文件：** `src/services/imageGenerator.ts`

修改 `generateImage()` 函数：

1. 先调用 `generatePrompt(config)` 生成原始提示词
2. 调用 `polishPrompt(rawPrompt)` 获取润色后的英文提示词
3. 用润色后的提示词替换原始提示词，发送给智谱 API
4. 其余逻辑不变（size 计算、返回 GeneratedAsset 等）

如果 DeepSeek 润色失败，**降级使用原始提示词**继续生图，不阻塞流程。

### Step 5: 验证构建

运行 `npm run build` 确认无编译错误。

***

## 文件变更清单

| 文件                               | 操作                              |
| -------------------------------- | ------------------------------- |
| `.env`                           | 修改 — 添加 `VITE_DEEPSEEK_API_KEY` |
| `vite.config.ts`                 | 修改 — 添加 DeepSeek API 代理         |
| `src/services/promptPolisher.ts` | 新建 — DeepSeek 提示词润色服务           |
| `src/services/imageGenerator.ts` | 修改 — 集成润色流程                     |

***

## 设计要点

* 润色过程对用户完全透明，UI 无需任何改动

* DeepSeek 润色失败时降级使用原始提示词，确保生图不中断

* 不引入新依赖，使用已有的 axios

* DeepSeek API 兼容 OpenAI Chat Completions 格式

* 润色后的提示词为英文，更适合 AI 生图模型理解

