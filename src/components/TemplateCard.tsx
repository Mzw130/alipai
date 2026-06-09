import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';

interface TemplateCardProps {
  name: string;
  subtitle?: string;
  onPress?: () => void;
}

export default function TemplateCard({ name, subtitle, onPress }: TemplateCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.image}>
        <Ionicons name="videocam" size={36} color={Colors.textMuted} />
        <View style={styles.playBtn}>
          <Ionicons name="play" size={14} color={Colors.bg} />
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    flex: 1,
  },
  image: {
    height: 180,
    backgroundColor: Colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    padding: Spacing.md,
    gap: 2,
  },
  name: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
