import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';
import { useAiTool } from '../hooks/useAiTool';
import GenerateResultModal from '../components/GenerateResultModal';
import { VIDEO_TEMPLATES } from '../constants/tools';

export default function CustomVideoScreen() {
  const navigation = useNavigation<any>();
  const [activeTemplate, setActiveTemplate] = useState('custom');
  const [prompt, setPrompt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const { selectedImage, isProcessing, resultUrl, error, taskError, pickImage, generate } = useAiTool('video_generate');

  const busy = isProcessing || submitting;

  useEffect(() => {
    if (resultUrl) setShowResult(true);
  }, [resultUrl]);

  const handleGenerate = async () => {
    if (busy || !selectedImage) return;
    setSubmitting(true);
    try {
      await generate({ mode: activeTemplate === 'custom' ? 'custom' : 'super', prompt: prompt || undefined });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI 视频</Text>
        <View style={styles.headerRight}>
          <View style={styles.creditsPill}>
            <View style={styles.creditIcon}>
              <Ionicons name="star" size={10} color="#fff" />
            </View>
            <Text style={styles.creditsText}>0</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('MaterialLibraryScreen')}>
            <Ionicons name="grid-outline" size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.8}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          ) : (
            <>
              <Ionicons name="image-outline" size={32} color={Colors.textMuted} />
              <Text style={styles.imagePickerText}>选择图片</Text>
            </>
          )}
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.templateRow}>
          <TouchableOpacity
            style={[styles.templateItem, activeTemplate === 'custom' && styles.templateActive]}
            onPress={() => setActiveTemplate('custom')}
          >
            <LinearGradient colors={['#FF9966', '#FF5E62']} style={styles.customThumb}>
              <Ionicons name="sparkles" size={20} color="#fff" />
              <View style={styles.superTag}>
                <Text style={styles.superTagText}>超级</Text>
              </View>
            </LinearGradient>
            <Text style={styles.templateName}>自定义</Text>
          </TouchableOpacity>
          {VIDEO_TEMPLATES.map((tpl) => (
            <TouchableOpacity
              key={tpl.id}
              style={[styles.templateItem, activeTemplate === tpl.id && styles.templateActive]}
              onPress={() => { setActiveTemplate(tpl.id); setPrompt(tpl.prompt); }}
            >
              <Image source={tpl.image} style={styles.templateThumb} />
              <Text style={styles.templateName}>{tpl.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.promptWrap}>
          <TextInput
            style={styles.promptInput}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="提示词"
            placeholderTextColor={Colors.textMuted}
          />
          <TouchableOpacity
            style={styles.upgradeBtn}
            onPress={() => navigation.navigate('ProMembershipScreen')}
          >
            <LinearGradient colors={['#FF5E62', '#9B51FF']} style={styles.upgradeGradient}>
              <Text style={styles.upgradeText}>升级</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {(error || taskError) && (
          <Text style={styles.errorText}>{error || taskError}</Text>
        )}

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={busy || !selectedImage}
          onPress={handleGenerate}
          style={[styles.generateWrap, (busy || !selectedImage) && { opacity: 0.5 }]}
        >
          <LinearGradient
            colors={['#FF9966', '#FF5E62']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.generateBtn}
          >
            <Text style={styles.generateText}>{busy ? '处理中...' : '生成'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.costRow}>
          <Ionicons name="star" size={14} color={Colors.primary} />
          <Text style={styles.costText}>90</Text>
        </View>
      </ScrollView>

      <GenerateResultModal
        visible={showResult}
        title="视频生成完成"
        subtitle="结果已保存到素材库"
        resultUrl={resultUrl}
        onClose={() => setShowResult(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  creditsPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.card, paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.full,
  },
  creditIcon: { width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  creditsText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.primary },
  content: { padding: Spacing.xl, paddingBottom: 100 },
  imagePicker: {
    backgroundColor: Colors.cardLight, borderRadius: BorderRadius.xl,
    height: 200, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xl,
  },
  previewImage: { width: '100%', height: '100%', borderRadius: BorderRadius.xl },
  imagePickerText: { fontSize: FontSize.base, color: Colors.textMuted, marginTop: Spacing.sm },
  templateRow: { gap: Spacing.md, marginBottom: Spacing.xl },
  templateItem: { alignItems: 'center', gap: 6 },
  templateActive: { opacity: 1 },
  customThumb: {
    width: 72, height: 72, borderRadius: BorderRadius.md,
    justifyContent: 'center', alignItems: 'center', position: 'relative',
    borderWidth: 2, borderColor: Colors.text,
  },
  superTag: {
    position: 'absolute', top: -4, left: -4,
    backgroundColor: '#FF5E62', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4,
  },
  superTagText: { fontSize: 8, color: '#fff', fontWeight: FontWeight.bold },
  templateThumb: { width: 72, height: 72, borderRadius: BorderRadius.md },
  templateName: { fontSize: FontSize.xs, color: Colors.textSecondary },
  promptWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#FF9966', borderRadius: BorderRadius.full,
    paddingLeft: Spacing.lg, marginBottom: Spacing.xl, overflow: 'hidden',
  },
  promptInput: { flex: 1, paddingVertical: Spacing.md, fontSize: FontSize.base, color: Colors.text },
  upgradeBtn: { borderRadius: BorderRadius.full, overflow: 'hidden', margin: 4 },
  upgradeGradient: { paddingHorizontal: 16, paddingVertical: 10 },
  upgradeText: { color: '#fff', fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  errorText: { color: Colors.error, fontSize: FontSize.sm, marginBottom: Spacing.md },
  generateWrap: { borderRadius: BorderRadius.full, overflow: 'hidden', marginBottom: Spacing.sm },
  generateBtn: { paddingVertical: 16, alignItems: 'center' },
  generateText: { color: '#fff', fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  costRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 },
  costText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
});
