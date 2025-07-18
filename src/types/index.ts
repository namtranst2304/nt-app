// Video types
export interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  duration: number;
  source: VideoSource;
  url: string;
  category?: string;
  tags?: string[];
  uploadedAt: string;
  views?: number;
}

export type VideoSource = 'youtube' | 'vimeo' | 'twitch' | 'local';

// Playlist types
export interface Playlist {
  id: string;
  name: string;
  description?: string;
  videos: Video[];
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  isPublic?: boolean;
}

// History types
export interface HistoryItem {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  duration: number;
  source: VideoSource;
  watchedAt: string;
  progress: number;
  lastPosition: number;
}

// Settings types
export interface AppSettings {
  theme: 'dark' | 'light';
  volume: number;
  playbackRate: number;
  autoplay: boolean;
  notifications: boolean;
  pipMode: boolean;
  historyEnabled: boolean;
}

// Navigation types
export type NavigationTab = 'dashboard' | 'player' | 'playlists' | 'history' | 'stats' | 'settings';

// Store types
export interface AppStore {
  // UI State
  activeTab: NavigationTab;
  theme: 'dark' | 'light';
  isDarkMode: boolean;
  
  // Video Player State
  currentVideo: Video | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  isFullscreen: boolean;
  isPiPMode: boolean;
  
  // Data
  playlists: Playlist[];
  watchHistory: HistoryItem[];
  favorites: Video[];
  
  // Actions
  setActiveTab: (tab: NavigationTab) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setCurrentVideo: (video: Video) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (muted: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackRate: (rate: number) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  setPiPMode: (pip: boolean) => void;
  
  // Playlist actions
  createPlaylist: (name: string, description?: string) => void;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, video: Video) => void;
  removeFromPlaylist: (playlistId: string, videoId: string) => void;
  
  // History actions
  updateVideoProgress: (videoId: string, progress: number, currentTime: number) => void;
  clearHistory: () => void;
  
  // Favorites actions
  addToFavorites: (video: Video) => void;
  removeFromFavorites: (videoId: string) => void;
}

// Component props types
export interface LoadingFallbackProps {
  message?: string;
}

export interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
  onAddToPlaylist?: (video: Video) => void;
  onAddToFavorites?: (video: Video) => void;
  showProgress?: boolean;
  progress?: number;
}

export interface PlaylistCardProps {
  playlist: Playlist;
  onOpen: (playlist: Playlist) => void;
  onDelete?: (playlistId: string) => void;
}

// Modal types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}
