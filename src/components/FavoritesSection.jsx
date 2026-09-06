import React, { useEffect, useState } from 'react';
import './FavoritesSection.css';
import { allVideos, getVideoUrl } from '../utils/localVideos';
import { useCardVideoPreview } from '../hooks/useCardVideoPreview';
import { FaHeart } from 'react-icons/fa6';
const FavoriteCard = ({ video, onVideoPlay }) => {
    const [showVideo, setShowVideo] = useState(false);
    const videoUrl = video.video;
    const { containerRef, videoRef, hasFrame } = useCardVideoPreview(videoUrl, showVideo);
    const handleMouseEnter = () => {
        setShowVideo(true);
    };
    const handleMouseLeave = () => {
        setShowVideo(false);
    };
    const handleClick = () => {
        onVideoPlay({
            title: video.name,
            videoUrl: video.video,
        });
    };
    return (<div className="favorite-card" onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="favorite-video-container" ref={containerRef}>
        <video ref={videoRef} className="favorite-video-element favorite-video-visible" muted playsInline loop preload="metadata" onError={() => {
            console.error('Favorite video load error:', videoUrl);
        }}/>
        {!hasFrame && (<div className="video-poster-fallback">{video.name}</div>)}
        <div className="favorite-overlay">
          <span className="favorite-badge"><FaHeart style={{ marginRight: 5 }} /> FAVORITE</span>
        </div>
      </div>
      <h3 className="favorite-title">{video.name}</h3>
      <span className="favorite-category">{video.category}</span>
    </div>);
};
const FavoritesSection = ({ onVideoPlay, onNavigate }) => {
    const [favoriteVideos, setFavoriteVideos] = useState([]);
    useEffect(() => {
        const loadFavorites = () => {
            const stored = localStorage.getItem('ghsnapflix_favorites');
            if (stored) {
                try {
                    const favoriteNames = new Set(JSON.parse(stored));
                    // Convert allVideos to VideoItem format and filter by favorite names
                    const videosList = allVideos
                        .filter(v => favoriteNames.has(v.name))
                        .map(v => ({
                        name: v.name,
                        video: getVideoUrl(v.videoPath),
                        category: v.category || 'All'
                    }));
                    // Remove duplicates - if same video appears in multiple categories, keep first occurrence
                    const uniqueVideos = videosList.reduce((acc, current) => {
                        const existing = acc.find(v => v.name === current.name && v.video === current.video);
                        if (!existing) {
                            acc.push(current);
                        }
                        return acc;
                    }, []);
                    setFavoriteVideos(uniqueVideos);
                }
                catch (error) {
                    console.error('Error loading favorites:', error);
                    setFavoriteVideos([]);
                }
            }
        };
        loadFavorites();
        // Listen for storage changes (when favorites are updated)
        const handleStorageChange = () => {
            loadFavorites();
        };
        // Use custom event for same-window updates
        const handleCustomStorageChange = () => {
            loadFavorites();
        };
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('focus', loadFavorites);
        window.addEventListener('favoritesUpdated', handleCustomStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('focus', loadFavorites);
            window.removeEventListener('favoritesUpdated', handleCustomStorageChange);
        };
    }, []);
    if (favoriteVideos.length === 0) {
        return null;
    }
    return (<div className="favorites-section">
      <div className="favorites-header">
        <h2 className="favorites-title">
          <FaHeart style={{ marginRight: 8, color: '#ff4757', verticalAlign: 'middle' }} />
          Your Favorite Videos
        </h2>
        {onNavigate && (<button className="view-all-btn" onClick={() => onNavigate('videos')}>
            View All →
          </button>)}
      </div>
      
      <div className="favorites-grid">
        {favoriteVideos.slice(0, 4).map((video) => (<FavoriteCard key={`${video.name}-${video.video}`} video={video} onVideoPlay={onVideoPlay}/>))}
      </div>
    </div>);
};
export default FavoritesSection;
