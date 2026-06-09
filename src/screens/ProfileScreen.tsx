import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MENU_ITEMS = [
  { icon: 'diamond', label: 'Pro 会员', color: Colors.proGold, screen: 'ProMembershipScreen' as const },
  { icon: 'folder-open', label: '我的素材', color: Colors.primary, screen: 'MaterialLibraryScreen' as const },
  { icon: 'settings', label: '设置', color: Colors.textSecondary, screen: null },
  { icon: 'information-circle', label: '关于', color: Colors.textSecondary, screen: null },
];

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* 头部标题 */}
        <Text style={styles.pageTitle}>个人中心</Text>

        {/* 用户信息卡片 */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={36} color={Colors.textMuted} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.nickname}>ClipAI 用户</Text>
            <View style={styles.badgeRow}>
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>免费用户</Text>
              </View>
              <TouchableOpacity
                style={styles.upgradeBtn}
                onPress={() => navigation.navigate('ProMembershipScreen')}
                activeOpacity={0.7}
              >
                <Text style={styles.upgradeBtnText}>升级 Pro</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
        </View>

        {/* 数据统计 */}
        <View style={styles.statsRow}>
          {[
            { value: '0', label: '作品' },
            { value: '0', label: '素材' },
            { value: '0', label: '收藏' },
          ].map((s, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* 菜单列表 */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.menuItem, i < MENU_ITEMS.length - 1 && styles.menuItemBorder]}
              onPress={() => {
                if (item.screen) navigation.navigate(item.screen as any);
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: Colors.cardLight }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* 底部 */}
        <Text style={styles.version}>ClipAI v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Spacing.xl, paddingBottom: 120 },
  pageTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xl,
  },

  // 用户卡片
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.cardLight,
    justifyContent: 'center', alignItems: 'center',
  },
  userInfo: { flex: 1, marginLeft: Spacing.md, gap: Spacing.sm },
  nickname: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  freeBadge: {
    backgroundColor: Colors.cardLight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm, paddingVertical: 2,
  },
  freeBadgeText: { fontSize: FontSize.xs, color: Colors.textMuted },
  upgradeBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md, paddingVertical: 3,
  },
  upgradeBtnText: { fontSize: FontSize.xs, color: Colors.text, fontWeight: FontWeight.semibold },

  // 统计
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted },

  // 菜单
  menuCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.base, paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  menuItemBorder: { borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  menuIcon: {
    width: 36, height: 36, borderRadius: BorderRadius.md,
    justifyContent: 'center', alignItems: 'center',
  },
  menuLabel: { flex: 1, fontSize: FontSize.base, color: Colors.text },

  version: {
    textAlign: 'center',
    marginTop: Spacing['2xl'],
    fontSize: FontSize.sm,
    color: Colors.textDark,
  },
});
