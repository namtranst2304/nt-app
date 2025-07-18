// Navigation constants
export const NAVIGATION_TABS = {
  DASHBOARD: 'dashboard',
  CONTENT: 'content',
  PLAYER: 'player',
  ANALYTICS: 'analytics',
  APIS: 'apis',
  SETTINGS: 'settings',
} as const;

export const CONTENT_SUBTABS = {
  PLAYLISTS: 'playlists',
  HISTORY: 'history',
  FAVORITES: 'favorites',
  LIBRARY: 'library',
} as const;

export const ANALYTICS_SUBTABS = {
  OVERVIEW: 'overview',
  DETAILED: 'detailed',
  REPORTS: 'reports',
} as const;

export const PLAYER_SUBTABS = {
  CURRENT: 'current',
  QUEUE: 'queue',
  CONTROLS: 'controls',
} as const;

export const SETTINGS_SUBTABS = {
  GENERAL: 'general',
  APPEARANCE: 'appearance',
  PRIVACY: 'privacy',
  ABOUT: 'about',
} as const;

export const APIS_SUBTABS = {
  API_1: 'api-1',
  API_2: 'api-2',
  API_3: 'api-3',
  API_4: 'api-4',
  API_5: 'api-5',
  API_6: 'api-6',
} as const;

export const KEYBOARD_SHORTCUTS = {
  '1': NAVIGATION_TABS.DASHBOARD,
  '2': NAVIGATION_TABS.CONTENT,
  '3': NAVIGATION_TABS.PLAYER,
  '4': NAVIGATION_TABS.ANALYTICS,
  '5': NAVIGATION_TABS.APIS,
  '6': NAVIGATION_TABS.SETTINGS,
} as const;

// Video player constants
export const VIDEO_SOURCES = {
  YOUTUBE: 'youtube',
  VIMEO: 'vimeo',
  TWITCH: 'twitch',
  LOCAL: 'local',
} as const;

export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;

// Theme constants
export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
} as const;

// Animation constants
export const ANIMATIONS = {
  DURATION: {
    SHORT: 0.2,
    MEDIUM: 0.3,
    LONG: 0.5,
  },
  EASING: {
    EASE_IN_OUT: [0.4, 0, 0.2, 1],
    BOUNCE: [0.68, -0.55, 0.265, 1.55],
  },
} as const;

// UI constants
export const GLASSMORPHISM = {
  BACKDROP_BLUR: 'backdrop-blur-md',
  BACKGROUND: 'bg-glass-light',
  BORDER: 'border border-glass-border',
  SHADOW: 'shadow-lg',
} as const;
