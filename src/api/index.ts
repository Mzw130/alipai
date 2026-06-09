// ClipAI API 接口预留
// 后端接口后续开发，此处仅定义接口签名与存根

// ==================== 订阅 / 支付 ====================
export async function subscribePlan(planId: string): Promise<{ success: boolean }> {
  // TODO: 对接实际支付接口
  console.log('[API] subscribePlan:', planId);
  return { success: false };
}

export async function restorePurchases(): Promise<{ success: boolean }> {
  // TODO: 对接恢复购买接口
  console.log('[API] restorePurchases');
  return { success: false };
}

export async function getSubscriptionPlans(): Promise<any[]> {
  // TODO: 获取订阅方案列表
  console.log('[API] getSubscriptionPlans');
  return [];
}

// ==================== AI 编辑 ====================
export async function enhanceImage(
  imageUri: string,
  toolType: string,
  params: Record<string, any>
): Promise<{ resultUri: string } | null> {
  // TODO: 对接 AI 图片处理接口
  console.log('[API] enhanceImage:', toolType, params);
  return null;
}

export async function generateVideo(
  imageUri: string,
  prompt: string,
  mode: string
): Promise<{ resultUri: string } | null> {
  // TODO: 对接 AI 视频生成接口
  console.log('[API] generateVideo:', mode, prompt);
  return null;
}

// ==================== 素材库 ====================
export async function getMaterials(type: string): Promise<any[]> {
  // TODO: 获取用户素材列表
  console.log('[API] getMaterials:', type);
  return [];
}

// ==================== 探索 ====================
export async function getTemplates(filter: string): Promise<any[]> {
  // TODO: 获取模板列表
  console.log('[API] getTemplates:', filter);
  return [];
}

// ==================== 通用 ====================
export async function uploadImage(uri: string): Promise<{ url: string } | null> {
  // TODO: 上传图片到服务器
  console.log('[API] uploadImage');
  return null;
}
