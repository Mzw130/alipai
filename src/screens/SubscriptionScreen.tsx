import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../theme';

export default function SubscriptionScreen() {
  const navigation = useNavigation();

  const handleSubscribe = () => {
    Alert.alert('订阅确认', 'Pro Annual — US$29.99/年', [
      { text: '取消', style: 'cancel' },
      { text: '确认订阅', onPress: () => Alert.alert('提示', '支付功能将于后续版本开放') },
    ]);
  };

  const handleRestore = () => {
    Alert.alert('恢复购买', '正在检查您的购买记录...');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部拖拽条 */}
      <View style={styles.dragBar} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* 关闭 + 恢复购买 */}
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color={Colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRestore} activeOpacity={0.7}>
            <Text style={styles.restoreText}>恢复购买</Text>
          </TouchableOpacity>
        </View>

        {/* 加载状态 */}
        <View style={styles.loadingSection}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>正在加载中</Text>
        </View>

        {/* App 信息卡片 */}
        <View style={styles.appCard}>
          <View style={styles.appIcon}>
            <Ionicons name="color-wand" size={36} color={Colors.primary} />
          </View>
          <View style={styles.appInfo}>
            <Text style={styles.appName}>ClipAI: AI Video Generator</Text>
            <Text style={styles.appMeta}>App Store · 16+</Text>
            <View style={styles.appRating}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons key={i} name="star" size={12} color={Colors.proGold} />
              ))}
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>
        </View>

        {/* 订阅方案卡片 */}
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <Ionicons name="diamond" size={22} color={Colors.proGold} />
            <Text style={styles.planTitle}>Pro Annual</Text>
          </View>
          <Text style={styles.planPrice}>US$ 29.99<Text style={styles.planPeriod}> / 年</Text></Text>

          <View style={styles.divider} />

          {/* 权益 */}
          <View style={styles.benefitsList}>
            {[
              '1250+ 视频模板与滤镜',
              '无限 AI 照片增强',
              '优先处理通道',
              '自动续期，随时取消',
            ].map((b, i) => (
              <View key={i} style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
                <Text style={styles.benefitText}>{b}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* 续期说明 */}
          <View style={styles.renewalSection}>
            <Text style={styles.renewalTitle}>续期与取消</Text>
            <Text style={styles.renewalText}>
              订阅将在当前周期结束前 24 小时内自动续期。{'\n'}
              取消路径：设置 {'>'} Apple 账户 {'>'} 订阅{'\n'}
              在订阅期结束前至少 24 小时关闭自动续期，即可取消。
            </Text>
          </View>

          <View style={styles.divider} />

          {/* 账户 */}
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Apple ID</Text>
            <Text style={styles.accountValue}>19839325301@163.com</Text>
          </View>
        </View>

        {/* 订阅按钮 */}
        <TouchableOpacity style={styles.subscribeBtn} activeOpacity={0.8} onPress={handleSubscribe}>
          <Ionicons name="lock-closed" size={18} color={Colors.text} />
          <Text style={styles.subscribeBtnText}>订阅</Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          确认购买后，费用将从您的 Apple ID 账户扣除。
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  dragBar: {
    width: 36, height: 5, borderRadius: 3,
    backgroundColor: Colors.textDark, alignSelf: 'center', marginTop: Spacing.sm,
  },
  content: { padding: Spacing.xl, paddingBottom: Spacing['4xl'] },

  topRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  restoreText: { fontSize: FontSize.base, color: Colors.primary, fontWeight: FontWeight.medium },

  // Loading
  loadingSection: { alignItems: 'center', paddingVertical: Spacing.base, gap: Spacing.md },
  loadingText: { fontSize: FontSize.base, color: Colors.textMuted },

  // App Card
  appCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, marginTop: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  appIcon: {
    width: 60, height: 60, borderRadius: BorderRadius.md,
    backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center',
  },
  appInfo: { flex: 1, gap: 3 },
  appName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  appMeta: { fontSize: FontSize.xs, color: Colors.textMuted },
  appRating: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 },
  ratingText: { fontSize: FontSize.xs, color: Colors.textMuted, marginLeft: 4 },

  // Plan Card
  planCard: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg,
    padding: Spacing.xl, marginTop: Spacing.md,
    borderWidth: 2, borderColor: Colors.primary,
  },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  planTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },
  planPrice: { fontSize: FontSize['3xl'], fontWeight: FontWeight.extrabold, color: Colors.text, marginTop: Spacing.sm },
  planPeriod: { fontSize: FontSize.md, fontWeight: FontWeight.regular, color: Colors.textMuted },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.lg },

  benefitsList: { gap: Spacing.md },
  benefitItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  benefitText: { fontSize: FontSize.base, color: Colors.textSecondary, flex: 1 },

  renewalSection: { gap: Spacing.sm },
  renewalTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.text },
  renewalText: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20 },

  accountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  accountLabel: { fontSize: FontSize.base, color: Colors.textSecondary },
  accountValue: { fontSize: FontSize.sm, color: Colors.textMuted },

  subscribeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.primary, borderRadius: BorderRadius.xl,
    paddingVertical: 16, marginTop: Spacing.xl, ...Shadow.button,
  },
  subscribeBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },

  footerNote: {
    fontSize: FontSize.xs, color: Colors.textDark, textAlign: 'center', marginTop: Spacing.md,
  },
});
