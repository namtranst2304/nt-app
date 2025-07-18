import { memo, useCallback, useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Share2, 
  Download, 
  ExternalLink,
  PictureInPicture,
  Plus,
  List,
  ChevronDown,
  Eye,
  SquareLibrary,
  FolderPlus
} from 'lucide-react';
import useAppStore from '@/lib/store/useAppStore';
import { Button } from '@/components/shared/ui';
import { isOnlineVideo } from './videoUtils';

/**
 * TitleBar - Component xử lý thanh tiêu đề video  
 * Features:
 * - Hiển thị tên video và thông tin
 * - Các nút action: favorite, share, download, PiP, add to playlist
 * - Hỗ trợ playlist info và time info cho local videos
 * - Responsive design với glassmorphism
 */
const TitleBar = memo(({ 
  video, 
  videoType = 'online',
  playlistInfo = null,
  timeInfo = null,
  onPlaylistToggle = null,
  showPlaylistToggle = false,
  isPlaylistVisible = false,
  compact = false 
}) => {  const { 
    toggleFavorite,
    favorites,
    addVideoToPlaylist,
    playlists,
    setPiPMode
  } = useAppStore();  // State for dropdown
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const [showViewPlaylistsDropdown, setShowViewPlaylistsDropdown] = useState(false);

  // Optimized callback handlers
  const handleFavoriteToggle = useCallback(() => {
    if (video?.id) {
      toggleFavorite(video.id);
    }
  }, [video?.id, toggleFavorite]);
  const handleAddToPlaylist = useCallback((playlistId) => {
    if (!video || !playlistId) return;
    addVideoToPlaylist(playlistId, video.id);
    setShowPlaylistDropdown(false);
    window.dispatchEvent(new CustomEvent('show-notification', {
      detail: { type: 'success', message: 'Added to playlist' }
    }));
  }, [video, addVideoToPlaylist]);

  const handleCreatePlaylist = useCallback(() => {
    setShowPlaylistDropdown(false);
    window.dispatchEvent(new CustomEvent('create-playlist'));
  }, []);

  const handleViewPlaylists = useCallback(() => {
    setShowViewPlaylistsDropdown(false);
    window.dispatchEvent(new CustomEvent('show-playlists'));
  }, []);

  const dropdownRef = useRef(null);
  const viewPlaylistsDropdownRef = useRef(null);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPlaylistDropdown(false);
      }
      if (viewPlaylistsDropdownRef.current && !viewPlaylistsDropdownRef.current.contains(event.target)) {
        setShowViewPlaylistsDropdown(false);
      }
    };

    if (showPlaylistDropdown || showViewPlaylistsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPlaylistDropdown, showViewPlaylistsDropdown]);

  const handleShare = useCallback(() => {
    if (video?.url) {
      navigator.clipboard.writeText(video.url);
      window.dispatchEvent(new CustomEvent('show-notification', {
        detail: { type: 'success', message: 'URL copied to clipboard' }
      }));
    }
  }, [video?.url]);  const handleDownload = useCallback(async () => {
    if (!video?.url) return;
    
    const url = video.url;
    const fileName = video.title ? `${video.title.replace(/[<>:"/\\|?*]/g, '_')}.mp4` : 'video.mp4';
    
    try {
      // Check if it's a platform video (YouTube, Vimeo, Twitch)
      const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
      const isVimeo = url.includes('vimeo.com');
      const isTwitch = url.includes('twitch.tv');
      
      if (isYouTube || isVimeo || isTwitch) {
        // For platform videos, open in new tab with helpful message
        window.open(url, '_blank');
        window.dispatchEvent(new CustomEvent('show-notification', {
          detail: { 
            type: 'info', 
            message: 'Opened in new tab. Use yt-dlp, browser extensions, or online tools to download.' 
          }
        }));
        return;
      }
      
      // For direct video files or other URLs, try different approaches
      window.dispatchEvent(new CustomEvent('show-notification', {
        detail: { type: 'info', message: 'Starting download...' }
      }));

      // Method 1: Try direct download link (works for many direct video URLs)
      try {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.target = '_blank';
        
        // Add to DOM, click, then remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        window.dispatchEvent(new CustomEvent('show-notification', {
          detail: { type: 'success', message: 'Download started! Check your Downloads folder.' }
        }));
        return;
      } catch (directDownloadError) {
        console.log('Direct download failed, trying fetch method...', directDownloadError);
      }

      // Method 2: Try fetching and creating blob (for CORS-enabled URLs)
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'video/mp4,video/webm,video/*,*/*',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();
        
        // Use File System Access API if available (Chrome/Edge)
        if ('showSaveFilePicker' in window) {
          try {
            const fileHandle = await window.showSaveFilePicker({
              suggestedName: fileName,
              types: [{
                description: 'Video files',
                accept: {
                  'video/mp4': ['.mp4'],
                  'video/webm': ['.webm'],
                  'video/avi': ['.avi'],
                  'video/mov': ['.mov'],
                  'video/*': ['.mp4', '.webm', '.avi', '.mov', '.mkv']
                }
              }]
            });

            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();

            window.dispatchEvent(new CustomEvent('show-notification', {
              detail: { type: 'success', message: 'Video saved successfully!' }
            }));
            return;
          } catch (filePickerError) {
            if (filePickerError.name === 'AbortError') {
              return; // User cancelled
            }
            console.log('File picker failed, using blob download...', filePickerError);
          }
        }
        
        // Fallback: Create blob URL and download
        const blobUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        
        window.dispatchEvent(new CustomEvent('show-notification', {
          detail: { type: 'success', message: 'Download completed!' }
        }));
        
      } catch (fetchError) {
        console.log('Fetch method failed:', fetchError);
        
        // Method 3: Open in new tab as final fallback
        window.open(url, '_blank');
        window.dispatchEvent(new CustomEvent('show-notification', {
          detail: { 
            type: 'warning', 
            message: 'Cannot download directly. Opened in new tab - try right-click "Save video as..."' 
          }
        }));
      }
      
    } catch (error) {
      console.error('Download failed:', error);
        // Final fallback: open in new tab
      try {
        window.open(url, '_blank');
        window.dispatchEvent(new CustomEvent('show-notification', {
          detail: { 
            type: 'error', 
            message: 'Download failed. Opened in new tab - try right-click "Save video as..."' 
          }
        }));
      } catch {
        window.dispatchEvent(new CustomEvent('show-notification', {
          detail: { type: 'error', message: 'Download and open failed. Please check the video URL.' }
        }));
      }
    }
  }, [video?.url, video?.title]);
  const openInNewTab = useCallback(() => {
    if (video?.url) {
      window.open(video.url, '_blank');
    }
  }, [video?.url]);

  const handlePiPToggle = useCallback(() => {
    setPiPMode(true);
  }, [setPiPMode]);
  if (!video) {
    return null;
  }

  const isOnlineVideoCheck = videoType === 'online' || video.source === 'online' || 
    isOnlineVideo(video.url);

  // Build title with playlist info
  let displayTitle = video.title;
  if (playlistInfo && playlistInfo.currentIndex !== undefined && playlistInfo.totalCount) {
    displayTitle = `${playlistInfo.currentIndex + 1}/${playlistInfo.totalCount}: ${video.title}`;
  }

  return (
    <div className={`relative z-10 ${compact ? 'mt-2' : 'mt-3'}`}>
      <div className={`flex items-center justify-between bg-black/40 backdrop-blur-sm rounded-lg ${compact ? 'px-3 py-2' : 'px-4 py-3'} max-w-5xl w-full`}>
        {/* Title Section */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <h1 className={`text-white font-medium line-clamp-1 ${compact ? 'text-sm max-w-[300px]' : 'text-base max-w-[400px]'}`}>
            {isOnlineVideoCheck ? `Online Stream: ${video.title}` : displayTitle}
          </h1>
          
          {playlistInfo && playlistInfo.isQueue && (
            <span className="text-gray-400 text-xs font-mono bg-white/10 px-2 py-1 rounded-md flex-shrink-0">
              Queue
            </span>
          )}
          
          {timeInfo && (
            <span className="text-white text-sm font-mono">
              {timeInfo.currentTime} / {timeInfo.duration}
            </span>
          )}
          
          {video.fileSize && !timeInfo && (
            <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded">
              {video.fileSize}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`flex items-center ${compact ? 'gap-1' : 'gap-2'} flex-shrink-0`}>         
            {/* Add to Playlist Button with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              onClick={() => setShowPlaylistDropdown(!showPlaylistDropdown)}
              variant="glass"
              size={compact ? "sm" : "icon"}
              className={compact ? 'p-1' : 'p-1.5'}
              title="Add to Playlist"
            >
              <Plus size={compact ? 12 : 14} />
              {!compact && <ChevronDown size={compact ? 10 : 12} />}
            </Button>{/* Dropdown Menu - Shows upward */}
            {showPlaylistDropdown && (
              <div className="absolute bottom-full right-0 mb-2 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-50 min-w-48">
                <div className="p-2">
                  {playlists.length > 0 ? (
                    <>
                      <div className="text-xs text-gray-400 mb-2 px-2">Add to playlist:</div>
                      {playlists.slice(0, 5).map((playlist) => (
                        <button
                          key={playlist.id}
                          onClick={() => handleAddToPlaylist(playlist.id)}
                          className="w-full text-left text-white text-sm py-2 px-2 hover:bg-white/10 rounded flex items-center gap-2"
                        >
                          <List size={12} className="text-gray-400" />
                          <span className="truncate">{playlist.name}</span>
                        </button>
                      ))}
                      {playlists.length > 5 && (
                        <div className="text-xs text-gray-500 px-2 py-1">
                          +{playlists.length - 5} more...
                        </div>
                      )}
                      <div className="border-t border-white/10 mt-2 pt-2">
                        <button
                          onClick={handleCreatePlaylist}
                          className="w-full text-left text-green-400 text-sm py-2 px-2 hover:bg-green-500/10 rounded flex items-center gap-2"
                        >
                          <FolderPlus size={12} />
                          Create Playlist
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-gray-400 text-sm py-2 px-2">
                        No playlists available
                      </div>
                      <div className="border-t border-white/10 mt-2 pt-2">
                        <button
                          onClick={handleCreatePlaylist}
                          className="w-full text-left text-green-400 text-sm py-2 px-2 hover:bg-green-500/10 rounded flex items-center gap-2"
                        >
                          <FolderPlus size={12} />
                          Create Playlist
                        </button>
                      </div>
                    </>
                  )}                </div>
              </div>
            )}
          </div>          {/* View Playlists Button with Dropdown */}
          <div className="relative" ref={viewPlaylistsDropdownRef}>
            <Button
              onClick={() => setShowViewPlaylistsDropdown(!showViewPlaylistsDropdown)}
              variant="glass"
              size={compact ? "sm" : "icon"}
              className={compact ? 'p-1' : 'p-1.5'}
              title="View Playlists"
            >
              <SquareLibrary size={compact ? 12 : 14} />
              {!compact && <ChevronDown size={compact ? 10 : 12} />}
            </Button>

            {/* Dropdown Menu - Shows upward */}
            {showViewPlaylistsDropdown && (
              <div className="absolute bottom-full right-0 mb-2 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-50 min-w-48">
                <div className="p-2">
                  {playlists.length > 0 ? (
                    <>
                      <div className="text-xs text-gray-400 mb-2 px-2">Your playlists:</div>
                      {playlists.slice(0, 8).map((playlist) => (
                        <button
                          key={playlist.id}
                          onClick={() => handleViewPlaylists()}
                          className="w-full text-left text-white text-sm py-2 px-2 hover:bg-white/10 rounded flex items-center gap-2"
                        >
                          <List size={12} className="text-gray-400" />
                          <span className="truncate">{playlist.name}</span>
                          <span className="text-xs text-gray-500 ml-auto">
                            {playlist.videos?.length || 0}
                          </span>
                        </button>
                      ))}
                      {playlists.length > 8 && (
                        <div className="text-xs text-gray-500 px-2 py-1">
                          +{playlists.length - 8} more...
                        </div>
                      )}
                      <div className="border-t border-white/10 mt-2 pt-2">
                        <button
                          onClick={handleViewPlaylists}
                          className="w-full text-left text-purple-400 text-sm py-2 px-2 hover:bg-purple-500/10 rounded flex items-center gap-2"
                        >
                          <Eye size={12} />
                          View All Playlists
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400 text-sm py-2 px-2">
                      No playlists available
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
                      {/* Favorite Button */}
          <Button
            onClick={handleFavoriteToggle}
            variant="glass"
            size={compact ? "sm" : "icon"}
            className={`${compact ? 'p-1' : 'p-1.5'} ${
              favorites.includes(video.id)
                ? 'text-red-500 bg-red-500/20'
                : 'text-white'
            }`}
            title={favorites.includes(video.id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={compact ? 12 : 14} fill={favorites.includes(video.id) ? 'currentColor' : 'none'} />
          </Button>          {/* Share Button */}
          <Button
            onClick={handleShare}
            variant="glass"
            size={compact ? "sm" : "icon"}
            className={compact ? 'p-1' : 'p-1.5'}
            title="Copy URL"
          >
            <Share2 size={compact ? 12 : 14} />
          </Button>

          {/* Download Button - Only for online videos */}
          {isOnlineVideo && (
            <Button
              onClick={handleDownload}
              variant="glass"
              size={compact ? "sm" : "icon"}
              className={compact ? 'p-1' : 'p-1.5'}
              title="Download Video (or open in new tab for platform videos)"
            >
              <Download size={compact ? 12 : 14} />
            </Button>
          )}

          {/* Picture in Picture Button */}
          <Button
            onClick={handlePiPToggle}
            variant="glass"
            size={compact ? "sm" : "icon"}
            className={compact ? 'p-1' : 'p-1.5'}
            title="Picture in Picture"
          >
            <PictureInPicture size={compact ? 12 : 14} />
          </Button>

          {/* Playlist Toggle Button - Only for local videos with playlist */}
          {showPlaylistToggle && onPlaylistToggle && (
            <Button
              onClick={onPlaylistToggle}
              variant="glass"
              size={compact ? "sm" : "icon"}
              className={`${compact ? 'p-1' : 'p-1.5'} ${
                isPlaylistVisible 
                  ? 'text-purple-400 bg-purple-500/20 shadow-md' 
                  : 'text-white'
              }`}
              title="Toggle Queue"
            >
              <List size={compact ? 12 : 14} />
            </Button>
          )}

          {/* Open in New Tab - Only for online videos */}
          {isOnlineVideo && (
            <Button
              onClick={openInNewTab}
              variant="glass"
              size={compact ? "sm" : "icon"}
              className={compact ? 'p-1' : 'p-1.5'}
              title="Open in new tab"
            >
              <ExternalLink size={compact ? 12 : 14} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

TitleBar.displayName = 'TitleBar';

export default TitleBar;
