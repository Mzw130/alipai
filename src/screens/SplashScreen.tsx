import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';
import GradientButton from '../components/GradientButton';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const { height: SCREEN_H } = Dimensions.get('window');

const FEATURES = [
  '1250+ 款美学视频模板与滤镜',
  '无限 AI 照片增强',
  '优先 编辑与生成通道',
];

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/design/hero.jpeg')}
        style={styles.heroImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.6)', '#FFFFFF']}
        style={styles.heroFade}
      />

      <TouchableOpacity
        style={styles.allPlansBtn}
        onPress={() => navigation.navigate('ProMembershipScreen')}
        activeOpacity={0.8}
      >
        <Text style={styles.allPlansText}>全部方案</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => navigation.replace('MainTabs')}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={20} color="#fff" />
      </TouchableOpacity>

      <View style={styles.bottom}>
        <Text style={styles.title}>准备好开始了吗？</Text>

        <View style={styles.features}>
          {FEATURES.map((text) => (
            <View key={text} style={styles.featureRow}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={14} color="#fff" />
              </View>
              <Text style={styles.featureText}>{text}</Text>
            </View>
          ))}
        </View>

        <GradientButton
          title="开始订阅"
          variant="coral"
          onPress={() => navigation.navigate('ProMembershipScreen')}
          style={styles.subscribeBtn}
        />

        <Text style={styles.cancelHint}>随时可取消</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_H * 0.55,
    width: '100%',
  },
  heroFade: {
    position: 'absolute',
    top: SCREEN_H * 0.25,
    left: 0,
    right: 0,
    height: SCREEN_H * 0.35,
  },
  allPlansBtn: {
    position: 'absolute',
    top: 56,
    left: Spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    zIndex: 10,
  },
  allPlansText: { color: '#fff', fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  closeBtn: {
    position: 'absolute',
    top: 56,
    right: Spacing.xl,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['3xl'],
    paddingTop: Spacing.xl,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  features: { gap: Spacing.md, marginBottom: Spacing['2xl'] },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: { fontSize: FontSize.base, color: Colors.text, flex: 1 },
  subscribeBtn: { marginBottom: Spacing.md },
  cancelHint: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
