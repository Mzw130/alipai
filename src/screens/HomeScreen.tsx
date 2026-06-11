import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
  Image, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';
import AppHeader from '../components/AppHeader';
import AiToolBar from '../components/AiToolBar';
import { VIDEO_TEMPLATES } from '../constants/tools';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = (SCREEN_W - Spacing.xl * 2 - Spacing.md) / 2;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AppHeader />

        <AiToolBar />

        {/* 视频生成器 */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="videocam-outline" size={16} color={Colors.text} />
            <Text style={styles.sectionTitle}>视频生成器</Text>
          </View>
          <View style={styles.genRow}>
            <TouchableOpacity
              style={styles.genCard}
              onPress={() => navigation.navigate('CustomVideoScreen')}
              activeOpacity={0.7}
            >
              <Ionicons name="play-circle-outline" size={22} color={Colors.textSecondary} />
              <Text style={styles.genLabel}>自定义</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.genCard}
              onPress={() => navigation.navigate('MaterialLibraryScreen')}
              activeOpacity={0.7}
            >
              <Ionicons name="grid-outline" size={22} color={Colors.textSecondary} />
              <Text style={styles.genLabel}>我的素材</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 热门: 图生视频 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="flame" size={16} color={Colors.hot} />
              <Text style={[styles.sectionTitle, { color: Colors.hot }]}>热门: 图生视频</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('MainTabs', { screen: 'ExploreTab' })}
              activeOpacity={0.7}
            >
              <Text style={styles.moreText}>更多 &gt;</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.templateGrid}>
            {VIDEO_TEMPLATES.slice(0, 2).map((tpl) => (
              <TouchableOpacity
                key={tpl.id}
                style={styles.templateCard}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('CustomVideoScreen')}
              >
                <Image source={tpl.image} style={styles.templateImage} resizeMode="cover" />
                <View style={styles.templateOverlay}>
                  <Text style={styles.templateName}>{tpl.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.templateGrid}>
            {VIDEO_TEMPLATES.slice(2, 4).map((tpl) => (
              <TouchableOpacity
                key={tpl.id}
                style={styles.templateCard}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('CustomVideoScreen')}
              >
                <Image source={tpl.image} style={styles.templateImage} resizeMode="cover" />
                <View style={styles.templateOverlay}>
                  <Text style={styles.templateName}>{tpl.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  section: { marginTop: Spacing.xl, paddingHorizontal: Spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  moreText: { fontSize: FontSize.sm, color: Colors.textMuted },
  genRow: { flexDirection: 'row', gap: Spacing.md },
  genCard: {
    flex: 1,
    backgroundColor: Colors.cardLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  genLabel: { fontSize: FontSize.base, fontWeight: FontWeight.medium, color: Colors.text },
  templateGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  templateCard: {
    width: CARD_W,
    height: CARD_W * 1.35,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.cardMuted,
  },
  templateImage: { width: '100%', height: '100%' },
  templateOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  templateName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: '#fff',
  },
});
