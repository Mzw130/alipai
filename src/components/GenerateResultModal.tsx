import React from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableOpacity, Image, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';

const { width: SCREEN_W } = Dimensions.get('window');

interface GenerateResultModalProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  resultUrl?: string;
  beforeLabel?: string;
  afterLabel?: string;
  onClose: () => void;
  onSave?: () => void;
}

export default function GenerateResultModal({
  visible,
  title,
  subtitle,
  resultUrl,
  beforeLabel = '处理前',
  afterLabel = '处理后',
  onClose,
  onSave,
}: GenerateResultModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color={Colors.text} />
          </TouchableOpacity>

          {resultUrl ? (
            <View style={styles.imageWrap}>
              <Image source={{ uri: resultUrl }} style={styles.image} resizeMode="cover" />
              <View style={styles.tagBefore}>
                <Text style={styles.tagBeforeText}>{beforeLabel}</Text>
              </View>
              <View style={styles.tagAfter}>
                <Text style={styles.tagAfterText}>{afterLabel}</Text>
              </View>
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.95)']}
                style={styles.imageFade}
              >
                <Ionicons name="scan-outline" size={28} color="#fff" />
                <Text style={styles.resultTitle}>{title}</Text>
                {subtitle && <Text style={styles.resultSub}>{subtitle}</Text>}
              </LinearGradient>
            </View>
          ) : (
            <View style={styles.loadingWrap}>
              <Ionicons name="sparkles" size={40} color={Colors.primary} />
              <Text style={styles.loadingText}>处理中...</Text>
            </View>
          )}

          <TouchableOpacity activeOpacity={0.85} onPress={onSave || onClose} style={styles.actionWrap}>
            <LinearGradient
              colors={[Colors.generateGradientStart, Colors.generateGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionBtn}
            >
              <Text style={styles.actionText}>{resultUrl ? '保存到素材库' : '知道了'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    paddingBottom: Spacing.xl,
  },
  closeBtn: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrap: {
    width: '100%',
    height: SCREEN_W * 1.1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  tagBefore: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  tagBeforeText: {
    color: '#fff',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  tagAfter: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  tagAfterText: {
    color: Colors.text,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  imageFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: Spacing.lg,
    gap: 4,
  },
  resultTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  resultSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  loadingWrap: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  actionWrap: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  actionBtn: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
});
