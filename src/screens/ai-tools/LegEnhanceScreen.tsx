import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../theme';
import AuthModal from '../../components/AuthModal';

export default function LegEnhanceScreen() {
  const navigation = useNavigation();
  const [showAuth, setShowAuth] = useState(false);
  const [activeMode, setActiveMode] = useState<string | null>(null);

  const modes = [
    { key: 'slim_leg', label: '瘦腿', desc: 'AI 智能瘦腿塑形', icon: 'trending-down' },
    { key: 'long_leg', label: '长腿', desc: '拉伸腿部线条比例', icon: 'trending-up' },
    { key: 'plump_leg', label: '丰腿', desc: '自然丰盈腿部曲线', icon: 'add-circle' },
    { key: 'leg_shape', label: '腿型矫正', desc: '矫正X/O型腿线条', icon: 'git-compare' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>丰腿</Text>
          <Text style={styles.headerSub}>Leg Enhancement</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.imageArea} activeOpacity={0.7}>
          <Ionicons name="camera" size={40} color={Colors.primary} />
          <Text style={styles.uploadText}>选择图片</Text>
          <Text style={styles.uploadSub}>从相册选取全身照片</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>腿部塑形</Text>
        <View style={styles.modeGrid}>
          {modes.map((mode) => (
            <TouchableOpacity
              key={mode.key}
              style={[
                styles.modeItem,
                activeMode === mode.key && styles.modeItemActive,
              ]}
              onPress={() => setActiveMode(mode.key)}
              activeOpacity={0.7}
            >
              <View style={styles.modeIconRow}>
                <View style={[
                  styles.modeIconBox,
                  activeMode === mode.key && styles.modeIconBoxActive,
                ]}>
                  <Ionicons
                    name={mode.icon as any}
                    size={26}
                    color={activeMode === mode.key ? Colors.text : Colors.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[
                    styles.modeLabel,
                    activeMode === mode.key && styles.modeLabelActive,
                  ]}>
                    {mode.label}
                  </Text>
                  <Text style={styles.modeDesc}>{mode.desc}</Text>
                </View>
                {activeMode === mode.key && (
                  <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {activeMode && (
          <View style={styles.intensityCard}>
            <Text style={styles.intensityLabel}>调整强度</Text>
            <View style={styles.intensityRow}>
              <Text style={styles.intensityText}>轻微</Text>
              <View style={styles.intensityTrack}>
                <View style={styles.intensityFill} />
                <View style={styles.intensityThumb} />
              </View>
              <Text style={styles.intensityText}>强烈</Text>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.generateBtn} onPress={() => setShowAuth(true)} activeOpacity={0.8}>
          <Ionicons name="color-wand" size={20} color={Colors.text} />
          <Text style={styles.generateText}>生成</Text>
        </TouchableOpacity>
      </ScrollView>
      <AuthModal visible={showAuth} onDismiss={() => setShowAuth(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  headerSub: { fontSize: FontSize.xs, color: Colors.textMuted },
  content: { padding: Spacing.xl, paddingBottom: 100 },
  imageArea: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing['2xl'], alignItems: 'center', gap: Spacing.sm, borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed', marginBottom: Spacing.xl },
  uploadText: { fontSize: FontSize.md, color: Colors.primary, fontWeight: FontWeight.medium },
  uploadSub: { fontSize: FontSize.sm, color: Colors.textMuted },
  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: Spacing.md },
  modeGrid: { gap: Spacing.md, marginBottom: Spacing.xl },
  modeItem: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border,
  },
  modeItemActive: { borderColor: '#F59E0B', backgroundColor: '#1F1A10' },
  modeIconRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  modeIconBox: {
    width: 48, height: 48, borderRadius: BorderRadius.md,
    backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center',
  },
  modeIconBoxActive: { backgroundColor: '#F59E0B' },
  modeLabel: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: 2 },
  modeLabelActive: { color: '#F59E0B' },
  modeDesc: { fontSize: FontSize.xs, color: Colors.textMuted },
  intensityCard: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing['2xl'],
  },
  intensityLabel: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: Spacing.md },
  intensityRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  intensityText: { fontSize: FontSize.xs, color: Colors.textMuted },
  intensityTrack: {
    flex: 1, height: 8, backgroundColor: Colors.border,
    borderRadius: 4, justifyContent: 'center',
  },
  intensityFill: {
    width: '60%', height: 8, backgroundColor: '#F59E0B',
    borderRadius: 4, position: 'absolute',
  },
  intensityThumb: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#F59E0B', position: 'absolute',
    left: '56%', shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 4,
    elevation: 4,
  },
  generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: BorderRadius.xl, paddingVertical: Spacing.base, ...Shadow.button },
  generateText: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text },
});
