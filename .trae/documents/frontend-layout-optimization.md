# 前端布局优化计划

## 当前布局分析

**现有结构（App.tsx）：**

* Header（顶部导航栏）

* 左侧栏（w-60）：AssetTypeSelector → StyleSelector → FormatSelector

* 中间区域：ParamsPanel（描述+尺寸+细节+配色）→ GenerateButton → PreviewPanel

* 右侧栏（w-72）：HistoryPanel

**需要调整的核心变化：**

1. ParamsPanel 中的「尺寸、细节、配色」从中间区域移至左侧栏
2. 中间区域重排：预览图片 → 操作按钮组 → 描述输入框
3. 取消预览图片下方的图片参数信息框
4. 右侧历史栏的 👀 按钮改为弹出二级界面展示图片参数

***

## 实施步骤

### Step 1: 拆分 ParamsPanel — 提取尺寸/细节/配色到独立组件

**文件：** `src/components/ParamsPanel.tsx`

将 ParamsPanel 拆分为两个组件：

* `SizeSelector` — 尺寸选择（预设尺寸按钮 + W/H 输入框）

* `DetailSelector` — 细节级别选择

* `ColorSchemeSelector` — 配色方案选择

* `DescriptionInput` — 描述输入框（保留在中间区域）

**操作：**

* 创建 `src/components/SizeSelector.tsx`：从 ParamsPanel 提取尺寸部分

* 创建 `src/components/DetailSelector.tsx`：从 ParamsPanel 提取细节部分

* 创建 `src/components/ColorSchemeSelector.tsx`：从 ParamsPanel 提取配色部分

* 创建 `src/components/DescriptionInput.tsx`：从 ParamsPanel 提取描述输入部分

* 删除 `src/components/ParamsPanel.tsx`（功能已全部拆出）

### Step 2: 重构左侧栏 — 按新顺序排列所有控制参数

**文件：** `src/App.tsx`

左侧栏新顺序：

1. AssetTypeSelector（素材类型）
2. StyleSelector（视觉风格）
3. ColorSchemeSelector（配色）
4. SizeSelector（尺寸）
5. DetailSelector（细节）
6. FormatSelector（输出格式）

**操作：**

* 在 App.tsx 的 `<aside>` 中按新顺序引入上述组件

* 移除对 ParamsPanel 的引用

### Step 3: 重构中间区域 — 预览 → 按钮组 → 描述框

**文件：** `src/App.tsx` + `src/components/PreviewPanel.tsx`

中间区域新布局（从上到下）：

1. PreviewPanel（预览图片区域）— 移除底部的图片参数信息框
2. 操作按钮组（生成素材、下载、重新生成、❌取消）— 从 PreviewPanel 中提取按钮部分
3. DescriptionInput（用户输入描述框）

**操作：**

* 修改 `PreviewPanel.tsx`：移除底部的参数信息框（TYPE/STYLE/SIZE/TIME 部分），移除按钮组

* 修改 `PreviewPanel.tsx`：仅保留图片展示区域 + loading/error/empty 状态

* 在 App.tsx 中间区域，按新顺序组合：PreviewPanel → 操作按钮组 → DescriptionInput

* 操作按钮组直接在 App.tsx 中组合 GenerateButton + Download + Regenerate + Clear 按钮

### Step 4: 右侧历史栏 — 👀 按钮弹出参数详情

**文件：** `src/components/HistoryPanel.tsx`

当前 👀 按钮点击后调用 `onSelect(asset)` 将图片设为当前预览。需求改为：点击 👀 弹出二级界面展示图片参数。

**操作：**

* 在 HistoryPanel 中添加弹窗状态 `viewingAsset`

* 点击 👀 按钮时设置 `viewingAsset`，显示弹窗

* 弹窗内容：展示该 asset 的完整参数（type, style, size, detail, colorScheme, format, description, createdAt）+ 图片预览

* 弹窗样式：居中模态框，暗色背景遮罩，与现有设计风格一致

* 👀 按钮不再触发 onSelect，改为打开弹窗

### Step 5: 验证与清理

**操作：**

* 删除不再使用的 `ParamsPanel.tsx`

* 确认所有组件导入正确

* 运行 `npm run build` 确认无编译错误

* 检查 TypeScript 类型无报错

***

## 文件变更清单

| 文件                                       | 操作                          |
| ---------------------------------------- | --------------------------- |
| `src/components/SizeSelector.tsx`        | 新建 — 从 ParamsPanel 提取尺寸部分   |
| `src/components/DetailSelector.tsx`      | 新建 — 从 ParamsPanel 提取细节部分   |
| `src/components/ColorSchemeSelector.tsx` | 新建 — 从 ParamsPanel 提取配色部分   |
| `src/components/DescriptionInput.tsx`    | 新建 — 从 ParamsPanel 提取描述输入部分 |
| `src/components/ParamsPanel.tsx`         | 删除 — 功能已拆分到独立组件             |
| `src/components/PreviewPanel.tsx`        | 修改 — 移除参数信息框和按钮组            |
| `src/components/HistoryPanel.tsx`        | 修改 — 添加 👀 弹窗查看参数详情         |
| `src/App.tsx`                            | 修改 — 重构整体布局                 |

***

## 设计原则

* 保持现有 UI 整体风格不变（暗色主题、amber 强调色）

* **字体统一改为** **`Consolas, 'Courier New', monospace`**（替换原 Outfit + JetBrains Mono）

* 所有新组件沿用现有 `section-label`、`control-surface`、`input-field` 等 CSS 类

* 弹窗使用与现有设计一致的暗色风格

* 不引入新的依赖库

***

## Step 0: 字体替换

**涉及文件：**

| 文件                   | 变更                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `tailwind.config.js` | `fontFamily.sans` 改为 `Consolas, 'Courier New', monospace`；`fontFamily.mono` 改为 `Consolas, 'Courier New', monospace` |
| `src/index.css`      | `body.font-family` 改为 `Consolas, 'Courier New', monospace`；`input/textarea.font-family` 同步修改                        |

