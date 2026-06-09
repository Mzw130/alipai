import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';
import AiToolBar from '../components/AiToolBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const { width: SCREEN_W } = Dimensions.get('window');

const TEMPLATES = [
  { id: '1', name: 'Flower Gift', desc: 'AI视频模板', color: '#1a1a2e' },
  { id: '2', name: 'Skirt Twirl', desc: 'AI视频模板', color: '#1a1e1a' },
];

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ===== Header ===== */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Ionicons name="color-wand" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.logo}>
              Clip<Text style={styles.logoAccent}>AI</Text>
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.proBadge}
              onPress={() => navigation.navigate('ProMembershipScreen')}
              activeOpacity={0.7}
            >
              <Ionicons name="diamond" size={12} color={Colors.bg} />
              <Text style={styles.proBadgeText}>PRO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.materialBtn}
              onPress={() => navigation.navigate('MaterialLibraryScreen')}
              activeOpacity={0.7}
            >
              <Ionicons name="folder-open-outline" size={20} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== AI 工具横栏 ===== */}
        <AiToolBar />

        {/* ===== 视频生成器 ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>视频生成器</Text>
          <View style={styles.genRow}>
            <TouchableOpacity
              style={styles.genCard}
              onPress={() => navigation.navigate('CustomVideoScreen')}
              activeOpacity={0.7}
            >
              <View style={styles.genIconCircle}>
                <Ionicons name="add-circle" size={32} color={Colors.primary} />
              </View>
              <Text style={styles.genLabel}>自定义</Text>
              <Text style={styles.genSub}>AI 视频创作</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.genCard}
              onPress={() => navigation.navigate('MaterialLibraryScreen')}
              activeOpacity={0.7}
            >
              <View style={styles.genIconCircle}>
                <Ionicons name="images" size={32} color={Colors.primary} />
              </View>
              <Text style={styles.genLabel}>我的素材</Text>
              <Text style={styles.genSub}>浏览与管理</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== 热门板块 ===== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="flame" size={18} color={Colors.proGold} />
              <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>热门</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.trendingCard}
            onPress={() => navigation.navigate('ExploreTab' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.trendingContent}>
              <View style={styles.trendingIconBox}>
                <Ionicons name="play-circle" size={32} color={Colors.primary} />
              </View>
              <View style={styles.trendingInfo}>
                <Text style={styles.trendingTitle}>图生视频</Text>
                <Text style={styles.trendingSub}>为您的照片注入动感</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('ExploreTab' as any)}
              style={styles.moreLink}
              activeOpacity={0.7}
            >
              <Text style={styles.moreText}>更多</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* ===== 模板推荐 ===== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>推荐模板</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.viewAll}>查看全部</Text>
            </TouchableOpacity>
          </View>

          {TEMPLATES.map((tpl) => (
            <TouchableOpacity key={tpl.id} style={styles.templateCard} activeOpacity={0.7}>
              <View style={[styles.templateImage, { backgroundColor: tpl.color }]}>
                <View style={styles.templateBadge}>
                  <Ionicons name="play" size={10} color={Colors.text} />
                  <Text style={styles.templateBadgeText}>AI 视频</Text>
                </View>
                <View style={styles.templatePlayBtn}>
                  <Ionicons name="play-circle" size={36} color={Colors.primary} />
                </View>
              </View>
              <View style={styles.templateInfo}>
                <Text style={styles.templateName}>{tpl.name}</Text>
                <Text style={styles.templateDesc}>{tpl.desc}</Text>
              </View>
              <TouchableOpacity style={styles.useBtn} activeOpacity={0.7}>
                <Ionicons name="color-wand" size={14} color={Colors.text} />
                <Text style={styles.useBtnText}>使用</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.base, paddingBottom: Spacing.sm,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  logoIcon: {
    width: 30, height: 30, borderRadius: BorderRadius.sm,
    backgroundColor: Colors.card, justifyContent: 'center', alignItems: 'center',
  },
  logo: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, color: Colors.text },
  logoAccent: { color: Colors.primary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  proBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.proGold, paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  proBadgeText: { fontSize: 10, fontWeight: FontWeight.extrabold, color: Colors.bg },
  materialBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.card, justifyContent: 'center', alignItems: 'center',
  },

  // Section
  section: { marginTop: Spacing.xl, paddingHorizontal: Spacing.xl },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.md },
  viewAll: { fontSize: FontSize.sm, color: Colors.primary },

  // Generator
  genRow: { flexDirection: 'row', gap: Spacing.md },
  genCard: {
    flex: 1, backgroundColor: Colors.card, borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.xl, alignItems: 'center', gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  genIconCircle: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  genLabel: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  genSub: { fontSize: FontSize.xs, color: Colors.textMuted },

  // Trending
  trendingCard: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.lg,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  trendingContent: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  trendingIconBox: {
    width: 52, height: 52, borderRadius: BorderRadius.md,
    backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center',
  },
  trendingInfo: { gap: 3 },
  trendingTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  trendingSub: { fontSize: FontSize.sm, color: Colors.textMuted },
  moreLink: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  moreText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.medium },

  // Templates
  templateCard: {
    flexDirection: 'row', backgroundColor: Colors.card, borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md, overflow: 'hidden', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  templateImage: {
    width: 100, height: 120, justifyContent: 'space-between',
    padding: Spacing.sm,
  },
  templateBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: BorderRadius.sm,
    paddingHorizontal: 6, paddingVertical: 3, alignSelf: 'flex-start',
  },
  templateBadgeText: { fontSize: 9, color: Colors.text },
  templatePlayBtn: {
    alignSelf: 'center',
  },
  templateInfo: { flex: 1, padding: Spacing.md, gap: 4 },
  templateName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  templateDesc: { fontSize: FontSize.xs, color: Colors.textMuted },
  useBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primary, borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    marginRight: Spacing.md,
  },
  useBtnText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.text },
});
