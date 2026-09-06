import React, { useEffect, useRef, useState, useMemo } from 'react';
import './VideoPlayerModal.css';
import { getVideoMimeType } from '../utils/localVideos';
import { useFavorites } from '../hooks/useFavorites';
import {
  FaHeart,
  FaRegHeart,
  FaXmark,
  FaArrowLeft,
  FaRotateRight,
  FaTriangleExclamation,
  FaFilm,
} from 'react-icons/fa6';

/**
 * Intelligent parser to detect whether the video source is:
 * 1. An iframe embed (YouTube, Vimeo, raw iframe tag, embed URL)
 * 2. A direct HTML5 video stream (MP4, WebM, MOV, S3 link)
 */
function parseVideoSource(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { type: 'unknown', url: '' };
  }

  const trimmed = rawUrl.trim();

  // 1. Raw <iframe> tag string: <iframe ... src="..." ...>
  if (trimmed.startsWith('<iframe') || trimmed.includes('<iframe')) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return { type: 'iframe', url: srcMatch[1] };
    }
  }

  // 2. YouTube URLs:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  const ytRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const ytMatch = trimmed.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'iframe',
      url: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      platform: 'youtube',
    };
  }

  // 3. Vimeo URLs:
  // - https://vimeo.com/VIDEO_ID
  // - https://player.vimeo.com/video/VIDEO_ID
  const vimeoRegex = /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)([0-9]+)/i;
  const vimeoMatch = trimmed.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'iframe',
      url: `https://player.vimeo.com/video/${videoId}?autoplay=1&playsinline=1`,
      platform: 'vimeo',
    };
  }

  // 4. Other Embed / Iframe URLs (e.g. contains /embed/ or player.)
  if (trimmed.includes('/embed/') || trimmed.includes('player.')) {
    return { type: 'iframe', url: trimmed, platform: 'embed' };
  }

  // 5. Standard Direct Video File (.mp4, .webm, .mov, S3 streaming bucket)
  return { type: 'video', url: trimmed, platform: 'native' };
}

