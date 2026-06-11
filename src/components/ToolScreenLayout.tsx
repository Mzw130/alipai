import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';
import GenerateResultModal from './GenerateResultModal';
import { useAiTool } from '../hooks/useAiTool';
import { TOOL_PRESETS } from '../constants/tools';

interface ToolScreenLayoutProps {
  title: string;
  toolType: string;
  introImage?: any;
  introSubtitle?: string;
  presetLabel?: string;
  generateLabel?: string;
  credits?: number;
}

export default function ToolScreenLayout({
  title,
  toolType,
  introImage = require('../../assets/design/tool-intro.jpeg'),
  introSubtitle = '让任何图片更真实',
  presetLabel,
  generateLabel = '生成',
  credits,
}: ToolScreenLayoutProps) {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const preset = TOOL_PRESETS[toolType];
  const {
    selectedImage, isProcessing, resultUrl, error, taskError,
    pickImage, generate, clear, setSelectedImage,
  } = useAiTool(toolType);

  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const imageUri = route.params?.imageUri;
    if (imageUri) setSelectedImage(imageUri);
  }, [route.params?.imageUri, setSelectedImage]);

  useEffect(() => {
    if (resultUrl) setShowResult(true);
  }, [resultUrl]);

  const activePreset = presetLabel || preset?.preset || title;
  const activeTag = preset?.tag || toolType;
  const activeCredits = credits ?? preset?.credits;

  if (!selectedImage) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.introHeader}>
          <AppHeaderMini />
        </View>
        <View style={styles.introBody}>
          <View style={styles.introImageWrap}>
            <Image source={introImage} style={styles.introImage} resizeMode="cover" />
            <View style={styles.introTagLeft}>
              <Text style={styles.introTagLeftText}>{title}</Text>
            </View>
            <View style={styles.introTagRight}>
              <Text style={styles.introTagRightText}>处理前</Text>
            </View>
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.98)']}
              style={styles.introFade}
            >
              <Ionicons name="scan-outline" size={28} color={Colors.text} />
              <Text style={styles.introTitle}>{title}</Text>
              <Text style={styles.introSub}>{introSubtitle}</Text>
            </LinearGradient>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('PhotoPickerScreen', { toolType })}
            style={styles.uploadWrap}
          >
            <LinearGradient
              colors={[Colors.generateGradientStart, Colors.generateGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.uploadBtn}
            >
              <Text style={styles.uploadText}>上传开始使用</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.editorHeader}>
        <TouchableOpacity onPress={() => { clear(); navigation.goBack(); }}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.editorTitle}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.editorContent} showsVerticalScrollIndicator={false}>
        <View style={styles.previewWrap}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="cover" />
          <View style={styles.imageTag}>
            <Text style={styles.imageTagText}>{activeTag}</Text>
          </View>
        </View>

        <View style={styles.presetPill}>
          <Text style={styles.presetText}>{activePreset}</Text>
        </View>

        {(error || taskError) && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color={Colors.error} />
            <Text style={styles.errorText}>{error || taskError}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.gridSmallBtn} onPress={pickImage}>
          <Ionicons name="grid-outline" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isProcessing}
          onPress={() => generate()}
          style={[styles.generateWrap, isProcessing && { opacity: 0.6 }]}
        >
          <LinearGradient
            colors={[Colors.generateGradientStart, Colors.generateGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.generateBtn}
          >
            <Ionicons name="sparkles" size={18} color="#fff" />
            <Text style={styles.generateText}>{isProcessing ? '处理中...' : generateLabel}</Text>
            {activeCredits !== undefined && !isProcessing && (
              <>
                <Ionicons name="star" size={12} color="#fff" style={{ marginLeft: 6 }} />
                <Text style={styles.creditText}>{activeCredits}</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <GenerateResultModal
        visible={showResult}
        title={title}
        subtitle={introSubtitle}
        resultUrl={resultUrl}
        onClose={() => setShowResult(false)}
        onSave={() => setShowResult(false)}
      />
    </SafeAreaView>
  );
}

function AppHeaderMini() {
  return (
    <View style={styles.miniHeader}>
      <Text style={styles.miniLogo}>Clip<Text style={{ fontStyle: 'italic' }}>AI</Text></Text>
      <View style={styles.miniRight}>
        <LinearGradient
          colors={[Colors.proGradientStart, Colors.proGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.miniPro}
        >
          <Text style={styles.miniProText}>Pro</Text>
        </LinearGradient>
        <Ionicons name="grid-outline" size={18} color={Colors.text} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgWarm },
  introHeader: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm },
  introBody: { flex: 1, paddingHorizontal: Spacing.xl, justifyContent: 'space-between', paddingBottom: Spacing['3xl'] },
  introImageWrap: {
    flex: 1,
    borderRadius: BorderRadius['3xl'],
    overflow: 'hidden',
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
    backgroundColor: Colors.cardMuted,
  },
  introImage: { width: '100%', height: '100%' },
  introTagLeft: {
    position: 'absolute', top: Spacing.lg, left: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  introTagLeftText: { color: Colors.success, fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  introTagRight: {
    position: 'absolute', top: Spacing.lg, right: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  introTagRightText: { color: '#fff', fontSize: FontSize.xs },
  introFade: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 160,
    alignItems: 'center', justifyContent: 'flex-end', paddingBottom: Spacing.xl, gap: 4,
  },
  introTitle: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.text },
  introSub: { fontSize: FontSize.sm, color: Colors.textSecondary },
  uploadWrap: { borderRadius: BorderRadius.full, overflow: 'hidden' },
  uploadBtn: { paddingVertical: 16, alignItems: 'center' },
  uploadText: { color: '#fff', fontSize: FontSize.md, fontWeight: FontWeight.semibold },

  editorHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
  },
  editorTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text },
  editorContent: { paddingHorizontal: Spacing.xl, paddingBottom: 120 },
  previewWrap: {
    borderRadius: BorderRadius['3xl'], overflow: 'hidden',
    aspectRatio: 0.75, backgroundColor: Colors.cardMuted, marginBottom: Spacing.lg,
  },
  previewImage: { width: '100%', height: '100%' },
  imageTag: {
    position: 'absolute', bottom: Spacing.lg, alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 14, paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  imageTagText: { fontSize: FontSize.sm, color: Colors.text, fontWeight: FontWeight.medium },
  presetPill: {
    alignSelf: 'flex-start', backgroundColor: Colors.card,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  presetText: { fontSize: FontSize.base, color: Colors.text, fontWeight: FontWeight.medium },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.error + '15', borderRadius: BorderRadius.md,
    padding: Spacing.md, marginTop: Spacing.md,
  },
  errorText: { fontSize: FontSize.sm, color: Colors.error, flex: 1 },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg, paddingBottom: Spacing['2xl'],
    backgroundColor: Colors.bgWarm,
  },
  gridSmallBtn: {
    width: 48, height: 48, borderRadius: BorderRadius.lg,
    backgroundColor: Colors.cardMuted, justifyContent: 'center', alignItems: 'center',
  },
  generateWrap: { flex: 1, borderRadius: BorderRadius.full, overflow: 'hidden' },
  generateBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, gap: 6,
  },
  generateText: { color: '#fff', fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  creditText: { color: '#fff', fontSize: FontSize.sm, fontWeight: FontWeight.semibold },

  miniHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  miniLogo: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text, fontStyle: 'italic' },
  miniRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  miniPro: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: BorderRadius.full },
  miniProText: { color: '#fff', fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
});
