import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../theme';

const PLANS = [
  {
    id: 'pro_monthly',
    title: 'Pro 月度',
    subtitle: '畅享全部 AI 工具',
    active: false,
  },
  {
    id: 'pro_annual',
    title: 'Pro 年度',
    subtitle: '性价比之选',
    active: false,
  },
  {
    id: 'super_pro',
    title: 'Super Pro',
    subtitle: '旗舰版 · 解锁全部功能',
    active: false,
  },
];

export default function ProMembershipScreen() {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState('pro_annual');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* 关闭按钮 */}
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color={Colors.textMuted} />
        </TouchableOpacity>

        {/* 头部图标 */}
        <View style={styles.headerIcon}>
          <Ionicons name="diamond" size={40} color={Colors.proGold} />
        </View>

        {/* 标题 */}
        <Text style={styles.title}>解锁 Pro 会员</Text>

        {/* 福利文案 */}
        <View style={styles.benefitsCard}>
          {[
            '畅享全部 AI 编辑工具',
            '高清画质 · 无限导出',
            '订阅即获专属积分回馈',
          ].map((benefit, i) => (
            <View key={i} style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        {/* 套餐选择 */}
        <View style={styles.plansSection}>
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                style={[styles.planCard, isSelected && styles.planCardActive]}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.7}
              >
                <View style={styles.planInfo}>
                  <View style={styles.planHeader}>
                    <Text style={styles.planTitle}>{plan.title}</Text>
                  </View>
                  {plan.subtitle && (
                    <Text style={styles.planSubtitle}>{plan.subtitle}</Text>
                  )}
                </View>
                <View style={[styles.radio, isSelected && styles.radioActive]}>
                  {isSelected && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 继续按钮 */}
        <TouchableOpacity
          style={styles.continueBtn}
          activeOpacity={0.8}
          onPress={() => {
            const plan = PLANS.find(p => p.id === selectedPlan);
            Alert.alert('订阅确认', `已选择 ${plan?.title} 方案`, [
              { text: '取消', style: 'cancel' },
              { text: '确认订阅', onPress: () => Alert.alert('提示', '支付功能将于后续版本开放') },
            ]);
          }}
        >
          <Text style={styles.continueText}>继续</Text>
        </TouchableOpacity>

        {/* 底部说明 */}
        <View style={styles.footerWrap}>
          <Text style={styles.footerText}>订阅自动续期，可随时取消</Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => Alert.alert('条款', '服务条款')}>
              <Text style={styles.footerLink}>条款</Text>
            </TouchableOpacity>
            <Text style={styles.footerSeparator}>·</Text>
            <TouchableOpacity onPress={() => Alert.alert('隐私', '隐私政策')}>
              <Text style={styles.footerLink}>隐私政策</Text>
            </TouchableOpacity>
            <Text style={styles.footerSeparator}>·</Text>
            <TouchableOpacity onPress={() => Alert.alert('恢复', '正在恢复购买...')}>
              <Text style={styles.footerLink}>恢复购买</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing['4xl'],
  },
  closeBtn: {
    alignSelf: 'flex-end',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  // Header
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius['2xl'],
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.proGold,
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },

  // Benefits
  benefitsCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  benefitText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },

  // Plans
  plansSection: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  planCardActive: {
    borderColor: Colors.proGold,
    backgroundColor: '#1A1A0D',
  },
  planInfo: {
    flex: 1,
    gap: 4,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  planTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  planSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: Colors.proGold,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.proGold,
  },

  // Continue
  continueBtn: {
    backgroundColor: Colors.proGold,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    marginTop: Spacing['2xl'],
    ...Shadow.button,
  },
  continueText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.bg,
  },

  // Footer
  footerWrap: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  footerText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  footerLink: {
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  footerSeparator: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
});
