import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../theme';
import AuthModal from '../../components/AuthModal';

const HAIR_COLORS = [
  { name: 'Pink', color: '#FF69B4' },
  { name: 'Red', color: '#FF4444' },
  { name: 'Gold', color: '#FFD700' },
  { name: 'Brown', color: '#8B4513' },
];

export default function HairDyeScreen() {
  const navigation = useNavigation();
  const [showAuth, setShowAuth] = useState(false);
  const [selectedColor, setSelectedColor] = useState('Pink');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>染发</Text>
          <Text style={styles.headerSub}>Hair Dye</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.imageArea} activeOpacity={0.7}>
          <Ionicons name="camera" size={40} color={Colors.primary} />
          <Text style={styles.uploadText}>上传图片</Text>
          <Text style={styles.uploadSub}>从相册选取照片</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>选择发色</Text>
        <View style={styles.colorRow}>
          {HAIR_COLORS.map((c) => (
            <TouchableOpacity
              key={c.name}
              style={[styles.colorItem, selectedColor === c.name && styles.colorItemActive]}
              onPress={() => setSelectedColor(c.name)}
              activeOpacity={0.7}
            >
              <View style={[styles.colorDot, { backgroundColor: c.color }]} />
              <Text style={[styles.colorName, selectedColor === c.name && styles.colorNameActive]}>
                {c.name}
              </Text>
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
  colorRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing['2xl'] },
  colorItem: { flex: 1, backgroundColor: Colors.card, borderRadius: BorderRadius.md, padding: Spacing.md, alignItems: 'center', gap: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  colorItemActive: { borderColor: Colors.primary },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  colorName: { fontSize: FontSize.xs, color: Colors.textMuted },
  colorNameActive: { color: Colors.primary, fontWeight: FontWeight.semibold },
  generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: BorderRadius.xl, paddingVertical: Spacing.base, ...Shadow.button },
  generateText: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text },
});
