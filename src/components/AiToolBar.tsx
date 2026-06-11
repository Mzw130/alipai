import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';
import { HOME_TOOLS } from '../constants/tools';

export default function AiToolBar() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {HOME_TOOLS.map((tool) => (
            <TouchableOpacity
              key={tool.key}
              style={styles.toolItem}
              onPress={() => navigation.navigate(tool.screen)}
              activeOpacity={0.7}
            >
              <View style={styles.iconSquare}>
                <Ionicons name={tool.icon} size={22} color={Colors.text} />
                {tool.isPro && (
                  <View style={styles.proBadge}>
                    <Text style={styles.proBadgeText}>Pro</Text>
                  </View>
                )}
              </View>
              <Text style={styles.toolLabel} numberOfLines={1}>{tool.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.handle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: Spacing.sm },
  container: {
    backgroundColor: Colors.bgSecondary,
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  toolItem: { alignItems: 'center', width: 64, gap: 6 },
  iconSquare: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  proBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.proBadge,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.sm,
  },
  proBadgeText: { fontSize: 8, color: '#fff', fontWeight: FontWeight.bold },
  toolLabel: {
    fontSize: 11,
    color: Colors.text,
    fontWeight: FontWeight.medium,
    textAlign: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: Spacing.sm,
  },
});
