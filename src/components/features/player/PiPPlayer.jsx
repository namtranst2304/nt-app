import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ReactPlayer from 'react-player';
import { X, Maximize2 } from 'lucide-react';
import useAppStore from '@/lib/store/useAppStore';

const PiPPlayer = () => {
  const { 
    currentVideo,
    isPlaying,
    volume,
    isMuted,
    isPiPMode,
    setPiPMode,
    currentTime
  } = useAppStore();

  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const playerRef = useRef(null);
  const pipRef = useRef(null);

  // Memoize video URL
  const videoUrl = useMemo(() => {
    return currentVideo?.url || currentVideo?.file || '';
  }, [currentVideo]);

  useEffect(() => {
    if (playerRef.current && currentTime) {
      playerRef.current.seekTo(currentTime);
    }
  }, [currentTime]);

  // Optimized drag handler
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    const rect = pipRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const handleMouseMove = (e) => {
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 320, e.clientX - offsetX)),
        y: Math.max(0, Math.min(window.innerHeight - 192, e.clientY - offsetY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  // Optimized close handler
  const handleClose = useCallback(() => {
    setPiPMode(false);
  }, [setPiPMode]);
  if (!isPiPMode || !currentVideo) return null;

  return (
    <div
      ref={pipRef}
      className="fixed z-50 w-80 h-48 glass-card border border-white/20 rounded-lg overflow-hidden shadow-2xl transition-all duration-200"
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
        <span className="text-white text-sm font-medium line-clamp-1 flex-1 mr-2">
          {currentVideo.title}
        </span>        <div className="flex items-center gap-1">
          <button
            onClick={handleClose}
            className="p-1 text-white bg-black/50 hover:bg-black/70 rounded transition-colors"
          >
            <Maximize2 size={14} />
          </button>
          <button
            onClick={handleClose}
            className="p-1 text-white bg-black/50 hover:bg-black/70 rounded transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>      {/* Video Player */}
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        width="100%"
        height="100%"
        playing={isPlaying}
        volume={isMuted ? 0 : volume / 100}
        controls={false}
        config={{
          file: {
            attributes: {
              crossOrigin: 'anonymous'
            }
          }
        }}
      />
    </div>
  );
};

export default PiPPlayer;
