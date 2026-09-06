import React, { useState } from 'react';
import './Newsletter.scss';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function Newsletter({ onSubscribeSuccess }) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const newsletterRef = useScrollReveal({ threshold: 0.15 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubmitted(true);
    if (onSubscribeSuccess) {
      onSubscribeSuccess(email);
    }
  };

  return (
    <section className="newsletter-section reveal-on-scroll" ref={newsletterRef}>
      <div className="newsletter-inner">
        <div className="newsletter-card">
          <div className="newsletter-left">
            <div className="mail-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div className="newsletter-text">
              <h3>Never Miss an Update</h3>
              <p>
                Get the latest anime series, trending videos and exclusive content delivered to your inbox.
              </p>
            </div>
          </div>

          <form className="newsletter-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <svg
                className="mail-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                type="email"
                placeholder={isSubmitted ? 'Thanks for subscribing!' : 'Enter your email address'}
                value={email}
                disabled={isSubmitted}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-subscribe-email"
              disabled={isSubmitted}
            >
              {isSubmitted ? 'Subscribed ✓' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

