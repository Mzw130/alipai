import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';

const TABS = ['最近', '实况', '截图'];
const MOCK_PHOTOS = Array.from({ length: 12 }, (_, i) => i);

type Route = RouteProp<RootStackParamList, 'PhotoPickerScreen'>;
const GRID_W = (Dimensions.get('window').width - Spacing.xl * 2 - Spacing.sm * 2) / 3;

export default function PhotoPickerScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<Route>();
  const toolType = route.params?.toolType || '';
  const [activeTab, setActiveTab] = useState('最近');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const pickFromAlbum = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.9,
    });
    if (!result.canceled && result.assets.length > 0) {
      setSelectedPhoto(result.assets[0].uri);
    }
  }, []);

  const handleConfirm = () => {
    if (selectedPhoto && toolType) {
      const screenMap: Record<string, string> = {
        super_realistic: 'SuperRealisticScreen',
        hd_repair: 'HDRepairScreen',
        leg_enhance: 'LegEnhanceScreen',
        muscle: 'MuscleScreen',
        muscle_enhance: 'MuscleEnhanceScreen',
        proportion: 'ProportionScreen',
        lip_plump: 'LipPlumpScreen',
        obj_remove: 'ObjectRemovalScreen',
        bg_remove: 'BackgroundRemovalScreen',
        reshape: 'HDReshapeScreen',
        beauty: 'BeautyScreen',
        hair_dye: 'HairDyeScreen',
        jawline: 'JawlineScreen',
        hair_smooth: 'HairSmoothScreen',
        hair_repair: 'HairRepairScreen',
        color_grade: 'ColorGradeScreen',
        filter: 'FilterScreen',
        ai_edit: 'AIEditScreen',
      };
      const screen = screenMap[toolType];
      if (screen) navigation.replace(screen, { imageUri: selectedPhoto });
      else navigation.goBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>相册</Text>
        <View style={styles.avatar}>
          <Ionicons name="flower-outline" size={18} color={Colors.primary} />
        </View>
      </View>

      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        <TouchableOpacity style={styles.pickBox} onPress={pickFromAlbum}>
          <Ionicons name="add" size={32} color={Colors.textMuted} />
          <Text style={styles.pickLabel}>选择照片</Text>
        </TouchableOpacity>
        {MOCK_PHOTOS.map((i) => (
          <TouchableOpacity key={i} style={styles.photoItem} onPress={pickFromAlbum}>
            <Image
              source={require('../../assets/design/template-flower.jpeg')}
              style={styles.photoImage}
              resizeMode="cover"
            />
            {selectedPhoto && i === 0 && (
              <View style={styles.selectedOverlay}>
                <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedPhoto && (
        <View style={styles.bottomBar}>
          <Text style={styles.selectedCount}>已选择 1 张</Text>
          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmText}>确认</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text },
  avatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.cardLight, justifyContent: 'center', alignItems: 'center',
  },
  tabRow: {
    flexDirection: 'row', paddingHorizontal: Spacing.xl, gap: Spacing.sm, marginBottom: Spacing.md,
  },
  tab: {
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full, backgroundColor: Colors.cardLight,
  },
  tabActive: { backgroundColor: Colors.card },
  tabText: { fontSize: FontSize.sm, color: Colors.textMuted },
  tabTextActive: { color: Colors.text, fontWeight: FontWeight.semibold },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm,
    paddingHorizontal: Spacing.xl, paddingBottom: 100,
  },
  pickBox: {
    width: GRID_W, height: GRID_W,
    backgroundColor: Colors.cardLight, borderRadius: BorderRadius.md,
    justifyContent: 'center', alignItems: 'center', gap: 4,
  },
  pickLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  photoItem: { width: GRID_W, height: GRID_W, borderRadius: BorderRadius.md, overflow: 'hidden' },
  photoImage: { width: '100%', height: '100%' },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(123,97,255,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg, paddingBottom: Spacing['2xl'],
    backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  selectedCount: { fontSize: FontSize.base, color: Colors.textSecondary },
  confirmBtn: {
    backgroundColor: Colors.text, borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing['2xl'], paddingVertical: Spacing.sm,
  },
  confirmText: { color: '#fff', fontSize: FontSize.base, fontWeight: FontWeight.semibold },
});
