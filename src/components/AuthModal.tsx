import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../theme';

interface AuthModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function AuthModal({ visible, onDismiss }: AuthModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* 图标 */}
          <View style={styles.iconBox}>
            <Ionicons name="shield-checkmark" size={40} color={Colors.primary} />
          </View>

          {/* 标题 */}
          <Text style={styles.title}>AI 服务授权</Text>

          {/* 说明 */}
          <Text style={styles.description}>
            App 调用合规第三方 AI 服务，仅处理本次创作所需信息；点击继续代表知悉并授权。
          </Text>

          {/* 按钮 */}
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={onDismiss}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmText}>知道了</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['2xl'],
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius['2xl'],
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  confirmBtn: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    ...Shadow.button,
  },
  confirmText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
});
