// Video player utilities - Shared functions for video handling

/**
 * Check if a file is a valid video file
 * @param {File} file - File object to check
 * @returns {boolean} - Whether the file is a video
 */
export const isVideoFile = (file) => {
  return file.type.startsWith('video/') || 
         /\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv)$/i.test(file.name);
};

/**
 * Create video object from file
 * @param {File} file - File object
 * @param {number} timestamp - Timestamp for unique ID
 * @param {number} index - Index for batch uploads
 * @returns {Object} - Video object
 */
export const createVideoFromFile = (file, timestamp, index = 0) => ({
  id: `batch-${timestamp}-${index}`,
  title: file.name.replace(/\.[^/.]+$/, ''),
  url: URL.createObjectURL(file),
  source: 'local',
  type: 'local',
  thumbnail: '/placeholder-video.jpg',
  duration: '00:00',
  addedAt: new Date().toISOString(),
  fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
});

/**
 * Validate video URL for both online and local videos
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
export const validateVideoUrl = (url) => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const isOnlineVideo = hostname.includes('youtube.com') || 
      hostname.includes('youtu.be') || 
      hostname.includes('vimeo.com') || 
      hostname.includes('twitch.tv');
    
    if (isOnlineVideo) return true;
  } catch {
    // Not a valid URL, check if it's a local file
  }
  
  // Check for local video files
  return /\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv)$/i.test(url);
};

/**
 * Get embed URL for online videos
 * @param {string} url - Original video URL
 * @returns {string} - Embed URL or original URL
 */
export const getEmbedUrl = (url) => {
  if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
    return '';
  }
  
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be') 
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  }
  
  // Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
  }
  
  // Twitch
  if (url.includes('twitch.tv')) {
    const channel = url.split('twitch.tv/')[1]?.split('?')[0];
    return `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}`;
  }
  
  return url;
};

/**
 * Check if URL is an online video (external platform)
 * @param {string} url - URL to check
 * @returns {boolean} - Whether URL is from online platform
 */
export const isOnlineVideo = (url) => {
  if (!url) return false;
  
  return url.includes('youtube.com') || 
         url.includes('youtu.be') || 
         url.includes('vimeo.com') || 
         url.includes('twitch.tv') ||
         url.startsWith('http://') || 
         url.startsWith('https://');
};

/**
 * Format time from seconds to MM:SS format
 * @param {number} time - Time in seconds
 * @returns {string} - Formatted time string
 */
export const formatTime = (time) => {
  if (!time || isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Get video platform name from URL
 * @param {string} url - Video URL
 * @returns {string} - Platform name
 */
export const getVideoPlatform = (url) => {
  if (!url) return 'Unknown';
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('vimeo.com')) return 'Vimeo';
  if (url.includes('twitch.tv')) return 'Twitch';
  if (url.startsWith('blob:') || url.startsWith('file:')) return 'Local';
  
  return 'Online';
};
