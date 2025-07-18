import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Upload, Link, ChevronDown, File, Folder, X, Video, AlertCircle } from 'lucide-react';
import { Button } from '@/components/shared/ui';
import useAppStore from '@/lib/store/useAppStore';
import OnlinePlayer from './OnlinePlayer';
import LocalPlayer from './LocalPlayer';
import { isVideoFile, createVideoFromFile, validateVideoUrl } from './videoUtils';

/**
 * VideoPlayer - Main component handling local file upload, URL pasting, and related popups
 * Features:
 * - Local file/folder upload logic (integrated)
 * - Online video URL input handling
 * - Upload popup management for files/folders
 * - Navigation between OnlinePlayer and LocalPlayer
 */

const VideoPlayer = () => {
  const { 
    currentVideo, 
    setCurrentVideo, 
    addVideo, 
    setActiveTab,
    createPlaylist,
    addVideoToPlaylist
  } = useAppStore();
  
  // URL input state
  const [urlInput, setUrlInput] = useState('');
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  
  // Upload popup state
  const [showPopup, setShowPopup] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [popupMode, setPopupMode] = useState('folder'); // 'folder' or 'files'
  
  // Session playlist (not saved)
  const [sessionPlaylist, setSessionPlaylist] = useState([]);
  
  // Refs
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  // Memoize URL validation
  const isValidUrl = useMemo(() => validateVideoUrl(urlInput), [urlInput]);

  // Handle load video from URL
  const handleLoadVideo = useCallback(() => {
    if (!isValidUrl || !urlInput) return;

    const video = {
      id: Date.now().toString(),
      title: urlInput.split('/').pop() || 'Video',
      url: urlInput,
      source: 'online',
      type: 'online',
      thumbnail: '/placeholder-video.jpg',
      duration: '00:00',
      addedAt: new Date().toISOString()
    };

    addVideo(video);
    setCurrentVideo(video);
    setUrlInput('');
  }, [isValidUrl, urlInput, addVideo, setCurrentVideo]);

  // Handle file upload
  const handleFileUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    const videoFiles = files.filter(isVideoFile);
    
    if (videoFiles.length === 0) {
      window.dispatchEvent(new CustomEvent('show-notification', {
        detail: { type: 'warning', message: 'No video files found in selection' }
      }));
      return;
    }

    const timestamp = Date.now();

    if (videoFiles.length === 1) {
      // Single file upload
      const video = createVideoFromFile(videoFiles[0], timestamp);
      addVideo(video);
      setCurrentVideo(video);
      setActiveTab && setActiveTab('player');
      
      // Trigger playlist visibility
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('show-local-playlist'));
      }, 100);
      
      window.dispatchEvent(new CustomEvent('show-notification', {
        detail: { type: 'success', message: `Loaded "${video.title}"` }
      }));
    } else {
      // Multiple files: show popup
      setPendingFiles(videoFiles);
      setPlaylistName('Uploaded Videos - ' + new Date().toLocaleDateString());
      setPopupMode('files');
      setShowPopup(true);
    }
  }, [addVideo, setCurrentVideo, setActiveTab]);

  // Handle folder upload
  const handleFolderUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    const videoFiles = files.filter(isVideoFile);
    
    if (videoFiles.length === 0) {
      window.dispatchEvent(new CustomEvent('show-notification', {
        detail: { type: 'warning', message: 'No video files found in the selected folder' }
      }));
      return;
    }

    const folderName = files[0]?.webkitRelativePath?.split('/')[0] || 'Unknown Folder';
    setPendingFiles(videoFiles);
    setPlaylistName(folderName + ' - ' + new Date().toLocaleDateString());
    setPopupMode('folder');
    setShowPopup(true);
  }, []);

  // Handle popup actions
  const handlePopupAction = useCallback((action) => {
    if (!pendingFiles.length) {
      setShowPopup(false);
      return;
    }

    if (action === 'cancel') {
      setShowPopup(false);
      setPendingFiles([]);
      setPlaylistName('');
      return;
    }

    const timestamp = Date.now();
    const playlist = pendingFiles.map((file, index) => {
      const video = createVideoFromFile(file, timestamp, index);
      addVideo(video);
      return video;
    });

    setSessionPlaylist(playlist);
    setCurrentVideo(playlist[0]);
    setActiveTab && setActiveTab('player');
    
    if (action === 'save') {
      const playlistId = createPlaylist(playlistName, `Uploaded ${playlist.length} videos`);
      playlist.forEach(video => addVideoToPlaylist(playlistId, video.id));
      window.dispatchEvent(new CustomEvent('show-notification', {
        detail: { type: 'success', message: `Created playlist "${playlistName}" with ${playlist.length} videos` }
      }));
    } else if (action === 'session') {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('show-local-playlist'));
      }, 200);
      window.dispatchEvent(new CustomEvent('show-notification', {
        detail: { type: 'info', message: `Loaded ${playlist.length} videos for this session` }
      }));
    }

    setShowPopup(false);
    setPendingFiles([]);
    setPlaylistName('');
  }, [pendingFiles, playlistName, addVideo, setCurrentVideo, setActiveTab, createPlaylist, addVideoToPlaylist, setSessionPlaylist]);

  // Effects for playlist visibility
  useEffect(() => {
    if (sessionPlaylist && sessionPlaylist.length > 0) {
      window.dispatchEvent(new CustomEvent('show-local-playlist'));
    }
  }, [sessionPlaylist]);

  useEffect(() => {
    if (currentVideo && currentVideo.type === 'local') {
      window.dispatchEvent(new CustomEvent('show-local-playlist'));
    }
  }, [currentVideo]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUploadOptions && !event.target.closest('.upload-dropdown')) {
        setShowUploadOptions(false);
      }
    };

    if (showUploadOptions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showUploadOptions]);

  // Upload button handlers
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
    setShowUploadOptions(false);
  };

  const handleFolderUploadClick = () => {
    folderInputRef.current?.click();
    setShowUploadOptions(false);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900/50 to-purple-900/50 p-4 relative rounded-t-2xl">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-white mb-1">Video Player</h1>
        <p className="text-gray-400 text-sm">Play videos from multiple sources or upload local files</p>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        ref={folderInputRef}
        type="file"
        webkitdirectory=""
        multiple
        accept="video/*"
        onChange={handleFolderUpload}
        className="hidden"
      />

      {/* Video URL Input */}
      <div className="glass-card p-3 mb-4 relative z-20">
        <div className="flex gap-2">
          <div className="flex-1">            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter video URL (YouTube, Vimeo, Twitch) or local file path..."
              className="input-glass w-full px-3 py-2 text-sm"
            />
          </div>          <Button
            onClick={handleLoadVideo}
            disabled={!isValidUrl}
            variant={isValidUrl ? "primary" : "secondary"}
            icon={Link}
            size="sm"
          >
            Load
          </Button>
          
          {/* Upload Button with Dropdown */}
          <div className="relative upload-dropdown">            <Button
              onClick={() => setShowUploadOptions(!showUploadOptions)}
              variant="primary"
              icon={Upload}
              size="sm"
              className="flex items-center gap-2"
            >
              Upload
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showUploadOptions ? 'rotate-180' : ''}`} />
            </Button>
            
            {/* Upload Options Dropdown */}
            {showUploadOptions && (
              <div className="absolute top-11 right-0 glass-card border border-white/20 rounded-xl p-2 min-w-52 z-[99999] shadow-2xl">
                <div className="space-y-1">                  <Button
                    onClick={handleFileUploadClick}
                    variant="ghost"
                    className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center gap-2 group justify-start"
                  >
                    <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                      <File className="w-3 h-3 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium text-xs">Upload Files</div>
                      <div className="text-xs text-gray-400">Select single or multiple video files</div>
                    </div>
                  </Button>
                    <Button
                    onClick={handleFolderUploadClick}
                    variant="ghost"
                    className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center gap-2 group justify-start"
                  >
                    <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                      <Folder className="w-3 h-3 text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium text-xs">Upload Folder</div>
                      <div className="text-xs text-gray-400">Select an entire folder with videos</div>
                    </div>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player Content - Unified layout for both sources */}
      <div className="flex-1 flex relative z-0 min-h-0 overflow-hidden">
        {currentVideo ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Player */}
            {currentVideo.type === 'online' && (
              <OnlinePlayer />
            )}
            {currentVideo.type === 'local' && (
              <LocalPlayer sessionPlaylist={sessionPlaylist} />
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Play className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No video selected</h3>
              <p className="mb-4">Load a video URL or upload a local file to start playing</p>              <Button
                onClick={() => setActiveTab('dashboard')}
                variant="primary"
                className="px-4 py-2"
              >
                Browse Videos
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-white mb-4">
              {popupMode === 'folder' ? 'Upload Folder as Playlist' : 'Upload Videos'}
            </h2>            <input
              type="text"
              className="input-glass w-full px-4 py-2 mb-4"
              value={playlistName}
              onChange={e => setPlaylistName(e.target.value)}
              placeholder="Playlist name"
            />
            <div className="flex gap-3 mt-4">              <Button
                onClick={() => handlePopupAction('save')}
                variant="primary"
                className="flex-1 font-medium"
              >
                Create Playlist
              </Button>              <Button
                onClick={() => handlePopupAction('session')}
                variant="secondary"
                className="flex-1"
              >
                Just Play
              </Button>              <Button
                onClick={() => handlePopupAction('cancel')}
                variant="ghost"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
