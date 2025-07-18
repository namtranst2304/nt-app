import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Play, Trash2, Edit3, Clock, VideoIcon, Eye } from 'lucide-react';
import useAppStore from '@/lib/store/useAppStore';

function Playlists() {  const {
    playlists,
    videos,
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    removeVideoFromPlaylist,
    setCurrentVideo,
    setActiveTab
  } = useAppStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim(), newPlaylistDescription.trim());
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setShowCreateModal(false);
    }
  };

  const handleEditPlaylist = (playlist) => {
    setEditingPlaylist(playlist);
    setNewPlaylistName(playlist.name);
    setNewPlaylistDescription(playlist.description);
    setShowCreateModal(true);
  };

  const handleUpdatePlaylist = () => {
    if (newPlaylistName.trim() && editingPlaylist) {
      updatePlaylist(editingPlaylist.id, {
        name: newPlaylistName.trim(),
        description: newPlaylistDescription.trim()
      });
      setEditingPlaylist(null);
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setShowCreateModal(false);
    }
  };

  const handlePlayPlaylist = (playlist) => {
    if (playlist.videoIds.length > 0) {
      const firstVideo = videos.find(v => v.id === playlist.videoIds[0]);
      if (firstVideo) {
        setCurrentVideo(firstVideo);
        setActiveTab('player');
      }
    }
  };

  const getPlaylistDuration = (playlist) => {
    const totalSeconds = playlist.videoIds.reduce((total, videoId) => {
      const video = videos.find(v => v.id === videoId);
      if (video && video.duration) {
        const [minutes, seconds] = video.duration.split(':').map(Number);
        return total + (minutes * 60) + seconds;
      }
      return total;
    }, 0);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const playlistsWithDetails = playlists.map(playlist => ({
    ...playlist,
    videosData: playlist.videoIds.map(id => videos.find(v => v.id === id)).filter(Boolean),
    duration: getPlaylistDuration(playlist)
  }));

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Playlists</h1>
          <p className="text-gray-400">Organize your favorite videos into custom playlists</p>
        </div>
        <motion.button
          onClick={() => setShowCreateModal(true)}
          className="glass-card px-6 py-3 text-white font-medium rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          Create Playlist
        </motion.button>
      </div>

      {/* Playlists Grid */}
      {playlistsWithDetails.length === 0 ? (
        <div className="text-center py-20">
          <VideoIcon size={64} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No playlists yet</h3>
          <p className="text-gray-500 mb-6">Create your first playlist to organize your videos</p>
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="glass-card px-6 py-3 text-white font-medium rounded-xl hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Playlist
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlistsWithDetails.map((playlist) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer"
              onClick={() => setSelectedPlaylist(playlist)}
            >
              {/* Playlist Thumbnail Grid */}
              <div className="relative mb-4 rounded-lg overflow-hidden bg-gray-800 aspect-video">
                {playlist.videosData.length > 0 ? (
                  <div className="grid grid-cols-2 h-full">
                    {playlist.videosData.slice(0, 4).map((video, index) => (
                      <div key={video.id} className="relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        {index === 3 && playlist.videosData.length > 4 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-semibold">
                              +{playlist.videosData.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <VideoIcon size={32} className="text-gray-600" />
                  </div>
                )}
                
                {/* Play Button Overlay */}
                {playlist.videoIds.length > 0 && (
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPlaylist(playlist);
                    }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Play size={24} className="text-white" fill="white" />
                  </motion.button>
                )}
              </div>

              {/* Playlist Info */}
              <div className="space-y-2">
                <h3 className="text-white font-semibold text-lg group-hover:text-purple-300 transition-colors">
                  {playlist.name}
                </h3>
                {playlist.description && (
                  <p className="text-gray-400 text-sm line-clamp-2">{playlist.description}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <VideoIcon size={14} />
                    {playlist.videoIds.length} videos
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {playlist.duration}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditPlaylist(playlist);
                    }}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit3 size={16} />
                  </motion.button>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlaylist(playlist.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Playlist Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowCreateModal(false);
              setEditingPlaylist(null);
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
              <h2 className="text-xl font-bold text-white mb-6">
                {editingPlaylist ? 'Edit Playlist' : 'Create New Playlist'}
              </h2>
              
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
                    setEditingPlaylist(null);
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
                  onClick={editingPlaylist ? handleUpdatePlaylist : handleCreatePlaylist}
                  disabled={!newPlaylistName.trim()}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {editingPlaylist ? 'Update' : 'Create'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playlist Detail Modal */}
      <AnimatePresence>
        {selectedPlaylist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPlaylist(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-6 rounded-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedPlaylist.name}</h2>
                  {selectedPlaylist.description && (
                    <p className="text-gray-400">{selectedPlaylist.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>{selectedPlaylist.videoIds.length} videos</span>
                    <span>{selectedPlaylist.duration}</span>
                  </div>
                </div>
                
                {selectedPlaylist.videoIds.length > 0 && (
                  <motion.button
                    onClick={() => handlePlayPlaylist(selectedPlaylist)}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play size={20} />
                    Play All
                  </motion.button>
                )}
              </div>

              {/* Videos List */}
              <div className="space-y-3">
                {selectedPlaylist.videosData.length === 0 ? (
                  <div className="text-center py-12">
                    <VideoIcon size={48} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No videos in this playlist yet</p>
                  </div>
                ) : (
                  selectedPlaylist.videosData.map((video, index) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                    >
                      <div className="text-gray-400 text-sm w-8 text-center">
                        {index + 1}
                      </div>
                      
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-24 h-16 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{video.title}</h4>
                        <p className="text-gray-400 text-sm">{video.duration} • {video.views} views</p>
                      </div>
                      
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          onClick={() => {
                            setCurrentVideo(video);
                            setActiveTab('player');
                            setSelectedPlaylist(null);
                          }}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Play size={16} />
                        </motion.button>
                        <motion.button
                          onClick={() => removeVideoFromPlaylist(selectedPlaylist.id, video.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Playlists;
