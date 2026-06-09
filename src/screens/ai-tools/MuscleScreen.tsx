import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../theme';
import AuthModal from '../../components/AuthModal';

export default function MuscleScreen() {
  const navigation = useNavigation();
  const [showAuth, setShowAuth] = useState(false);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const muscleParts = [
    { key: 'abs', label: '腹肌', desc: '雕刻腹部肌肉线条', icon: 'fitness' },
    { key: 'chest', label: '胸肌', desc: '强化胸部肌肉轮廓', icon: 'body' },
    { key: 'arms', label: '手臂肌肉', desc: '增强手臂肌肉线条', icon: 'hand-left' },
    { key: 'shoulders', label: '肩部肌肉', desc: '塑造肩部肌肉形态', icon: 'shirt' },
    { key: 'back', label: '背部肌肉', desc: '刻画背部肌肉纹理', icon: 'swap-horizontal' },
    { key: 'legs_muscle', label: '腿部肌肉', desc: '定义腿部肌肉轮廓', icon: 'walk' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>肌肉</Text>
          <Text style={styles.headerSub}>Muscle Definition</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.imageArea} activeOpacity={0.7}>
          <Ionicons name="camera" size={40} color={Colors.primary} />
          <Text style={styles.uploadText}>选择图片</Text>
          <Text style={styles.uploadSub}>从相册选取人物照片</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>肌肉部位</Text>
        <View style={styles.muscleGrid}>
          {muscleParts.map((part) => (
            <TouchableOpacity
              key={part.key}
              style={[
                styles.muscleItem,
                selectedPart === part.key && styles.muscleItemSelected,
              ]}
              onPress={() => setSelectedPart(part.key)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.muscleIconCircle,
                selectedPart === part.key && styles.muscleIconCircleSelected,
              ]}>
                <Ionicons
                  name={part.icon as any}
                  size={22}
                  color={selectedPart === part.key ? Colors.text : '#EF4444'}
                />
              </View>
              <Text style={[
                styles.muscleLabel,
                selectedPart === part.key && styles.muscleLabelSelected,
              ]}>
                {part.label}
              </Text>
              <Text style={styles.muscleDesc}>{part.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedPart && (
          <View style={styles.controlCard}>
            <Text style={styles.controlLabel}>肌肉强度</Text>
            <View style={styles.controlRow}>
              <Text style={styles.controlMinMax}>弱</Text>
              <View style={styles.controlTrack}>
                <View style={styles.controlFill} />
                <View style={styles.controlThumb} />
              </View>
              <Text style={styles.controlMinMax}>强</Text>
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
  muscleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.xl },
  muscleItem: {
    width: '47%', backgroundColor: Colors.card, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, alignItems: 'center', gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  muscleItemSelected: { borderColor: '#EF4444', backgroundColor: '#1F1015' },
  muscleIconCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center',
  },
  muscleIconCircleSelected: { backgroundColor: '#EF4444' },
  muscleLabel: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  muscleLabelSelected: { color: '#EF4444' },
  muscleDesc: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
  controlCard: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing['2xl'],
  },
  controlLabel: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: Spacing.md },
  controlRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  controlMinMax: { fontSize: FontSize.xs, color: Colors.textMuted },
  controlTrack: {
    flex: 1, height: 8, backgroundColor: Colors.border,
    borderRadius: 4, justifyContent: 'center',
  },
  controlFill: {
    width: '50%', height: 8, backgroundColor: '#EF4444',
    borderRadius: 4, position: 'absolute',
  },
  controlThumb: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#EF4444', position: 'absolute',
    left: '46%', shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 4,
    elevation: 4,
  },
  generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: BorderRadius.xl, paddingVertical: Spacing.base, ...Shadow.button },
  generateText: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text },
});
