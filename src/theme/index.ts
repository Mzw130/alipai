// ClipAI 主题 — 设计稿浅色风格
// iPhone 基准: 390 x 844 points

export const Colors = {
  // 主背景
  bg: '#FAF7F5',
  bgSecondary: '#F3EDE8',
  bgWarm: '#FDF5F2',
  card: '#FFFFFF',
  cardLight: '#F0EBE6',
  cardMuted: '#E8E0D9',

  // 主色调
  primary: '#7B61FF',
  primaryLight: '#9B7FFF',
  primaryDark: '#6B4FE0',

  // 渐变
  proGradientStart: '#7B61FF',
  proGradientEnd: '#3B82F6',
  ctaGradientStart: '#FF5E62',
  ctaGradientEnd: '#FF9966',
  generateGradientStart: '#2B85FF',
  generateGradientEnd: '#A066FF',

  // Pro / 会员
  proGold: '#7B61FF',
  proBadge: '#3B82F6',

  // 文字
  text: '#1A1A1A',
  textSecondary: '#4A4A4A',
  textMuted: '#999999',
  textDark: '#666666',
  textOnDark: '#FFFFFF',

  // 状态
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  hot: '#E85D4C',

  // 边框
  border: '#E8E0D9',
  borderLight: '#F0EBE6',

  // Tab Bar
  tabBar: 'rgba(255,255,255,0.92)',
  tabBarBorder: 'rgba(0,0,0,0.06)',

  // 深色遮罩（订阅页等）
  overlay: 'rgba(0,0,0,0.55)',
  darkCard: '#2C2C2E',
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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  full: 9999,
};

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  button: {
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  tabBar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
};
