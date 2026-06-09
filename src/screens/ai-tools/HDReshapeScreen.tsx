import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../theme';
import AuthModal from '../../components/AuthModal';

export default function HDReshapeScreen() {
  const navigation = useNavigation();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>重塑 / 比例调整</Text>
          <Text style={styles.headerSub}>Reshape & Scale</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.imageArea} activeOpacity={0.7}>
          <Ionicons name="camera" size={40} color={Colors.primary} />
          <Text style={styles.uploadText}>选择图片</Text>
          <Text style={styles.uploadSub}>从相册选取素材</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>塑形功能</Text>
        <View style={styles.toolGrid}>
          {['丰腿', '肌肉调整', '肌肉增强', 'AI纤臂塑形'].map((name, i) => (
            <TouchableOpacity key={i} style={styles.toolItem} activeOpacity={0.7}>
              <Ionicons name="body" size={24} color={Colors.primary} />
              <Text style={styles.toolName}>{name}</Text>
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
  toolGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing['2xl'] },
  toolItem: { width: '47%', backgroundColor: Colors.card, borderRadius: BorderRadius.md, padding: Spacing.lg, alignItems: 'center', gap: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  toolName: { fontSize: FontSize.sm, color: Colors.textSecondary },
  generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: BorderRadius.xl, paddingVertical: Spacing.base, ...Shadow.button },
  generateText: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text },
});
