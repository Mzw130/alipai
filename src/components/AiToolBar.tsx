import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';

interface Tool {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen: string;
  color: string;
}

const TOOLS: Tool[] = [
  { key: 'reshape', label: '重塑', icon: 'resize', screen: 'HDReshapeScreen', color: '#F59E0B' },
  { key: 'hd_repair', label: '高清修复', icon: 'sparkles', screen: 'HDRepairScreen', color: '#8B5CF6' },
  { key: 'obj_remove', label: '物体消除', icon: 'remove-circle', screen: 'ObjectRemovalScreen', color: '#F87171' },
  { key: 'bg_remove', label: '背景移除', icon: 'layers', screen: 'BackgroundRemovalScreen', color: '#4ADE80' },
  { key: 'realistic', label: '超级写实', icon: 'star', screen: 'SuperRealisticScreen', color: '#FBBF24' },
  { key: 'hair_dye', label: '染发', icon: 'color-palette', screen: 'HairDyeScreen', color: '#F472B6' },
  { key: 'lip_plump', label: '丰唇', icon: 'rose', screen: 'LipPlumpScreen', color: '#FB7185' },
  { key: 'jawline', label: '下颌轮廓', icon: 'body', screen: 'JawlineScreen', color: '#A78BFA' },
  { key: 'hair_smooth', label: '发质顺滑', icon: 'water', screen: 'HairSmoothScreen', color: '#60A5FA' },
  { key: 'hair_repair', label: '发质修复', icon: 'shield-checkmark', screen: 'HairRepairScreen', color: '#34D399' },
  { key: 'proportion', label: '比例调整', icon: 'swap-vertical', screen: 'ProportionScreen', color: '#06B6D4' },
  { key: 'leg_enhance', label: '丰腿', icon: 'fitness', screen: 'LegEnhanceScreen', color: '#F59E0B' },
  { key: 'muscle', label: '肌肉', icon: 'barbell', screen: 'MuscleScreen', color: '#EF4444' },
  { key: 'muscle_enhance', label: '肌肉增强', icon: 'flash', screen: 'MuscleEnhanceScreen', color: '#EC4899' },
  { key: 'ai_edit', label: 'AI编辑', icon: 'color-wand', screen: 'AIEditScreen', color: '#8B5CF6' },
];

export default function AiToolBar() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>AI 编辑工具</Text>
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {TOOLS.map((tool) => (
            <TouchableOpacity
              key={tool.key}
              style={styles.toolItem}
              onPress={() => navigation.navigate(tool.screen as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconCircle, { borderColor: tool.color + '40' }]}>
                <Ionicons name={tool.icon} size={24} color={tool.color} />
              </View>
              <Text style={styles.toolLabel} numberOfLines={2}>
                {tool.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  container: {
    backgroundColor: Colors.bgSecondary,
    paddingVertical: Spacing.md,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.base,
  },
  toolItem: {
    alignItems: 'center',
    width: 70,
    gap: 8,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  toolLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    textAlign: 'center',
    lineHeight: 14,
  },
});
