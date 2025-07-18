import { memo, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Play, Plus, MoreHorizontal, Star, Clock, Eye, Tag, TrendingUp, Users, Activity, Calendar, Video } from 'lucide-react';
import useAppStore from '@/lib/store/useAppStore';
import { Button } from '@/components/shared/ui';

// Memoized components for better performance
// eslint-disable-next-line no-unused-vars
const QuickStatsCard = memo(({ icon: IconComponent, title, value, gradient }) => (
  <div className="glass-card p-4">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center`}>
        <IconComponent className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm text-secondary">{title}</p>
        <p className="text-lg font-semibold text-primary">{value}</p>
      </div>
    </div>
  </div>
));

QuickStatsCard.displayName = 'QuickStatsCard';

const VideoCard = memo(({ video, index, onPlay, onToggleFavorite, isFavorite }) => (
  <motion.div
    className="video-card p-4 group"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
    onClick={() => onPlay(video)}
  >
    <div className="relative mb-4">
      {video.thumbnail ? (
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-40 rounded-lg object-cover"
          loading="lazy"
          onError={e => { e.target.onerror = null; e.target.src = ''; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
        />
      ) : null}
      {/* Placeholder if no thumbnail or error */}
      <div
        style={{ display: video.thumbnail ? 'none' : 'flex' }}
        className="absolute inset-0 w-full h-40 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100/60 to-purple-100/40 border border-blue-200/40 rounded-lg glass-card text-blue-400"
      >
        <Video className="w-12 h-12 mb-2 opacity-70" />
        <span className="text-xs text-blue-400/70">No Thumbnail</span>
      </div>
      <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
        {video.duration}
      </div>
      <div className="absolute inset-0 bg-black/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
          <Play className="w-4 h-4 text-black ml-0.5" />
        </div>
      </div>
    </div>
      <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold video-title mb-2 truncate">{video.title}</h3>
        <p className="text-sm video-description mb-2 line-clamp-2">{video.description}</p>        <div className="flex items-center gap-2 video-metadata">
          <span>{video.views} views</span>
          <span>•</span>
          <span className="uppercase">{video.source}</span>
        </div>
      </div>
        <Button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(video.id);
        }}
        variant="glass"
        size="icon"
        className="ml-2"
      >
        <Star className={`w-4 h-4 ${isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
      </Button>
    </div>
  </motion.div>
));

VideoCard.displayName = 'VideoCard';

const RecentVideoItem = memo(({ video, onPlay }) => (
  <div 
    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
    onClick={onPlay}
  >
    {video.thumbnail ? (
      <img 
        src={video.thumbnail} 
        alt={video.title}
        className="w-16 h-10 rounded object-cover"
        loading="lazy"
        onError={e => { e.target.onerror = null; e.target.src = ''; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
      />
    ) : null}
    {/* Placeholder if no thumbnail or error */}
    <div
      style={{ display: video.thumbnail ? 'none' : 'flex' }}
      className="w-16 h-10 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100/60 to-purple-100/40 border border-blue-200/40 rounded glass-card text-blue-400"
    >
      <Video className="w-6 h-6 mb-1 opacity-70" />
      <span className="text-[10px] text-blue-400/70">No Thumbnail</span>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-medium video-title text-sm truncate">{video.title}</h4>
      <div className="w-full h-1 bg-white/20 rounded-full mt-2">
        <div 
          className="h-1 bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${video.progress || 0}%` }}
        />
      </div>
    </div>
  </div>
));

RecentVideoItem.displayName = 'RecentVideoItem';

const Dashboard = () => {
  const { 
    videos, 
    setCurrentVideo, 
    toggleFavorite, 
    favorites, 
    watchHistory, 
    playlists,
    addVideoToPlaylist 
  } = useAppStore();

  // Memoized calculations for better performance
  const quickStats = useMemo(() => {
    const totalWatchTime = watchHistory.reduce((acc, video) => acc + (video.watchTime || 0), 0);
    const completedVideos = watchHistory.filter(video => video.progress >= 90).length;
    const todayWatchTime = watchHistory
      .filter(video => {
        const today = new Date().toDateString();
        const videoDate = new Date(video.watchedAt).toDateString();
        return today === videoDate;
      })
      .reduce((acc, video) => acc + (video.watchTime || 0), 0);

    return {
      todayWatchTime,
      totalWatchTime,
      completedVideos,
      librarySize: videos.length
    };
  }, [watchHistory, videos.length]);

  const { featuredVideo, suggestedVideos, recentVideos } = useMemo(() => ({
    featuredVideo: videos[0],
    suggestedVideos: videos.slice(1, 9), // Show 8 suggested videos
    recentVideos: watchHistory.slice(0, 4) // Show 4 recent videos
  }), [videos, watchHistory]);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handlePlayVideo = (video) => {
    setCurrentVideo(video);
  };

  const handleAddToPlaylist = (videoId) => {
    // Add to "Watch Later" playlist by default
    const watchLaterPlaylist = playlists.find(p => p.name === 'Watch Later');
    if (watchLaterPlaylist) {
      addVideoToPlaylist(watchLaterPlaylist.id, videoId);
    }
  };

  return (
    <motion.div 
      className="flex-1 p-6 overflow-y-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >      {/* Quick Stats Row */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >        <QuickStatsCard
          icon={Clock}
          title="Today"
          value={formatDuration(quickStats.todayWatchTime)}
          gradient="from-blue-500 to-blue-600"
        />
        <QuickStatsCard
          icon={TrendingUp}
          title="Total Time"
          value={formatDuration(quickStats.totalWatchTime)}
          gradient="from-green-500 to-green-600"
        />
        <QuickStatsCard
          icon={Eye}
          title="Completed"
          value={quickStats.completedVideos}
          gradient="from-purple-500 to-purple-600"
        />
        <QuickStatsCard
          icon={Users}
          title="Library"
          value={quickStats.librarySize}
          gradient="from-orange-500 to-orange-600"
        />
      </motion.div>

      {/* Hero Section */}
      <motion.div 
        className="glass-card p-8 mb-8 relative overflow-hidden"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${featuredVideo.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        
        <div className="relative z-10 flex items-center gap-8">
          {/* Video Thumbnail */}
          <div className="relative group">
            <img 
              src={featuredVideo.thumbnail} 
              alt={featuredVideo.title}
              className="w-80 h-48 rounded-xl object-cover shadow-2xl group-hover:scale-105 transition-transform duration-300"
            />            <motion.div
              onClick={() => handlePlayVideo(featuredVideo)}
              className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            >
              <motion.div 
                className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Play className="w-6 h-6 text-black ml-1" />
              </motion.div>
            </motion.div>
          </div>

          {/* Video Info */}
          <div className="flex-1">            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">{featuredVideo.title}</h1>
                <p className="text-secondary text-lg mb-4 max-w-2xl">{featuredVideo.description}</p>
                
                {/* Video Meta */}
                <div className="flex items-center gap-6 text-sm text-muted mb-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{featuredVideo.views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{featuredVideo.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    <span>{featuredVideo.source.toUpperCase()}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-2 mb-6">
                  {featuredVideo.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-xs text-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>              <Button
                onClick={() => toggleFavorite(featuredVideo.id)}
                variant="glass"
                size="icon"
              >
                <Star className={`w-5 h-5 ${favorites.includes(featuredVideo.id) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={() => handlePlayVideo(featuredVideo)}
                variant="primary"
                icon={<Play className="w-4 h-4" />}
              >
                Watch Now
              </Button>
              
              <Button
                onClick={() => handleAddToPlaylist(featuredVideo.id)}
                variant="glass"
                icon={<Plus className="w-4 h-4" />}
              >
                Add to Playlist
              </Button>
              
              <Button
                variant="glass"
                size="icon"
                icon={<MoreHorizontal className="w-4 h-4" />}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Suggested Videos */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">You Might Like</h2>            <Button className="text-blue-400 hover:text-blue-300 transition-colors" variant="ghost">
              View All
            </Button>
          </div>          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestedVideos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                index={index}
                onPlay={handlePlayVideo}
                onToggleFavorite={toggleFavorite}
                isFavorite={favorites.includes(video.id)}
              />
            ))}
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Continue Watching */}
          {recentVideos.length > 0 && (
            <motion.div
              className="glass-card p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Continue Watching
              </h3>              <div className="space-y-4">
                {recentVideos.map((video) => (
                  <RecentVideoItem
                    key={video.videoId}
                    video={{
                      ...video,
                      title: video.title,
                      thumbnail: video.thumbnail
                    }}
                    onPlay={() => {
                      const videoData = videos.find(v => v.id === video.videoId);
                      if (videoData) handlePlayVideo(videoData);
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="glass"
                className="w-full justify-start gap-3"
                icon={<Plus className="w-4 h-4 text-blue-400" />}
              >
                <span className="text-white">Create Playlist</span>
              </Button>
              <Button
                variant="glass"
                className="w-full justify-start gap-3"
                icon={<Calendar className="w-4 h-4 text-green-400" />}
              >
                <span className="text-white">Schedule Learning</span>
              </Button>
              <Button
                variant="glass"
                className="w-full justify-start gap-3"
                icon={<TrendingUp className="w-4 h-4 text-purple-400" />}
              >
                <span className="text-white">View Statistics</span>
              </Button>
            </div>
          </motion.div>          {/* Today's Goal */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">Today's Goal</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{formatDuration(quickStats.todayWatchTime)}</div>
              <div className="text-sm text-gray-400 mb-4">of 60m daily goal</div>
              <div className="w-full h-2 bg-white/20 rounded-full">
                <div 
                  className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((quickStats.todayWatchTime / 60) * 100, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {Math.max(0, 60 - quickStats.todayWatchTime)}m remaining
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
