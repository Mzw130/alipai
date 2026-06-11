import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, RefreshControl, ActivityIndicator, Modal, Dimensions, Animated, Platform, PanResponder,
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

const TABS = [
  { key: 'all', label: '全部', icon: 'apps' },
  { key: 'video', label: '视频', icon: 'videocam' },
  { key: 'image', label: '图片', icon: 'image' },
];

export default function MaterialLibraryScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('all');
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
      if (data?.items) {
        setMaterials(data.items);
      }
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
      fetchMaterials(activeTab);
    }, [activeTab, fetchMaterials]),
  );

  // 为所有视频生成本地缩略图（第一帧）
  useEffect(() => {
    materials.forEach(async (item) => {
      if (item.type !== 'video') return;
      if (generatingRef.current.has(item.id)) return;
      if (videoThumbnails[item.id]) return;

      generatingRef.current.add(item.id);
      const localUri = await getVideoThumbnail(item.url);
      if (localUri) {
        setVideoThumbnails(prev => ({ ...prev, [item.id]: localUri }));
      }
      generatingRef.current.delete(item.id);
    });
  }, [materials]);

  const handleDelete = async (id: string) => {
    try {
      await deleteMaterial(id);
      setMaterials(prev => prev.filter(m => m.id !== id));
      if (selectedItem?.id === id) closePreview();
    } catch (err) {
      console.error('[MaterialLibrary] 删除失败:', err);
    }
  };

  const openPreview = (item: Material) => {
    setSelectedItem(item);
    panY.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closePreview = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setSelectedItem(null);
      panY.setValue(0);
    });
  };

  // 下滑关闭手势
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 10 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderMove: (_, gestureState) => {
        panY.setValue(Math.max(0, gestureState.dy));
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          const { height: screenHeight } = Dimensions.get('window');
          Animated.timing(panY, {
            toValue: screenHeight,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            panY.setValue(0);
            closePreview();
          });
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
            friction: 6,
          }).start();
        }
      },
    }),
  ).current;

  const handleImageLoad = (id: string) => {
    setImageLoaded(prev => ({ ...prev, [id]: true }));
  };

  const renderItem = (item: Material) => {
    const isVideo = item.type === 'video';
    // 封面优先级: 本地缩略图 > 后端 thumbnailUrl > 原始 url
    const coverUrl = isVideo
      ? (videoThumbnails[item.id] || item.thumbnailUrl || item.url)
      : item.url;
    const loaded = imageLoaded[item.id];

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.gridItem}
        activeOpacity={0.9}
        onPress={() => openPreview(item)}
      >
        {/* 缩略图 */}
        <View style={styles.itemImage}>
          <Image
            source={{ uri: coverUrl }}
            style={styles.itemImageFull}
            resizeMode="cover"
            onLoad={() => handleImageLoad(item.id)}
          />
          {/* 加载中骨架 */}
          {!loaded && (
            <View style={styles.skeleton}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          )}
          {/* 视频播放按钮覆盖层 */}
          {isVideo && (
            <View style={styles.playOverlay}>
              <View style={styles.playBtn}>
                <Ionicons name="play" size={22} color="#fff" style={{ marginLeft: 2 }} />
              </View>
            </View>
          )}
          {/* 类型标签 */}
          <View style={[styles.typeTag, isVideo && styles.typeTagVideo]}>
            <Ionicons name={isVideo ? 'videocam' : 'image'} size={10} color="#fff" />
            <Text style={styles.typeTagText}>{isVideo ? '视频' : '图片'}</Text>
          </View>
        </View>

        {/* 底部信息 */}
        <View style={styles.itemFooter}>
          <Text style={styles.itemDate} numberOfLines={1}>
            {new Date(item.createdAt).toLocaleDateString('zh-CN')}
          </Text>
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation(); handleDelete(item.id); }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const selectedIsVideo = selectedItem?.type === 'video';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>我的素材</Text>
        <Text style={styles.count}>{materials.length} 项</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => { setActiveTab(tab.key); setLoading(true); setImageLoaded({}); }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={tab.icon as any}
              size={14}
              color={activeTab === tab.key ? Colors.text : Colors.textMuted}
            />
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : materials.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="folder-open" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyText}>暂无素材</Text>
          <Text style={styles.emptySub}>使用 AI 工具生成图片或视频后将在此显示</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchMaterials(activeTab); }}
              tintColor={Colors.primary}
            />
          }
        >
          {materials.map(renderItem)}
        </ScrollView>
      )}

      {/* ========== 内联预览 Modal ========== */}
      <Modal visible={!!selectedItem} transparent animationType="none" onRequestClose={closePreview}>
        <Animated.View
          style={[styles.previewOverlay, { opacity: fadeAnim, transform: [{ translateY: panY }] }]}
          {...panResponder.panHandlers}
        >
          {/* 顶部栏 */}
          <View style={styles.previewHeader}>
            <TouchableOpacity onPress={closePreview} style={styles.previewCloseBtn}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.previewTitle}>
              {selectedIsVideo ? '视频预览' : '图片预览'}
            </Text>
            <TouchableOpacity onPress={() => selectedItem && handleDelete(selectedItem.id)} style={styles.previewDeleteBtn}>
              <Ionicons name="trash-outline" size={22} color={Colors.error} />
            </TouchableOpacity>
          </View>

          {/* 内容区 */}
          <View style={styles.previewContent}>
            {selectedItem && !selectedIsVideo && (
              <Image
                source={{ uri: selectedItem.url }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            )}
            {selectedItem && selectedIsVideo && (
              <View style={styles.videoContainer}>
                <Video
                  source={{ uri: selectedItem.url }}
                  style={styles.videoPlayer}
                  resizeMode={ResizeMode.CONTAIN}
                  useNativeControls
                  shouldPlay
                  isLooping
                />
              </View>
            )}
          </View>

          {/* 底部信息 */}
          {selectedItem && (
            <View style={styles.previewFooter}>
              <View style={styles.previewMeta}>
                <View style={[styles.typeTag, selectedIsVideo && styles.typeTagVideo, { position: 'relative', top: 0, right: 0 }]}>
                  <Ionicons name={selectedIsVideo ? 'videocam' : 'image'} size={10} color="#fff" />
                  <Text style={styles.typeTagText}>{selectedIsVideo ? '视频' : '图片'}</Text>
                </View>
                <Text style={styles.previewDate}>
                  {new Date(selectedItem.createdAt).toLocaleString('zh-CN')}
                </Text>
              </View>
              {selectedItem.toolType && (
                <Text style={styles.previewTool}>工具: {selectedItem.toolType}</Text>
              )}
            </View>
          )}
        </Animated.View>
      </Modal>
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
  count: { fontSize: FontSize.sm, color: Colors.textMuted },
  tabRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: FontSize.sm, color: Colors.textMuted },
  tabTextActive: { color: Colors.text, fontWeight: FontWeight.semibold },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    paddingBottom: 100,
  },
  emptyText: { fontSize: FontSize.md, color: Colors.textSecondary },
  emptySub: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', paddingHorizontal: Spacing.xl },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.xl,
    gap: ITEM_GAP,
    paddingBottom: 100,
  },
  gridItem: {
    width: ITEM_WIDTH,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  itemImage: {
    height: ITEM_WIDTH * 1.2,
    backgroundColor: '#1A1A2E',
    position: 'relative',
  },
  itemImageFull: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  skeleton: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + 'CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeTag: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  typeTagVideo: {
    backgroundColor: Colors.primary + 'CC',
  },
  typeTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: FontWeight.medium,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.sm,
  },
  itemDate: { fontSize: FontSize.xs, color: Colors.textMuted, flex: 1 },

  // Preview Modal
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    paddingTop: 50,
  },
  previewCloseBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  previewDeleteBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  videoContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  videoPlayer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
  },
  previewFooter: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  previewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  previewDate: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  previewTool: {
    fontSize: FontSize.xs,
    color: Colors.textDark,
  },
});
