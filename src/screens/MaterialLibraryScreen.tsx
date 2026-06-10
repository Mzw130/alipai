import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, RefreshControl, ActivityIndicator, Linking, Platform,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';
import { getMaterials, deleteMaterial, Material } from '../api/index';

const TABS = [
  { key: 'all', label: '全部' },
  { key: 'video', label: '视频' },
  { key: 'image', label: '图片' },
];

export default function MaterialLibraryScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('all');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleDelete = async (id: string) => {
    try {
      await deleteMaterial(id);
      setMaterials(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('[MaterialLibrary] 删除失败:', err);
    }
  };

  const handleOpen = (item: Material) => {
    if (Platform.OS === 'web') {
      (globalThis as any).open(item.url, '_blank');
    } else {
      Linking.openURL(item.url);
    }
  };

  const renderItem = (item: Material) => {
    const isVideo = item.type === 'video';
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.gridItem}
        activeOpacity={0.8}
        onPress={() => handleOpen(item)}
      >
        {/* 缩略图 */}
        <View style={styles.itemImage}>
          {isVideo ? (
            <View style={styles.videoPlaceholder}>
              <Ionicons name="play-circle" size={40} color={Colors.primary} />
              <Text style={styles.videoHint}>点击播放</Text>
              <Text style={styles.itemTypeTag}>视频</Text>
            </View>
          ) : (
            <Image
              source={{ uri: item.url }}
              style={styles.itemImageFull}
              resizeMode="cover"
            />
          )}
        </View>

        {/* 底部信息 */}
        <View style={styles.itemFooter}>
          <Text style={styles.itemDate} numberOfLines={1}>
            {new Date(item.createdAt).toLocaleDateString('zh-CN')}
          </Text>
          <TouchableOpacity onPress={() => handleDelete(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="trash-outline" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

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
            onPress={() => { setActiveTab(tab.key); setLoading(true); }}
            activeOpacity={0.7}
          >
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchMaterials(activeTab); }} />
          }
        >
          {materials.map(renderItem)}
        </ScrollView>
      )}
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
    gap: Spacing.md,
    paddingBottom: 100,
  },
  gridItem: {
    width: '48%',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  itemImage: {
    height: 140,
    backgroundColor: '#2A2A3E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImageFull: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  videoHint: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  itemTypeTag: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.primary + 'CC',
    color: Colors.text,
    fontSize: FontSize.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.sm,
  },
  itemDate: { fontSize: FontSize.xs, color: Colors.textMuted, flex: 1 },
});
