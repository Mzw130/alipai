/**
 * 全局 AI 任务管理器
 *
 * 功能:
 * - 跟踪所有后台 AI 任务
 * - 显示实时进度条
 * - 任务完成桌面通知
 * - 结果自动存入素材库
 * - 离开页面不中断任务
 */
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Alert, AppState, AppStateStatus } from 'react-native';
import { enhanceImage, getTaskStatus, EnhanceResult } from '../api/index';

// ==================== 类型 ====================
export interface AITask {
  id: string;
  toolType: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number;        // 0-100
  startTime: number;
  resultUrl?: string;
  originalUrl?: string;
  errorMessage?: string;
  processingTimeMs?: number;
  creditsUsed?: number;
  imageUri?: string;
}

interface TaskContextType {
  tasks: AITask[];
  activeTask: AITask | null;       // 当前界面显示的任务（有进度条）
  isProcessing: boolean;
  submitTask: (toolType: string, imageUri: string, params?: Record<string, any>) => Promise<string>;
  setActiveTask: (taskId: string | null) => void;
  clearActiveTask: () => void;
  pollTaskStatus: (taskId: string) => Promise<EnhanceResult | null>;
}

const TaskContext = createContext<TaskContextType | null>(null);

export function useTaskContext() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used within TaskProvider');
  return ctx;
}

// ==================== Provider ====================
export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<AITask[]>([]);
  const [activeTask, setActiveTaskState] = useState<AITask | null>(null);
  const tasksRef = useRef<AITask[]>([]);
  const pollingRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const appStateRef = useRef<AppStateStatus>('active');

  // 更新任务列表
  const updateTask = useCallback((taskId: string, updates: Partial<AITask>) => {
    setTasks(prev => {
      const idx = prev.findIndex(t => t.id === taskId);
      if (idx === -1) {
        const newTask: AITask = {
          id: taskId,
          toolType: updates.toolType || '',
          status: updates.status || 'processing',
          progress: updates.progress || 0,
          startTime: updates.startTime || Date.now(),
          ...updates,
        };
        return [...prev, newTask];
      }
      const updated = [...prev];
      updated[idx] = { ...updated[idx], ...updates };
      return updated;
    });

    // 同步更新 activeTask
    setActiveTaskState(prev => {
      if (prev?.id === taskId) {
        return prev ? { ...prev, ...updates } : null;
      }
      return prev;
    });
  }, []);

  // 轮询异步任务
  const pollTask = useCallback(async (taskId: string, toolType: string) => {
    const maxAttempts = 200; // 最多轮询约 6.6 分钟（后端最多 5 分钟）
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        updateTask(taskId, { status: 'failed', errorMessage: '任务超时' });
        pollingRef.current.delete(taskId);
        return;
      }
      attempts++;

      try {
        const result = await getTaskStatus(taskId);
        if (!result) {
          // 结果为空，继续轮询
          pollingRef.current.set(taskId, setTimeout(poll, 2000));
          return;
        }

        if (result.status === 'completed') {
          updateTask(taskId, {
            status: 'completed',
            resultUrl: result.result_url ?? undefined,
            processingTimeMs: (result as any).processing_time_ms,
            creditsUsed: (result as any).credits_used,
          });
          pollingRef.current.delete(taskId);

          // 弹窗通知
          if (appStateRef.current !== 'active') {
            Alert.alert('✨ AI 处理完成', `${toolType} 任务已完成，结果已保存到素材库`);
          }
        } else if (result.status === 'failed') {
          updateTask(taskId, {
            status: 'failed',
            errorMessage: result.error_message || '处理失败',
          });
          pollingRef.current.delete(taskId);
        } else {
          // 仍为 processing / queued / running → 继续
          pollingRef.current.set(taskId, setTimeout(poll, 2000));
        }
      } catch {
        // 网络错误不中断轮询
        pollingRef.current.set(taskId, setTimeout(poll, 2000));
      }
    };

    pollingRef.current.set(taskId, setTimeout(poll, 1000));
  }, [updateTask]);

  // 提交任务
  const submitTask = useCallback(async (
    toolType: string,
    imageUri: string,
    params?: Record<string, any>,
  ): Promise<string> => {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // 创建本地任务记录
    const newTask: AITask = {
      id: taskId,
      toolType,
      status: 'uploading',
      progress: 0,
      startTime: Date.now(),
      imageUri,
    };

    setTasks(prev => [...prev, newTask]);
    setActiveTaskState(newTask);
    tasksRef.current = [...tasksRef.current, newTask];

    try {
      // 上传中
      updateTask(taskId, {});

      const result = await enhanceImage({
        toolType,
        imageUri,
        params: params || {},
      });

      if (!result) {
        updateTask(taskId, { status: 'failed', errorMessage: '网络错误' });
        return taskId;
      }

      if (result.status === 'processing') {
        // 异步任务 — 开始轮询
        updateTask(taskId, { status: 'processing' });
        pollTask(result.task_id, toolType);
        return taskId;
      }

      // 同步完成
      updateTask(taskId, {
        status: 'completed',
        resultUrl: result.result_url,
        processingTimeMs: result.processing_time_ms,
        creditsUsed: result.credits_used,
      });

      return taskId;
    } catch (e: any) {
      updateTask(taskId, { status: 'failed', errorMessage: e.message });
      return taskId;
    }
  }, [updateTask, pollTask]);

  const setActiveTask = useCallback((taskId: string | null) => {
    if (!taskId) {
      setActiveTaskState(null);
      return;
    }
    const task = tasks.find(t => t.id === taskId) || tasksRef.current.find(t => t.id === taskId);
    if (task) setActiveTaskState(task);
  }, [tasks]);

  const clearActiveTask = useCallback(() => setActiveTaskState(null), []);

  // 清理
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      appStateRef.current = state;
    });
    return () => {
      sub.remove();
      pollingRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  const isProcessing = activeTask?.status === 'uploading' || activeTask?.status === 'processing';

  return (
    <TaskContext.Provider value={{
      tasks,
      activeTask,
      isProcessing,
      submitTask,
      setActiveTask,
      clearActiveTask,
      pollTaskStatus: pollTaskStatus,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

async function pollTaskStatus(taskId: string): Promise<EnhanceResult | null> {
  try {
    const res = await getTaskStatus(taskId);
    if (!res) return null;
    return {
      task_id: res.task_id,
      status: res.status as 'processing' | 'completed' | 'failed',
      result_url: res.result_url ?? undefined,
      error_message: res.error_message ?? undefined,
    };
  } catch { return null; }
}
