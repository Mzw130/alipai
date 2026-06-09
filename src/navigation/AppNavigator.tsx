import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import AIToolsScreen from '../screens/AIToolsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SplashScreen from '../screens/SplashScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import ProMembershipScreen from '../screens/ProMembershipScreen';
import MaterialLibraryScreen from '../screens/MaterialLibraryScreen';
import CustomVideoScreen from '../screens/CustomVideoScreen';
import PhotoPickerScreen from '../screens/PhotoPickerScreen';
import HDReshapeScreen from '../screens/ai-tools/HDReshapeScreen';
import HDRepairScreen from '../screens/ai-tools/HDRepairScreen';
import ObjectRemovalScreen from '../screens/ai-tools/ObjectRemovalScreen';
import BackgroundRemovalScreen from '../screens/ai-tools/BackgroundRemovalScreen';
import SuperRealisticScreen from '../screens/ai-tools/SuperRealisticScreen';
import LipPlumpScreen from '../screens/ai-tools/LipPlumpScreen';
import HairDyeScreen from '../screens/ai-tools/HairDyeScreen';
import JawlineScreen from '../screens/ai-tools/JawlineScreen';
import HairSmoothScreen from '../screens/ai-tools/HairSmoothScreen';
import HairRepairScreen from '../screens/ai-tools/HairRepairScreen';
import AIEditScreen from '../screens/ai-tools/AIEditScreen';
import AIToolDetailScreen from '../screens/AIToolDetailScreen';
import BeautyScreen from '../screens/ai-tools/BeautyScreen';
import ColorGradeScreen from '../screens/ai-tools/ColorGradeScreen';
import FilterScreen from '../screens/ai-tools/FilterScreen';
import ProportionScreen from '../screens/ai-tools/ProportionScreen';
import LegEnhanceScreen from '../screens/ai-tools/LegEnhanceScreen';
import MuscleScreen from '../screens/ai-tools/MuscleScreen';
import MuscleEnhanceScreen from '../screens/ai-tools/MuscleEnhanceScreen';

// 导航参数类型定义
export type RootStackParamList = {
  MainTabs: undefined;
  SplashScreen: undefined;
  SubscriptionScreen: undefined;
  ProMembershipScreen: undefined;
  MaterialLibraryScreen: undefined;
  CustomVideoScreen: undefined;
  PhotoPickerScreen: { toolType: string };
  HDReshapeScreen: undefined;
  HDRepairScreen: undefined;
  ObjectRemovalScreen: undefined;
  BackgroundRemovalScreen: undefined;
  SuperRealisticScreen: undefined;
  LipPlumpScreen: undefined;
  HairDyeScreen: undefined;
  JawlineScreen: undefined;
  HairSmoothScreen: undefined;
  HairRepairScreen: undefined;
  AIEditScreen: undefined;
  AIToolDetailScreen: { collectionKey: string };
  BeautyScreen: undefined;
  ColorGradeScreen: undefined;
  FilterScreen: undefined;
  ProportionScreen: undefined;
  LegEnhanceScreen: undefined;
  MuscleScreen: undefined;
  MuscleEnhanceScreen: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  ExploreTab: undefined;
  AIToolsTab: undefined;
  ProfileTab: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// 深色导航主题
const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.bg,
    card: Colors.tabBar,
    text: Colors.text,
    border: Colors.tabBarBorder,
    notification: Colors.primary,
  },
};

// 底部 Tab 导航
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopColor: Colors.tabBarBorder,
          borderTopWidth: 0.5,
          height: 85,
          paddingBottom: 28,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          switch (route.name) {
            case 'HomeTab':
              iconName = 'home';
              break;
            case 'ExploreTab':
              iconName = 'compass';
              break;
            case 'AIToolsTab':
              iconName = 'color-wand';
              break;
            case 'ProfileTab':
              iconName = 'person';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: '首页' }}
      />
      <Tab.Screen
        name="ExploreTab"
        component={ExploreScreen}
        options={{ tabBarLabel: '探索' }}
      />
      <Tab.Screen
        name="AIToolsTab"
        component={AIToolsScreen}
        options={{ tabBarLabel: 'AI 工具' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: '个人中心' }}
      />
    </Tab.Navigator>
  );
}

// 根 Stack 导航
export default function AppNavigator() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
        <Stack.Screen name="ProMembershipScreen" component={ProMembershipScreen} />
        <Stack.Screen name="MaterialLibraryScreen" component={MaterialLibraryScreen} />
        <Stack.Screen name="CustomVideoScreen" component={CustomVideoScreen} />
        <Stack.Screen name="PhotoPickerScreen" component={PhotoPickerScreen} />
        <Stack.Screen name="HDReshapeScreen" component={HDReshapeScreen} />
        <Stack.Screen name="HDRepairScreen" component={HDRepairScreen} />
        <Stack.Screen name="ObjectRemovalScreen" component={ObjectRemovalScreen} />
        <Stack.Screen name="BackgroundRemovalScreen" component={BackgroundRemovalScreen} />
        <Stack.Screen name="SuperRealisticScreen" component={SuperRealisticScreen} />
        <Stack.Screen name="LipPlumpScreen" component={LipPlumpScreen} />
        <Stack.Screen name="HairDyeScreen" component={HairDyeScreen} />
        <Stack.Screen name="JawlineScreen" component={JawlineScreen} />
        <Stack.Screen name="HairSmoothScreen" component={HairSmoothScreen} />
        <Stack.Screen name="HairRepairScreen" component={HairRepairScreen} />
        <Stack.Screen name="AIEditScreen" component={AIEditScreen} />
        <Stack.Screen name="AIToolDetailScreen" component={AIToolDetailScreen} />
        <Stack.Screen name="BeautyScreen" component={BeautyScreen} />
        <Stack.Screen name="ColorGradeScreen" component={ColorGradeScreen} />
        <Stack.Screen name="FilterScreen" component={FilterScreen} />
        <Stack.Screen name="ProportionScreen" component={ProportionScreen} />
        <Stack.Screen name="LegEnhanceScreen" component={LegEnhanceScreen} />
        <Stack.Screen name="MuscleScreen" component={MuscleScreen} />
        <Stack.Screen name="MuscleEnhanceScreen" component={MuscleEnhanceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
