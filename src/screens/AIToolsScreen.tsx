import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface ToolCollection {
  key: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  items: string[];
}

const COLLECTIONS: ToolCollection[] = [
  {
    key: 'freeze',
    title: 'Freeze The Moment',
    icon: 'snow',
    items: ['瞬间定格', '动态捕捉', '时间凝固'],
  },
  {
    key: 'ai_body',
    title: 'AI Body',
    icon: 'body',
    items: ['Slim Thick', 'Apple Shape', 'Athletic', 'Hourglass'],
  },
  {
    key: 'street',
    title: 'Street Race',
    icon: 'car-sport',
    items: ['Outdoor Road', 'Night Light', 'Street Racer', 'Race Scene'],
  },
  {
    key: 'true_skin',
    title: 'True Skin Series',
    icon: 'rose',
    items: ['Soft Matte 01', 'Natural 01'],
  },
  {
    key: 'evening',
    title: 'Evening Wear',
    icon: 'shirt',
    items: ['Crimson Elegance Gown', 'Elegant Bow Ensemble', 'Black Ballet Chic', 'Classic Body Dress'],
  },
  {
    key: 'holiday',
    title: 'The Holiday Edi',
    icon: 'gift',
    items: ['节日主题特效', '圣诞魔法', '新年光彩'],
  },
];

export default function AIToolsScreen() {
  const navigation = useNavigation<Nav>();
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI 工具</Text>
        <Text style={styles.headerSub}>探索全部 AI 特效与塑形工具</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {COLLECTIONS.map((collection) => (
          <TouchableOpacity
            key={collection.key}
            style={styles.collectionCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('AIToolDetailScreen', { collectionKey: collection.key })}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons name={collection.icon} size={28} color={Colors.primary} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{collection.title}</Text>
                <Text style={styles.cardCount}>
                  {collection.items.length} 个工具
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
            </View>

            {/* 工具标签列表 */}
            <View style={styles.toolsRow}>
              {collection.items.map((item, idx) => (
                <View key={idx} style={styles.toolTag}>
                  <Text style={styles.toolTagText}>{item}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  headerTitle: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.text },
  headerSub: { fontSize: FontSize.sm, color: Colors.textMuted },

  content: { paddingHorizontal: Spacing.xl },

  collectionCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: { flex: 1, gap: 2 },
  cardTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  cardCount: { fontSize: FontSize.sm, color: Colors.textMuted },

  toolsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  toolTag: {
    backgroundColor: Colors.bg,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toolTagText: { fontSize: FontSize.xs, color: Colors.textSecondary },
});
