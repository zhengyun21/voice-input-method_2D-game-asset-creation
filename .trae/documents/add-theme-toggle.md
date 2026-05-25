# 白天/夜间模式切换计划（修订版）

## 需求

点击侧边栏底部的设置按钮 → 弹出二级弹窗 → 弹窗内包含日/夜模式切换按钮

## 实施方案

采用 **CSS 变量 + Tailwind darkMode class 策略**，通过在 `<html>` 上切换 `dark` class 实现主题切换。

### 修改/新增文件清单

1. **新建** **`src/hooks/useTheme.ts`** — 主题 Hook
2. **新建** **`src/components/SettingsPopover.tsx`** — 设置弹窗组件
3. **修改** **`tailwind.config.js`** — 启用 darkMode，颜色引用 CSS 变量
4. **修改** **`src/index.css`** — 定义两套 CSS 变量（亮色/暗色）
5. **修改** **`src/components/Sidebar.tsx`** — 设置按钮点击弹出弹窗
6. **修改** **`src/components/AppLayout.tsx`** — 初始化主题

### 详细步骤

#### 1. 创建 `useTheme` Hook

* 读取 `localStorage` 中 `theme` 值（`dark` / `light`）

* 若无存储值，跟随 `prefers-color-scheme`

* 切换时在 `<html>` 元素上添加/移除 `dark` class

* 持久化到 `localStorage`

* 导出 `isDark`、`toggleTheme`

#### 2. 创建 `SettingsPopover` 弹窗组件

* 从设置按钮上方弹出的小弹窗（绝对定位）

* 弹窗内容：一行显示"日间/夜间模式" + 切换开关

* 点击弹窗外部关闭

* 样式：`dark-card` 风格，带阴影，圆角

#### 3. 修改 `tailwind.config.js`

* 添加 `darkMode: 'class'`

* 颜色改为引用 CSS 变量：`var(--surface-bg)` 等

#### 4. 修改 `src/index.css`

* `:root` 下定义亮色 CSS 变量

* `.dark` 下定义暗色 CSS 变量

* `body` 背景和颜色改用变量

* `dark-card` / `dark-input` 适配双主题

* 滚动条颜色适配

#### 5. 修改 `Sidebar.tsx`

* 设置按钮添加点击事件，控制弹窗显示/隐藏

* 引入 `SettingsPopover` 组件

* 弹窗定位在设置按钮上方

#### 6. 修改 `AppLayout.tsx`

* 调用 `useTheme` 初始化主题

### 亮色主题配色

| Token                 | 亮色        | 暗色（现有）    |
| --------------------- | --------- | --------- |
| surface-bg            | `#f8f9fa` | `#09090b` |
| surface-base          | `#ffffff` | `#131316` |
| surface-card          | `#ffffff` | `#1a1a1f` |
| surface-elevated      | `#f1f3f5` | `#222228` |
| surface-border        | `#e5e7eb` | `#27272a` |
| surface-border-subtle | `#f1f3f5` | `#1f1f23` |
| text-primary          | `#111827` | `#fafafa` |
| text-secondary        | `#6b7280` | `#71717a` |
| text-muted            | `#9ca3af` | `#52525b` |
| accent                | `#f59e0b` | `#f59e0b` |

