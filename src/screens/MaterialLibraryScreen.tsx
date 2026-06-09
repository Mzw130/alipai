import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';

const TABS = ['视频', '图片', '全部', '已收藏'];

const MOCK_MATERIALS = Array.from({ length: 8 }, (_, i) => ({
  id: String(i),
  type: i < 4 ? '视频' : '图片',
}));

export default function MaterialLibraryScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('全部');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>我的素材</Text>
        <View style={{ width: 24 }} />
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

      {/* Grid */}
      <ScrollView contentContainerStyle={styles.grid}>
        {MOCK_MATERIALS.map((item) => (
          <View key={item.id} style={styles.gridItem}>
            <Ionicons
              name={item.type === '视频' ? 'videocam' : 'image'}
              size={32}
              color={Colors.textMuted}
            />
            <Text style={styles.itemType}>{item.type}</Text>
          </View>
        ))}
      </ScrollView>

      {MOCK_MATERIALS.length === 0 && (
        <View style={styles.empty}>
          <Ionicons name="folder-open" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyText}>暂无素材</Text>
          <Text style={styles.emptySub}>使用 AI 工具生成图片或视频后将在此显示</Text>
        </View>
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
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  tab: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: FontSize.sm, color: Colors.textMuted },
  tabTextActive: { color: Colors.text, fontWeight: FontWeight.semibold },
  grid: {
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingBottom: 100,
  },
  gridItem: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  itemType: { fontSize: FontSize.xs, color: Colors.textMuted },
  empty: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emptyText: { fontSize: FontSize.md, color: Colors.textMuted, marginTop: Spacing.md },
  emptySub: { fontSize: FontSize.sm, color: Colors.textDark },
});
