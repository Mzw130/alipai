import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';

const TABS = ['最近', '实况', '截图'];

type Route = RouteProp<RootStackParamList, 'PhotoPickerScreen'>;

export default function PhotoPickerScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<Route>();
  const toolType = route.params?.toolType || '';
  const [activeTab, setActiveTab] = useState('最近');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  // 加载相册照片
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return;
      // 获取最近照片列表（简化处理：使用 ImagePicker 展示）
      // 此处为 Mock 网格，实际可集成 expo-media-library
    })();
  }, []);

  const pickFromAlbum = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
    });
    if (!result.canceled && result.assets.length > 0) {
      setSelectedPhoto(result.assets[0].uri);
    }
  }, []);

  // 首次进入时弹出相册选择
  useEffect(() => {
    pickFromAlbum();
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedPhoto) {
      // 返回到调用页面，传递选中的图片
      navigation.goBack();
    }
  }, [selectedPhoto, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>选择图片</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={pickFromAlbum}>
          <Text style={styles.headerAction}>相册</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Photo Display / Re-pick */}
      <ScrollView contentContainerStyle={styles.grid}>
        {selectedPhoto ? (
          <View style={styles.selectedWrap}>
            <Image source={{ uri: selectedPhoto }} style={styles.selectedImage} />
            <TouchableOpacity style={styles.repickBtn} onPress={pickFromAlbum} activeOpacity={0.7}>
              <Ionicons name="images" size={20} color={Colors.text} />
              <Text style={styles.repickText}>重新选择</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.pickContainer} onPress={pickFromAlbum} activeOpacity={0.7}>
            <Ionicons name="images" size={48} color={Colors.primary} />
            <Text style={styles.pickLabel}>点击选择图片</Text>
            <Text style={styles.pickSub}>从相册选取素材</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.selectedCount}>
          {selectedPhoto ? '已选择 1 张图片' : '未选择图片'}
        </Text>
        <TouchableOpacity
          style={[styles.confirmBtn, !selectedPhoto && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          activeOpacity={0.8}
          disabled={!selectedPhoto}
        >
          <Text style={[styles.confirmText, !selectedPhoto && styles.confirmTextDisabled]}>确认</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  headerAction: { fontSize: FontSize.base, color: Colors.primary, fontWeight: FontWeight.medium },

  tabRow: {
    flexDirection: 'row', paddingHorizontal: Spacing.xl, gap: Spacing.md,
    paddingBottom: Spacing.md, borderBottomWidth: 0.5, borderBottomColor: Colors.border,
  },
  tab: {
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full, backgroundColor: Colors.card,
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: FontSize.sm, color: Colors.textMuted },
  tabTextActive: { color: Colors.text, fontWeight: FontWeight.semibold },

  grid: { padding: Spacing.xl, flex: 1, alignItems: 'center', paddingBottom: 100 },
  selectedWrap: { width: '100%', alignItems: 'center', gap: Spacing.lg },
  selectedImage: { width: '100%', aspectRatio: 1, borderRadius: BorderRadius.lg, backgroundColor: Colors.card },
  repickBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.card, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border,
  },
  repickText: { fontSize: FontSize.base, color: Colors.text },
  pickContainer: {
    width: '100%', aspectRatio: 1,
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed',
    gap: Spacing.sm,
  },
  pickLabel: { fontSize: FontSize.lg, color: Colors.primary, fontWeight: FontWeight.semibold },
  pickSub: { fontSize: FontSize.sm, color: Colors.textMuted },

  bottomBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.base,
    backgroundColor: Colors.card, borderTopWidth: 0.5, borderTopColor: Colors.border,
  },
  selectedCount: { fontSize: FontSize.base, color: Colors.textSecondary },
  confirmBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing['2xl'], paddingVertical: Spacing.sm,
  },
  confirmBtnDisabled: { backgroundColor: Colors.cardLight },
  confirmText: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.text },
  confirmTextDisabled: { color: Colors.textMuted },
});
