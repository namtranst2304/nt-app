'use client'

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Play, 
  History, 
  List, 
  BarChart3, 
  Settings,
  Star,
  Clock,
  Folder,
  Youtube,
  Video
} from 'lucide-react';
import useAppStore from '@/lib/store/useAppStore';

const Sidebar = () => {
  const { activeTab, setActiveTab, favorites, watchHistory } = useAppStore();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'player', label: 'Video Player', icon: Play },
    { id: 'history', label: 'History', icon: History },
    { id: 'playlists', label: 'Playlists', icon: List },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const recentVideos = watchHistory.slice(0, 3);

  // Folder items for enhanced animations
  const folderItems = [
    { icon: Youtube, label: 'YouTube', count: 24, color: 'text-red-400' },
    { icon: Video, label: 'Local Files', count: 8, color: 'text-blue-400' },
    { icon: List, label: 'Series', count: 12, color: 'text-green-400' }
  ];

  return (
    <motion.div 
      className="glass-sidebar w-80 h-screen flex flex-col p-6"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ 
        duration: 0.4, // nhanh hơn
        type: "spring",
        stiffness: 400, // cao hơn
        damping: 22
      }}
    >
      {/* Logo */}
      <motion.div 
        className="flex items-center gap-3 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.div 
          className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
          whileHover={{ 
            scale: 1.1,
            rotate: 5,
            boxShadow: "0 8px 25px rgba(139, 92, 246, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Play className="w-5 h-5 text-white" />
        </motion.div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          StreamSync
        </h1>
      </motion.div>

      {/* Navigation */}
      <nav className="mb-8">
        <div className="relative space-y-2" style={{ minHeight: navItems.length * 56 }}>
          {/* Sliding indicator */}
          <motion.div
            layout
            layoutId="sidebar-slide-indicator"
            className="absolute left-0 w-full h-12 bg-gradient-to-r from-purple-600/40 to-blue-600/30 rounded-lg z-0"
            style={{
              top: `${navItems.findIndex(item => item.id === activeTab) * 56}px`
            }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 30
            }}
          />
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`sidebar-item w-full relative flex items-center gap-3 px-5 h-12 rounded-lg z-10 ${isActive ? 'text-white' : 'text-gray-300 hover:bg-white/10'}`}
                initial={false}
                // Không còn hiệu ứng scale/x khi hover
                whileHover={{}}
                whileTap={{}}
                style={{ background: 'transparent', position: 'relative', zIndex: 10, minHeight: 48, height: 48, paddingTop: 0, paddingBottom: 0 }}
              >
                <Icon className="w-5 h-5 transition-colors duration-150" />
                <span className="transition-colors duration-150">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Recent Videos */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >        <motion.h3 
          className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2"
        >
          <Clock className="w-4 h-4" />
          Recent Videos
        </motion.h3>
        <div className="space-y-3">
          <AnimatePresence>
            {recentVideos.map((video, index) => (
              <motion.div 
                key={video.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + (index * 0.1) }}
                whileHover={{ 
                  scale: 1.02,
                  x: 4,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-12 h-8 rounded object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white truncate group-hover:text-blue-300 transition-colors">
                    {video.title}
                  </p>
                  <p className="text-xs text-gray-400">{video.duration}</p>
                </div>
                <motion.div 
                  className="w-1 h-8 bg-blue-500 rounded-full" 
                  style={{
                    height: `${video.progress}%`,
                    minHeight: '4px'
                  }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Favorites */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <motion.h3 
          className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <Star className="w-4 h-4" />
          Favorites
          <motion.span 
            className="text-xs bg-white/10 px-2 py-1 rounded-full"
            whileHover={{ 
              scale: 1.1,
              backgroundColor: "rgba(255, 255, 255, 0.15)"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {favorites.length}
          </motion.span>
        </motion.h3>
      </motion.div>

      {/* Folders */}
      <motion.div 
        className="flex-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
      >
        <motion.h3 
          className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <Folder className="w-4 h-4" />
          Folders
        </motion.h3>
        <div className="space-y-2">
          <AnimatePresence>
            {folderItems.map((folder, index) => {
              const Icon = folder.icon;
              return (
                <motion.div 
                  key={folder.label}
                  className="sidebar-item text-sm cursor-pointer group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 + (index * 0.1) }}
                  whileHover={{ 
                    scale: 1.02,
                    x: 8,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Icon className={`w-4 h-4 ${folder.color}`} />
                  </motion.div>
                  <span className="group-hover:text-white transition-colors">
                    {folder.label}
                  </span>
                  <motion.span 
                    className="ml-auto text-xs text-gray-400 group-hover:text-blue-300 transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    {folder.count}
                  </motion.span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
