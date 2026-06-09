import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../theme';
import AuthModal from '../../components/AuthModal';

export default function ProportionScreen() {
  const navigation = useNavigation();
  const [showAuth, setShowAuth] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState<string | null>(null);

  const ratios = [
    { key: 'head_body', label: '头身比', desc: '优化头部与身体比例', icon: 'body' },
    { key: 'waist_hip', label: '腰臀比', desc: '调整腰臀曲线比例', icon: 'resize' },
    { key: 'leg_body', label: '腿身比', desc: '拉长腿部视觉比例', icon: 'walk' },
    { key: 'shoulder', label: '肩宽比', desc: '优化肩部宽度比例', icon: 'shirt' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>比例调整</Text>
          <Text style={styles.headerSub}>Proportion Adjustment</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.imageArea} activeOpacity={0.7}>
          <Ionicons name="camera" size={40} color={Colors.primary} />
          <Text style={styles.uploadText}>选择图片</Text>
          <Text style={styles.uploadSub}>从相册选取人物照片</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>比例调节项</Text>
        <View style={styles.ratioGrid}>
          {ratios.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.ratioItem,
                selectedRatio === item.key && styles.ratioItemSelected,
              ]}
              onPress={() => setSelectedRatio(item.key)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.ratioIconCircle,
                selectedRatio === item.key && styles.ratioIconCircleSelected,
              ]}>
                <Ionicons
                  name={item.icon as any}
                  size={28}
                  color={selectedRatio === item.key ? Colors.text : Colors.primary}
                />
              </View>
              <Text style={[
                styles.ratioLabel,
                selectedRatio === item.key && styles.ratioLabelSelected,
              ]}>
                {item.label}
              </Text>
              <Text style={styles.ratioDesc}>{item.desc}</Text>
              {selectedRatio === item.key && (
                <View style={styles.sliderPlaceholder}>
                  <View style={styles.sliderTrack}>
                    <View style={styles.sliderFill} />
                    <View style={styles.sliderThumb} />
                  </View>
                  <Text style={styles.sliderValue}>50%</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

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
  ratioGrid: { gap: Spacing.md, marginBottom: Spacing['2xl'] },
  ratioItem: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border,
  },
  ratioItemSelected: { borderColor: Colors.primary, backgroundColor: '#1A1530' },
  ratioIconCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  ratioIconCircleSelected: { backgroundColor: Colors.primary },
  ratioLabel: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: 2 },
  ratioLabelSelected: { color: Colors.primary },
  ratioDesc: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: Spacing.sm },
  sliderPlaceholder: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.bg, borderRadius: BorderRadius.md, padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  sliderTrack: {
    flex: 1, height: 6, backgroundColor: Colors.border,
    borderRadius: 3, justifyContent: 'center',
  },
  sliderFill: {
    width: '50%', height: 6, backgroundColor: Colors.primary,
    borderRadius: 3, position: 'absolute',
  },
  sliderThumb: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.primary, position: 'absolute',
    left: '46%', shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 4,
    elevation: 4,
  },
  sliderValue: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold, width: 40, textAlign: 'right' },
  generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: BorderRadius.xl, paddingVertical: Spacing.base, ...Shadow.button },
  generateText: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text },
});
