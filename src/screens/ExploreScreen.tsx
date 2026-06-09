import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';

const TOP_TABS = ['最近', '喜欢'];
const FILTERS = ['热门', '最新', '最多喜欢'];

const EXPLORE_ITEMS = [
  { id: '1', name: 'Pokemon', type: 'AI视频模板' },
  { id: '2', name: 'Dorky and cute', type: 'AI视频模板' },
  { id: '3', name: 'Anime Style', type: 'AI视频模板' },
  { id: '4', name: 'Cinematic', type: 'AI视频模板' },
];

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState('最近');
  const [activeFilter, setActiveFilter] = useState('热门');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>探索</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="search" size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Top Tabs */}
      <View style={styles.tabRow}>
        {TOP_TABS.map((tab) => (
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

      <ScrollView contentContainerStyle={styles.content}>
        {/* 图片转视频板块 */}
        <View style={styles.featureCard}>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>图片转视频</Text>
            <Text style={styles.featureSub}>为您的照片注入动感</Text>
          </View>
          <View style={styles.featureIconBox}>
            <Ionicons name="play-circle" size={36} color={Colors.primary} />
          </View>
        </View>

        {/* 搜索视频 */}
        <TouchableOpacity style={styles.searchCard} activeOpacity={0.7}>
          <Ionicons name="search" size={20} color={Colors.textMuted} />
          <Text style={styles.searchPlaceholder}>搜索视频...</Text>
        </TouchableOpacity>

        {/* 筛选栏 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, activeFilter === f && styles.filterBtnActive]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 模板网格 */}
        <View style={styles.grid}>
          {EXPLORE_ITEMS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.gridCard} activeOpacity={0.7}>
              <View style={styles.gridImage}>
                <Ionicons name="videocam" size={32} color={Colors.textMuted} />
              </View>
              <View style={styles.gridInfo}>
                <Text style={styles.gridName}>{item.name}</Text>
                <Text style={styles.gridType}>{item.type}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
  headerTitle: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.text },

  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xl,
    marginBottom: Spacing.md,
  },
  tab: { paddingBottom: Spacing.sm },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabText: { fontSize: FontSize.md, color: Colors.textMuted },
  tabTextActive: { color: Colors.text, fontWeight: FontWeight.semibold },

  content: { padding: Spacing.xl, paddingBottom: 100 },

  featureCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureInfo: { gap: 4 },
  featureTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  featureSub: { fontSize: FontSize.sm, color: Colors.textMuted },
  featureIconBox: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  searchPlaceholder: { fontSize: FontSize.base, color: Colors.textMuted, flex: 1 },

  filterScroll: { marginBottom: Spacing.lg },
  filterRow: { gap: Spacing.sm },
  filterBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
  },
  filterBtnActive: { backgroundColor: Colors.primary },
  filterText: { fontSize: FontSize.sm, color: Colors.textMuted },
  filterTextActive: { color: Colors.text, fontWeight: FontWeight.medium },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  gridCard: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  gridImage: {
    height: 160,
    backgroundColor: Colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridInfo: { padding: Spacing.md, gap: 2 },
  gridName: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.text },
  gridType: { fontSize: FontSize.xs, color: Colors.textMuted },
});
