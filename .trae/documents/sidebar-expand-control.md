# 侧边栏展开状态控制计划

## 需求分析

当前问题：
1. 侧边栏使用 `hover:w-52` 实现 hover 展开
2. 设置弹窗通过 Portal 渲染到 `document.body`
3. 鼠标从侧边栏移动到弹窗时，侧边栏会收起（因为 hover 失效）
4. 导致弹窗位置异常

期望行为：
1. 点击设置按钮时，侧边栏保持展开状态
2. 设置弹窗悬浮在展开的侧边栏上方
3. 鼠标在侧边栏或弹窗上时，侧边栏保持展开
4. 点击别处且鼠标不在侧边栏上时，侧边栏才收起

## 解决方案

使用状态控制侧边栏展开/收起：
1. 添加 `isExpanded` 状态
2. 添加 `isMouseInside` 状态（鼠标是否在侧边栏内）
3. 当设置弹窗打开时，强制展开
4. 鼠标进入侧边栏时展开，离开且设置关闭时收起

## 修改文件

### 1. `src/components/Sidebar.tsx`
- 添加 `isExpanded` 状态
- 添加 `isMouseInside` 状态
- 添加 `onMouseEnter` / `onMouseLeave` 事件
- 侧边栏宽度由状态控制：`w-16` 或 `w-52`
- 设置按钮点击时设置 `isExpanded = true`

### 2. `src/components/SettingsPopover.tsx`
- 添加 `onMouseEnter` / `onMouseLeave` 回调
- 通知父组件鼠标是否在弹窗上

## 实现步骤

1. 修改 Sidebar：
   - 添加 `isExpanded` 和 `isMouseInside` 状态
   - 侧边栏宽度改为动态：`w-16` 或 `w-52`
   - 添加鼠标进入/离开事件处理
   - 设置按钮点击时设置 `isExpanded = true`

2. 修改 SettingsPopover：
   - 添加 `onMouseEnter` / `onMouseLeave` 属性
   - 在鼠标进入/离开时调用回调

3. 在 Sidebar 中处理弹窗的鼠标事件：
   - 鼠标进入弹窗时，设置 `isExpanded = true`
   - 鼠标离开弹窗时，如果也不在侧边栏内且设置已关闭，设置 `isExpanded = false`

## 关键逻辑

```typescript
// 侧边栏展开条件
const shouldExpand = isExpanded || isMouseInside || showSettings;

// 鼠标进入侧边栏
const handleMouseEnter = () => {
  setIsMouseInside(true);
  setIsExpanded(true);
};

// 鼠标离开侧边栏
const handleMouseLeave = () => {
  setIsMouseInside(false);
  if (!showSettings) {
    setIsExpanded(false);
  }
};

// 设置弹窗关闭时，如果鼠标不在侧边栏内，收起侧边栏
const handleSettingsClose = () => {
  setShowSettings(false);
  if (!isMouseInside) {
    setIsExpanded(false);
  }
};
```
