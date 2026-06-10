import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../theme';
import { useAiTool } from '../../hooks/useAiTool';

export default function BeautyScreen() {
  const navigation = useNavigation();
  const { selectedImage, isProcessing, result, error, pickImage, takePhoto, generate, clear } = useAiTool('beauty');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>美颜</Text>
          <Text style={styles.headerSub}>Face Beauty</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {/* 选图区 */}
        {!selectedImage ? (
          <TouchableOpacity style={styles.imageArea} onPress={pickImage} activeOpacity={0.7}>
            <Ionicons name="camera" size={40} color={Colors.primary} />
            <Text style={styles.uploadText}>选择图片</Text>
            <Text style={styles.uploadSub}>从相册选取或拍照</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.previewWrap}>
            <Image source={{ uri: selectedImage }} style={styles.preview} />
            <View style={styles.previewActions}>
              <TouchableOpacity style={styles.actionBtn} onPress={pickImage} activeOpacity={0.7}>
                <Ionicons name="swap-horizontal" size={16} color={Colors.text} />
                <Text style={styles.actionText}>换图</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={takePhoto} activeOpacity={0.7}>
                <Ionicons name="camera" size={16} color={Colors.text} />
                <Text style={styles.actionText}>拍照</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={clear} activeOpacity={0.7}>
                <Ionicons name="trash" size={16} color={Colors.error} />
                <Text style={[styles.actionText, { color: Colors.error }]}>移除</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 结果 */}
        {result?.status === 'completed' && result.result_url && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>✨ 处理完成</Text>
            <Image source={{ uri: result.result_url }} style={styles.resultImage} />
            <Text style={styles.resultMeta}>耗时: {result.processing_time_ms}ms | 积分: {result.credits_used}</Text>
          </View>
        )}

        {/* 错误 */}
        {error && (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle" size={18} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* 描述 */}
        {!result && (
          <View style={styles.descCard}>
            <Ionicons name="happy" size={24} color={Colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.descTitle}>美颜</Text>
              <Text style={styles.descText}>AI 智能美颜，自然磨皮美白</Text>
            </View>
          </View>
        )}

        {/* 生成按钮 */}
        <TouchableOpacity
          style={[styles.generateBtn, (!selectedImage || isProcessing) && styles.generateBtnDisabled]}
          onPress={() => generate()}
          disabled={!selectedImage || isProcessing}
          activeOpacity={0.8}
        >
          <Ionicons name="color-wand" size={20} color={Colors.text} />
          <Text style={styles.generateText}>{isProcessing ? '处理中...' : '生成'}</Text>
        </TouchableOpacity>
      </ScrollView>
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
  previewWrap: { marginBottom: Spacing.xl },
  preview: { width: '100%', aspectRatio: 1, borderRadius: BorderRadius.lg, backgroundColor: Colors.card },
  previewActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.card, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md },
  actionText: { fontSize: FontSize.xs, color: Colors.text },
  resultCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.xl, borderWidth: 1, borderColor: Colors.success + '40' },
  resultTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.success, marginBottom: Spacing.md },
  resultImage: { width: '100%', aspectRatio: 1, borderRadius: BorderRadius.md, backgroundColor: Colors.cardLight },
  resultMeta: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.sm, textAlign: 'center' },
  errorCard: { backgroundColor: Colors.error + '15', borderRadius: BorderRadius.md, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xl },
  errorText: { fontSize: FontSize.sm, color: Colors.error, flex: 1 },
  descCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.md, padding: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing['2xl'], borderWidth: 1, borderColor: Colors.border },
  descTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  descText: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: BorderRadius.xl, paddingVertical: Spacing.base, ...Shadow.button },
  generateBtnDisabled: { opacity: 0.5 },
  generateText: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text },
});
