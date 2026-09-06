import React from 'react';
import './ValueProps.scss';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { FaHeart } from 'react-icons/fa6';

export default function ValueProps() {
  const propsRef = useScrollReveal({ threshold: 0.15 });

  return (
    <section className="value-props-section reveal-on-scroll" ref={propsRef}>
      <div className="value-props-inner">
        <div className="value-props-title">
          <span className="heart-icon"><FaHeart /></span>
          <h2>Why GHSNAPFLIX?</h2>
        </div>

        <div className="props-grid">
          {/* High Quality */}
          <div className="prop-card">
            <div className="prop-icon-wrap hd-wrap">
              <span className="hd-tag">HD</span>
            </div>
            <h4>High Quality</h4>
            <p>Watch in HD & 4K</p>
          </div>

          {/* Instant Streaming */}
          <div className="prop-card">
            <div className="prop-icon-wrap">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </div>
            <h4>Instant Streaming</h4>
            <p>Fast, buffer-free HD video</p>
          </div>

          {/* Save Favorites */}
          <div className="prop-card">
            <div className="prop-icon-wrap">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h4>Save Favorites</h4>
            <p>Keep your favorite videos in one place</p>
          </div>

          {/* Regular Updates */}
          <div className="prop-card">
            <div className="prop-icon-wrap">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 4h-2v-2h2v2zm4 0h-2v-2h2v2z" />
              </svg>
            </div>
            <h4>Regular Updates</h4>
            <p>New content every week</p>
          </div>
        </div>
      </div>
    </section>
  );
}

