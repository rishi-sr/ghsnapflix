import React from 'react';
import './VideoSection.scss';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useFavorites } from '../../hooks/useFavorites';
import { FaHeart, FaRegHeart, FaFire } from 'react-icons/fa6';

export default function VideoSection({
  title,
  subtitle,
  icon = <FaFire />,
  viewAllText = 'View All →',
  videos = [],
  onViewAll,
  onVideoPlay,
}) {
  const sectionRef = useScrollReveal({ threshold: 0.08 });
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <section className="video-section reveal-on-scroll" ref={sectionRef}>
      <div className="video-section-inner">
        {/* Section Header */}
        <div className="section-header">
          <div className="header-left">
            <div className="title-row">
              <span className="section-icon">{icon}</span>
              <h2>{title}</h2>
            </div>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </div>

          <button
            type="button"
            className="view-all-link"
            onClick={onViewAll}
          >
            <span>{viewAllText}</span>
          </button>
        </div>

        {/* 4-Card Video Grid */}
        <div className="video-grid">
          {videos.map((video, idx) => {
            const videoKey = video.title || video.name || video.id;
            const favorited = isFavorite(videoKey);

            return (
              <div
                key={video.id || idx}
                className="anime-catalog-card"
                onClick={() => onVideoPlay(video)}
              >
                <div className="catalog-thumb-wrap">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    loading="lazy"
                  />
                  <div className="catalog-thumb-overlay" />

                  {video.isFeatured && (
                    <span className="catalog-featured-badge">FEATURED</span>
                  )}

                  <span className="catalog-duration-pill">{video.duration}</span>

                  <button
                    type="button"
                    className={`catalog-fav-btn ${favorited ? 'is-favorited' : ''}`}
                    title={favorited ? 'Remove from favorites' : 'Add to favorites'}
                    aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(video);
                    }}
                  >
                    {favorited ? <FaHeart /> : <FaRegHeart />}
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
                    <span>{video.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
