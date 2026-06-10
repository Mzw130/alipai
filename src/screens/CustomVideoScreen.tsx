import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Image, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../theme';
import { useAiTool } from '../hooks/useAiTool';

const MODES = ['超级', '自定义'];
const TEMPLATES = [
  { id: '1', name: 'Flower Gift', prompt: 'Flower Gift 风格视频' },
  { id: '2', name: 'Skirt Twirl', prompt: 'Skirt Twirl 风格视频' },
  { id: '3', name: 'Playful Smile', prompt: 'Playful Smile 风格视频' },
];

export default function CustomVideoScreen() {
  const navigation = useNavigation<any>();
  const [activeMode, setActiveMode] = useState('自定义');
  const [prompt, setPrompt] = useState('');
  const { selectedImage, isProcessing, resultUrl, result, error, taskError, pickImage, takePhoto, generate, clear } = useAiTool('video_generate');

  // 防止重复点击
  const [submitting, setSubmitting] = useState(false);
  const busy = isProcessing || submitting;

  const handleGenerate = async () => {
    if (busy || !selectedImage) return;
    setSubmitting(true);
    try {
      await generate({
        mode: activeMode === '超级' ? 'super' : 'custom',
        prompt: prompt || undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>自定义视频</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => Alert.alert('设置', '视频生成设置')}
        >
          <Ionicons name="settings-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* 选择图片 */}
        <TouchableOpacity style={styles.imagePicker} activeOpacity={0.7} onPress={pickImage}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          ) : (
            <>
              <Ionicons name="images" size={36} color={Colors.primary} />
              <Text style={styles.imagePickerText}>选择图片</Text>
              <Text style={styles.imagePickerSub}>从相册选取素材</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Error */}
        {error && (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle" size={18} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Task Error (后端返回) */}
        {taskError && (
          <View style={styles.errorCard}>
            <Ionicons name="close-circle" size={18} color={Colors.error} />
            <Text style={styles.errorText}>{taskError}</Text>
          </View>
        )}

        {/* Result */}
        {resultUrl && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>✨ 视频生成完成</Text>
            <Text style={styles.resultMeta}>视频结果已保存到素材库</Text>
          </View>
        )}

        {/* 模式选择 */}
        <View style={styles.modeRow}>
          {MODES.map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[styles.modeBtn, activeMode === mode && styles.modeBtnActive]}
              onPress={() => setActiveMode(mode)}
              activeOpacity={0.7}
            >
              <Text style={[styles.modeText, activeMode === mode && styles.modeTextActive]}>
                {mode}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 案例模板 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>案例模板</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {TEMPLATES.map((tpl) => (
              <TouchableOpacity
                key={tpl.id}
                style={styles.templateCard}
                activeOpacity={0.7}
                onPress={() => {
                  setPrompt(tpl.prompt);
                  if (!selectedImage) pickImage();
                }}
              >
                <View style={styles.templateImage}>
                  <Ionicons name="play-circle" size={28} color={Colors.primary} />
                </View>
                <Text style={styles.templateName}>{tpl.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 提示词输入 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>提示词</Text>
          <TextInput
            style={styles.promptInput}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="描述你想生成的视频效果..."
            placeholderTextColor={Colors.textDark}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* 操作按钮 */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.upgradeBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ProMembershipScreen')}
          >
            <Ionicons name="flash" size={18} color={Colors.bg} />
            <Text style={styles.upgradeText}>升级</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.generateBtn, busy && styles.generateBtnDisabled]}
            activeOpacity={0.8}
            onPress={handleGenerate}
            disabled={busy}
          >
            <Ionicons name="color-wand" size={18} color={Colors.text} />
            <Text style={styles.generateText}>{busy ? '处理中...' : '生成'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  content: { padding: Spacing.xl, paddingBottom: 100 },

  imagePicker: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing['2xl'],
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    marginBottom: Spacing.xl,
    minHeight: 160,
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.md,
  },
  imagePickerText: { fontSize: FontSize.md, color: Colors.primary, fontWeight: FontWeight.medium },
  imagePickerSub: { fontSize: FontSize.sm, color: Colors.textMuted },

  modeRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modeBtnActive: { borderColor: Colors.primary, backgroundColor: '#1A1A2E' },
  modeText: { fontSize: FontSize.base, color: Colors.textMuted },
  modeTextActive: { color: Colors.primary, fontWeight: FontWeight.semibold },

  section: { marginBottom: Spacing.xl },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  templateCard: {
    marginRight: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
    width: 100,
  },
  templateImage: {
    width: 90,
    height: 140,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateName: { fontSize: FontSize.xs, color: Colors.textSecondary },

  promptInput: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    minHeight: 120,
    color: Colors.text,
    fontSize: FontSize.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xs,
  },

  actionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  upgradeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.proGold,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.base,
  },
  upgradeText: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.bg },
  generateBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.base,
    ...Shadow.button,
  },
  generateBtnDisabled: {
    opacity: 0.5,
  },
  generateText: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.text },

  errorCard: {
    backgroundColor: Colors.error + '15',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  errorText: { fontSize: FontSize.sm, color: Colors.error, flex: 1 },

  resultCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.success + '40',
  },
  resultTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.success, marginBottom: Spacing.sm },
  resultMeta: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
});
