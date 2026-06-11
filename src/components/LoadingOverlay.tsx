/**
 * 加载进度覆盖层
 * 显示 AI 处理状态，可最小化到后台
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../theme';
import { useTaskContext } from '../store/TaskContext';

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

  useEffect(() => {
    if (activeTask && (activeTask.status === 'uploading' || activeTask.status === 'processing')) {
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    } else if (activeTask?.status === 'completed' || activeTask?.status === 'failed') {
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start();
        setTimeout(clearActiveTask, 600);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeTask?.status, activeTask?.id]);

  if (!activeTask) return null;

  const isRunning = activeTask.status === 'uploading' || activeTask.status === 'processing';
  const label = TOOL_LABELS[activeTask.toolType] || activeTask.toolType;
  const statusText = activeTask.status === 'uploading' ? '上传中...'
    : activeTask.status === 'processing' ? 'AI 处理中...'
    : activeTask.status === 'completed' ? '✅ 完成!'
    : '❌ 失败';

  if (minimized && isRunning) {
    return (
      <TouchableOpacity style={styles.miniBar} onPress={() => setMinimized(false)} activeOpacity={0.8}>
        <Ionicons name="sparkles" size={14} color={Colors.primary} />
        <Text style={styles.miniText}>{label} · 处理中</Text>
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

        <Text style={styles.statusText}>{statusText}</Text>

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
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  minimizeBtn: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.medium },
  statusText: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.xs },
  errorMsg: { fontSize: FontSize.xs, color: Colors.error, marginTop: Spacing.sm },
  hintMsg: { fontSize: FontSize.xs, color: Colors.success, marginTop: Spacing.sm },
  miniBar: {
    position: 'absolute', top: 60, left: Spacing.xl, right: Spacing.xl,
    backgroundColor: Colors.card, borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.primary + '40',
    zIndex: 9999,
  },
  miniText: { fontSize: FontSize.xs, color: Colors.text, flex: 1 },
  miniHint: { fontSize: FontSize.xs, color: Colors.textMuted },
});
