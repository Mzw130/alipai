import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../theme';
import AuthModal from '../../components/AuthModal';

export default function HDRepairScreen() {
  const navigation = useNavigation();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>高清修复</Text>
          <Text style={styles.headerSub}>HD Restoration</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.imageArea} activeOpacity={0.7}>
          <Ionicons name="camera" size={40} color={Colors.primary} />
          <Text style={styles.uploadText}>选择图片</Text>
          <Text style={styles.uploadSub}>从相册选取素材</Text>
        </TouchableOpacity>
        <View style={styles.descCard}>
          <Text style={styles.descText}>超清放大，提升图片清晰度和细节表现</Text>
        </View>
        <View style={styles.toolRow}>
          {['重置', '绘图', '擦除'].map((name, i) => (
            <TouchableOpacity key={i} style={styles.toolBtn} activeOpacity={0.7}>
              <Ionicons name={['refresh','brush','eraser'][i] as any} size={20} color={Colors.textSecondary} />
              <Text style={styles.toolBtnText}>{name}</Text>
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
  descCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.md, padding: Spacing.lg, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  descText: { fontSize: FontSize.base, color: Colors.textSecondary, lineHeight: 22 },
  toolRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing['2xl'] },
  toolBtn: { flex: 1, backgroundColor: Colors.card, borderRadius: BorderRadius.md, padding: Spacing.lg, alignItems: 'center', gap: Spacing.xs, borderWidth: 1, borderColor: Colors.border },
  toolBtnText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: BorderRadius.xl, paddingVertical: Spacing.base, ...Shadow.button },
  generateText: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text },
});
