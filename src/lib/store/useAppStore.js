import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// localStorage utilities with Next.js compatibility
const storage = {
  getItem: (name) => {
    if (typeof window === 'undefined') return null;
    try {
      return JSON.parse(localStorage.getItem(name));
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
  }
};

const useAppStore = create(
  persist(
    (set, get) => ({      // UI State
      activeTab: 'dashboard',
      activeSubTab: null,
      setActiveTab: (tab) => {
        set({ activeTab: tab });
        // Reset sub tab when changing main tab
        if (tab === 'dashboard') {
          set({ activeSubTab: null });
        } else {
          // Set default sub tab for each main tab
          const defaultSubTabs = {
            'content': 'playlists',
            'analytics': 'overview',
            'player': 'current',
            'settings': 'general'
          };
          set({ activeSubTab: defaultSubTabs[tab] || null });
        }
      },
      setActiveSubTab: (subTab) => set({ activeSubTab: subTab }),
      
      // Theme Management
      theme: 'dark', // 'dark' | 'light'
      isDarkMode: true,
      setTheme: (theme) => {
        set({ theme, isDarkMode: theme === 'dark' });
        // Apply theme to document (Next.js compatible)
        if (typeof window !== 'undefined') {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
          } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
          }
        }
      },
      toggleTheme: () => {
        const state = get();
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        state.setTheme(newTheme);
      },
      
      // Video Player State
      currentVideo: null,
      isPlaying: false,
      volume: 100,
      isMuted: false,
      currentTime: 0,
      duration: 0,
      playbackRate: 1,
      isFullscreen: false,
      isPiPMode: false,
      
      setCurrentVideo: (video) => {
        set({ currentVideo: video });
        // Add to watch history
        const state = get();
        const existingIndex = state.watchHistory.findIndex(item => item.videoId === video.id);
        if (existingIndex >= 0) {
          // Update existing entry
          state.watchHistory[existingIndex].watchedAt = new Date().toISOString();
          state.watchHistory[existingIndex].lastPosition = 0;
        } else {
          // Add new entry
          const newHistoryItem = {
            id: Date.now(),
            videoId: video.id,
            title: video.title,
            thumbnail: video.thumbnail,
            duration: video.duration,
            source: video.source,
            watchedAt: new Date().toISOString(),
            progress: 0,
            lastPosition: 0
          };
          state.watchHistory.unshift(newHistoryItem);
        }
        set({ watchHistory: state.watchHistory.slice(0, 50) }); // Keep only last 50
      },
      
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
      setIsMuted: (muted) => set({ isMuted: muted }),
      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),
      setPlaybackRate: (rate) => set({ playbackRate: rate }),
      setIsFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
      setPiPMode: (pip) => set({ isPiPMode: pip }),
      
      // Video Progress Tracking
      updateVideoProgress: (videoId, progress, currentTime) => {
        const state = get();
        const historyIndex = state.watchHistory.findIndex(item => item.videoId === videoId);
        if (historyIndex >= 0) {
          state.watchHistory[historyIndex].progress = progress;
          state.watchHistory[historyIndex].lastPosition = currentTime;
          state.watchHistory[historyIndex].watchedAt = new Date().toISOString();
          set({ watchHistory: [...state.watchHistory] });
          
          // Update statistics
          const today = new Date().toDateString();
          const stats = { ...state.statistics };
          if (!stats.dailyWatchTime[today]) {
            stats.dailyWatchTime[today] = 0;
          }
          stats.totalWatchTime += 1; // Add 1 second
          stats.dailyWatchTime[today] += 1;
          set({ statistics: stats });
        }
      },

      // Video Library
      videos: [
        {
          id: 1,
          title: "React Best Practices 2024",
          description: "Learn the latest React patterns and best practices for modern web development. This comprehensive guide covers hooks, context, performance optimization, and more.",
          source: "youtube",
          videoId: "dQw4w9WgXcQ",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
          duration: "15:30",
          views: "125K",
          tags: ["React", "JavaScript", "Web Development", "Best Practices"],
          uploadedAt: "2024-01-15",
          category: "Programming",
          instructor: "React Expert",
          rating: 4.8
        },
        {
          id: 2,          title: "JavaScript ES2024 Features",
          description: "Explore the newest JavaScript features and how to use them effectively. Learn about temporal, pattern matching, and other cutting-edge features.",
          source: "youtube",
          videoId: "dQw4w9WgXcQ",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
          duration: "22:15",
          views: "89K",
          tags: ["JavaScript", "ES2024", "Programming", "Features"],
          uploadedAt: "2024-01-14",
          category: "Programming",
          instructor: "JS Ninja",
          rating: 4.6
        },
        {
          id: 3,
          title: "CSS Grid Mastery",
          description: "Master CSS Grid layout with practical examples and real-world projects. Build responsive layouts that work across all devices.",
          source: "vimeo",
          videoId: "76979871",
          url: "https://vimeo.com/76979871",
          thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
          duration: "18:45",
          views: "67K",
          tags: ["CSS", "Grid", "Layout", "Responsive"],
          uploadedAt: "2024-01-13",
          category: "Design",
          instructor: "CSS Master",
          rating: 4.7
        },        {
          id: 4,
          title: "Node.js Performance Optimization",
          description: "Optimize your Node.js applications for better performance and scalability. Learn about clustering, caching, and monitoring techniques.",
          source: "youtube", 
          videoId: "f2EqECiTBL8",
          url: "https://www.youtube.com/watch?v=f2EqECiTBL8",
          thumbnail: "https://img.youtube.com/vi/f2EqECiTBL8/maxresdefault.jpg",
          duration: "25:10",
          views: "156K",
          tags: ["Node.js", "Performance", "Backend", "Optimization"],
          uploadedAt: "2024-01-12",
          category: "Backend",
          instructor: "Node.js Pro",
          rating: 4.9
        },        {
          id: 5,
          title: "TypeScript Advanced Patterns",
          description: "Deep dive into advanced TypeScript patterns for enterprise applications. Explore conditional types, mapped types, and template literal types.",
          source: "youtube",
          videoId: "P-J9Eg7hJwE",
          url: "https://www.youtube.com/watch?v=P-J9Eg7hJwE",
          thumbnail: "https://img.youtube.com/vi/P-J9Eg7hJwE/maxresdefault.jpg",
          duration: "31:20",
          views: "203K",
          tags: ["TypeScript", "Advanced", "Patterns", "Enterprise"],
          uploadedAt: "2024-01-11",
          category: "Programming",
          instructor: "TS Wizard",
          rating: 4.8
        },
        {
          id: 6,
          title: "Docker for Developers",
          description: "Learn Docker from scratch and containerize your applications. Master Docker Compose, volumes, networking, and deployment strategies.",
          source: "youtube",
          videoId: "pTFZFxd4hOI",
          url: "https://www.youtube.com/watch?v=pTFZFxd4hOI",
          thumbnail: "https://img.youtube.com/vi/pTFZFxd4hOI/maxresdefault.jpg",
          duration: "45:30",
          views: "342K",
          tags: ["Docker", "DevOps", "Containers", "Deployment"],
          uploadedAt: "2024-01-10",
          category: "DevOps",
          instructor: "DevOps Guru",
          rating: 4.9
        },
        {
          id: 7,
          title: "Vue.js 3 Composition API",
          description: "Master Vue.js 3 Composition API with hands-on examples. Build reactive, maintainable applications with the latest Vue features.",
          source: "youtube",
          videoId: "I_xLMmNeLDY",
          url: "https://www.youtube.com/watch?v=I_xLMmNeLDY",
          thumbnail: "https://img.youtube.com/vi/I_xLMmNeLDY/maxresdefault.jpg",
          duration: "28:45",
          views: "98K",
          tags: ["Vue.js", "Composition API", "Frontend", "JavaScript"],
          uploadedAt: "2024-01-09",
          category: "Programming",
          instructor: "Vue Expert",
          rating: 4.6
        },
        {
          id: 8,
          title: "MongoDB Aggregation Pipeline",
          description: "Master MongoDB aggregation framework with complex queries and data transformations. Learn to build efficient data processing pipelines.",
          source: "youtube",
          videoId: "A3jvoE0jGdE",
          url: "https://www.youtube.com/watch?v=A3jvoE0jGdE",
          thumbnail: "https://img.youtube.com/vi/A3jvoE0jGdE/maxresdefault.jpg",
          duration: "35:20",
          views: "76K",
          tags: ["MongoDB", "Database", "Aggregation", "NoSQL"],
          uploadedAt: "2024-01-08",
          category: "Database",
          instructor: "DB Specialist",
          rating: 4.7
        },
        {
          id: 9,
          title: "GraphQL Complete Guide",
          description: "Learn GraphQL from basics to advanced concepts. Build APIs with queries, mutations, subscriptions, and schema design best practices.",
          source: "vimeo",
          videoId: "98767543",
          url: "https://vimeo.com/98767543",
          thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
          duration: "42:15",
          views: "134K",
          tags: ["GraphQL", "API", "Backend", "Schema"],
          uploadedAt: "2024-01-07",
          category: "Backend",
          instructor: "API Master",
          rating: 4.8
        },
        {
          id: 10,
          title: "Kubernetes Fundamentals",
          description: "Get started with Kubernetes orchestration. Learn pods, services, deployments, and how to manage containerized applications at scale.",
          source: "youtube",
          videoId: "X48VuDVv0do",
          url: "https://www.youtube.com/watch?v=X48VuDVv0do",
          thumbnail: "https://img.youtube.com/vi/X48VuDVv0do/maxresdefault.jpg",
          duration: "52:30",
          views: "267K",
          tags: ["Kubernetes", "DevOps", "Orchestration", "Containers"],
          uploadedAt: "2024-01-06",
          category: "DevOps",
          instructor: "K8s Expert",
          rating: 4.9
        }
      ],

      // Local Videos (uploaded by user)
      localVideos: [],
      addLocalVideo: (videoFile, videoData) => {
        const newVideo = {
          id: Date.now(),
          title: videoData.title || videoFile.name,
          description: videoData.description || '',
          source: 'local',
          file: videoFile,
          url: URL.createObjectURL(videoFile),
          thumbnail: videoData.thumbnail || null,
          duration: videoData.duration || '00:00',
          views: '0',
          tags: videoData.tags || [],
          uploadedAt: new Date().toISOString(),
          category: 'Local',
          size: videoFile.size
        };
        set((state) => ({ 
          localVideos: [...state.localVideos, newVideo],
          videos: [...state.videos, newVideo]
        }));
        return newVideo;
      },
      
      removeLocalVideo: (videoId) => {
        set((state) => {
          const localVideos = state.localVideos.filter(v => v.id !== videoId);
          const videos = state.videos.filter(v => v.id !== videoId);
          return { localVideos, videos };
        });
      },

      // Watch History
      watchHistory: [
        {
          id: 1,
          videoId: 1,
          title: "React Best Practices 2024",
          thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
          duration: "15:30",
          source: "youtube",
          watchedAt: "2024-01-15T10:30:00.000Z",
          progress: 85,
          lastPosition: 780
        },        {
          id: 2,
          videoId: 4,
          title: "Node.js Performance Optimization",
          thumbnail: "https://img.youtube.com/vi/f2EqECiTBL8/maxresdefault.jpg",
          duration: "25:10",
          source: "youtube",
          watchedAt: "2024-01-14T15:45:00.000Z",
          progress: 65,
          lastPosition: 980
        },
        {
          id: 3,
          videoId: 6,
          title: "Docker for Developers",
          thumbnail: "https://img.youtube.com/vi/pTFZFxd4hOI/maxresdefault.jpg",
          duration: "45:30",
          source: "youtube",
          watchedAt: "2024-01-13T09:20:00.000Z",
          progress: 45,
          lastPosition: 1230
        }
      ],
      clearWatchHistory: () => set({ watchHistory: [] }),
      removeFromWatchHistory: (historyId) => set((state) => ({
        watchHistory: state.watchHistory.filter(item => item.id !== historyId)
      })),

      // Playlists
      playlists: [
        {
          id: 1,
          name: "Frontend Mastery",
          description: "Complete frontend development journey from basics to advanced",
          videoIds: [1, 2, 3, 7],
          thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
          createdAt: "2024-01-15",
          isPublic: false,
          totalDuration: "84:35",
          videoCount: 4
        },        {
          id: 2,
          name: "Backend Development",
          description: "Server-side development with Node.js, databases, and APIs",
          videoIds: [4, 8, 9],
          thumbnail: "https://img.youtube.com/vi/f2EqECiTBL8/maxresdefault.jpg",
          createdAt: "2024-01-14",
          isPublic: true,
          totalDuration: "102:45",
          videoCount: 3
        },
        {
          id: 3,
          name: "DevOps Essentials",
          description: "Infrastructure, containers, and deployment strategies",
          videoIds: [6, 10],
          thumbnail: "https://img.youtube.com/vi/pTFZFxd4hOI/maxresdefault.jpg",
          createdAt: "2024-01-13",
          isPublic: true,
          totalDuration: "98:00",
          videoCount: 2
        },        {
          id: 4,
          name: "TypeScript Deep Dive",
          description: "Advanced TypeScript for professional developers",
          videoIds: [5],
          thumbnail: "https://img.youtube.com/vi/P-J9Eg7hJwE/maxresdefault.jpg",
          createdAt: "2024-01-12",
          isPublic: false,
          totalDuration: "31:20",
          videoCount: 1
        },
        {
          id: 5,
          name: "Watch Later",
          description: "Videos saved for later viewing",
          videoIds: [3, 7, 8],
          thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
          createdAt: "2024-01-11",
          isPublic: false,
          totalDuration: "105:20",
          videoCount: 3
        }
      ],

      createPlaylist: (name, description) => {
        const newPlaylist = {
          id: Date.now().toString(),
          name,
          description,
          videoIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set(state => ({
          playlists: [...state.playlists, newPlaylist]
        }));

        return newPlaylist.id;
      },

      updatePlaylist: (playlistId, updates) => {
        set((state) => ({
          playlists: state.playlists.map(playlist => 
            playlist.id === playlistId ? { ...playlist, ...updates } : playlist
          )
        }));
      },

      deletePlaylist: (playlistId) => {
        set((state) => ({
          playlists: state.playlists.filter(playlist => playlist.id !== playlistId)
        }));
      },

      addVideoToPlaylist: (playlistId, videoId) => {
        set((state) => ({
          playlists: state.playlists.map(playlist => 
            playlist.id === playlistId 
              ? { 
                  ...playlist, 
                  videoIds: playlist.videoIds.includes(videoId) 
                    ? playlist.videoIds 
                    : [...playlist.videoIds, videoId],
                  updatedAt: new Date().toISOString()
                }
              : playlist
          )
        }));
      },

      removeVideoFromPlaylist: (playlistId, videoId) => {
        set((state) => ({
          playlists: state.playlists.map(playlist => 
            playlist.id === playlistId 
              ? { ...playlist, videoIds: playlist.videoIds.filter(id => id !== videoId), updatedAt: new Date().toISOString() }
              : playlist
          )
        }));
      },

      // Favorites
      favorites: [1, 3, 6, 10],
      toggleFavorite: (videoId) => {
        const state = get();
        const isFavorited = state.favorites.includes(videoId);
        
        set((state) => ({
          favorites: isFavorited
            ? state.favorites.filter(id => id !== videoId)
            : [...state.favorites, videoId]
        }));
        
        window.dispatchEvent(new CustomEvent('show-notification', {
          detail: { 
            type: 'success', 
            message: isFavorited ? 'Removed from favorites' : 'Added to favorites' 
          }
        }));
      },
      clearFavorites: () => set({ favorites: [] }),

      // Watch Later
      watchLater: [2, 4, 7, 9],
      toggleWatchLater: (videoId) => set((state) => ({
        watchLater: state.watchLater.includes(videoId)
          ? state.watchLater.filter(id => id !== videoId)
          : [...state.watchLater, videoId]
      })),

      // Statistics
      statistics: {
        totalWatchTime: 147830,
        videosWatched: 127,
        averageSessionTime: 2700,
        totalVideosUploaded: 23,
        playlistsCreated: 8,
        dailyWatchTime: {
          "2024-01-15": 5400,
          "2024-01-14": 7200,
          "2024-01-13": 3600,
          "2024-01-12": 4500,
          "2024-01-11": 6300,
          "2024-01-10": 8100,
          "2024-01-09": 5700
        },
        weeklyStats: [
          { day: 'Mon', hours: 2.5, videos: 3 },
          { day: 'Tue', hours: 4.2, videos: 5 },
          { day: 'Wed', hours: 3.1, videos: 4 },
          { day: 'Thu', hours: 5.8, videos: 7 },
          { day: 'Fri', hours: 2.9, videos: 3 },
          { day: 'Sat', hours: 7.2, videos: 9 },
          { day: 'Sun', hours: 6.1, videos: 8 }
        ],
        monthlyStats: [
          { month: 'Jan', watchTime: 180, videos: 45 },
          { month: 'Dec', watchTime: 165, videos: 42 },
          { month: 'Nov', watchTime: 142, videos: 38 },
          { month: 'Oct', watchTime: 158, videos: 40 },
          { month: 'Sep', watchTime: 134, videos: 35 },
          { month: 'Aug', watchTime: 145, videos: 37 }
        ],
        categoryStats: [
          { name: 'Programming', value: 35, color: '#3B82F6', hours: 14.5 },
          { name: 'DevOps', value: 25, color: '#10B981', hours: 10.3 },
          { name: 'Backend', value: 20, color: '#F59E0B', hours: 8.2 },
          { name: 'Design', value: 15, color: '#EF4444', hours: 6.1 },
          { name: 'Database', value: 3, color: '#8B5CF6', hours: 1.2 },
          { name: 'Others', value: 2, color: '#6B7280', hours: 0.7 }
        ],
        topTags: [
          { tag: 'JavaScript', count: 23, percentage: 18 },
          { tag: 'React', count: 19, percentage: 15 },
          { tag: 'Node.js', count: 15, percentage: 12 },
          { tag: 'TypeScript', count: 12, percentage: 9 },
          { tag: 'CSS', count: 10, percentage: 8 },
          { tag: 'Docker', count: 8, percentage: 6 },
          { tag: 'MongoDB', count: 6, percentage: 5 }
        ],
        deviceStats: [
          { device: 'Desktop', percentage: 65, hours: 26.6 },
          { device: 'Mobile', percentage: 25, hours: 10.2 },
          { device: 'Tablet', percentage: 10, hours: 4.1 }
        ]
      },

      // Video Notes Management
      videoNotes: {},
      addVideoNote: (videoId, note) => {
        const newNote = {
          id: Date.now(),
          timestamp: note.timestamp,
          content: note.content,
          tag: note.tag || 'general',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        set((state) => ({
          videoNotes: {
            ...state.videoNotes,
            [videoId]: [...(state.videoNotes[videoId] || []), newNote]
          }
        }));
      },
      
      updateVideoNote: (videoId, noteId, updates) => {
        set((state) => ({
          videoNotes: {
            ...state.videoNotes,
            [videoId]: (state.videoNotes[videoId] || []).map(note =>
              note.id === noteId 
                ? { ...note, ...updates, updatedAt: new Date().toISOString() }
                : note
            )
          }
        }));
      },
      
      deleteVideoNote: (videoId, noteId) => {
        set((state) => ({
          videoNotes: {
            ...state.videoNotes,
            [videoId]: (state.videoNotes[videoId] || []).filter(note => note.id !== noteId)
          }
        }));
      },
      
      exportNotesToPDF: async (videoId) => {
        const { videoNotes, videos } = get();
        const video = videos.find(v => v.id === videoId);
        const notes = videoNotes[videoId] || [];
        
        if (!video || notes.length === 0) {
          window.dispatchEvent(new CustomEvent('show-notification', {
            detail: { type: 'warning', message: 'No notes to export' }
          }));
          return;
        }
        
        try {
          const { exportNotesToPDF } = await import('../utils/pdfExport');
          await exportNotesToPDF(video.title, notes);
          
          window.dispatchEvent(new CustomEvent('show-notification', {
            detail: { type: 'success', message: 'Notes exported successfully' }
          }));
        } catch (error) {
          console.error('Export error:', error);
          window.dispatchEvent(new CustomEvent('show-notification', {
            detail: { type: 'error', message: 'Failed to export notes' }
          }));
        }
      },

      // Video Management
      addVideo: (videoData) => {
        const newVideo = {
          ...videoData,
          id: videoData.id || Date.now(),
          uploadedAt: videoData.uploadedAt || new Date().toISOString()
        };
        
        set((state) => ({
          videos: [...state.videos, newVideo]
        }));
        
        window.dispatchEvent(new CustomEvent('show-notification', {
          detail: { type: 'success', message: `Video "${newVideo.title}" added to library` }
        }));
        
        return newVideo;
      },
      
      removeVideo: (videoId) => {
        set((state) => ({
          videos: state.videos.filter(v => v.id !== videoId),
          favorites: state.favorites.filter(id => id !== videoId),
          watchLater: state.watchLater.filter(id => id !== videoId),
          watchHistory: state.watchHistory.filter(item => item.videoId !== videoId)
        }));
      },      // Settings Management
      settings: {
        autoplay: true,
        notifications: true,
        saveProgress: true,
        highQuality: true,
        subtitles: false,
        theatreMode: false,
        keyboardShortcuts: true,
        dataSync: true,
        theme: 'dark',
        language: 'en',
        reducedMotion: false,
        highContrast: false,
        timeFormat: '24h'
      },
      
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      }
    }),
    {
      name: 'ntsync-storage',
      storage: {
        getItem: storage.getItem,
        setItem: storage.setItem,
        removeItem: storage.removeItem
      },
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        watchHistory: state.watchHistory,
        playlists: state.playlists,
        favorites: state.favorites,
        watchLater: state.watchLater,
        statistics: state.statistics,
        settings: state.settings,
        localVideos: state.localVideos.map(video => ({
          ...video,
          file: null,
          url: null
        }))
      })
    }
  )
);

export default useAppStore;
