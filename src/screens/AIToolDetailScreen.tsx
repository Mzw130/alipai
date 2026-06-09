import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';

type Route = RouteProp<RootStackParamList, 'AIToolDetailScreen'>;

interface ToolItem {
  name: string;
  description: string;
}

const COLLECTION_DATA: Record<string, { title: string; icon: string; tools: ToolItem[] }> = {
  freeze: {
    title: 'Freeze The Moment',
    icon: 'snow',
    tools: [
      { name: '瞬间定格', description: '捕捉动态瞬间，冻结时间之美' },
      { name: '动态捕捉', description: '智能追踪运动轨迹' },
      { name: '时间凝固', description: '创造超现实定格效果' },
    ],
  },
  ai_body: {
    title: 'AI Body',
    icon: 'body',
    tools: [
      { name: 'Slim Thick', description: '自然纤体塑形' },
      { name: 'Apple Shape', description: '苹果型身材优化' },
      { name: 'Athletic', description: '运动型线条塑造' },
      { name: 'Hourglass', description: '沙漏型曲线调整' },
    ],
  },
  street: {
    title: 'Street Race',
    icon: 'car-sport',
    tools: [
      { name: 'Outdoor Road', description: '户外公路场景' },
      { name: 'Night Light', description: '夜色灯光特效' },
      { name: 'Street Racer', description: '街头赛车风格' },
      { name: 'Race Scene', description: '赛道竞速场景' },
    ],
  },
  true_skin: {
    title: 'True Skin Series',
    icon: 'rose',
    tools: [
      { name: 'Soft Matte 01', description: '柔雾哑光肤感' },
      { name: 'Natural 01', description: '自然清透肤感' },
    ],
  },
  evening: {
    title: 'Evening Wear',
    icon: 'shirt',
    tools: [
      { name: 'Crimson Elegance Gown', description: '深红优雅晚礼服' },
      { name: 'Elegant Bow Ensemble', description: '蝴蝶结优雅套装' },
      { name: 'Black Ballet Chic', description: '黑色芭蕾时尚风' },
      { name: 'Classic Body Dress', description: '经典修身连衣裙' },
    ],
  },
  holiday: {
    title: 'The Holiday Edi',
    icon: 'gift',
    tools: [
      { name: '节日主题特效', description: '节日氛围滤镜' },
      { name: '圣诞魔法', description: '圣诞主题特效' },
      { name: '新年光彩', description: '新年璀璨效果' },
    ],
  },
};

export default function AIToolDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const collectionKey = route.params?.collectionKey || 'freeze';
  const data = COLLECTION_DATA[collectionKey];

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>未找到</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{data.title}</Text>
          <Text style={styles.headerSub}>
            {data.tools.length} 个工具
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* 图标 */}
        <View style={styles.collectionIcon}>
          <Ionicons name={data.icon as any} size={40} color={Colors.primary} />
        </View>

        {/* 工具列表 */}
        {data.tools.map((tool, i) => (
          <TouchableOpacity key={i} style={styles.toolCard} activeOpacity={0.7}>
            <View style={styles.toolImage}>
              <Ionicons name="sparkles" size={28} color={Colors.primary} />
            </View>
            <View style={styles.toolInfo}>
              <Text style={styles.toolName}>{tool.name}</Text>
              <Text style={styles.toolDesc}>{tool.description}</Text>
            </View>
            <TouchableOpacity style={styles.tryBtn} activeOpacity={0.7}>
              <Text style={styles.tryBtnText}>试用</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
  },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  headerSub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  content: { padding: Spacing.xl, paddingBottom: 120 },

  collectionIcon: {
    width: 80, height: 80, borderRadius: BorderRadius['2xl'],
    backgroundColor: Colors.card, justifyContent: 'center', alignItems: 'center',
    alignSelf: 'center', marginBottom: Spacing.xl,
    borderWidth: 1, borderColor: Colors.border,
  },

  toolCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, marginBottom: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  toolImage: {
    width: 56, height: 56, borderRadius: BorderRadius.md,
    backgroundColor: Colors.cardLight,
    justifyContent: 'center', alignItems: 'center',
  },
  toolInfo: { flex: 1, gap: 4 },
  toolName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  toolDesc: { fontSize: FontSize.sm, color: Colors.textMuted },

  tryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
  },
  tryBtnText: {
    fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text,
  },
});
