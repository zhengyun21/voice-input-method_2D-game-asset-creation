# 死代码清除计划

对 `src` 目录下 **2D-game-asset-creation** 和 **voice-input-method** 两个项目进行代码审查，找出并清除未被使用的死代码。

---

## 项目 1: 2D-game-asset-creation

### 死代码清单

| # | 文件 | 死代码 | 行号 | 说明 |
|---|------|--------|------|------|
| 1 | `src/services/exportService.ts` | `exportAssets` 函数 | L13-18 | 仅在文件中定义，无任何地方导入使用 |
| 2 | `src/services/exportService.ts` | `exportAsSpriteSheet` 函数 | L20-30 | 仅在文件中定义，无任何地方导入使用 |
| 3 | `src/services/exportService.ts` | `getFormatExtension` 函数 | L32-42 | 仅在文件中定义，无任何地方导入使用 |
| 4 | `src/services/imageGenerator.ts` | `generateMultipleImages` 函数 | L135-147 | 仅在文件中定义，无任何地方导入使用 |
| 5 | `src/services/imageGenerator.ts` | `StepUpdateCallback` type 导出 | L33 | 仅文件内部使用，无需导出 |
| 6 | `src/utils/helpers.ts` | `debounce` 函数 | L62-71 | 仅在文件中定义，无任何地方导入使用 |
| 7 | `src/index.css` | `.control-surface` CSS 类 | L58-60 | 定义了但无任何组件使用 |
| 8 | `src/index.css` | `.btn-ghost` CSS 类 | L62-65 | 定义了但无任何组件使用 |
| 9 | `src/index.css` | `.btn-primary` CSS 类 | L67-70 | 定义了但无任何组件使用 |

### 需要同步清理的 import

| # | 文件 | 需要移除的 import | 
|---|------|-------------------|
| 1 | `exportService.ts` | `import { downloadFile } from '../utils/helpers';` 在移除 `exportAsSpriteSheet` 后仍需保留（`exportAsset` 使用 `downloadFile`），保持不变 |
| 2 | `exportService.ts` | `import type { OutputFormat }` 在移除 `getFormatExtension` 后可移除 |

**注意**: `exportService.ts` 中 `downloadFile` 仍被 `exportAsset` 使用，不可移除。但 `OutputFormat` 类型不再需要。

---

## 项目 2: voice-input-method

### 死代码清单

| # | 文件 | 死代码 | 行号 | 说明 |
|---|------|--------|------|------|
| 10 | `src/types/index.ts` | `Transcript` 接口 | L3-8 | 定义了但无任何文件导入使用 |
| 11 | `src/types/index.ts` | `Translation` 接口 | L10-17 | 定义了但无任何文件导入使用 |
| 12 | `src/types/index.ts` | `RecognitionState` 接口 | L19-24 | 定义了但无任何文件导入使用 |
| 13 | `src/types/index.ts` | `TranslationState` 接口 | L26-30 | 定义了但无任何文件导入使用 |
| 14 | `src/types/index.ts` | `RecognitionMode` 类型 | L32 | 定义了但无任何文件导入使用 |
| 15 | `src/services/documentParser.ts` | `getAcceptedExtensions` 函数 | L7-9 | 仅在文件中定义，无任何地方导入使用 |
| 16 | `src/components/FileUploader.tsx` | `FileInfo` 组件 | L80-101 | 仅导出但无任何地方导入使用 |
| 17 | `src/components/FileUploader.tsx` | `FileInfoProps` 接口 | L75-78 | 与 `FileInfo` 组件配套，一同移除 |
| 18 | `src/utils/audioUtils.ts` | `blobToBase64` 方法 | L2-12 | `audioUtils` 对象的属性，但无任何地方调用 |
| 19 | `src/utils/audioUtils.ts` | `base64ToBlob` 方法 | L14-22 | `audioUtils` 对象的属性，但无任何地方调用 |
| 20 | `src/utils/audioUtils.ts` | `generateId` 方法 | L30-32 | `audioUtils` 对象的属性，但无任何地方调用 |
| 21 | `src/index.css` | `.dark-input` CSS 类 | L98-103 | 定义了但无任何组件使用 |
| 22 | `src/index.css` | `.line-clamp-6` CSS 工具类 | L107-112 | 定义了但无任何组件使用 |

### 需要同步清理的 import

| # | 文件 | 需要移除的 import |
|---|------|-------------------|
| 1 | `src/components/FileUploader.tsx` | `import { getAcceptedMimeTypes, formatFileSize } from '../services/documentParser';` 仍被使用，但移除 `getAcceptedMimeTypes` 后... 等等，`getAcceptedMimeTypes` 仍在 `FileUploader` 中使用，保持不变 |

---

## 执行步骤

### Step 1: 清除 2D-game-asset-creation 死代码

#### 1a: `src/services/exportService.ts`
- 删除 `exportAssets` 函数定义
- 删除 `exportAsSpriteSheet` 函数定义
- 删除 `getFormatExtension` 函数定义
- 移除不再需要的 `OutputFormat` 类型 import（移除 `, OutputFormat`，保留 `GeneratedAsset`）
- 保留 `exportAsset`（被 App.tsx 使用）和 `downloadFile` import

#### 1b: `src/services/imageGenerator.ts`
- 删除 `generateMultipleImages` 函数定义
- 将 `export type StepUpdateCallback` 改为内部类型（移除 `export` 关键字）

#### 1c: `src/utils/helpers.ts`
- 删除 `debounce` 函数定义

#### 1d: `src/index.css`
- 删除 `.control-surface` CSS 规则
- 删除 `.btn-ghost` CSS 规则
- 删除 `.btn-primary` CSS 规则

### Step 2: 清除 voice-input-method 死代码

#### 2a: `src/types/index.ts`
- 删除 `Transcript` 接口
- 删除 `Translation` 接口
- 删除 `RecognitionState` 接口
- 删除 `TranslationState` 接口
- 删除 `RecognitionMode` 类型

#### 2b: `src/services/documentParser.ts`
- 删除 `getAcceptedExtensions` 函数
- 删除 `ACCEPTED_EXTENSIONS` 常量（仅 `getAcceptedExtensions` 使用它）
- 保留 `getAcceptedMimeTypes`（被 FileUploader 使用）

#### 2c: `src/components/FileUploader.tsx`
- 删除 `FileInfoProps` 接口
- 删除 `FileInfo` 组件

#### 2d: `src/utils/audioUtils.ts`
- 删除 `blobToBase64` 方法
- 删除 `base64ToBlob` 方法
- 删除 `generateId` 方法
- 保留 `formatDuration`（被 VoiceRecorder 使用）

#### 2e: `src/index.css`
- 删除 `.dark-input` CSS 规则
- 删除 `.line-clamp-6` CSS 工具类

### Step 3: 验证

- 确认所有剩余代码引用关系完整，无编译错误
- 运行 `npm run build` 或 TypeScript 类型检查（如果项目配置了）
