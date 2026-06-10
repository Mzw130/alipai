/**
 * AI 工具共享 Hook — 图片选择 + 全局任务管理集成
 */
import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useTaskContext } from '../store/TaskContext';
import { setAuthToken } from '../api/index';

const DEV_PHONE = '13800138000';
const DEV_CODE = '123456';
const API_BASE = 'http://localhost:3000/api/v1';

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

export function useAiTool(toolType: string) {
  const { submitTask, activeTask, isProcessing } = useTaskContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  const pickImage = useCallback(async () => {
    setError(null);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { setError('需要相册权限'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, quality: 0.9,
    });
    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  }, []);

  const takePhoto = useCallback(async () => {
    setError(null);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { setError('需要相机权限'); return; }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, quality: 0.9,
    });
    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
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
    setSelectedImage(null); setError(null); setCurrentTaskId(null);
  }, []);

  // 当前任务状态
  const currentTask = currentTaskId && activeTask?.id === currentTaskId ? activeTask : null;
  const isCurrentProcessing = currentTask?.status === 'uploading' || currentTask?.status === 'processing';
  const resultUrl = currentTask?.status === 'completed' ? currentTask.resultUrl : undefined;

  // 兼容旧版 result 对象
  const result = currentTask?.status === 'completed' ? {
    status: 'completed' as const,
    result_url: currentTask.resultUrl,
    resultUri: currentTask.resultUrl,
    processing_time_ms: currentTask.processingTimeMs,
    credits_used: currentTask.creditsUsed,
  } : null;

  return {
    selectedImage, isProcessing: isCurrentProcessing,
    resultUrl, result, error, currentTask,
    pickImage, takePhoto, generate, clear,
  };
}
