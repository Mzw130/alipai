/**
 * ClipAI API 客户端
 *
 * 与后端 clipai-api 通信的完整接口封装
 *
 * 基础 URL 配置: 修改 API_BASE_URL 指向你的后端服务地址
 */

// ==================== 配置 ====================
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api/v1'
  : 'https://api.clipai.com/api/v1';

// 开发模式自动登录
const DEV_PHONE = '13800138000';
const DEV_CODE = '123456';
let autoLoginPromise: Promise<void> | null = null;

async function ensureAuth(): Promise<void> {
  if (authToken) return;
  if (!autoLoginPromise) {
    autoLoginPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: DEV_PHONE, code: DEV_CODE }),
        });
        const json = await res.json();
        if (json.code === 0 && json.data?.token) {
          authToken = json.data.token;
          console.log('[API] 自动登录成功, userId:', json.data.user?.id);
        }
      } catch (e) {
        console.error('[API] 自动登录失败:', e);
      }
    })();
  }
  await autoLoginPromise;
}

// ==================== 通用请求工具 ====================
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T | null;
  request_id: string;
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

async function request<T>(
  method: string,
  path: string,
  options?: {
    body?: any;
    headers?: Record<string, string>;
    formData?: FormData;
    timeout?: number;
  },
): Promise<ApiResponse<T>> {
  // 自动登录（auth 端点自身跳过，避免死循环）
  if (!path.startsWith('/auth/')) {
    await ensureAuth();
  }

  const url = `${API_BASE_URL}${path}`;

  const headers: Record<string, string> = {
    ...options?.headers,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  let body: any = undefined;
  if (options?.formData) {
    body = options.formData;
    // 不设置 Content-Type，让浏览器自动设置 multipart boundary
  } else if (options?.body) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.body);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options?.timeout || 120_000);

  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const json = await response.json();

    if (!response.ok && json.code === 0) {
      // 有些情况 HTTP 错误但业务码为 0，标准化处理
      throw new ApiError(response.status, '请求失败');
    }

    return json as ApiResponse<T>;
  } catch (error: any) {
    clearTimeout(timeout);
    if (error instanceof ApiError) throw error;
    if (error.name === 'AbortError') {
      throw new ApiError(408, '请求超时');
    }
    // 网络错误时返回离线可用的降级结果
    throw new ApiError(0, error.message || '网络连接失败，请检查网络');
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ==================== 认证 ====================

export async function sendVerificationCode(phone: string) {
  const res = await request<{ expires_in: number }>('POST', '/auth/send-code', {
    body: { phone },
  });
  return res.data;
}

export async function verifyCode(phone: string, code: string) {
  const res = await request<{
    token: string;
    user: {
      id: string;
      phone: string;
      nickname: string | null;
      avatarUrl: string | null;
      role: string;
      credits: number;
      isNewUser: boolean;
    };
  }>('POST', '/auth/verify', {
    body: { phone, code },
  });

  if (res.data?.token) {
    setAuthToken(res.data.token);
  }

  return res.data;
}

// ==================== 用户 ====================

export async function getUserProfile() {
  const res = await request<{
    id: string;
    phone: string;
    nickname: string | null;
    avatarUrl: string | null;
    role: string;
    credits: number;
    proExpiresAt: string | null;
    createdAt: string;
  }>('GET', '/user/profile');
  return res.data;
}

export async function getUserCredits() {
  const res = await request<{
    credits: number;
    is_pro: boolean;
    daily_quota: { used: number; total: number } | { unlimited: true };
  }>('GET', '/user/credits');
  return res.data;
}

// ==================== AI 编辑 ====================

export interface EnhanceParams {
  toolType: string;
  imageUri: string;
  params?: Record<string, any>;
  maskUri?: string;
  webhookUrl?: string;
}

export interface EnhanceResult {
  task_id: string;
  status: 'processing' | 'completed' | 'failed';
  result_url?: string;
  original_url?: string;
  processing_time_ms?: number;
  credits_used?: number;
  estimated_seconds?: number;
  error_message?: string;
}

/**
 * AI 图片增强（核心接口）
 */
export async function enhanceImage(params: EnhanceParams): Promise<EnhanceResult | null> {
  const formData = new FormData();

  // 处理图片: Web 端需要先 fetch 成 Blob，原生端直接用 uri
  try {
    const response = await fetch(params.imageUri);
    const blob = await response.blob();
    const ext = blob.type === 'image/png' ? 'png' : 'jpg';
    (formData as any).append('image', blob, `image.${ext}`);
  } catch {
    // fallback: 原生端用 uri 格式
    formData.append('image', {
      uri: params.imageUri,
      type: 'image/jpeg',
      name: 'image.jpg',
    } as any);
  }

  formData.append('tool_type', params.toolType);

  if (params.params) {
    formData.append('params', JSON.stringify(params.params));
  }

  if (params.maskUri) {
    formData.append('mask', {
      uri: params.maskUri,
      type: 'image/png',
      name: 'mask.png',
    } as any);
  }

  if (params.webhookUrl) {
    formData.append('webhook_url', params.webhookUrl);
  }

  const res = await request<EnhanceResult>('POST', '/ai/enhance', {
    formData,
    timeout: 120_000,
  });

  return res.data;
}

/**
 * 查询 AI 任务状态
 */
export async function getTaskStatus(taskId: string) {
  const res = await request<{
    task_id: string;
    status: string;
    result_url: string | null;
    error_message: string | null;
  }>('GET', `/ai/status/${taskId}`);
  return res.data;
}

/**
 * 图生视频 (Pro)
 */
export async function generateVideo(
  imageUri: string,
  prompt: string,
  mode: string = 'super',
): Promise<EnhanceResult | null> {
  const formData = new FormData();

  if (imageUri.startsWith('file://') || imageUri.startsWith('/')) {
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'image.jpg',
    } as any);
  } else {
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'image.jpg',
    } as any);
  }

  // 注意: prompt 和 mode 需要作为其他 parts 发送
  // Fastify multipart 按顺序解析
  formData.append('prompt', prompt);
  formData.append('mode', mode);

  const res = await request<EnhanceResult>('POST', '/ai/video', {
    formData,
    timeout: 300_000,
  });

  return res.data;
}

