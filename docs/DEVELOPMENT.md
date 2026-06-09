# ClipAI 开发规范与 API 设计文档

## 项目架构概述

```
ClipAI
├── 前端: React Native (Expo) + TypeScript
├── 后端: 待开发 (推荐 Node.js Fastify / Python FastAPI)
├── AI 层: 统一 Prompt Pipeline（接入 Stable Diffusion / ControlNet / Replicate）
└── 存储: 对象存储 (OSS/S3/R2) + PostgreSQL + Redis
```

### 核心设计理念

**18 个 AI 工具 ≠ 18 个 AI 模型，而是 1 套统一的 AI Pipeline + 18 套 Prompt/参数组合。**

```
用户选图 → 选择 tool_type + 参数 → 后端拼装 Prompt → 调用 AI 模型 → 返回结果
```

这种设计的优势：
- 新增工具只需添加 prompt 模板，无需改 AI 基础设施
- 后端维护成本极低（一个 pipeline 处理所有工具）
- Prompt 可以在后台热更新，无需发版

---

## 一、工具与 Prompt 映射表

### 1.1 工具分类与参数总结

| # | tool_type | 中文名 | 参数类型 | 用户可选参数 |
|---|-----------|--------|----------|-------------|
| 1 | `reshape` | 重塑 | 子功能选择 | `sub_tool`: `leg_enhance` / `muscle_adjust` / `muscle_enhance` / `arm_slim` |
| 2 | `hd_repair` | 高清修复 | 无参 + 涂抹 | upscale factor (2x/4x), face enhance |
| 3 | `obj_remove` | 物体消除 | 涂抹蒙版 | brush/eraser mask coordinates |
| 4 | `bg_remove` | 背景移除 | 无参 | — |
| 5 | `super_realistic` | 超级写实 | 无参 | — |
| 6 | `hair_dye` | 染发 | 颜色选择 | `hair_color`: `pink` / `red` / `gold` / `brown` + hex value |
| 7 | `lip_plump` | 丰唇 | 无参 / 强度 | `intensity`: 0.0–1.0 |
| 8 | `jawline` | 下颌轮廓 | 无参 / 强度 | `intensity`: 0.0–1.0 |
| 9 | `hair_smooth` | 发质顺滑 | 无参 | — |
| 10 | `hair_repair` | 发质修复 | 无参 | — |
| 11 | `proportion` | 比例调整 | 比例类型 + 滑块 | `ratio_type` + `intensity` 0–100 |
| 12 | `leg_enhance` | 丰腿 | 模式 + 强度 | `mode`: `slim_leg` / `long_leg` / `plump_leg` / `leg_shape` + `intensity` 0–100 |
| 13 | `muscle` | 肌肉 | 部位 + 强度 | `body_part`: `abs`/`chest`/`arms`/`shoulders`/`back`/`legs_muscle` + `intensity` 0–100 |
| 14 | `muscle_enhance` | 肌肉增强 | 风格 + 强度 | `style`: `lean`/`athletic`/`bodybuilder`/`massive` + `intensity` 0–100 |
| 15 | `ai_edit` | AI编辑 | 自由文本 | `prompt`: 用户输入的自然语言描述 |
| 16 | `beauty` | 美颜 | 无参 | — |
| 17 | `color_grade` | 调色 | 无参 | — |
| 18 | `filter` | 滤镜 | 无参 | — |

### 1.2 视频工具

| tool_type | 中文名 | 参数 |
|-----------|--------|------|
| `video_generate` | 图生视频 | `image` + `prompt` + `mode` (`super` / `custom`) |

---

## 二、统一 API 接口设计

### 2.1 核心 AI 处理接口

```
POST /api/v1/ai/enhance
Content-Type: multipart/form-data
Authorization: Bearer <jwt_token>
```

**请求参数：**

```json
{
  "tool_type": "muscle_enhance",     // 必填，工具类型标识
  "image": <file>,                    // 必填，用户上传的原图
  "params": {                         // 可选，工具特定参数
    "style": "athletic",
    "intensity": 70
  },
  "mask": <file>,                     // 可选，涂抹蒙版图（obj_remove 等工具用）
  "mask_coordinates": [[x1,y1],[x2,y2],...],  // 可选，蒙版坐标数组
  "webhook_url": "https://..."        // 可选，异步回调地址
}
```

