# 尺寸预设与校验优化计划

## 需求

1. 更新预设尺寸为智谱 API 官方推荐枚举值
2. 自定义尺寸校验：宽高须在 512-2048px 范围内，超出时锁定生成按钮并显示警告
3. 更新 imageGenerator.ts 中的 SIZE_PRESETS 匹配官方文档

## 当前模型

`.env` 中 `VITE_ZHIPU_MODEL=cogview-3-flash`，属于"其它模型"类别，适用规则：
- 推荐枚举值：1024x1024, 768x1344, 864x1152, 1344x768, 1152x864, 1440x720, 720x1440
- 自定义参数：长宽均需满足 512px-2048px，需被 16 整除，最大像素数不超过 2^21px

---

## 实施步骤

### Step 1: 更新 PRESET_SIZES（types/index.ts）

将预设尺寸从 `64/128/256/512` 改为智谱官方推荐枚举值：

```ts
export const PRESET_SIZES = [
  { label: '1024²', width: 1024, height: 1024 },
  { label: '768×1344', width: 768, height: 1344 },
  { label: '864×1152', width: 864, height: 1152 },
  { label: '1344×768', width: 1344, height: 768 },
  { label: '1152×864', width: 1152, height: 864 },
  { label: '1440×720', width: 1440, height: 720 },
  { label: '720×1440', width: 720, height: 1440 },
];
```

### Step 2: 更新 SizeSelector 组件

**文件：** `src/components/SizeSelector.tsx`

- 预设按钮改为 2 行网格布局（4+3），适配 7 个预设
- 自定义输入框 min/max 改为 512/2048
- 添加尺寸校验逻辑：宽或高 < 512 或 > 2048 时，显示红色警告文字
- 新增 `sizeError` prop 传递给父组件

### Step 3: 更新 App.tsx — 尺寸校验 + 按钮锁定

**文件：** `src/App.tsx`

- 计算尺寸是否合法：`width >= 512 && width <= 2048 && height >= 512 && height <= 2048`
- 生成按钮的 `disabled` 条件增加尺寸校验：`!description.trim() || sizeInvalid`
- 尺寸不合法时显示警告提示

### Step 4: 更新 imageGenerator.ts — SIZE_PRESETS 匹配官方文档

**文件：** `src/services/imageGenerator.ts`

SIZE_PRESETS 已经是正确的值（与官方推荐枚举一致），无需修改。但需确认 `nearestSize` 逻辑正确。

### Step 5: 验证构建

运行 `npm run build` 确认无编译错误。

---

## 文件变更清单

| 文件 | 操作 |
|------|------|
| `src/types/index.ts` | 修改 — 更新 PRESET_SIZES 为官方推荐枚举值 |
| `src/components/SizeSelector.tsx` | 修改 — 适配新预设、添加校验警告、更新 min/max |
| `src/App.tsx` | 修改 — 添加尺寸校验，超范围时锁定生成按钮 |
