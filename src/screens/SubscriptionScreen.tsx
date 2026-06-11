import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';

const { height: SCREEN_H } = Dimensions.get('window');

export default function SubscriptionScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/design/hero.jpeg')}
        style={styles.heroImage}
        resizeMode="cover"
      />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)']} style={styles.heroFade} />

      <TouchableOpacity style={styles.allPlansBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.allPlansText}>全部方案</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={18} color="#fff" />
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>正在加载中...</Text>
        </View>
      )}

      <View style={styles.sheet}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>App Store</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close-circle" size={24} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.planCard}>
          <View style={styles.planRow}>
            <LinearGradient colors={[Colors.proGradientStart, Colors.proGradientEnd]} style={styles.appIcon}>
              <Ionicons name="play" size={20} color="#fff" />
            </LinearGradient>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>Pro Annual</Text>
              <Text style={styles.planApp}>ClipAI: AI Video Generator</Text>
              <Text style={styles.planType}>订阅</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.price}>US$ 29.99/年</Text>
          <Text style={styles.legal}>
            在每个续期日期前至少一天，你可随时在"设置" &gt; "Apple 账户"中取消。方案将自动续期，直到取消为止。
          </Text>
          <Text style={styles.account}>账户: user@example.com</Text>
        </View>

        <TouchableOpacity
          style={styles.subscribeBtn}
          onPress={() => { setLoading(false); navigation.goBack(); }}
        >
          <Text style={styles.subscribeText}>订阅</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  heroImage: { position: 'absolute', top: 0, left: 0, right: 0, height: SCREEN_H * 0.55 },
  heroFade: { position: 'absolute', top: SCREEN_H * 0.3, left: 0, right: 0, height: SCREEN_H * 0.25 },
  allPlansBtn: {
    position: 'absolute', top: 56, left: Spacing.xl, zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: BorderRadius.full,
  },
  allPlansText: { color: '#fff', fontSize: FontSize.sm },
  closeBtn: {
    position: 'absolute', top: 56, right: Spacing.xl, zIndex: 10,
    width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  loadingBox: {
    position: 'absolute', top: '40%', alignSelf: 'center', zIndex: 5,
    backgroundColor: 'rgba(0,0,0,0.6)', padding: Spacing.xl, borderRadius: BorderRadius.lg, alignItems: 'center', gap: Spacing.sm,
  },
  loadingText: { color: '#fff', fontSize: FontSize.sm },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#F2F2F7', borderTopLeftRadius: BorderRadius['2xl'], borderTopRightRadius: BorderRadius['2xl'],
    padding: Spacing.xl, paddingBottom: Spacing['3xl'],
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  sheetTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  planCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.lg },
  planRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  appIcon: { width: 48, height: 48, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center' },
  planInfo: { flex: 1 },
  planName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  planApp: { fontSize: FontSize.sm, color: Colors.textMuted },
  planType: { fontSize: FontSize.xs, color: Colors.textMuted },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: Spacing.md },
  price: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.md },
  legal: { fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 18, marginBottom: Spacing.md },
  account: { fontSize: FontSize.sm, color: Colors.textSecondary },
  subscribeBtn: {
    backgroundColor: '#007AFF', borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base, alignItems: 'center',
  },
  subscribeText: { color: '#fff', fontSize: FontSize.md, fontWeight: FontWeight.semibold },
});