**响应（同步模式，快速任务）：**

```json
{
  "code": 0,
  "data": {
    "task_id": "task_abc123",
    "status": "completed",
    "result_url": "https://cdn.clipai.com/results/abc123.png",
    "original_url": "https://cdn.clipai.com/uploads/abc123_orig.png",
    "processing_time_ms": 3200,
    "credits_used": 1
  }
}
```

**响应（异步模式，耗时任务）：**

```json
{
  "code": 0,
  "data": {
    "task_id": "task_abc123",
    "status": "processing",
    "estimated_seconds": 15
  }
}
```

### 2.2 任务状态轮询

```
GET /api/v1/ai/status/:task_id
Authorization: Bearer <jwt_token>
```

```json
{
  "code": 0,
  "data": {
    "task_id": "task_abc123",
    "status": "processing|completed|failed",
    "result_url": "https://cdn.clipai.com/results/abc123.png",
    "error_message": null
  }
}
```

### 2.3 图片上传

```
POST /api/v1/upload
Content-Type: multipart/form-data
Authorization: Bearer <jwt_token>
```

```json
// Response
{
  "code": 0,
  "data": {
    "url": "https://cdn.clipai.com/uploads/xyz789.png",
    "file_id": "xyz789",
    "width": 1170,
    "height": 2532,
    "size_bytes": 245760
  }
}
```

### 2.4 统一响应格式

所有接口遵循统一格式：

```typescript
interface ApiResponse<T> {
  code: number;        // 0=成功, 非0=错误
  message: string;     // 人类可读的消息
  data: T | null;      // 业务数据
  request_id: string;  // 请求追踪 ID
}
```

**错误码规范：**

| code | 含义 |
|------|------|
| 0 | 成功 |
| 1001 | 参数错误 |
| 1002 | 未登录 / token 过期 |
| 1003 | 积分不足 |
| 1004 | 非 Pro 会员不可用 |
| 1005 | 图片内容违规 |
| 1006 | 图片格式不支持 |
| 2001 | AI 服务超时 |
| 2002 | AI 服务返回错误 |
| 5000 | 服务器内部错误 |

