import { NativeModules, Platform } from 'react-native';
import appsFlyer from 'react-native-appsflyer';
import { APPSFLYER_DEV_KEY, APPSFLYER_IOS_APP_ID } from '../config/analytics';

const isNativeAvailable = !!NativeModules.RNAppsFlyer;
let initialized = false;

function warnUnavailable(action: string) {
  if (__DEV__) {
    console.warn(`[Analytics] ${action} skipped — AppsFlyer native module unavailable (use expo run:android)`);
  }
}

/** App 启动时调用一次 */
export function initAnalytics() {
  if (initialized || !isNativeAvailable) {
    if (!isNativeAvailable) warnUnavailable('initAnalytics');
    return;
  }

  appsFlyer.onInstallConversionData((data) => {
    if (__DEV__) console.log('[AppsFlyer] install conversion:', data);
  });

  const options: Parameters<typeof appsFlyer.initSdk>[0] = {
    devKey: APPSFLYER_DEV_KEY,
    isDebug: __DEV__,
    onInstallConversionDataListener: true,
    onDeepLinkListener: true,
  };

  if (Platform.OS === 'ios' && APPSFLYER_IOS_APP_ID) {
    options.appId = APPSFLYER_IOS_APP_ID;
  }

  appsFlyer.initSdk(
    options,
    (result) => {
      initialized = true;
      if (__DEV__) console.log('[AppsFlyer] init ok', result);
    },
    (error) => console.warn('[AppsFlyer] init fail', error),
  );
}

/** 登录/注册成功后绑定业务 userId */
export function bindAnalyticsUser(userId: string, isNewUser?: boolean) {
  if (!isNativeAvailable) return;

  appsFlyer.setCustomerUserId(userId);

  if (isNewUser) {
    logEvent('signup_complete', { signup_method: 'phone' });
  } else {
    logEvent('login', { login_method: 'phone' });
  }
}

/** 记录自定义事件 */
export function logEvent(name: string, params: Record<string, unknown> = {}) {
  if (!isNativeAvailable) return;

  appsFlyer
    .logEvent(name, params)
    .catch((err) => {
      if (__DEV__) console.warn(`[AppsFlyer] logEvent(${name}) failed`, err);
    });
}

export function logPageView(pageName: string) {
  logEvent('page_view', { page_name: pageName });
}

export function logAiTaskStart(toolType: string) {
  logEvent('ai_task_start', { tool_type: toolType });
}

export function logAiTaskComplete(
  toolType: string,
  extra: { processing_time_ms?: number; credits_used?: number } = {},
) {
  logEvent('ai_task_complete', { tool_type: toolType, ...extra });
}

export function logAiTaskFailed(toolType: string, errorMessage?: string) {
  logEvent('ai_task_failed', { tool_type: toolType, error_message: errorMessage });
}
