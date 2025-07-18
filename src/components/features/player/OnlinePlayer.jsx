import { useState, useEffect, memo, useMemo } from 'react';
import { Play } from 'lucide-react';
import useAppStore from '@/lib/store/useAppStore';
import TitleBar from './TitleBar';
import { getEmbedUrl } from './videoUtils';

const OnlinePlayer = memo(() => {
  const { 
    currentVideo,
    setIsPlaying
  } = useAppStore();
  
  const [isLoaded, setIsLoaded] = useState(false);

  // Memoize embed URL calculation
  const embedUrl = useMemo(() => getEmbedUrl(currentVideo?.url), [currentVideo?.url]);
  
  // Check if current video is an online video
  const isOnlineVideo = useMemo(() => {
    return currentVideo && (currentVideo.source === 'online' || 
      (currentVideo.url && (currentVideo.url.startsWith('http://') || currentVideo.url.startsWith('https://'))));
  }, [currentVideo]);

  useEffect(() => {
    if (currentVideo) {
      setIsLoaded(false);
      setIsPlaying(true);
    }
  }, [currentVideo, setIsPlaying]);

  // Early return for non-online videos
  if (!currentVideo || !isOnlineVideo) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <Play size={64} className="text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No online video selected</h2>
          <p className="text-gray-400">
            {currentVideo && currentVideo.source === 'local' 
              ? 'This video requires the Local Player' 
              : 'Choose an online video from your library'
            }
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col rounded-xl overflow-hidden">
      {/* Video Container - Match LocalPlayer layout */}
      <div className="relative flex-1 group px-2 pb-2 pt-4 flex justify-center items-start">
        <div className="flex flex-col gap-0 items-center w-full max-w-5xl">
          {/* Video Frame Container - Larger like LocalPlayer */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-xl glass-card border border-white/20 bg-black/80">
            {/* Iframe Player */}
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsLoaded(true)}
              style={{ border: 'none' }}
            />

            {/* Loading State */}
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Title Bar - Centered under video like LocalPlayer */}
          <TitleBar 
            video={currentVideo}
            videoType="online"
            compact={false}
          />
        </div>
      </div>
    </div>
  );
});

OnlinePlayer.displayName = 'OnlinePlayer';

export default OnlinePlayer;
