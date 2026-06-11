/// <reference lib="dom" />
/**
 * Web 端视频缩略图生成
 *
 * 使用浏览器原生 HTMLVideoElement + Canvas 截取视频第 1 秒帧
 * expo-video-thumbnails 在 Web 上不可用（显式抛出异常）
 * expo-file-system 的 cacheDirectory 在 Web 上为 null
 */
const memoryCache = new Map<string, string>();

/**
 * 使用浏览器原生能力截取视频帧
 */
function captureFrame(videoUrl: string, timeSeconds: number): Promise<string | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const cleanup = () => {
      video.remove();
      canvas.remove();
    };

    const timeout = setTimeout(() => {
      cleanup();
      resolve(null);
    }, 15000); // 15s 超时

    video.preload = 'metadata';
    video.muted = true;
    video.crossOrigin = 'anonymous';
    video.currentTime = timeSeconds;

    video.addEventListener('loadeddata', () => {
      // 视频元数据加载完毕，等待 seek 完成
    });

    video.addEventListener('seeked', () => {
      clearTimeout(timeout);
      try {
        // 限制缩略图最大宽度 400px，高度按比例缩放，避免超大尺寸
        const MAX_WIDTH = 400;
        const scale = Math.min(1, MAX_WIDTH / video.videoWidth);
        canvas.width = Math.round(video.videoWidth * scale);
        canvas.height = Math.round(video.videoHeight * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          cleanup();
          resolve(null);
          return;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        cleanup();
        resolve(dataUrl);
      } catch {
        cleanup();
        resolve(null);
      }
    });

    video.addEventListener('error', () => {
      clearTimeout(timeout);
      cleanup();
      resolve(null);
    });

    video.src = videoUrl;
  });
}

/**
 * 获取视频缩略图（Web 端实现）
 * - 使用 <video> + <canvas> 截取视频第 1 秒帧
 * - 返回 data: URL（可直接用作 Image source）
 * - 内存缓存，同 URL 不重复截取
 */
export async function getVideoThumbnail(videoUrl: string): Promise<string | null> {
  try {
    // 命中内存缓存
    const cached = memoryCache.get(videoUrl);
    if (cached) {
      return cached;
    }

    // 截取帧（1s 处）
    const dataUrl = await captureFrame(videoUrl, 1);
    if (dataUrl) {
      memoryCache.set(videoUrl, dataUrl);
    }

    return dataUrl;
  } catch (error) {
    console.warn('[thumbnailCache:web] 缩略图生成失败:', error);
    return null;
  }
}
