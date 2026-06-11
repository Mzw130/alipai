import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';
import AppHeader from '../components/AppHeader';
import { EXPLORE_COLLECTIONS } from '../constants/tools';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const CARD_W = 140;

export default function AIToolsScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader showCredits credits={5000} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {EXPLORE_COLLECTIONS.map((collection) => (
          <View key={collection.key} style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => navigation.navigate('AIToolDetailScreen', { collectionKey: collection.key })}
            >
              <Text style={styles.sectionTitle}>{collection.title}</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {collection.items.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.card}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate('AIToolDetailScreen', { collectionKey: collection.key })}
                >
                  <Image
                    source={require('../../assets/design/template-flower.jpeg')}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <View style={styles.cardOverlay}>
                    <Text style={styles.cardLabel} numberOfLines={1}>{item}</Text>
                  </View>
                  {collection.key === 'freeze' && (
                    <View style={styles.numberBadge}>
                      <Text style={styles.numberText}>{idx + 1}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingTop: Spacing.sm },
  section: { marginBottom: Spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    fontStyle: 'italic',
  },
  horizontalScroll: { paddingHorizontal: Spacing.xl, gap: Spacing.md },
  card: {
    width: CARD_W,
    height: CARD_W * 1.4,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.cardMuted,
  },
  cardImage: { width: '100%', height: '100%' },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  cardLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: '#fff',
    paddingHorizontal: Spacing.sm,
  },
  numberBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    alignSelf: 'center',
  },
  numberText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: '#fff',
  },
});