// ==================== 素材库 ====================

export interface Material {
  id: string;
  userId: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  sizeBytes: number | null;
  toolType: string | null;
  taskId: string | null;
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export async function getMaterials(type: string = 'all', page: number = 1, pageSize: number = 20) {
  const res = await request<{
    items: Material[];
    pagination: {
      page: number;
      page_size: number;
      total: number;
      total_pages: number;
    };
  }>('GET', `/materials?type=${type}&page=${page}&page_size=${pageSize}`);
  return res.data;
}

export async function deleteMaterial(id: string) {
  const res = await request<null>('DELETE', `/materials/${id}`);
  return res;
}

export async function toggleFavorite(id: string) {
  const res = await request<{ is_favorite: boolean }>('POST', `/materials/${id}/favorite`);
  return res.data;
}

// ==================== 探索 ====================

export async function getTemplates(category?: string) {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  const res = await request<any[]>('GET', `/templates${query}`);
  return res.data || [];
}

export async function getExploreContent(category?: string) {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  const res = await request<any[]>('GET', `/explore${query}`);
  return res.data || [];
}

// ==================== 订阅 / 支付 ====================

export interface Plan {
  id: string;
  name: string;
  productId: string;
  type: string;
  price: string;
  currency: string;
  creditsPerPeriod: number;
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

export async function getSubscriptionPlans(): Promise<Plan[]> {
  const res = await request<Plan[]>('GET', '/plans');
  return res.data || [];
}

export async function getSubscriptionStatus() {
  const res = await request<{
    isPro: boolean;
    credits: number;
    subscription: {
      planId: string;
      status: string;
      expiresAt: string | null;
      autoRenew: boolean;
    } | null;
  }>('GET', '/subscription/status');
  return res.data;
}

export async function verifyPurchase(receiptData: string) {
  const res = await request<{
    verified: boolean;
    plan_id: string;
    expires_at: string;
  }>('POST', '/purchase/verify', {
    body: { receipt_data: receiptData },
  });
  return res.data;
}

export async function restorePurchases(receiptData: string) {
  const res = await request<{
    restored: boolean;
    plan_id: string;
    expires_at: string;
  }>('POST', '/purchase/restore', {
    body: { receipt_data: receiptData },
  });
  return res.data;
}

// ==================== 上传 ====================

export async function uploadImage(uri: string): Promise<{ url: string } | null> {
  const formData = new FormData();

  if (uri.startsWith('file://') || uri.startsWith('/')) {
    formData.append('image', {
      uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as any);
  } else {
    formData.append('image', {
      uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as any);
  }

  const res = await request<{ url: string; file_id: string; width: number; height: number; size_bytes: number }>(
    'POST',
    '/upload',
    { formData },
  );
  return res.data ? { url: res.data.url } : null;
}

// ==================== 兼容旧版存根接口 ====================
// 保持向后兼容的旧接口名

export async function subscribePlan(planId: string): Promise<{ success: boolean }> {
  try {
    const receipt = ''; // 由原生端获取的真实收据
    if (!receipt) {
      console.log('[API] subscribePlan: 需要原生端提供 receipt_data');
      return { success: false };
    }
    const result = await verifyPurchase(receipt);
    return { success: result?.verified || false };
  } catch (error) {
    console.error('[API] subscribePlan error:', error);
    return { success: false };
  }
}
