import { useState, useCallback, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause,
  List,
  Plus,
  Shuffle,
  Repeat,
  X,
  ChevronDown,
  SkipForward,
  SkipBack
} from 'lucide-react';
import useAppStore from '@/lib/store/useAppStore';

const PlaylistManager = ({ 
  // Props from LocalPlayer for queue management
  folderPlaylist = [], 
  setFolderPlaylist = () => {}, 
  currentPlaylistIndex = 0, 
  setCurrentPlaylistIndex = () => {},
  showPlaylist = false,
  setShowPlaylist = () => {},
  shuffle = false,
  setShuffle = () => {},
  repeat = false, 
  setRepeat = () => {},
  currentTime = 0,
  duration = 0,  isPlaying = false,
  _setIsPlaying = () => {},
  currentPlaylistName = 'Queue',
  setCurrentPlaylistName = () => {},
  formatTime = (time) => time || '0:00',
  onVideoSelect = () => {},
  onPlayPause = () => {}
}) => {  const { 
    createPlaylist,
    addVideoToPlaylist,
    setCurrentVideo
  } = useAppStore();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');  // Play video from playlist - Optimized
  const playVideoFromPlaylist = useCallback((index) => {
    if (index >= 0 && index < folderPlaylist.length) {
      const video = folderPlaylist[index];
      
      // Batch updates to prevent multiple re-renders
      setCurrentPlaylistIndex(index);
      setCurrentVideo(video);
      onVideoSelect(video, index);
    }
  }, [folderPlaylist, setCurrentPlaylistIndex, setCurrentVideo, onVideoSelect]);// Remove video from playlist
  const removeFromPlaylist = useCallback((index) => {
    if (folderPlaylist.length === 0) return;
    const newPlaylist = folderPlaylist.filter((_, i) => i !== index);
    setFolderPlaylist(newPlaylist);
    
    // If removing current, play next or previous, or clear
    if (index === currentPlaylistIndex) {
      if (newPlaylist.length === 0) {
        setCurrentPlaylistIndex(0);
        setCurrentVideo(null);
        _setIsPlaying(false);
      } else {
        const newIndex = index >= newPlaylist.length ? newPlaylist.length - 1 : index;
        setCurrentPlaylistIndex(newIndex);
        setCurrentVideo(newPlaylist[newIndex]);
        onVideoSelect(newPlaylist[newIndex], newIndex); // Use callback
      }
    } else if (index < currentPlaylistIndex) {
      setCurrentPlaylistIndex(currentPlaylistIndex - 1);
    }
  }, [folderPlaylist, currentPlaylistIndex, setFolderPlaylist, setCurrentPlaylistIndex, setCurrentVideo, onVideoSelect, _setIsPlaying]);

  // Move item up in playlist
  const moveItemUp = useCallback((index) => {
    if (index > 0 && index < folderPlaylist.length) {
      const newPlaylist = [...folderPlaylist];
      [newPlaylist[index], newPlaylist[index - 1]] = [newPlaylist[index - 1], newPlaylist[index]];
      setFolderPlaylist(newPlaylist);
      if (currentPlaylistIndex === index) {
        setCurrentPlaylistIndex(index - 1);
      } else if (currentPlaylistIndex === index - 1) {
        setCurrentPlaylistIndex(index);
      }
    }
  }, [folderPlaylist, currentPlaylistIndex, setFolderPlaylist, setCurrentPlaylistIndex]);

  // Move item down in playlist
  const moveItemDown = useCallback((index) => {
    if (index >= 0 && index < folderPlaylist.length - 1) {
      const newPlaylist = [...folderPlaylist];
      [newPlaylist[index], newPlaylist[index + 1]] = [newPlaylist[index + 1], newPlaylist[index]];
      setFolderPlaylist(newPlaylist);
      if (currentPlaylistIndex === index) {
        setCurrentPlaylistIndex(index + 1);
      } else if (currentPlaylistIndex === index + 1) {
        setCurrentPlaylistIndex(index);
      }
    }
  }, [folderPlaylist, currentPlaylistIndex, setFolderPlaylist, setCurrentPlaylistIndex]);

  // Clear entire playlist
  const clearPlaylist = useCallback(() => {
    setFolderPlaylist([]);
    setCurrentPlaylistIndex(0);
    setCurrentPlaylistName('Queue');
    setCurrentVideo(null);
    setShowPlaylist(false);
  }, [setFolderPlaylist, setCurrentPlaylistIndex, setCurrentPlaylistName, setCurrentVideo, setShowPlaylist]);

  // Create new playlist from current queue
  const handleCreatePlaylist = useCallback(() => {
    if (!newPlaylistName.trim()) return;
    const playlistId = createPlaylist(newPlaylistName.trim(), newPlaylistDescription.trim());
    // Add all videos in queue to new playlist
    folderPlaylist.forEach(video => {
      if (video?.id) addVideoToPlaylist(playlistId, video.id);
    });
    window.dispatchEvent(new CustomEvent('show-notification', {
      detail: { type: 'success', message: `Created playlist "${newPlaylistName}" with ${folderPlaylist.length} videos` }
    }));
    setNewPlaylistName('');
    setNewPlaylistDescription('');
    setShowCreateModal(false);
  }, [newPlaylistName, newPlaylistDescription, createPlaylist, addVideoToPlaylist, folderPlaylist]);

  // Add keyboard event handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!showPlaylist) return;
      
      switch (e.key) {
        case 'Escape':
          setShowPlaylist(false);
          break;
        case 'Delete':
        case 'Backspace':
          if (e.target.tagName === 'BODY') {
            e.preventDefault();
            removeFromPlaylist(currentPlaylistIndex);
          }
          break;
        case 'ArrowUp':
          if (e.target.tagName === 'BODY' && currentPlaylistIndex > 0) {
            e.preventDefault();
            playVideoFromPlaylist(currentPlaylistIndex - 1);
          }
          break;
        case 'ArrowDown':
          if (e.target.tagName === 'BODY' && currentPlaylistIndex < folderPlaylist.length - 1) {
            e.preventDefault();
            playVideoFromPlaylist(currentPlaylistIndex + 1);
          }
          break;
        case ' ':
          if (e.target.tagName === 'BODY') {
            e.preventDefault();
            onPlayPause();
          }
          break;
      }
    };

    if (showPlaylist) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [showPlaylist, currentPlaylistIndex, folderPlaylist.length, playVideoFromPlaylist, removeFromPlaylist, onPlayPause, setShowPlaylist]);

  if (!showPlaylist || folderPlaylist.length === 0) {
    return null;
  }

  return (
    <>
      {/* Playlist Sidebar */}      <motion.div
        initial={{ opacity: 0, width: 0, x: 0 }} 
        animate={{ opacity: 1, width: 400, x: 0 }}
        exit={{ opacity: 0, width: 0, x: 0 }}    
        transition={{ 
          duration: 0.15, 
          ease: [0.4, 0, 0.2, 1],
          opacity: { duration: 0.1 }
        }}
        className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg flex flex-col shadow-2xl flex-shrink-0 ml-1"
        style={{
          height: 'auto',
          maxHeight: '640px',
          minHeight: '200px',
          minWidth: '400px',
          maxWidth: '400px',
          overflowX: 'hidden',
          contain: 'layout style paint',
          willChange: 'transform, opacity'
        }}
      >
        {/* Playlist Header */}        <motion.div 
          className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.15 }}
          style={{ flex: '0 0 auto' }}
        >
          <div className="flex items-center gap-3">            <motion.div 
              className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 3 }}
              transition={{ duration: 0.15 }}
            >
              <List className="w-4 h-4 text-white" />
            </motion.div>
            <div>
              <h3 className="text-white font-semibold text-sm">Now Playing</h3>
              <p className="text-gray-400 text-xs">{folderPlaylist.length} videos in queue</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">            <motion.button
              onClick={() => setShuffle(!shuffle)}
              className={`p-1.5 rounded-lg transition-colors duration-150 ${
                shuffle ? 'text-purple-400 bg-purple-500/20 shadow-md' : 'text-white bg-white/20 hover:bg-white/30'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Shuffle"
            >
              <Shuffle size={12} />
            </motion.button>
            
            <motion.button
              onClick={() => setRepeat(!repeat)}
              className={`p-1.5 rounded-lg transition-colors duration-150 ${
                repeat ? 'text-purple-400 bg-purple-500/20 shadow-md' : 'text-white bg-white/20 hover:bg-white/30'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Repeat"
            >
              <Repeat size={12} />
            </motion.button>

            <motion.button
              onClick={() => setShowPlaylist(false)}
              className="p-1.5 text-white bg-white/20 hover:bg-red-500/30 rounded-lg transition-colors duration-150 ml-1"
              whileHover={{ scale: 1.1, rotate: 45 }}
              whileTap={{ scale: 0.95 }}
              title="Hide Playlist"
            >
              <X size={12} />
            </motion.button>
          </div>
        </motion.div>        {/* Playlist Content */}
        <motion.div 
          className="flex-1 overflow-y-auto p-1 playlist-scrollbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(147, 51, 234, 0.6) rgba(255, 255, 255, 0.05)',
            flex: '1 1 auto',
            minHeight: 0,
            maxHeight: 'none',
            overflowX: 'hidden'
          }}
        >
          <div className="space-y-0.5 p-1" style={{ width: '100%', overflowX: 'hidden' }}>
            {folderPlaylist.map((video, index) => {
              // Restore progress from localStorage if available
              let progressData = {};
              try {
                progressData = JSON.parse(localStorage.getItem('playlist-progress') || '{}');
              } catch {
                progressData = {};
              }
              const saved = progressData[video.id];
              const videoProgress = saved && saved.progress ? saved.progress : 0;
              const videoCurrentTime = saved && saved.currentTime ? saved.currentTime : 0;
              const videoDuration = saved && saved.duration ? saved.duration : video.duration;

              return (                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.01, 
                    duration: 0.12,
                    ease: "easeOut"
                  }}
                  className={`group relative rounded-lg cursor-pointer transition-all duration-100 ${
                    index === currentPlaylistIndex
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 shadow-lg'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20'
                  }`}
                  whileHover={{ scale: 1.005, x: 2 }}
                  whileTap={{ scale: 0.995 }}
                  layout="position"
                  layoutId={`playlist-item-${video.id}`}
                  style={{ contain: 'layout style paint' }}
                  onClick={() => playVideoFromPlaylist(index)}
                >
                  <div className="flex items-center gap-3 p-3">                    {/* Enhanced Playing Indicator */}
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                      {index === currentPlaylistIndex ? (                        <motion.div 
                          className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlayPause();
                          }}
                          title={isPlaying ? "Pause" : "Play"}
                        >                          {isPlaying ? (
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <Pause size={10} className="text-white" />
                            </motion.div>
                          ) : (
                            <Play size={10} className="text-white ml-0.5" />
                          )}
                        </motion.div>
                      ) : (
                        <span className="text-gray-400 text-xs font-mono w-6 text-center group-hover:text-white transition-colors">
                          {index + 1}
                        </span>
                      )}
                    </div>                    {/* Video Info */}
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className={`text-xs font-medium line-clamp-2 mb-1 transition-colors break-words ${
                        index === currentPlaylistIndex ? 'text-white' : 'text-gray-300 group-hover:text-white'
                      }`}>
                        {video.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                        <span className="truncate">{video.fileSize}</span>
                        <span>•</span>
                        {/* Show correct time for each video in playlist */}
                        <span className="shrink-0">
                          {index === currentPlaylistIndex
                            ? `${formatTime(currentTime || 0)} / ${formatTime(duration || 0)}`
                            : videoDuration && videoDuration !== '00:00'
                              ? `${formatTime(videoCurrentTime || 0)} / ${formatTime(videoDuration || 0)}`
                              : '--:--'}
                        </span>
                      </div>
                    </div>                    {/* Action Buttons */}
                    <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (index > 0) {
                            moveItemUp(index);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-white bg-black/40 hover:bg-black/60 rounded transition-colors duration-150"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title="Move up"
                        disabled={index === 0}
                      >
                        <ChevronDown size={10} className="rotate-180" />
                      </motion.button>

                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (index < folderPlaylist.length - 1) {
                            moveItemDown(index);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-white bg-black/40 hover:bg-black/60 rounded transition-colors duration-150"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title="Move down"
                        disabled={index === folderPlaylist.length - 1}
                      >
                        <ChevronDown size={10} />
                      </motion.button>                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromPlaylist(index);
                        }}
                        className="p-1 text-gray-400 hover:text-red-400 bg-black/40 hover:bg-red-500/30 rounded transition-colors duration-150"
                        whileHover={{ scale: 1.1, rotate: 45 }}
                        whileTap={{ scale: 0.95 }}
                        title="Remove from playlist"
                      >
                        <X size={10} />
                      </motion.button>
                    </div>
                  </div>                  {/* Enhanced Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-lg overflow-hidden">
                    {index === currentPlaylistIndex && currentTime > 0 && duration > 0 ? (
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentTime / duration) * 100}%` }}
                        transition={{ duration: 0.1, ease: "linear" }}
                      />
                    ) : (
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{
                          width: `${videoProgress || 0}%`,
                          transition: 'width 0.15s linear'
                        }}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>        {/* Playlist Footer */}        <motion.div 
          className="p-3 border-t border-white/10 bg-gradient-to-r from-black/30 to-purple-900/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.15 }}
          style={{ flex: '0 0 auto' }}
        >
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex flex-col">
              <span className="font-medium text-white">{currentPlaylistName}</span>
              <span>{folderPlaylist.length} video{folderPlaylist.length !== 1 ? 's' : ''} • Playing #{currentPlaylistIndex + 1}</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => setShowCreateModal(true)}
                className="text-green-400 hover:text-green-300 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Save as playlist"
              >
                <Plus size={12} />
              </motion.button>
              <motion.button
                onClick={clearPlaylist}
                className="text-red-400 hover:text-red-300 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Clear queue"
              >
                Clear
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Create Playlist Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowCreateModal(false);
              setNewPlaylistName('');
              setNewPlaylistDescription('');
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-6 rounded-xl w-full max-w-md"
            >
              <h2 className="text-xl font-bold text-white mb-6">Create New Playlist</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Playlist Name *
                  </label>
                  <input
                    type="text"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="Enter playlist name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newPlaylistDescription}
                    onChange={(e) => setNewPlaylistDescription(e.target.value)}
                    placeholder="Enter playlist description"
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewPlaylistName('');
                    setNewPlaylistDescription('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim()}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .playlist-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(147, 51, 234, 0.6) rgba(255, 255, 255, 0.05);
          overflow-x: hidden !important;
          overflow-y: auto;
        }
        
        .playlist-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .playlist-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 4px;
          margin: 4px 0;
        }
        
        .playlist-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgb(147, 51, 234) 0%, rgb(236, 72, 153) 100%);
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s ease;
        }
        
        .playlist-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgb(168, 85, 247) 0%, rgb(244, 114, 182) 100%);
          border-color: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }
        
        .playlist-scrollbar::-webkit-scrollbar-thumb:active {
          background: linear-gradient(180deg, rgb(126, 34, 206) 0%, rgb(219, 39, 119) 100%);
        }
        
        .playlist-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
          /* Smooth scrolling behavior */
        .playlist-scrollbar {
          scroll-behavior: smooth;
          contain: layout;
        }
        
        /* Prevent horizontal overflow */
        .playlist-scrollbar * {
          max-width: 100%;
          box-sizing: border-box;
        }
        
        /* Hide scrollbar when not needed */
        .playlist-scrollbar:not(:hover)::-webkit-scrollbar-thumb {
          opacity: 0.6;
        }
        
        .playlist-scrollbar:hover::-webkit-scrollbar-thumb {
          opacity: 1;
        }
        
        /* Smooth transitions for better UX */
        .group {
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </>
  );
};

export default PlaylistManager;
