import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface AppHeaderProps {
  showCredits?: boolean;
  credits?: number;
  onGridPress?: () => void;
}

export default function AppHeader({ showCredits, credits = 0, onGridPress }: AppHeaderProps) {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.header}>
      <Text style={styles.logo}>
        Clip<Text style={styles.logoItalic}>AI</Text>
      </Text>
      <View style={styles.right}>
        {showCredits ? (
          <View style={styles.creditsPill}>
            <View style={styles.creditIcon}>
              <Ionicons name="star" size={10} color="#fff" />
            </View>
            <Text style={styles.creditsText}>{credits}</Text>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ProMembershipScreen')}
          >
            <LinearGradient
              colors={[Colors.proGradientStart, Colors.proGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.proBtn}
            >
              <Text style={styles.proText}>Pro</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.gridBtn}
          activeOpacity={0.7}
          onPress={onGridPress || (() => navigation.navigate('MaterialLibraryScreen'))}
        >
          <Ionicons name="grid-outline" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  logo: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text,
    fontStyle: 'italic',
  },
  logoItalic: {
    fontStyle: 'italic',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  proBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  proText: {
    color: '#fff',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  creditsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    ...{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  },
  creditIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  creditsText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  gridBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
