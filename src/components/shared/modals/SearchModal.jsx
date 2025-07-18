import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, Play, Clock, Star, List } from 'lucide-react';
import useAppStore from '@/lib/store/useAppStore';

function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  const { 
    watchHistory, 
    favorites, 
    playlists,
    setCurrentVideo,
    setActiveTab 
  } = useAppStore();

  // Combine all searchable content
  const getSearchResults = () => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    const results = [];

    // Search watch history
    if (activeFilter === 'all' || activeFilter === 'history') {
      watchHistory.forEach(item => {
        if (item.title.toLowerCase().includes(searchTerm) ||
            item.description?.toLowerCase().includes(searchTerm)) {
          results.push({
            ...item,
            type: 'history',
            source: 'Watch History'
          });
        }
      });
    }

    // Search favorites
    if (activeFilter === 'all' || activeFilter === 'favorites') {
      favorites.forEach(item => {
        if (item.title.toLowerCase().includes(searchTerm) ||
            item.description?.toLowerCase().includes(searchTerm)) {
          results.push({
            ...item,
            type: 'favorite',
            source: 'Favorites'
          });
        }
      });
    }

    // Search playlists
    if (activeFilter === 'all' || activeFilter === 'playlists') {
      playlists.forEach(playlist => {
        if (playlist.name.toLowerCase().includes(searchTerm) ||
            playlist.description?.toLowerCase().includes(searchTerm)) {
          results.push({
            id: playlist.id,
            title: playlist.name,
            description: playlist.description,
            thumbnail: playlist.videos[0]?.thumbnail || '/api/placeholder/320/180',
            type: 'playlist',
            source: 'Playlists',
            videoCount: playlist.videos.length
          });
        }

        // Search within playlist videos
        playlist.videos.forEach(video => {
          if (video.title.toLowerCase().includes(searchTerm) ||
              video.description?.toLowerCase().includes(searchTerm)) {
            results.push({
              ...video,
              type: 'playlist-video',
              source: `Playlist: ${playlist.name}`,
              playlistId: playlist.id
            });
          }
        });
      });
    }

    return results.slice(0, 20); // Limit results
  };

  const searchResults = getSearchResults();

  const handleResultClick = (result) => {
    if (result.type === 'playlist') {
      setActiveTab('playlists');
    } else if (result.type === 'history') {
      setActiveTab('history');
    } else if (result.type === 'favorite') {
      setActiveTab('favorites');
    } else {
      // Play the video
      setCurrentVideo({
        id: result.videoId || result.id,
        title: result.title,
        url: result.url,
        thumbnail: result.thumbnail,
        description: result.description
      });
      setActiveTab('dashboard');
    }
    onClose();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'history': return <Clock size={16} className="text-blue-400" />;
      case 'favorite': return <Star size={16} className="text-yellow-400" />;
      case 'playlist': return <List size={16} className="text-green-400" />;
      case 'playlist-video': return <Play size={16} className="text-purple-400" />;
      default: return <Play size={16} className="text-gray-400" />;
    }
  };

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'history', label: 'History' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'playlists', label: 'Playlists' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-20"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card w-full max-w-2xl rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search videos, playlists, and more..."
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    autoFocus
                  />
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-3 hover:bg-white/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={20} className="text-gray-400" />
                </motion.button>
              </div>

              {/* Filters */}
              <div className="flex gap-2 mt-4">
                {filters.map(filter => (
                  <motion.button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeFilter === filter.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {filter.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {query.trim() ? (
                searchResults.length > 0 ? (
                  <div className="p-4 space-y-2">
                    {searchResults.map((result, index) => (
                      <motion.div
                        key={`${result.type}-${result.id || result.videoId}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleResultClick(result)}
                        className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
                      >
                        <img
                          src={result.thumbnail}
                          alt={result.title}
                          className="w-16 h-9 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(result.type)}
                            <h3 className="font-medium text-white truncate">
                              {result.title}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-400 truncate">
                            {result.source}
                            {result.videoCount && ` • ${result.videoCount} videos`}
                          </p>
                          {result.description && (
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {result.description}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Search size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No results found for "{query}"</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Try different keywords or check your spelling
                    </p>
                  </div>
                )
              ) : (
                <div className="p-8 text-center">
                  <Search size={48} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400">Start typing to search</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Search across your videos, playlists, and watch history
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SearchModal;
