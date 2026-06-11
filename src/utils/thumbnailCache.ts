import * as VideoThumbnails from 'expo-video-thumbnails';
import * as FileSystem from 'expo-file-system';

const CACHE_DIR = `${FileSystem.cacheDirectory}video-thumbnails/`;

/**
 * 简单字符串哈希（无需外部依赖）
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

/**
 * 获取视频缩略图（带文件系统缓存）
 * - 取视频第 1 秒帧，避免首帧黑屏
 * - 缓存到 FileSystem.cacheDirectory，重复访问秒加载
 * - 失败返回 null，调用方可显示占位图
 */
export async function getVideoThumbnail(videoUrl: string): Promise<string | null> {
  try {
    // 确保缓存目录存在
    const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
    }

    const cacheKey = hashString(videoUrl);
    const cachePath = `${CACHE_DIR}${cacheKey}.jpg`;

    // 命中缓存直接返回
    const fileInfo = await FileSystem.getInfoAsync(cachePath);
    if (fileInfo.exists) {
      return cachePath;
    }

    // 生成缩略图（1s 处取帧）
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUrl, {
      time: 1000,
    });

    // 复制到缓存目录（临时目录可能被系统清理）
    await FileSystem.copyAsync({ from: uri, to: cachePath });

    return cachePath;
  } catch (error) {
    console.warn('[thumbnailCache] 缩略图生成失败:', error);
    return null;
  }
}
