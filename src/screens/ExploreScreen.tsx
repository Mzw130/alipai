import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView,
  TextInput, Image, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';
import AppHeader from '../components/AppHeader';

const TOP_TABS = [
  { key: 'recent', label: '最近', icon: 'time-outline' as const },
  { key: 'liked', label: '喜欢', icon: 'heart-outline' as const },
];
const FILTERS = ['热门', '最新', '最多喜欢'];
const TAGS = ['Pokémon', 'Dorky and cute'];

const GRID_ITEMS = [
  { id: '1', image: require('../../assets/design/template-flower.jpeg') },
  { id: '2', image: require('../../assets/design/template-flower.jpeg') },
  { id: '3', image: require('../../assets/design/template-flower.jpeg') },
  { id: '4', image: require('../../assets/design/template-flower.jpeg') },
  { id: '5', image: require('../../assets/design/template-flower.jpeg') },
  { id: '6', image: require('../../assets/design/template-flower.jpeg') },
];

const { width: SCREEN_W } = Dimensions.get('window');
const GRID_W = (SCREEN_W - Spacing.xl * 2 - Spacing.sm * 2) / 3;

export default function ExploreScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('recent');
  const [activeFilter, setActiveFilter] = useState('热门');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TOP_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={tab.icon}
              size={16}
              color={activeTab === tab.key ? Colors.primary : Colors.textMuted}
            />
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
            {activeTab === tab.key && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 视频生成 */}
        <Text style={styles.blockTitle}>视频生成</Text>
        <View style={styles.genCards}>
          <TouchableOpacity
            style={styles.genCardActive}
            onPress={() => navigation.navigate('CustomVideoScreen')}
          >
            <Ionicons name="image-outline" size={28} color={Colors.primary} />
            <Text style={styles.genCardActiveText}>图片转视频</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.genCard}
            onPress={() => navigation.navigate('CustomVideoScreen')}
          >
            <Ionicons name="code-slash-outline" size={28} color={Colors.textMuted} />
            <Text style={styles.genCardText}>自定义</Text>
          </TouchableOpacity>
        </View>

        {/* 搜索 */}
        <View style={styles.searchBar}>
          <Text style={styles.searchPlaceholder}>搜索视频</Text>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
        </View>

        {/* 图片转视频 */}
        <View style={styles.filterHeader}>
          <View>
            <Text style={styles.blockTitle}>图片转视频</Text>
            <Text style={styles.blockSub}>为您的照片注入动感</Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.filterDropdown}
              onPress={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Text style={styles.filterDropdownText}>{activeFilter}</Text>
              <Ionicons name="chevron-down" size={14} color={Colors.text} />
            </TouchableOpacity>
            {showFilterMenu && (
              <View style={styles.filterMenu}>
                {FILTERS.map((f) => (
                  <TouchableOpacity
                    key={f}
                    style={styles.filterMenuItem}
                    onPress={() => { setActiveFilter(f); setShowFilterMenu(false); }}
                  >
                    <Text style={[styles.filterMenuText, activeFilter === f && styles.filterMenuActive]}>
                      {f}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.tagRow}>
          {TAGS.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* 网格 */}
        <View style={styles.grid}>
          <View style={[styles.gridItem, styles.gridPlaceholder]}>
            <Ionicons name="image-outline" size={32} color={Colors.textMuted} />
          </View>
          {GRID_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.gridItem}
              onPress={() => navigation.navigate('CustomVideoScreen')}
            >
              <Image source={item.image} style={styles.gridImage} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    gap: Spacing['2xl'],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingBottom: 0,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: Spacing.md,
    position: 'relative',
  },
  tabText: { fontSize: FontSize.base, color: Colors.textMuted },
  tabTextActive: { color: Colors.primary, fontWeight: FontWeight.semibold },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
  content: { padding: Spacing.xl },
  blockTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.md },
  blockSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  genCards: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  genCardActive: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  genCardActiveText: { fontSize: FontSize.base, color: Colors.primary, fontWeight: FontWeight.semibold },
  genCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  genCardText: { fontSize: FontSize.base, color: Colors.textMuted },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.xl,
  },
  searchPlaceholder: { fontSize: FontSize.base, color: Colors.textMuted },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterDropdownText: { fontSize: FontSize.sm, color: Colors.text },
  filterMenu: {
    position: 'absolute',
    top: 36,
    right: 0,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    zIndex: 100,
    minWidth: 100,
    overflow: 'hidden',
  },
  filterMenuItem: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  filterMenuText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  filterMenuActive: { color: Colors.primary, fontWeight: FontWeight.semibold },
  tagRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  tag: {
    backgroundColor: Colors.cardLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  tagText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  gridItem: {
    width: GRID_W,
    height: GRID_W * 1.3,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.cardMuted,
  },
  gridPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  gridImage: { width: '100%', height: '100%' },
});