### 2.5 接口列表汇总

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/auth/send-code` | 发送验证码 |
| POST | `/api/v1/auth/verify` | 验证码登录 |
| GET | `/api/v1/user/profile` | 用户信息 |
| GET | `/api/v1/user/credits` | 积分余额 |
| POST | `/api/v1/upload` | 上传图片 |
| POST | `/api/v1/ai/enhance` | 统一 AI 处理 |
| GET | `/api/v1/ai/status/:task_id` | 任务状态 |
| POST | `/api/v1/ai/video` | 图生视频 |
| GET | `/api/v1/materials` | 素材列表 |
| DELETE | `/api/v1/materials/:id` | 删除素材 |
| POST | `/api/v1/materials/:id/favorite` | 收藏/取消 |
| GET | `/api/v1/templates` | 模板列表 |
| GET | `/api/v1/explore` | 探索页内容 |
| GET | `/api/v1/plans` | 订阅方案 |
| POST | `/api/v1/purchase/verify` | 验证支付票据 |
| GET | `/api/v1/subscription/status` | 订阅状态 |

---

## 三、Prompt 设计规范

### 3.1 核心原则

后端维护一个 **Prompt 模板表**，每个 `tool_type` 对应一个模板：

```sql
CREATE TABLE prompt_templates (
  id UUID PRIMARY KEY,
  tool_type VARCHAR(50) UNIQUE NOT NULL,
  model_name VARCHAR(100) NOT NULL,       -- 使用的 AI 模型
  base_prompt TEXT NOT NULL,              -- 基础 prompt 模板
  negative_prompt TEXT,                   -- 负向 prompt
  default_params JSONB,                   -- 默认参数
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 3.2 Prompt 模板示例

**背景移除 (bg_remove)：**
```
Base: "Remove the background from this image. Keep only the main subject. 
Output with transparent background. High quality, clean edges."
Model: rembg / BRIA-RMBG
```

**染发 (hair_dye)：**
```
Base: "Change the hair color in this portrait photo to {hair_color}. 
Keep the natural hair texture and lighting. 
Only modify the hair area, do not change face or background."
Params: { hair_color: "pink" }
Model: Stable Diffusion Inpainting / ControlNet
```

**肌肉增强 (muscle_enhance)：**
```
Base: "Enhance the muscle definition of this person's body in a {style} style. 
Intensity: {intensity}%. 
Maintain natural skin tone and lighting. Keep face unchanged."
Params: { style: "athletic", intensity: 70 }
Negative: "deformed, unnatural proportions, overly muscular, cartoonish"
Model: Stable Diffusion + ControlNet (pose/depth)
```

**比例调整 (proportion)：**
```
Base: "Adjust the body proportion of this full-body photo. 
Focus on {ratio_type}. Intensity: {intensity}%. 
Maintain natural look and realistic proportions. 
Keep clothing and background unchanged."
Params: { ratio_type: "leg_body", intensity: 50 }
Model: Stable Diffusion + ControlNet
```

### 3.3 模型选择策略

| 工具类别 | 推荐模型 | 说明 |
|----------|---------|------|
| 背景移除 | BRIA-RMBG / rembg | 专用背景移除，速度快 |
| 面部相关（丰唇/下颌/美颜） | InsightFace / FaceFusion | 面部特征精确处理 |
| 身体塑形（比例/丰腿/肌肉） | SD + ControlNet (OpenPose/Depth) | 需要保持身体结构 |
| 风格转换（写实/调色/滤镜） | SD img2img + LoRA | 风格迁移 |
| 高清修复 | Real-ESRGAN / GFPGAN | 超分辨率专用模型 |
| 物体消除 | SD Inpainting / LaMa | 局部重绘 |
| AI编辑 / 视频 | SDXL / AnimateDiff | 重任务，需要 GPU |

---

## 四、前端开发规范

### 4.1 文件命名

```
组件: PascalCase  → AiToolBar.tsx, AuthModal.tsx
屏幕: PascalCase + Screen 后缀 → HomeScreen.tsx, HDReshapeScreen.tsx
API:  camelCase  → src/api/index.ts
主题: kebab-case → src/theme/index.ts
```

### 4.2 目录结构

```
src/
├── api/           # API 调用（每个领域一个文件）
│   ├── index.ts       # 当前存根 → 后续拆分为:
│   ├── auth.ts        # 认证相关
│   ├── ai.ts          # AI 处理相关
│   ├── materials.ts   # 素材相关
│   └── payment.ts     # 支付相关
├── components/    # 可复用组件
├── screens/       # 页面（按 Tab 组织 + ai-tools 子目录）
├── navigation/    # 导航配置
├── theme/         # 颜色、字号、间距常量
├── hooks/         # 自定义 hooks（待添加）
├── store/         # 状态管理（待添加，推荐 zustand）
└── utils/         # 工具函数（待添加）
```

### 4.3 新增 AI 工具 Checklist

当需要新增一个 AI 工具时，按以下步骤操作：

1. **`src/components/AiToolBar.tsx`** — 在 `TOOLS` 数组添加一项
2. **`src/screens/ai-tools/XxxScreen.tsx`** — 创建页面组件
3. **`src/navigation/AppNavigator.tsx`** — 添加 import + Route 类型 + Stack.Screen
4. **后端** — 在 `prompt_templates` 表插入一行 prompt 配置
5. **无需改 AI 基础设施**

### 4.4 屏幕组件模板

所有 AI 工具屏幕遵循同一模式：

```tsx
export default function XxxScreen() {
  const [showAuth, setShowAuth] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [params, setParams] = useState<XxxParams>(defaultParams);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    try {
      const res = await enhanceImage(selectedImage, 'xxx_tool', params);
      setResult(res?.resultUri ?? null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView>
      {/* Header: back + title + subtitle */}
      {/* ImagePicker: 选图区 */}
      {/* Params: 工具特定参数区 */}
      {/* Result: 结果展示区（可选） */}
      {/* GenerateBtn: 调用 API */}
      {/* AuthModal: 授权弹窗 */}
    </SafeAreaView>
  );
}
```

---

## 五、后端架构规范

### 5.1 推荐目录结构

```
server/
├── src/
│   ├── index.ts              # 入口
│   ├── config/               # 配置（环境变量、常量）
│   ├── routes/               # 路由定义
│   │   ├── auth.ts
│   │   ├── ai.ts
│   │   ├── user.ts
│   │   ├── materials.ts
│   │   └── payment.ts
│   ├── services/             # 业务逻辑
│   │   ├── ai/
│   │   │   ├── pipeline.ts       # 统一 AI Pipeline
│   │   │   ├── prompts.ts        # Prompt 模板管理
│   │   │   └── models.ts         # 模型调用封装
│   │   ├── auth.ts
│   │   ├── payment.ts
│   │   └── storage.ts
│   ├── middleware/            # 中间件
│   │   ├── auth.ts           # JWT 验证
│   │   ├── ratelimit.ts      # 频率限制
│   │   └── validator.ts      # 参数校验
│   ├── db/                   # 数据库
│   │   ├── schema.ts         # 表定义
│   │   └── migrations/       # 迁移文件
│   └── utils/                # 工具函数
├── tests/
├── docker-compose.yml
└── .env.example
```

### 5.2 AI Pipeline 核心流程

```
1. 接收请求（tool_type + image + params）
       ↓
2. 鉴权 + 积分检查
       ↓
3. 上传原图到 OSS，获取 URL
       ↓
4. 查询 prompt_templates 表，获取 base_prompt + model
       ↓
5. 将 params 注入 prompt 模板（变量替换）
       ↓
6. 调用对应的 AI 模型
       ↓
7. 下载结果 → 上传到 OSS
       ↓
8. 入库（materials 表） + 扣积分
       ↓
9. 返回结果 URL
```

### 5.3 环境变量规范

```bash
# .env.example
NODE_ENV=development
PORT=3000

# 数据库
DATABASE_URL=postgresql://user:pass@localhost:5432/clipai
REDIS_URL=redis://localhost:6379

# AI 服务
REPLICATE_API_TOKEN=r8_xxx
STABLE_DIFFUSION_ENDPOINT=https://xxx.runpod.io

# 对象存储
OSS_ENDPOINT=https://xxx.r2.cloudflarestorage.com
OSS_ACCESS_KEY=xxx
OSS_SECRET_KEY=xxx
OSS_BUCKET=clipai
OSS_PUBLIC_URL=https://cdn.clipai.com

# JWT
JWT_SECRET=xxx
JWT_EXPIRES_IN=7d

# 验证码
SMS_PROVIDER=aliyun
SMS_ACCESS_KEY=xxx
```

---

## 六、Git 与协作规范

### 6.1 分支策略

```
main          → 生产环境
develop       → 开发主线
feature/xxx   → 功能分支（从 develop 切出）
fix/xxx       → 修复分支
```

### 6.2 Commit 规范

```
feat: 新增功能      → feat: 添加肌肉增强工具
fix: 修复 bug       → fix: 修复首页滚动卡顿
refactor: 重构      → refactor: 统一 AI 工具屏幕组件
style: UI 调整      → style: 调整暗色主题对比度
docs: 文档更新      → docs: 更新 API 设计文档
chore: 工程化       → chore: 添加 eslint 配置
```

### 6.3 代码风格

- TypeScript strict mode
- 所有导出函数/组件必须有明确的类型注解
- 使用 `const` 声明不变变量，避免 `let` 除非必须
- 组件文件使用默认导出 `export default function Xxx()`
- 工具/API 文件使用命名导出 `export async function xxx()`
- 缩进: 2 空格
- 字符串: 单引号

---

## 七、安全规范

1. **所有 API 需要 JWT 认证**（除 `send-code` 和 `verify`）
2. **图片上传限制**: 最大 20MB，仅允许 jpg/png/webp/heic
3. **频率限制**: 免费用户每分钟 5 次，Pro 用户每分钟 30 次
4. **内容审核**: 调用第三方内容审核 API 检查上传图片是否违规
5. **敏感信息**: API Key、密钥等只存环境变量，绝不硬编码
6. **HTTPS**: 所有通信必须走 HTTPS

---

## 八、测试规范

1. **单元测试**: 工具函数、prompt 模板变量替换
2. **集成测试**: API 端点 + 数据库
3. **E2E**: 上传图片 → AI 处理 → 返回结果 全链路
4. **Prompt 回归测试**: 每次修改 prompt 后跑一次对比测试
