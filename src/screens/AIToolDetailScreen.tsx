import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';
import { EXPLORE_COLLECTIONS } from '../constants/tools';

type Route = RouteProp<RootStackParamList, 'AIToolDetailScreen'>;
const GRID_W = (Dimensions.get('window').width - Spacing.xl * 2 - Spacing.md) / 2;

const CATEGORY_TAGS: Record<string, string[]> = {
  true_skin: ['#Street Race', '#Evening Wear', '#True Skin Series', '#The Holiday Edi...'],
  evening: ['#True Skin Series', '#The Holiday Edi...', '#Evening Wear'],
  freeze: ['#Freeze The Moment'],
  ai_body: ['#AI Body'],
  street: ['#Street Race'],
  holiday: ['#The Holiday Edi'],
};

export default function AIToolDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<Route>();
  const collectionKey = route.params?.collectionKey || 'true_skin';
  const collection = EXPLORE_COLLECTIONS.find((c) => c.key === collectionKey);
  const tags = CATEGORY_TAGS[collectionKey] || [`#${collection?.title || ''}`];
  const [activeTag, setActiveTag] = useState(tags[tags.length - 1] || tags[0]);

  if (!collection) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: Spacing.xl }}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>#{collection.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagRow}>
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.tag, activeTag === tag && styles.tagActive]}
            onPress={() => setActiveTag(tag)}
          >
            <Text style={[styles.tagText, activeTag === tag && styles.tagTextActive]}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.grid}>
        {collection.items.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('SuperRealisticScreen')}
          >
            <Image
              source={require('../../assets/design/template-flower.jpeg')}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.heartBtn}>
              <Ionicons name="heart-outline" size={18} color="#FF4444" />
            </TouchableOpacity>
            <View style={styles.cardOverlay}>
              <Text style={styles.cardLabel}>{item}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.card },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  tagRow: { paddingHorizontal: Spacing.xl, gap: Spacing.sm, marginBottom: Spacing.lg },
  tag: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  tagActive: { backgroundColor: '#F3E8FF', borderColor: Colors.primary },
  tagText: { fontSize: FontSize.sm, color: Colors.text },
  tagTextActive: { color: Colors.primary, fontWeight: FontWeight.medium },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md,
    paddingHorizontal: Spacing.xl, paddingBottom: 100,
  },
  card: {
    width: GRID_W, height: GRID_W * 1.35,
    borderRadius: BorderRadius.lg, overflow: 'hidden', backgroundColor: Colors.cardMuted,
  },
  cardImage: { width: '100%', height: '100%' },
  heartBtn: { position: 'absolute', top: Spacing.sm, right: Spacing.sm },
  cardOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingVertical: Spacing.sm, alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  cardLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: '#fff' },
});
