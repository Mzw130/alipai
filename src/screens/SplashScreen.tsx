import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.container}>
      {/* 渐变背景 */}
      <View style={styles.bgGradient}>
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />
        <View style={styles.bgCircle3} />
      </View>

      {/* 关闭按钮 */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => navigation.replace('MainTabs')}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={22} color={Colors.textSecondary} />
      </TouchableOpacity>

      {/* 中间内容 */}
      <View style={styles.content}>
        {/* 应用图标 */}
        <View style={styles.appIcon}>
          <Ionicons name="color-wand" size={52} color={Colors.primary} />
        </View>

        {/* 标题 */}
        <Text style={styles.title}>准备好开始了吗？</Text>

        {/* 宣传文案 */}
        <View style={styles.features}>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
            <Text style={styles.featureText}>1250+ 款美学视频模板与滤镜</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
            <Text style={styles.featureText}>无限 AI 照片增强</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
            <Text style={styles.featureText}>优先编辑与生成通道</Text>
          </View>
        </View>
      </View>

      {/* 底部按钮区 */}
      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.subscribeBtn}
          onPress={() => navigation.navigate('SubscriptionScreen')}
          activeOpacity={0.8}
        >
          <Ionicons name="diamond" size={18} color={Colors.text} />
          <Text style={styles.subscribeText}>开始订阅</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => navigation.replace('MainTabs')}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>暂不订阅，直接体验</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          订阅即表示同意 服务条款 和 隐私政策
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.bg,
  },
  bgGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  bgCircle1: {
    position: 'absolute', top: -100, right: -80,
    width: 320, height: 320, borderRadius: 160,
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
  },
  bgCircle2: {
    position: 'absolute', bottom: '35%', left: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(212, 175, 55, 0.06)',
  },
  bgCircle3: {
    position: 'absolute', top: '40%', right: -40,
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
  },

  closeBtn: {
    position: 'absolute', top: 56, right: Spacing.xl, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.card, justifyContent: 'center', alignItems: 'center',
  },

  content: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  appIcon: {
    width: 110, height: 110, borderRadius: BorderRadius['2xl'],
    backgroundColor: Colors.card, justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing['2xl'],
    borderWidth: 2, borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  title: {
    fontSize: 28, fontWeight: FontWeight.extrabold, color: Colors.text,
    marginBottom: Spacing['2xl'], textAlign: 'center',
  },
  features: {
    gap: Spacing.md, width: '100%',
  },
  featureRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.card, borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg,
  },
  featureText: {
    fontSize: FontSize.base, color: Colors.textSecondary, flex: 1,
  },

  bottom: {
    paddingHorizontal: Spacing.xl, paddingBottom: Spacing['3xl'], gap: Spacing.md,
  },
  subscribeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.primary, borderRadius: BorderRadius.xl,
    paddingVertical: 16,
  },
  subscribeText: {
    fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text,
  },
  skipBtn: {
    paddingVertical: Spacing.md, alignItems: 'center',
  },
  skipText: { fontSize: FontSize.base, color: Colors.textMuted },
  terms: {
    fontSize: FontSize.xs, color: Colors.textDark, textAlign: 'center',
    marginTop: Spacing.xs,
  },
});
