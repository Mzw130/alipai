/**
 * 加载进度覆盖层
 * 显示 AI 处理进度条，可最小化到后台
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../theme';
import { useTaskContext, AITask } from '../store/TaskContext';

const TOOL_LABELS: Record<string, string> = {
  reshape: '重塑', hd_repair: '高清修复', obj_remove: '物体消除',
  bg_remove: '背景移除', super_realistic: '超级写实', hair_dye: '染发',
  lip_plump: '丰唇', jawline: '下颌轮廓', hair_smooth: '发质顺滑',
  hair_repair: '发质修复', proportion: '比例调整', leg_enhance: '丰腿',
  muscle: '肌肉', muscle_enhance: '肌肉增强', ai_edit: 'AI编辑',
  beauty: '美颜', color_grade: '调色', filter: '滤镜',
  video_generate: '图生视频',
};

export default function LoadingOverlay() {
  const { activeTask, clearActiveTask } = useTaskContext();
  const [minimized, setMinimized] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (activeTask && (activeTask.status === 'uploading' || activeTask.status === 'processing')) {
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    } else if (activeTask?.status === 'completed' || activeTask?.status === 'failed') {
      // 自动隐藏完成/失败任务
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start();
        setTimeout(clearActiveTask, 600);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeTask?.status, activeTask?.id]);

  useEffect(() => {
    if (activeTask) {
      Animated.timing(progressAnim, {
        toValue: activeTask.progress / 100,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }
  }, [activeTask?.progress]);

  if (!activeTask) return null;

  const isRunning = activeTask.status === 'uploading' || activeTask.status === 'processing';
  const label = TOOL_LABELS[activeTask.toolType] || activeTask.toolType;
  const statusText = activeTask.status === 'uploading' ? '上传中...'
    : activeTask.status === 'processing' ? 'AI 处理中...'
    : activeTask.status === 'completed' ? '✅ 完成!'
    : '❌ 失败';

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  if (minimized && isRunning) {
    return (
      <TouchableOpacity style={styles.miniBar} onPress={() => setMinimized(false)} activeOpacity={0.8}>
        <Animated.View style={[styles.miniProgress, { width: progressWidth as any }]} />
        <Ionicons name="sparkles" size={14} color={Colors.primary} />
        <Text style={styles.miniText}>{label} {activeTask.progress}%</Text>
        <Text style={styles.miniHint}>点击查看</Text>
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={{flexDirection:'row',alignItems:'center',gap:Spacing.sm}}>
            <Ionicons name="sparkles" size={20} color={Colors.primary} />
            <Text style={styles.title}>{label}</Text>
          </View>
          {isRunning && (
            <TouchableOpacity onPress={() => setMinimized(true)}>
              <Text style={styles.minimizeBtn}>最小化</Text>
            </TouchableOpacity>
          )}
          {!isRunning && (
            <TouchableOpacity onPress={clearActiveTask}>
              <Ionicons name="close" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* 进度条 */}
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, {
            width: progressWidth as any,
            backgroundColor: activeTask.status === 'failed' ? Colors.error
              : activeTask.status === 'completed' ? Colors.success
              : Colors.primary,
          }]} />
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.statusText}>{statusText}</Text>
          <Text style={styles.progressText}>{activeTask.progress}%</Text>
        </View>

        {activeTask.errorMessage && (
          <Text style={styles.errorMsg}>{activeTask.errorMessage}</Text>
        )}

        {activeTask.status === 'completed' && (
          <Text style={styles.hintMsg}>结果已自动保存到素材库</Text>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', bottom: 120, left: Spacing.xl, right: Spacing.xl,
    zIndex: 9999,
  },
  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    ...Shadow.card,
  },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  minimizeBtn: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.medium },
  progressBar: {
    height: 6, backgroundColor: Colors.border,
    borderRadius: 3, overflow: 'hidden', marginBottom: Spacing.sm,
  },
  progressFill: { height: 6, borderRadius: 3 },
  statusRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  statusText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  progressText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: FontWeight.medium },
  errorMsg: { fontSize: FontSize.xs, color: Colors.error, marginTop: Spacing.sm },
  hintMsg: { fontSize: FontSize.xs, color: Colors.success, marginTop: Spacing.sm },
  // 最小化
  miniBar: {
    position: 'absolute', top: 60, left: Spacing.xl, right: Spacing.xl,
    backgroundColor: '#1A1A2E', borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.primary + '40',
    zIndex: 9999, overflow: 'hidden',
  },
  miniProgress: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    backgroundColor: Colors.primary + '20',
  },
  miniText: { fontSize: FontSize.xs, color: Colors.text, flex: 1 },
  miniHint: { fontSize: FontSize.xs, color: Colors.textMuted },
});
