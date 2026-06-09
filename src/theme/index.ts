// ClipAI 主题配色 & 样式常量
// iPhone 基准: 390 x 844 points (1170 x 2532 pixels @3x)

export const Colors = {
  // 主背景
  bg: '#0D0D0D',
  bgSecondary: '#111111',
  card: '#1A1A1A',
  cardLight: '#222222',

  // 主色调
  primary: '#8B5CF6',     // 紫色
  primaryLight: '#A78BFA',

  // Pro / 会员
  proGold: '#D4AF37',
  proGoldLight: '#F0D060',

  // 文字
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textMuted: '#999999',
  textDark: '#666666',

  // 状态
  success: '#4ADE80',
  error: '#F87171',
  warning: '#FBBF24',

  // 边框
  border: '#2A2A2A',
  borderLight: '#333333',

  // Tab Bar
  tabBar: '#0A0A0A',
  tabBarBorder: '#1A1A1A',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 36,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  '2xl': 24,
  full: 9999,
};

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
};
