import React, { useState, useEffect, useCallback } from 'react';
import './FavoritesPage.scss';
import { allVideos, getVideoUrl } from '../utils/localVideos';
import { getMatchingAnimeThumbnail } from '../config/animeCatalog';
import {
  FaHeart,
  FaCompass,
  FaPlay,
  FaTableCellsLarge,
  FaUsers,
  FaChevronRight,
  FaTrashCan,
} from 'react-icons/fa6';

export default function FavoritesPage({ onVideoPlay, onNavigate }) {
  const [favoriteVideos, setFavoriteVideos] = useState([]);

  const loadFavorites = useCallback(() => {
    const stored = localStorage.getItem('ghsnapflix_favorites');
    if (stored) {
      try {
        const favoriteNames = new Set(JSON.parse(stored));
        const videosList = allVideos
          .filter((v) => favoriteNames.has(v.name))
          .map((v, idx) => ({
            id: `fav-${v.id || idx}`,
            title: v.name,
            name: v.name,
            videoUrl: getVideoUrl(v.videoPath),
            category: v.category || 'Anime',
            thumbnail: getMatchingAnimeThumbnail(v.name, idx),
            duration: '02:15',
            views: '1.4M',
            timestamp: 'Recently',
          }));

        // Deduplicate
        const uniqueVideos = videosList.reduce((acc, current) => {
          const exists = acc.find(
            (v) => v.name === current.name && v.videoUrl === current.videoUrl
          );
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);

        setFavoriteVideos(uniqueVideos);
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavoriteVideos([]);
      }
    } else {
      setFavoriteVideos([]);
    }
  }, []);

  useEffect(() => {
    loadFavorites();

    const handleStorageChange = () => loadFavorites();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', loadFavorites);
    window.addEventListener('favoritesUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', loadFavorites);
      window.removeEventListener('favoritesUpdated', handleStorageChange);
    };
  }, [loadFavorites]);

  const handleRemoveFavorite = (videoTitle) => {
    const stored = localStorage.getItem('ghsnapflix_favorites');
    if (stored) {
      const favoriteNames = new Set(JSON.parse(stored));
      favoriteNames.delete(videoTitle);
      localStorage.setItem(
        'ghsnapflix_favorites',
        JSON.stringify(Array.from(favoriteNames))
      );
      setFavoriteVideos((prev) => prev.filter((v) => v.name !== videoTitle));
      window.dispatchEvent(new Event('favoritesUpdated'));
    }
  };

  const handleClearAll = () => {
    localStorage.removeItem('ghsnapflix_favorites');
    setFavoriteVideos([]);
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  // 1. EMPTY STATE (Exact reference design from user screenshot media_1788639014925.png)
  if (favoriteVideos.length === 0) {
    return (
      <div className="favorites-page-canvas">
        <div className="favorites-hero-container">
          {/* Left Column: Luffy with Glowing Heart Illustration */}
          <div className="favorites-illustration-col">
            <div className="illustration-wrapper">
              <img
                src="/luffy_favorites.png"
                alt="Good Anime Stays Forever - Luffy hugging golden heart"
                className="luffy-illustration-img"
              />
            </div>
          </div>

          {/* Right Column: Empty State Message & Quick Navigation */}
          <div className="favorites-content-col">
            {/* Glowing Heart Circle Badge */}
            <div className="empty-heart-circle" aria-hidden="true">
              <FaHeart className="heart-icon-svg" />
            </div>

            {/* Main Heading */}
            <h1 className="empty-state-title">No Favorite Videos Yet</h1>

            {/* Subtitle */}
            <p className="empty-state-desc">
              Start adding videos to your favorites by clicking the heart icon
              on any video!
            </p>

            {/* Primary CTA Button */}
            <button
              type="button"
              className="btn-explore-pill"
              onClick={() => onNavigate?.('videos')}
            >
              <FaCompass className="btn-icon" />
              <span>Explore Videos →</span>
            </button>

            {/* "OR EXPLORE" Section Divider */}
            <div className="explore-divider">
              <span>OR EXPLORE</span>
            </div>

            {/* 3 Quick Navigation Cards */}
            <div className="quick-explore-grid">
              {/* Card 1: Trending Videos */}
              <button
                type="button"
                className="quick-card-btn"
                onClick={() => onNavigate?.('videos')}
              >
                <div className="quick-card-left">
                  <div className="quick-icon-play">
                    <FaPlay />
                  </div>
                  <div className="quick-label">
                    <span>Trending</span>
                    <span>Videos</span>
                  </div>
                </div>
                <FaChevronRight className="chevron-icon" />
              </button>

              {/* Card 2: Browse Categories */}
              <button
                type="button"
                className="quick-card-btn"
                onClick={() => onNavigate?.('categories')}
              >
                <div className="quick-card-left">
                  <div className="quick-icon-grid">
                    <FaTableCellsLarge />
                  </div>
                  <div className="quick-label">
                    <span>Browse</span>
                    <span>Categories</span>
                  </div>
                </div>
                <FaChevronRight className="chevron-icon" />
              </button>

              {/* Card 3: Discover Creators */}
              <button
                type="button"
                className="quick-card-btn"
                onClick={() => onNavigate?.('home')}
              >
                <div className="quick-card-left">
                  <div className="quick-icon-users">
                    <FaUsers />
                  </div>
                  <div className="quick-label">
                    <span>Discover</span>
                    <span>Creators</span>
                  </div>
                </div>
                <FaChevronRight className="chevron-icon" />
              </button>
            </div>
          </div>
        </div>

        {/* Floating Cursive Annotation positioned in outer right space */}
        <div className="collect-love-annotation">
          <span>Collect</span>
          <span>What You Love ♡</span>
        </div>
      </div>
    );
  }

  // 2. POPULATED STATE (When user has favorites)
  return (
    <div className="favorites-page-canvas populated">
      <div className="favorites-populated-container">
        {/* Header with Title and Clear Action */}
        <div className="favorites-header-bar">
          <div className="header-text-group">
            <div className="title-row">
              <span className="heart-pill-badge">
                <FaHeart />
              </span>
              <h2>Your Favorite Videos</h2>
            </div>
            <p className="subtitle">
              {favoriteVideos.length}{' '}
              {favoriteVideos.length === 1 ? 'video' : 'videos'} saved in your collection
            </p>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="btn-browse-more"
              onClick={() => onNavigate?.('videos')}
            >
              <FaCompass />
              <span>Browse More</span>
            </button>
            <button
              type="button"
              className="btn-clear-favorites"
              onClick={handleClearAll}
              title="Clear all favorites"
            >
              <FaTrashCan />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {/* 4-Column Video Grid */}
        <div className="favorites-catalog-grid">
          {favoriteVideos.map((video) => (
            <div
              key={video.id}
              className="anime-catalog-card"
              onClick={() => onVideoPlay?.(video)}
            >
              <div className="catalog-thumb-wrap">
                <img src={video.thumbnail} alt={video.title} loading="lazy" />
                <div className="catalog-thumb-overlay" />

                <span className="catalog-duration-pill">{video.duration}</span>

                <button
                  type="button"
                  className="catalog-fav-btn is-favorited"
                  title="Remove from favorites"
                  aria-label="Remove from favorites"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFavorite(video.title);
                  }}
                >
                  <FaHeart />
                </button>

                <div className="catalog-play-badge">
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              <div className="catalog-card-info">
                <h3 className="catalog-card-title">{video.title}</h3>
                <div className="catalog-card-meta">
                  <svg
                    className="meta-eye"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>{video.views} views</span>
                  <span className="dot-sep">•</span>
                  <span>{video.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
