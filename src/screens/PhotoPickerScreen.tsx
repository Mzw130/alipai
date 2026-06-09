import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';

const TABS = ['最近', '实况', '截图'];
const MOCK_PHOTOS = Array.from({ length: 21 }, (_, i) => ({
  id: String(i),
  label: i === 0 ? '相机胶卷' : undefined,
}));

export default function PhotoPickerScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('最近');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>选择图片</Text>
        <TouchableOpacity activeOpacity={0.7}>
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

      {/* Photo Grid */}
      <ScrollView contentContainerStyle={styles.grid}>
        {MOCK_PHOTOS.map((photo, i) => (
          <TouchableOpacity
            key={photo.id}
            style={[
              styles.photoItem,
              i === 0 && styles.photoItemFirst,
              selectedId === photo.id && styles.photoItemSelected,
            ]}
            onPress={() => setSelectedId(photo.id === selectedId ? null : photo.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.photoThumb, i === 0 && styles.photoThumbFirst]}>
              <Ionicons name="image" size={24} color={Colors.textMuted} />
              {i === 0 && <Text style={styles.photoLabel}>相机胶卷</Text>}
            </View>
            {selectedId === photo.id && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom bar */}
      {selectedId && (
        <View style={styles.bottomBar}>
          <Text style={styles.selectedCount}>已选择 1 张图片</Text>
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmText}>确认</Text>
          </TouchableOpacity>
        </View>
      )}
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

  grid: { padding: 3, flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 100 },
  photoItem: { width: '33.33%', aspectRatio: 1, padding: 1.5 },
  photoItemFirst: { width: '66.66%', aspectRatio: 0.5 },
  photoItemSelected: { opacity: 0.8 },
  photoThumb: {
    flex: 1, backgroundColor: Colors.card, borderRadius: 2,
    justifyContent: 'center', alignItems: 'center',
  },
  photoThumbFirst: {
    flex: 1, backgroundColor: Colors.cardLight,
    justifyContent: 'flex-end', alignItems: 'flex-start',
    padding: Spacing.md,
  },
  photoLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  checkmark: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: Colors.bg, borderRadius: 12,
  },

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
  confirmText: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.text },
});
