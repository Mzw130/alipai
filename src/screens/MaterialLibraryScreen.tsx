import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image,
  RefreshControl, ActivityIndicator, Modal, Dimensions, Animated, PanResponder,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';
import { getMaterials, deleteMaterial, Material } from '../api/index';
import { getVideoThumbnail } from '../utils/thumbnailCache';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_GAP = Spacing.md;
const ITEM_WIDTH = (SCREEN_WIDTH - Spacing.xl * 2 - ITEM_GAP) / 2;

const TYPE_TABS = [
  { key: 'video', label: '视频' },
  { key: 'image', label: '图片' },
];
const FILTER_TABS = [
  { key: 'all', label: '全部' },
  { key: 'fav', label: '已收藏', icon: 'star' as const },
];

export default function MaterialLibraryScreen() {
  const navigation = useNavigation();
  const [activeType, setActiveType] = useState('video');
  const [activeFilter, setActiveFilter] = useState('all');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Material | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
  const [videoThumbnails, setVideoThumbnails] = useState<Record<string, string>>({});
  const generatingRef = useRef<Set<string>>(new Set());
  const panY = useRef(new Animated.Value(0)).current;

  const fetchMaterials = useCallback(async (type: string) => {
    try {
      const data = await getMaterials(type, 1, 50);
      if (data?.items) setMaterials(data.items);
    } catch (err) {
      console.error('[MaterialLibrary] 加载失败:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchMaterials(activeType);
    }, [activeType, fetchMaterials]),
  );

  useEffect(() => {
    materials.forEach(async (item) => {
      if (item.type !== 'video') return;
      if (generatingRef.current.has(item.id) || videoThumbnails[item.id]) return;
      generatingRef.current.add(item.id);
      const localUri = await getVideoThumbnail(item.url);
      if (localUri) setVideoThumbnails((prev) => ({ ...prev, [item.id]: localUri }));
      generatingRef.current.delete(item.id);
    });
  }, [materials]);

  const handleDelete = async (id: string) => {
    try {
      await deleteMaterial(id);
      setMaterials((prev) => prev.filter((m) => m.id !== id));
      if (selectedItem?.id === id) closePreview();
    } catch (err) {
      console.error('[MaterialLibrary] 删除失败:', err);
    }
  };

  const openPreview = (item: Material) => {
    setSelectedItem(item);
    panY.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  };

  const closePreview = () => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setSelectedItem(null);
      panY.setValue(0);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => panY.setValue(Math.max(0, g.dy)),
      onPanResponderRelease: (_, g) => {
        if (g.dy > 100 || g.vy > 0.5) closePreview();
        else Animated.spring(panY, { toValue: 0, useNativeDriver: true, friction: 6 }).start();
      },
    }),
  ).current;

  const renderItem = (item: Material) => {
    const isVideo = item.type === 'video';
    const coverUrl = isVideo
      ? (videoThumbnails[item.id] || item.thumbnailUrl || item.url)
      : item.url;

    return (
      <TouchableOpacity key={item.id} style={styles.gridItem} activeOpacity={0.9} onPress={() => openPreview(item)}>
        <View style={styles.itemImage}>
          <Image
            source={{ uri: coverUrl }}
            style={styles.itemImageFull}
            resizeMode="cover"
            onLoad={() => setImageLoaded((prev) => ({ ...prev, [item.id]: true }))}
          />
          {!imageLoaded[item.id] && (
            <View style={styles.skeleton}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          )}
          {isVideo && (
            <View style={styles.playOverlay}>
              <View style={styles.playBtn}>
                <Ionicons name="play" size={20} color="#fff" style={{ marginLeft: 2 }} />
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const selectedIsVideo = selectedItem?.type === 'video';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>素材库</Text>
        <View style={styles.headerRight}>
          <View style={styles.creditsPill}>
            <View style={styles.creditIcon}>
              <Ionicons name="star" size={10} color="#fff" />
            </View>
            <Text style={styles.creditsText}>0</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterSection}>
        <View style={styles.tabRow}>
          {TYPE_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.pillBtn, activeType === tab.key && styles.pillBtnActive]}
              onPress={() => { setActiveType(tab.key); setLoading(true); }}
            >
              <Text style={[styles.pillText, activeType === tab.key && styles.pillTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.tabRow}>
          {FILTER_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.pillBtn, activeFilter === tab.key && styles.pillBtnActive]}
              onPress={() => setActiveFilter(tab.key)}
            >
              {tab.icon && <Ionicons name={tab.icon} size={12} color={activeFilter === tab.key ? '#fff' : '#F59E0B'} />}
              <Text style={[styles.pillText, activeFilter === tab.key && styles.pillTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : materials.length === 0 ? (
        <View style={styles.centered} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.grid}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchMaterials(activeType); }} tintColor={Colors.primary} />
          }
        >
          {materials.map(renderItem)}
        </ScrollView>
      )}

      <Modal visible={!!selectedItem} transparent animationType="none" onRequestClose={closePreview}>
        <Animated.View
          style={[styles.previewOverlay, { opacity: fadeAnim, transform: [{ translateY: panY }] }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.previewHeader}>
            <TouchableOpacity onPress={closePreview}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectedItem && handleDelete(selectedItem.id)}>
              <Ionicons name="trash-outline" size={22} color={Colors.error} />
            </TouchableOpacity>
          </View>
          <View style={styles.previewContent}>
            {selectedItem && !selectedIsVideo && (
              <Image source={{ uri: selectedItem.url }} style={styles.previewImage} resizeMode="contain" />
            )}
            {selectedItem && selectedIsVideo && (
              <Video source={{ uri: selectedItem.url }} style={styles.videoPlayer} resizeMode={ResizeMode.CONTAIN} useNativeControls shouldPlay isLooping />
            )}
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.card },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  creditsPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.card, paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: BorderRadius.full,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  creditIcon: { width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  creditsText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.primary },
  filterSection: { paddingHorizontal: Spacing.xl, gap: Spacing.sm, marginBottom: Spacing.md },
  tabRow: { flexDirection: 'row', gap: Spacing.sm },
  pillBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full, backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border,
  },
  pillBtnActive: { backgroundColor: Colors.text, borderColor: Colors.text },
  pillText: { fontSize: FontSize.sm, color: Colors.text },
  pillTextActive: { color: '#fff', fontWeight: FontWeight.semibold },
  centered: { flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.xl, gap: ITEM_GAP, paddingBottom: 100 },
  gridItem: { width: ITEM_WIDTH, borderRadius: BorderRadius.md, overflow: 'hidden' },
  itemImage: { height: ITEM_WIDTH * 1.2, backgroundColor: Colors.cardMuted, position: 'relative' },
  itemImageFull: { width: '100%', height: '100%', position: 'absolute' },
  skeleton: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.cardMuted },
  playOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
  playBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  previewOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' },
  previewHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingTop: 50, paddingBottom: Spacing.md },
  previewContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  previewImage: { flex: 1, width: '100%' },
  videoPlayer: { flex: 1, width: '100%', backgroundColor: '#000' },
});
