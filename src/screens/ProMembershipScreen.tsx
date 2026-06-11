import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';
import GradientButton from '../components/GradientButton';

const { height: SCREEN_H } = Dimensions.get('window');

const BENEFITS = [
  '免费使用 1,000+ 视频模板',
  '积分充值享 5 折优惠',
  '订阅即得 1500 积分',
];

const PLANS = [
  { id: 'pro_weekly', title: 'Pro Weekly', price: '$19.99/week' },
  { id: 'pro_annual', title: 'Pro Annual', price: '$39.99/year', badge: '59% 优惠', selected: true },
  { id: 'super_pro_annual', title: 'Super Pro Annual', subtitle: 'AI 视频生成超级版', price: '更省钱', gradient: true },
];

export default function ProMembershipScreen() {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState('pro_annual');

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/design/paywall-hero.jpeg')}
        style={styles.heroImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)', '#000']}
        style={styles.heroFade}
      />

      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={20} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={{ height: SCREEN_H * 0.32 }} />

        <View style={styles.benefits}>
          {BENEFITS.map((b) => (
            <View key={b} style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={18} color="#fff" />
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>

        <View style={styles.plans}>
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            if (plan.gradient) {
              return (
                <TouchableOpacity
                  key={plan.id}
                  activeOpacity={0.85}
                  onPress={() => setSelectedPlan(plan.id)}
                >
                  <LinearGradient
                    colors={['#FF5E62', '#FF9966']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.superPlan}
                  >
                    <View>
                      <Text style={styles.superTitle}>{plan.title}</Text>
                      {plan.subtitle && <Text style={styles.superSub}>{plan.subtitle}</Text>}
                    </View>
                    <View style={styles.saveBadge}>
                      <Text style={styles.saveText}>{plan.price}</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity
                key={plan.id}
                style={[styles.planCard, isSelected && styles.planCardActive]}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.8}
              >
                {plan.badge && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{plan.badge}</Text>
                  </View>
                )}
                <Text style={styles.planTitle}>{plan.title}</Text>
                <Text style={styles.planPrice}>{plan.price}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <GradientButton
          title="继续"
          variant="pro"
          onPress={() => {
            const plan = PLANS.find((p) => p.id === selectedPlan);
            Alert.alert('订阅确认', `已选择 ${plan?.title}`, [
              { text: '取消', style: 'cancel' },
              { text: '确认', onPress: () => navigation.navigate('SubscriptionScreen' as never) },
            ]);
          }}
          style={styles.continueBtn}
        />

        <Text style={styles.footerText}>$39.99 每年，随时取消</Text>
        <View style={styles.footerLinks}>
          {['条款', '隐私政策', '恢复购买'].map((link, i) => (
            <React.Fragment key={link}>
              {i > 0 && <Text style={styles.footerDot}>·</Text>}
              <TouchableOpacity onPress={() => Alert.alert(link)}>
                <Text style={styles.footerLink}>{link}</Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  heroImage: { position: 'absolute', top: 0, left: 0, right: 0, height: SCREEN_H * 0.5 },
  heroFade: { position: 'absolute', top: SCREEN_H * 0.2, left: 0, right: 0, height: SCREEN_H * 0.35 },
  closeBtn: {
    position: 'absolute', top: 56, left: Spacing.xl, zIndex: 10,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  content: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing['3xl'] },
  benefits: { gap: Spacing.md, marginBottom: Spacing.xl },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  benefitText: { fontSize: FontSize.base, color: '#fff' },
  plans: { gap: Spacing.md, marginBottom: Spacing.xl },
  planCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'relative',
  },
  planCardActive: { borderColor: Colors.primary },
  discountBadge: {
    position: 'absolute',
    top: -10,
    right: Spacing.lg,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  discountText: { fontSize: FontSize.xs, color: '#fff', fontWeight: FontWeight.semibold },
  planTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: '#fff' },
  planPrice: { fontSize: FontSize.base, color: '#fff' },
  superPlan: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  superTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: '#fff' },
  superSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  saveBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  saveText: { fontSize: FontSize.sm, color: '#FF5E62', fontWeight: FontWeight.semibold },
  continueBtn: { marginBottom: Spacing.md },
  footerText: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: Spacing.sm },
  footerLinks: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: Spacing.sm },
  footerLink: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)' },
  footerDot: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.5)' },
});
