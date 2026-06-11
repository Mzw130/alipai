import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Shadow } from '../theme';

type Variant = 'primary' | 'coral' | 'pro';

const GRADIENTS: Record<Variant, [string, string]> = {
  primary: [Colors.generateGradientStart, Colors.generateGradientEnd],
  coral: [Colors.ctaGradientStart, Colors.ctaGradientEnd],
  pro: [Colors.proGradientStart, Colors.proGradientEnd],
};

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  credits?: number;
}

export default function GradientButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  loading,
  style,
  textStyle,
  credits,
}: GradientButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.wrap, style, (disabled || loading) && styles.disabled]}
    >
      <LinearGradient
        colors={GRADIENTS[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            {icon && <Ionicons name={icon} size={18} color="#fff" />}
            <Text style={[styles.text, textStyle]}>{title}</Text>
            {credits !== undefined && (
              <>
                <Ionicons name="star" size={14} color="#fff" style={{ marginLeft: 8 }} />
                <Text style={styles.credits}>{credits}</Text>
              </>
            )}
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    ...Shadow.button,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 6,
  },
  text: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  credits: {
    color: '#fff',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  disabled: {
    opacity: 0.5,
  },
});
