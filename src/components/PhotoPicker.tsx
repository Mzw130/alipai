import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';

interface PhotoPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (image: { id: string; uri: string }) => void;
}

const PHOTO_TABS = ['最近', '实况', '截图'];

const MOCK_PHOTOS = Array.from({ length: 12 }, (_, i) => ({
  id: String(i),
  uri: `photo_${i}`,
}));

export default function PhotoPicker({ visible, onClose, onSelect }: PhotoPickerProps) {
  const [activeTab, setActiveTab] = useState('最近');

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>选择图片</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {PHOTO_TABS.map((tab) => (
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

        {/* Photo grid */}
        <ScrollView contentContainerStyle={styles.grid}>
          {MOCK_PHOTOS.map((photo) => (
            <TouchableOpacity
              key={photo.id}
              style={styles.photoItem}
              onPress={() => onSelect(photo)}
              activeOpacity={0.7}
            >
              <View style={styles.photoPlaceholder}>
                <Ionicons name="image" size={24} color={Colors.textMuted} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Note */}
        <View style={styles.note}>
          <Ionicons name="information-circle" size={16} color={Colors.textMuted} />
          <Text style={styles.noteText}>
            选择图片后将进入对应 AI 编辑功能
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
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
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  tab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: FontSize.sm, color: Colors.textMuted },
  tabTextActive: { color: Colors.text, fontWeight: FontWeight.semibold },
  grid: {
    paddingHorizontal: Spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 100,
  },
  photoItem: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 3,
  },
  photoPlaceholder: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  noteText: { fontSize: FontSize.xs, color: Colors.textMuted, flex: 1 },
});
