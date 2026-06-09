import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../theme';
import AuthModal from '../../components/AuthModal';

export default function MuscleEnhanceScreen() {
  const navigation = useNavigation();
  const [showAuth, setShowAuth] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const styles_list = [
    {
      key: 'lean',
      label: '精瘦型',
      desc: '低体脂、线条分明的肌肉形态',
      icon: 'trending-down',
      color: '#4ADE80',
    },
    {
      key: 'athletic',
      label: '运动型',
      desc: '匀称紧致的运动肌肉线条',
      icon: 'fitness',
      color: '#60A5FA',
    },
    {
      key: 'bodybuilder',
      label: '健美型',
      desc: '饱满立体的健美肌肉轮廓',
      icon: 'barbell',
      color: '#F59E0B',
    },
    {
      key: 'massive',
      label: '巨肌型',
      desc: '极致夸张的大块肌肉体态',
      icon: 'flash',
      color: '#EF4444',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>肌肉增强</Text>
          <Text style={styles.headerSub}>Muscle Enhancement</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.imageArea} activeOpacity={0.7}>
          <Ionicons name="camera" size={40} color={Colors.primary} />
          <Text style={styles.uploadText}>选择图片</Text>
          <Text style={styles.uploadSub}>从相册选取人物照片</Text>
        </TouchableOpacity>

        <View style={styles.descCard}>
          <Ionicons name="flash" size={24} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.descTitle}>AI 肌肉增强</Text>
            <Text style={styles.descText}>智能识别身体结构，一键增强肌肉线条与体积</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>肌肉风格</Text>
        <View style={styles.styleGrid}>
          {styles_list.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.styleItem,
                selectedStyle === item.key && {
                  borderColor: item.color,
                  backgroundColor: item.color + '15',
                },
              ]}
              onPress={() => setSelectedStyle(item.key)}
              activeOpacity={0.7}
            >
              <View style={[styles.styleIcon, { backgroundColor: item.color + '25' }]}>
                <Ionicons name={item.icon as any} size={28} color={item.color} />
              </View>
              <Text style={[
                styles.styleLabel,
                selectedStyle === item.key && { color: item.color },
              ]}>
                {item.label}
              </Text>
              <Text style={styles.styleDesc}>{item.desc}</Text>
              {selectedStyle === item.key && (
                <View style={[styles.selectedBadge, { backgroundColor: item.color }]}>
                  <Ionicons name="checkmark" size={12} color={Colors.text} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {selectedStyle && (
          <View style={styles.enhanceCard}>
            <Text style={styles.enhanceLabel}>增强强度</Text>
            <View style={styles.enhanceRow}>
              <Text style={styles.enhanceMin}>自然</Text>
              <View style={styles.enhanceTrack}>
                <View style={styles.enhanceFill} />
                <View style={styles.enhanceThumb} />
              </View>
              <Text style={styles.enhanceMax}>极致</Text>
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
  descCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.md, padding: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl, borderWidth: 1, borderColor: Colors.border },
  descTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  descText: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: Spacing.md },
  styleGrid: { gap: Spacing.md, marginBottom: Spacing.xl },
  styleItem: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.lg,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  styleIcon: {
    width: 52, height: 52, borderRadius: BorderRadius.md,
    justifyContent: 'center', alignItems: 'center',
  },
  styleLabel: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, flex: 1 },
  styleDesc: { fontSize: FontSize.xs, color: Colors.textMuted, position: 'absolute', left: 84, bottom: Spacing.lg },
  selectedBadge: {
    width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center',
  },
  enhanceCard: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing['2xl'],
  },
  enhanceLabel: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: Spacing.md },
  enhanceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  enhanceMin: { fontSize: FontSize.xs, color: Colors.textMuted },
  enhanceMax: { fontSize: FontSize.xs, color: Colors.textMuted },
  enhanceTrack: {
    flex: 1, height: 8, backgroundColor: Colors.border,
    borderRadius: 4, justifyContent: 'center',
  },
  enhanceFill: {
    width: '70%', height: 8, backgroundColor: Colors.primary,
    borderRadius: 4, position: 'absolute',
  },
  enhanceThumb: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.primary, position: 'absolute',
    left: '66%', shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 4,
    elevation: 4,
  },
  generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: BorderRadius.xl, paddingVertical: Spacing.base, ...Shadow.button },
  generateText: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text },
});
