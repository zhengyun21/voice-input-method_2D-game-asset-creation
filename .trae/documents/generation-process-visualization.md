# 生成过程可视化面板计划

## 需求

在用户输入框下方添加一个「生成过程」面板，实时展示从点击生成到图片返回的完整流程：

1. **用户输入提示词** — 显示用户在描述框中输入的原始文本
2. **拼接后提示词** — 显示 `generatePrompt()` 将用户输入 + 参数组合后的原始提示词
3. **DeepSeek 润色后提示词** — 显示 DeepSeek 返回的润色英文提示词
4. **智谱生图** — 显示正在调用智谱 API 生成图片的状态

每个步骤有三种状态：等待(pending)、进行中(active)、完成(done)。

---

## 实施步骤

### Step 1: 定义生成过程状态类型

**文件：** `src/types/index.ts`

新增 `GenerationStep` 和 `GenerationProcess` 类型：

```ts
export type GenerationStepStatus = 'pending' | 'active' | 'done' | 'error';

export interface GenerationStep {
  label: string;
  content: string;
  status: GenerationStepStatus;
}

export interface GenerationProcess {
  steps: GenerationStep[];
  isActive: boolean;
}
```

4 个步骤固定顺序：
1. `用户输入` — content = description
2. `拼接提示词` — content = generatePrompt() 结果
3. `DeepSeek 润色` — content = polishPrompt() 结果
4. `智谱生图` — content = 图片 URL 或状态信息

### Step 2: 创建 GenerationProcessPanel 组件

**文件：** `src/components/GenerationProcessPanel.tsx`（新建）

设计风格：与现有暗色主题一致，垂直步骤条 + 每步展开显示内容。

视觉设计：
- 左侧竖线连接各步骤（类似 timeline/stepper）
- 每步有圆形状态指示器：
  - pending: 灰色空心圆
  - active: amber 色脉冲动画圆
  - done: emerald 色实心圆 + 勾号
  - error: rose 色实心圆 + 叉号
- 步骤标签 + 状态文字
- 展开区域显示该步骤的内容（提示词文本），用等宽字体
- active 步骤的内容区显示加载动画
- done 步骤的内容区显示实际文本
- 面板仅在生成过程激活时显示（`isActive` 为 true），生成完成后自动折叠或保持展示最终结果

### Step 3: 修改 imageGenerator.ts — 暴露中间步骤

**文件：** `src/services/imageGenerator.ts`

将 `generateImage()` 改为接受一个回调函数 `onStepUpdate`，在每个步骤完成时通知调用方：

```ts
export type StepUpdateCallback = (steps: GenerationStep[]) => void;

export async function generateImage(
  config: AssetConfig,
  onStepUpdate?: StepUpdateCallback
): Promise<GeneratedAsset>
```

流程中逐步更新：
1. 设置步骤1(用户输入)为 done，步骤2(拼接提示词)为 active → 回调
2. 调用 `generatePrompt()` → 设置步骤2为 done，步骤3(DeepSeek润色)为 active → 回调
3. 调用 `polishPrompt()` → 设置步骤3为 done，步骤4(智谱生图)为 active → 回调
4. 调用智谱 API → 设置步骤4为 done → 回调

如果 DeepSeek 失败降级，步骤3标记为 error 并注明"降级使用原始提示词"。

### Step 4: 修改 App.tsx — 集成生成过程面板

**文件：** `src/App.tsx`

- 新增 `generationProcess` state（类型 `GenerationProcess`）
- 在 `handleGenerate` 中初始化步骤状态，将 `onStepUpdate` 回调传给 `generateImage()`
- 在中间区域布局中，在 `DescriptionInput` 下方添加 `GenerationProcessPanel`
- 生成完成后保持展示最终结果，下次点击生成时重置

### Step 5: 验证构建

运行 `npm run build` 确认无编译错误。

---

## 文件变更清单

| 文件 | 操作 |
|------|------|
| `src/types/index.ts` | 修改 — 添加 GenerationStep / GenerationProcess 类型 |
| `src/components/GenerationProcessPanel.tsx` | 新建 — 生成过程可视化面板组件 |
| `src/services/imageGenerator.ts` | 修改 — 添加 onStepUpdate 回调，逐步通知进度 |
| `src/App.tsx` | 修改 — 集成 generationProcess 状态和面板组件 |

---

## 设计要点

- 面板位置：DescriptionInput 下方，与现有布局无缝衔接
- 视觉风格：暗色 stepper/timeline，amber 强调当前步骤，emerald 标记完成
- 每步内容可展开查看具体提示词文本
- 生成完成后面板保持展示（用户可查看完整流程），下次生成时重置
- 不生成时面板不显示（保持界面简洁）
