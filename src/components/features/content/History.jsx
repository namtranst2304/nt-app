import { useState, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Calendar, Clock, Play, Trash2, Filter, Eye, X, TrendingUp, BarChart3 } from 'lucide-react';
import useAppStore from '@/lib/store/useAppStore';
import { Button } from '@/components/shared/ui';

function History() {
  const {
    watchHistory,
    videos,
    clearWatchHistory,
    removeFromWatchHistory,
    setCurrentVideo,
    setActiveTab
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all'); // all, today, week, month
  const [sortBy, setSortBy] = useState('recent'); // recent, duration, title, progress
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get video details for history items
  const historyWithDetails = useMemo(() => {
    return watchHistory.map(historyItem => {
      const video = videos.find(v => v.id === historyItem.videoId);
      return {
        ...historyItem,
        video
      };
    }).filter(item => item.video); // Only include items with valid video data
  }, [watchHistory, videos]);

  // Get unique categories from watch history
  const categories = useMemo(() => {
    const cats = new Set(['all']);
    historyWithDetails.forEach(item => {
      if (item.video?.category) {
        cats.add(item.video.category);
      }
    });
    return Array.from(cats);
  }, [historyWithDetails]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalVideos = historyWithDetails.length;
    const totalTime = historyWithDetails.reduce((acc, item) => {
      const [minutes, seconds] = item.duration.split(':').map(Number);
      return acc + (minutes * 60 + seconds);
    }, 0);
    
    const completedVideos = historyWithDetails.filter(item => item.progress >= 90).length;
    const averageProgress = historyWithDetails.reduce((acc, item) => acc + item.progress, 0) / totalVideos || 0;

    return {
      totalVideos,
      totalTime: Math.floor(totalTime / 60), // in minutes
      completedVideos,
      averageProgress: Math.round(averageProgress)
    };
  }, [historyWithDetails]);

  // Filter and sort history
  const filteredHistory = useMemo(() => {
    let filtered = historyWithDetails;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.video.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.video.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.video.category === selectedCategory);
    }

    // Time period filter
    const now = new Date();
    if (selectedPeriod !== 'all') {
      filtered = filtered.filter(item => {
        const watchedDate = new Date(item.watchedAt);
        
        switch (selectedPeriod) {
          case 'today':
            return watchedDate.toDateString() === now.toDateString();
          case 'week': {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return watchedDate >= weekAgo;
          }
          case 'month': {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return watchedDate >= monthAgo;
          }
          default:
            return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.watchedAt) - new Date(a.watchedAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'duration': {
          const getDurationSeconds = (duration) => {
            const [minutes, seconds] = duration.split(':').map(Number);
            return minutes * 60 + seconds;
          };
          return getDurationSeconds(b.duration) - getDurationSeconds(a.duration);
        }
        case 'progress':
          return b.progress - a.progress;
        default:
          return 0;
      }
    });

    return filtered;
  }, [historyWithDetails, searchQuery, selectedPeriod, sortBy, selectedCategory]);

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const formatProgress = (progress) => {
    return `${Math.round(progress)}%`;
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Watch History</h1>
          <p className="text-gray-400">
            {filteredHistory.length} videos • Keep track of your viewing progress
          </p>
        </div>
          {watchHistory.length > 0 && (
          <Button
            onClick={clearWatchHistory}
            variant="secondary"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
            icon={<Trash2 size={20} />}
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search watch history..."
            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
        </div>        {/* Filter Toggle */}
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant={showFilters ? "primary" : "glass"}
          icon={<Filter size={20} />}
        >
          Filters
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          className="glass-card p-4 rounded-xl"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3">
            <Eye className="text-purple-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">Total Videos</p>
              <p className="text-white text-xl font-bold">{stats.totalVideos}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card p-4 rounded-xl"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3">
            <Clock className="text-blue-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">Watch Time</p>
              <p className="text-white text-xl font-bold">{Math.floor(stats.totalTime / 60)}h {stats.totalTime % 60}m</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card p-4 rounded-xl"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="text-green-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-white text-xl font-bold">{stats.completedVideos}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card p-4 rounded-xl"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="text-orange-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">Avg Progress</p>
              <p className="text-white text-xl font-bold">{stats.averageProgress}%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="glass-card p-6 rounded-xl mb-6 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Time Period Filter */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Time Period</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                >
                  <option value="all" className="bg-gray-800">All Time</option>
                  <option value="today" className="bg-gray-800">Today</option>
                  <option value="week" className="bg-gray-800">This Week</option>
                  <option value="month" className="bg-gray-800">This Month</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800">
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                >
                  <option value="recent" className="bg-gray-800">Most Recent</option>
                  <option value="title" className="bg-gray-800">Title A-Z</option>
                  <option value="duration" className="bg-gray-800">Duration</option>
                  <option value="progress" className="bg-gray-800">Progress</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-20">
          <Clock size={64} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {watchHistory.length === 0 ? 'No watch history' : 'No results found'}
          </h3>
          <p className="text-gray-500">
            {watchHistory.length === 0 
              ? 'Start watching videos to build your history'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-4 rounded-xl hover:bg-white/10 transition-colors group"
            >
              <div className="flex gap-4">
                {/* Thumbnail with Progress */}
                <div className="relative flex-shrink-0">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-40 h-24 object-cover rounded-lg"
                  />
                  
                  {/* Progress Bar */}
                  {item.progress > 0 && (
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className="bg-black/60 rounded-full h-1">
                        <div
                          className="bg-red-500 h-1 rounded-full transition-all"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Play Button */}
                  <motion.button
                    onClick={() => {
                      setCurrentVideo(item.video);
                      setActiveTab('player');
                    }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Play size={24} className="text-white" fill="white" />
                  </motion.button>
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {item.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {item.video.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatRelativeTime(item.watchedAt)}
                    </span>
                  </div>

                  {/* Progress Info */}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-purple-400">
                      Progress: {formatProgress(item.progress)}
                    </span>
                    {item.video.tags && (
                      <div className="flex gap-2">
                        {item.video.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-white/10 text-gray-300 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>                {/* Actions */}
                <div className="flex-shrink-0 flex items-start gap-2">
                  <Button
                    onClick={() => {
                      setCurrentVideo(item.video);
                      setActiveTab('player');
                    }}
                    variant="ghost"
                    size="icon"
                    className="p-2 text-gray-400 hover:text-white"
                    title="Watch"
                  >
                    <Play size={18} />
                  </Button>
                  <Button
                    onClick={() => removeFromWatchHistory(item.id)}
                    variant="ghost"
                    size="icon"
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20"
                    title="Remove from history"
                  >
                    <X size={18} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
