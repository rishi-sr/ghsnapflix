import React from 'react';
import './MembershipBanner.scss';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function MembershipBanner({ onSubscribeClick }) {
  const bannerRef = useScrollReveal({ threshold: 0.15 });

  return (
    <section className="membership-banner-section reveal-on-scroll" ref={bannerRef}>
      <div className="membership-banner-inner">
        <div className="banner-card">
          {/* Background Anime Illustration */}
          <div className="banner-art-bg">
            <img
              src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80"
              alt="Anime Artwork"
              loading="lazy"
            />
          </div>

          {/* Left Content */}
          <div className="banner-content">
            <span className="member-tag">— BECOME A MEMBER —</span>
            <h2 className="banner-heading">
              <span className="accent-bar" />
              <span>Unlock More Anime</span>
            </h2>
            <p className="banner-subtext">
              Ad-free experience • Full day access for only 1 GHS • Instant 24-hour unlimited streaming
            </p>
            <button
              type="button"
              className="btn-subscribe-now"
              onClick={onSubscribeClick}
            >
              <span>Get 1-Day Pass (1 GHS)</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Right Features */}
          <div className="banner-features">
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
              </div>
              <span>No Ads</span>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <span>Exclusive Anime</span>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <span>Early Access</span>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span>Support Creators</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

