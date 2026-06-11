/**
 * AI 工具共享 Hook — 图片选择 + 图片校验 + 全局任务管理集成
 */
import { useState, useCallback } from 'react';
import { Platform, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTaskContext } from '../store/TaskContext';
import { setAuthToken } from '../api/index';

const DEV_PHONE = '13800138000';
const DEV_CODE = '123456';
const API_BASE = 'http://localhost:3000/api/v1';

// 图片限制（根据 Seedance API 官方文档）
// 格式: jpeg, png, webp, bmp, tiff, gif, heic, heif
// 宽高比(宽/高): (0.4, 2.5)
// 宽高像素: [300, 6000]
// 大小: 单张 < 30MB, 请求体 < 64MB (Base64 约膨胀 33%)
const MIN_WIDTH = 300;
const MIN_HEIGHT = 300;
const MAX_WIDTH = 6000;
const MAX_HEIGHT = 6000;
const MIN_ASPECT_RATIO = 0.4;
const MAX_ASPECT_RATIO = 2.5;
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

let autoLoginPromise: Promise<string | null> | null = null;

async function autoLogin(): Promise<string | null> {
  if (autoLoginPromise) return autoLoginPromise;
  autoLoginPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: DEV_PHONE, code: DEV_CODE }),
      });
      const json = await res.json();
      if (json.code === 0 && json.data?.token) {
        setAuthToken(json.data.token);
        return json.data.token;
      }
      return null;
    } catch { return null; }
  })();
  return autoLoginPromise;
}

/** 校验图片：尺寸 + 宽高比 + 文件大小，返回错误信息或 null */
async function validateImage(uri: string): Promise<string | null> {
  // 1. 检查文件大小（fetch HEAD 或从 picker 结果获取）
  try {
    const response = await fetch(uri, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      const size = parseInt(contentLength, 10);
      if (size > MAX_FILE_SIZE_BYTES) {
        return `图片过大 (${(size / 1024 / 1024).toFixed(1)}MB)，请选择 20MB 以内的图片`;
      }
    }
  } catch {
    // HEAD 请求失败不阻塞
  }

  // 2. 检查尺寸 + 宽高比
  return new Promise((resolve) => {
    Image.getSize(
      uri,
      (width, height) => {
        if (width < MIN_WIDTH || height < MIN_HEIGHT) {
          resolve(`图片尺寸过小 (${width}x${height})，至少需要 ${MIN_WIDTH}x${MIN_HEIGHT} 像素`);
          return;
        }
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          resolve(`图片尺寸过大 (${width}x${height})，最大支持 ${MAX_WIDTH}x${MAX_HEIGHT} 像素`);
          return;
        }
        const aspectRatio = width / height;
        if (aspectRatio < MIN_ASPECT_RATIO || aspectRatio > MAX_ASPECT_RATIO) {
          resolve(`图片宽高比不满足要求 (${aspectRatio.toFixed(2)})，需在 ${MIN_ASPECT_RATIO}~${MAX_ASPECT_RATIO} 之间`);
          return;
        }
        resolve(null);
      },
      () => resolve(null), // 获取尺寸失败不阻塞
    );
  });
}

export function useAiTool(toolType: string) {
  const { submitTask, activeTask, isProcessing } = useTaskContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<{ width: number; height: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  const pickImage = useCallback(async () => {
    setError(null);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { setError('需要相册权限'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      // 优先使用 picker 返回的尺寸，否则异步获取
      if (asset.width && asset.height) {
        const w = asset.width, h = asset.height;
        // 尺寸范围检查 (API 要求 300~6000px)
        if (w < MIN_WIDTH || h < MIN_HEIGHT) {
          setError(`图片尺寸过小 (${w}x${h})，至少需要 ${MIN_WIDTH}x${MIN_HEIGHT} 像素`);
          return;
        }
        if (w > MAX_WIDTH || h > MAX_HEIGHT) {
          setError(`图片尺寸过大 (${w}x${h})，最大支持 ${MAX_WIDTH}x${MAX_HEIGHT} 像素`);
          return;
        }
        // 宽高比检查 (API 要求 0.4~2.5)
        const aspectRatio = w / h;
        if (aspectRatio < MIN_ASPECT_RATIO || aspectRatio > MAX_ASPECT_RATIO) {
          setError(`图片宽高比不满足要求 (${aspectRatio.toFixed(2)})，需在 ${MIN_ASPECT_RATIO}~${MAX_ASPECT_RATIO} 之间`);
          return;
        }
        setImageInfo({ width: w, height: h });
      } else {
        const validationError = await validateImage(asset.uri);
        if (validationError) { setError(validationError); return; }
      }
      // 文件大小校验
      if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE_BYTES) {
        setError(`图片过大 (${(asset.fileSize / 1024 / 1024).toFixed(1)}MB)，请选择 20MB 以内的图片`);
        return;
      }
      setSelectedImage(asset.uri);
    }
  }, []);

  const takePhoto = useCallback(async () => {
    setError(null);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { setError('需要相机权限'); return; }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false, quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset.width && asset.height) {
        if (asset.width < MIN_WIDTH || asset.height < MIN_HEIGHT) {
          setError(`图片尺寸过小 (${asset.width}x${asset.height})，至少需要 ${MIN_WIDTH}x${MIN_HEIGHT} 像素`);
          return;
        }
        setImageInfo({ width: asset.width, height: asset.height });
      } else {
        const validationError = await validateImage(asset.uri);
        if (validationError) { setError(validationError); return; }
      }
      if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE_BYTES) {
        setError(`图片过大 (${(asset.fileSize / 1024 / 1024).toFixed(1)}MB)，请选择 20MB 以内的图片`);
        return;
      }
      setSelectedImage(asset.uri);
    }
  }, []);

  const generate = useCallback(async (params?: Record<string, any>) => {
    if (!selectedImage) { setError('请先选择图片'); return; }
    setError(null);
    await autoLogin();
    const taskId = await submitTask(toolType, selectedImage, params);
    setCurrentTaskId(taskId);
  }, [selectedImage, toolType, submitTask]);

  const clear = useCallback(() => {
    setSelectedImage(null);
    setImageInfo(null);
    setError(null);
    setCurrentTaskId(null);
  }, []);

  const setImage = useCallback((uri: string) => {
    setSelectedImage(uri);
    setError(null);
  }, []);

  // 当前任务状态
  const currentTask = currentTaskId && activeTask?.id === currentTaskId ? activeTask : null;
  const isCurrentProcessing = currentTask?.status === 'uploading' || currentTask?.status === 'processing';
  const resultUrl = currentTask?.status === 'completed' ? currentTask.resultUrl : undefined;
  const taskError = currentTask?.status === 'failed' ? (currentTask.errorMessage || '处理失败') : null;

  // 兼容旧版 result 对象
  const result = currentTask?.status === 'completed' ? {
    status: 'completed' as const,
    result_url: currentTask.resultUrl,
    resultUri: currentTask.resultUrl,
    processing_time_ms: currentTask.processingTimeMs,
    credits_used: currentTask.creditsUsed,
  } : null;

  return {
    selectedImage,
    imageInfo,
    isProcessing: isCurrentProcessing,
    resultUrl,
    result,
    error,
    taskError,
    currentTask,
    pickImage,
    takePhoto,
    generate,
    clear,
    setSelectedImage: setImage,
  };
}
