import { Ionicons } from '@expo/vector-icons';

export interface ToolDef {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen: string;
  isPro?: boolean;
}

export const HOME_TOOLS: ToolDef[] = [
  { key: 'hd_repair', label: '高清修复', icon: 'scan-outline', screen: 'HDRepairScreen' },
  { key: 'obj_remove', label: '物体消除', icon: 'brush-outline', screen: 'ObjectRemovalScreen', isPro: true },
  { key: 'bg_remove', label: '背景移除', icon: 'person-outline', screen: 'BackgroundRemovalScreen', isPro: true },
  { key: 'realistic', label: '超级写实', icon: 'image-outline', screen: 'SuperRealisticScreen' },
  { key: 'lip_plump', label: '丰唇', icon: 'heart-outline', screen: 'LipPlumpScreen' },
  { key: 'hair_dye', label: '染发', icon: 'color-palette-outline', screen: 'HairDyeScreen', isPro: true },
  { key: 'jawline', label: '下颌轮廓', icon: 'body-outline', screen: 'JawlineScreen' },
  { key: 'hair_smooth', label: '顺滑发质', icon: 'water-outline', screen: 'HairSmoothScreen' },
  { key: 'hair_repair', label: '发质修复', icon: 'sparkles-outline', screen: 'HairRepairScreen' },
  { key: 'ai_edit', label: 'AI 编辑', icon: 'color-wand-outline', screen: 'AIEditScreen' },
];

export const TOOL_CATEGORIES = [
  {
    key: 'reshape',
    title: '重塑',
    tools: [
      { key: 'proportion', label: '比例调整', icon: 'resize-outline' as const, screen: 'ProportionScreen' },
      { key: 'leg_enhance', label: '丰腿', icon: 'walk-outline' as const, screen: 'LegEnhanceScreen' },
      { key: 'muscle', label: '肌肉', icon: 'barbell-outline' as const, screen: 'MuscleScreen' },
      { key: 'muscle_enhance', label: '肌肉增强', icon: 'flash-outline' as const, screen: 'MuscleEnhanceScreen' },
    ],
  },
  {
    key: 'ai_tools',
    title: 'AI 工具',
    tools: [
      { key: 'hd_repair', label: '高清修复', icon: 'scan-outline' as const, screen: 'HDRepairScreen' },
      { key: 'obj_remove', label: '物体消除', icon: 'brush-outline' as const, screen: 'ObjectRemovalScreen', isPro: true },
      { key: 'bg_remove', label: '背景移除', icon: 'person-outline' as const, screen: 'BackgroundRemovalScreen', isPro: true },
      { key: 'realistic', label: '超级写实', icon: 'image-outline' as const, screen: 'SuperRealisticScreen' },
      { key: 'ai_edit', label: 'AI 编辑', icon: 'color-wand-outline' as const, screen: 'AIEditScreen' },
    ],
  },
  {
    key: 'face',
    title: '面部工具',
    tools: [
      { key: 'beauty', label: '美颜', icon: 'happy-outline' as const, screen: 'BeautyScreen' },
      { key: 'hair_dye', label: '染发', icon: 'color-palette-outline' as const, screen: 'HairDyeScreen', isPro: true },
      { key: 'lip_plump', label: '丰唇', icon: 'heart-outline' as const, screen: 'LipPlumpScreen' },
      { key: 'jawline', label: '下颌轮廓', icon: 'body-outline' as const, screen: 'JawlineScreen' },
    ],
  },
];

export const VIDEO_TEMPLATES = [
  { id: '1', name: 'Flower Gift', prompt: 'Flower Gift style video', image: require('../../assets/design/template-flower.jpeg') },
  { id: '2', name: 'Skirt Twirl', prompt: 'Skirt Twirl style video', image: require('../../assets/design/template-flower.jpeg') },
  { id: '3', name: 'Playful Smile', prompt: 'Playful Smile style video', image: require('../../assets/design/template-flower.jpeg') },
  { id: '4', name: 'Slow Strip', prompt: 'Slow Strip style video', image: require('../../assets/design/template-flower.jpeg') },
];

export const EXPLORE_COLLECTIONS = [
  {
    key: 'freeze',
    title: 'Freeze The Moment',
    items: ['1', '2', '3', '4'],
  },
  {
    key: 'ai_body',
    title: 'AI Body',
    items: ['Slim Thick', 'Apple Shape', 'Athletic', 'Hourglass'],
  },
  {
    key: 'street',
    title: 'Street Race',
    items: ['outdoor road', 'street racer', 'Night Light', 'race scen...'],
  },
  {
    key: 'true_skin',
    title: 'True Skin Series',
    items: ['Soft Matte01', 'Natutal01'],
  },
  {
    key: 'evening',
    title: 'Evening Wear',
    items: ['Crimson Elegance Gown', 'Elegant Bow Ensemble', 'Black Ballet Chic', 'Classic Body Dress'],
  },
  {
    key: 'holiday',
    title: 'The Holiday Edi',
    items: ['Holiday Magic', 'Winter Glow', 'Festive Light'],
  },
];

export const TOOL_PRESETS: Record<string, { tag: string; preset: string; credits?: number }> = {
  super_realistic: { tag: '动漫', preset: '超级写实', credits: 10 },
  hd_repair: { tag: 'hd', preset: '高清修复', credits: 10 },
  leg_enhance: { tag: 'leg', preset: '蜜腿塑形', credits: 10 },
  muscle: { tag: 'muscle', preset: '力量臂', credits: 10 },
  muscle_enhance: { tag: 'muscle_pl', preset: 'AI 肱二头肌增大', credits: 10 },
  proportion: { tag: 'arm', preset: 'AI纤臂塑形', credits: 10 },
  lip_plump: { tag: 'lips', preset: '饱满嘴唇', credits: 10 },
};
