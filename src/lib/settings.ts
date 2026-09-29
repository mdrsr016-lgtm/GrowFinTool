import { supabase } from './supabase';

export interface AppearanceSettings {
  appWidth?: number;
  appHeight?: number;
  appRadius?: number;
  appBgOverride?: string;
  panelOpacity?: number;
  bgOpacity?: number;
  panelBlur?: number;
  backgroundType?: string;
  customBgUrl?: string;
  customBgRotate?: number;
  customBgScale?: number;
  customBgBlur?: number;
  customBgOffsetX?: number;
  customBgOffsetY?: number;
}

const LOCAL_KEY = 'global_appearance';

/** Apply CSS variables immediately from a settings object */
export function applyCssVars(s: AppearanceSettings) {
  const root = document.documentElement;
  if (s.panelOpacity != null)
    root.style.setProperty('--panel-bg', `rgba(20,21,23,${s.panelOpacity / 100})`);
  if (s.panelBlur != null)
    root.style.setProperty('--panel-blur', `blur(${s.panelBlur}px)`);
  if (s.bgOpacity != null)
    root.style.setProperty('--app-bg-alpha', `${s.bgOpacity / 100}`);
}

/** Load settings: tries Supabase first, falls back to localStorage */
export async function loadGlobalSettings(): Promise<AppearanceSettings> {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('settings')
      .eq('id', 'global')
      .single();

    if (!error && data?.settings) {
      const cloud = data.settings as AppearanceSettings;
      // Keep local cache in sync
      localStorage.setItem(LOCAL_KEY, JSON.stringify(cloud));
      applyCssVars(cloud);
      return cloud;
    }
  } catch {
    // offline or table doesn't exist yet — fall through to localStorage
  }

  // Fallback: localStorage
  try {
    const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}') as AppearanceSettings;
    applyCssVars(local);
    return local;
  } catch {
    return {};
  }
}

/** Save settings to both Supabase and localStorage */
export async function saveGlobalSettings(settings: AppearanceSettings): Promise<boolean> {
  // Always write to localStorage immediately (fast, offline-safe)
  localStorage.setItem(LOCAL_KEY, JSON.stringify(settings));
  applyCssVars(settings);

  try {
    const { error } = await supabase
      .from('app_settings')
      .upsert({ id: 'global', settings, updated_at: new Date().toISOString() });

    return !error;
  } catch {
    // Offline — settings are in localStorage, will sync next time
    return false;
  }
}