const VideoPlayerModal = ({ video, onClose }) => {
  const videoRef = useRef(null);
  const stageRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rotation, setRotation] = useState(0);

  const { isFavorite, toggleFavorite } = useFavorites();
  const videoKey = video?.title || video?.name || video?.id || '';
  const isFavorited = isFavorite(videoKey);

  const sourceInfo = useMemo(() => {
    return parseVideoSource(video?.videoUrl || video?.url || '');
  }, [video]);

  // Reset rotation when video changes
  useEffect(() => {
    setRotation(0);
  }, [video?.videoUrl, video?.url]);

  // Transform style for video / iframe rotation (PC only)
  const rotationStyle = useMemo(() => {
    if (rotation === 0) return {};
    const scale = rotation % 180 !== 0 ? 0.5625 : 1;
    return {
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transformOrigin: 'center center',
      transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    };
  }, [rotation]);

  // Keyboard shortcut listener (Escape to close, Space to toggle native video, R to rotate on PC)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === ' ' && sourceInfo.type === 'video' && videoRef.current) {
        if (event.target.tagName !== 'BUTTON' && event.target.tagName !== 'INPUT') {
          event.preventDefault();
          if (videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      } else if ((event.key === 'r' || event.key === 'R') && window.innerWidth > 768) {
        if (event.target.tagName !== 'BUTTON' && event.target.tagName !== 'INPUT') {
          event.preventDefault();
          setRotation((prev) => (prev + 90) % 360);
        }
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, sourceInfo.type]);

  // Autoplay native video on mount or URL change
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);

    if (sourceInfo.type === 'video') {
      const el = videoRef.current;
      if (!el) return;
      el.currentTime = 0;
      const playPromise = el.play();
      if (playPromise) {
        playPromise
          .then(() => setIsLoading(false))
          .catch(() => {
            // Autoplay with sound might be blocked; fallback to ready state
            setIsLoading(false);
          });
      }
    } else {
      // For iframe, assume loaded after initial mount
      const timer = setTimeout(() => setIsLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [sourceInfo]);

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    if (sourceInfo.type === 'video' && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div
      className="video-player-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={video?.title || 'Video Player'}
    >
      <div className="video-player-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header Bar */}
        <header className="video-player-header">
          {/* Mobile Back / Close Button */}
          <button
            type="button"
            className="mobile-back-btn"
            onClick={onClose}
            aria-label="Back to videos"
            title="Close video"
          >
            <FaArrowLeft />
          </button>

          {/* Left: Category Badge & Title */}
          <div className="header-meta-left">
            {video?.category && (
              <span className="player-category-pill">
                <FaFilm className="pill-icon" />
                {video.category}
              </span>
            )}
            <h2 className="video-player-title" title={video?.title}>
              {video?.title || 'Anime Video'}
            </h2>
          </div>

          {/* Right: Rotate Screen (PC Only), Favorite Toggle & Desktop Close Button */}
          <div className="header-actions-right">
            {/* Rotate Screen Button - Exclusively visible on PC / Desktop */}
            <button
              type="button"
              className={`player-rotate-btn ${rotation !== 0 ? 'is-rotated' : ''}`}
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
              title={
                rotation !== 0
                  ? `Screen rotated ${rotation}°. Click to rotate further (Shortcut: R)`
                  : 'Rotate video screen 90° (PC only, Shortcut: R)'
              }
              aria-label="Rotate screen"
            >
              <FaRotateRight
                className="rotate-icon"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 0.3s ease',
                }}
              />
              <span className="rotate-label">
                {rotation !== 0 ? `Rotate ${rotation}°` : 'Rotate'}
              </span>
            </button>

            <button
              type="button"
              className={`player-fav-btn ${isFavorited ? 'is-favorited' : ''}`}
              onClick={() => toggleFavorite(video)}
              title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorited ? <FaHeart className="fav-icon" /> : <FaRegHeart className="fav-icon" />}
              <span className="fav-label">{isFavorited ? 'Favorited' : 'Favorite'}</span>
            </button>

            <button
              type="button"
              className="desktop-close-btn"
              onClick={onClose}
              aria-label="Close video player"
              title="Close (Esc)"
            >
              <FaXmark />
            </button>
          </div>
        </header>

        {/* Video Stage Frame (16:9 Responsive Container for both Video & Iframe) */}
        <div className="video-player-stage" ref={stageRef}>
          {/* Loading Spinner */}
          {isLoading && !hasError && (
            <div className="stage-loading-overlay">
              <div className="stage-spinner" />
              <span className="stage-loading-text">Loading stream...</span>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="stage-error-overlay">
              <FaTriangleExclamation className="error-icon" />
              <h3>Unable to Play Video</h3>
              <p>The video format or stream could not be loaded at this time.</p>
              <div className="error-actions">
                <button type="button" className="btn-error-retry" onClick={handleRetry}>
                  <FaRotateRight /> Retry
                </button>
                <button type="button" className="btn-error-close" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          )}

          {/* 1. Iframe Embed (YouTube, Vimeo, Embed URL) */}
          {sourceInfo.type === 'iframe' && (
            <iframe
              className="video-player-iframe"
              src={sourceInfo.url}
              title={video?.title || 'Video Player'}
              frameBorder="0"
              style={rotationStyle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
            />
          )}

          {/* 2. Direct HTML5 Video (.mp4, .webm, .mov, S3 streaming URL) */}
          {sourceInfo.type === 'video' && (
            <video
              ref={videoRef}
              key={sourceInfo.url}
              className="video-player-element"
              src={sourceInfo.url}
              style={rotationStyle}
              controls
              playsInline
              autoPlay
              preload="auto"
              poster={video?.thumbnail || video?.thumbnailUrl || undefined}
              onLoadedData={() => setIsLoading(false)}
              onWaiting={() => setIsLoading(true)}
              onPlaying={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            >
              <source src={sourceInfo.url} type={getVideoMimeType(sourceInfo.url)} />
              Your browser does not support HTML5 video streaming.
            </video>
          )}
        </div>

        {/* Footer Meta Bar (Views, Timestamp, Duration, Brand tag) */}
        <footer className="video-player-footer">
          <div className="footer-info-meta">
            {video?.views && <span className="meta-views">👁 {video.views} views</span>}
            {video?.views && video?.timestamp && <span className="meta-dot">•</span>}
            {video?.timestamp && <span className="meta-time">{video.timestamp}</span>}
            {video?.duration && (video?.views || video?.timestamp) && <span className="meta-dot">•</span>}
            {video?.duration && <span className="meta-dur">⏱ {video.duration}</span>}
          </div>

          <div className="footer-brand-badge">
            <span className="brand-dot" />
            <span className="brand-name">GHSNAPFLIX PLAYER</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default VideoPlayerModal;
