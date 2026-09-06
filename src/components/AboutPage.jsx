import React, { useState } from 'react';
import './AboutPage.scss';
import {
  FaGamepad,
  FaRocket,
  FaGlobe,
  FaHeart,
  FaPlay,
  FaUsers,
  FaStar,
  FaArrowRight,
  FaShieldHalved,
  FaCloud,
  FaMicrochip,
  FaNetworkWired,
  FaChevronDown,
  FaChevronUp,
  FaFileContract,
  FaLock,
  FaCircleCheck,
} from 'react-icons/fa6';

export default function AboutPage({ onNavigate }) {
  const [selectedMilestone, setSelectedMilestone] = useState(4); // 2024 active by default
  const [activeTermsTab, setActiveTermsTab] = useState('terms');
  const [expandedTerm, setExpandedTerm] = useState(0);

  const stats = [
    { icon: <FaUsers />, number: '10M+', label: 'ACTIVE USERS' },
    { icon: <FaPlay />, number: '50K+', label: 'GAMES AVAILABLE' },
    { icon: <FaGlobe />, number: '180+', label: 'COUNTRIES' },
    { icon: <FaStar />, number: '99.9%', label: 'UPTIME' },
  ];

  const values = [
    {
      icon: <FaGamepad />,
      title: 'Gaming First',
      description: 'We put gamers at the center of everything we do',
    },
    {
      icon: <FaRocket />,
      title: 'Innovation',
      description: "Constantly pushing the boundaries of what's possible",
    },
    {
      icon: <FaGlobe />,
      title: 'Accessibility',
      description: 'Making gaming accessible to everyone, everywhere',
    },
    {
      icon: <FaHeart />,
      title: 'Community',
      description: 'Building connections between gamers worldwide',
    },
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'GHSnapflix was born from a vision to make anime gaming accessible to everyone.',
    },
    {
      year: '2021',
      title: 'First 1M Users',
      description: 'Reached our first million registered users worldwide.',
    },
    {
      year: '2022',
      title: 'Cloud Gaming Launch',
      description: 'Introduced cutting-edge cloud gaming technology.',
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description: 'Expanded to 150+ countries worldwide.',
    },
    {
      year: '2024',
      title: 'AI Integration',
      description: 'Launched AI-powered game recommendations.',
    },
  ];

  const techFeatures = [
    { icon: <FaCloud />, text: 'Cloud Gaming Infrastructure' },
    { icon: <FaMicrochip />, text: 'AI-Powered Recommendations' },
    { icon: <FaNetworkWired />, text: 'Global Content Delivery' },
    { icon: <FaShieldHalved />, text: 'Enterprise-Grade Security' },
  ];

  const termsArticles = [
    {
      title: '1. Account Registration & Acceptable Use',
      content:
        'Users must provide accurate information when creating an account. You agree not to misuse our streaming services, circumvent access controls, or distribute unauthorized digital copies of hosted anime videos and game streams.',
    },
    {
      title: '2. Intellectual Property & Fair Use',
      content:
        'All anime edits, promotional previews, and game trailers are displayed in compliance with fair-use and licensed provider agreements. Users retain ownership of their community contributions while granting GHSnapflix a broadcast license.',
    },
    {
      title: '3. Subscription, Rewards & Billing Terms',
      content:
        'Subscriptions renew automatically per selected billing periods unless cancelled. Reward points and tokens earned through quests and streaming have no cash monetary value and can be redeemed exclusively within the platform store.',
    },
    {
      title: '4. Privacy, Data Protection & Termination',
      content:
        'We adhere to international data security standards. You may terminate your account at any time. We reserve the right to suspend accounts violating community safety standards or engaged in fraudulent activities.',
    },
  ];

  const privacyArticles = [
    {
      title: '1. Information We Collect',
      content:
        'We collect phone numbers or email credentials for authentication, device specifications to optimize video streaming resolutions, and telemetry data for personalized anime recommendations.',
    },
    {
      title: '2. How We Safeguard Your Information',
      content:
        'All data is encrypted in transit and at rest using AES-256 standards. We never sell personal user data or payment details to third-party advertising brokers.',
    },
    {
      title: '3. Cookie & Cache Policy',
      content:
        'We utilize browser storage and edge caching to preserve your playback timestamps, favorites watchlist, and UI theme preferences for seamless navigation.',
    },
  ];

  const currentLegalArticles = activeTermsTab === 'terms' ? termsArticles : privacyArticles;

  return (
    <div className="about-page-wrapper">
      <div className="about-redesign-canvas">
        {/* 1. HERO SECTION */}
        <section className="about-hero-block">
          <div className="about-hero-grid">
            <div className="about-hero-left">
              <div className="about-eyebrow-row">
                <span className="eyebrow-dash">—</span>
                <span className="eyebrow-text">ABOUT US</span>
              </div>
              <h1 className="about-hero-title">
                We Are <span className="highlight-yellow">GHSnapflix</span>
              </h1>
              <p className="about-hero-desc">
                We're revolutionizing the anime industry with innovative cloud technology,
                exclusive content, and an unparalleled gaming experience for millions worldwide.
              </p>
              <div className="about-hero-actions">
                <button
                  className="btn-story-yellow"
                  onClick={() => {
                    const el = document.getElementById('milestones-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <FaPlay className="btn-icon" /> Our Story
                </button>
                <button
                  className="btn-community-outline"
                  onClick={() => (onNavigate ? onNavigate('login') : null)}
                >
                  <FaUsers className="btn-icon" /> Join Our Community
                </button>
              </div>
            </div>

            <div className="about-hero-right">
              <div className="about-hero-art-card">
                <img
                  src="/images/about_luffy_hero.png"
                  alt="Luffy Sunset Hero - More Than Anime A Community"
                  className="about-hero-art-img"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. STATS STRIP */}
        <section className="about-stats-strip">
          <div className="about-stats-card">
            {stats.map((stat, idx) => (
              <div key={idx} className="about-stat-item">
                <div className="stat-icon-wrapper">{stat.icon}</div>
                <div className="stat-text-info">
                  <div className="stat-big-num">{stat.number}</div>
                  <div className="stat-sub-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. MISSION SECTION */}
        <section className="about-mission-block">
          <div className="mission-eyebrow">
            <span className="eyebrow-dash">—</span>
            <span>OUR MISSION</span>
            <span className="eyebrow-dash">—</span>
          </div>
          <h2 className="mission-main-title">
            Creating a <span className="highlight-yellow">Bigger Anime Universe</span>
          </h2>
          <p className="mission-statement-text">
            At GHSnapflix, we believe gaming and anime should be accessible to everyone, everywhere. Our mission
            is to break down barriers and create a seamless experience that connects players across the globe
            through cutting-edge cloud technology and an ever-expanding library of amazing games.
          </p>
        </section>

        {/* 4. CORE VALUES */}
        <section className="about-values-block">
          <div className="values-combined-row">
            <div className="values-header-col">
              <div className="values-eyebrow">
                <span className="eyebrow-dash">—</span>
                <span>OUR VALUES</span>
              </div>
              <h2 className="values-heading">
                What <span className="highlight-yellow">Drives Us</span>
              </h2>
              <p className="values-subtext">
                These core values guide everything we do at GHSnapflix.
              </p>
            </div>
            <div className="values-cards-row">
              {values.map((val, idx) => (
                <div key={idx} className="value-pillar-card">
                  <div className="pillar-icon-box">{val.icon}</div>
                  <h3 className="pillar-title">{val.title}</h3>
                  <p className="pillar-desc">{val.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. JOURNEY / MILESTONES */}
        <section id="milestones-section" className="about-milestones-block">
          <div className="milestones-layout-grid">
            {/* Left Column: Heading & Button */}
            <div className="milestones-left-info">
              <div className="milestones-eyebrow">
                <span className="eyebrow-dash">—</span>
                <span>OUR JOURNEY</span>
              </div>
              <h2 className="milestones-headline">
                Milestones That <br />
                <span className="highlight-yellow">Made Us Stronger</span>
              </h2>
              <p className="milestones-lead-desc">
                From a small idea to a global community, here's how GHSnapflix grew over the years.
              </p>
              <button
                className="btn-full-story-yellow"
                onClick={() => {
                  const el = document.getElementById('tech-banner');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Our Full Story <FaArrowRight />
              </button>
            </div>

            {/* Center Column: Perfectly Aligned 3-Column Timeline Grid */}
            <div className="milestones-timeline-column">
              <div className="timeline-grid-wrapper">
                <div className="timeline-vertical-spine" />
                {milestones.map((item, idx) => {
                  const isActive = selectedMilestone === idx;
                  const isLeft = idx % 2 === 0;
                  return (
                    <div
                      key={idx}
                      className={`timeline-milestone-row ${isLeft ? 'row-left' : 'row-right'} ${
                        isActive ? 'is-active' : ''
                      }`}
                      onClick={() => setSelectedMilestone(idx)}
                    >
                      {/* Left Slot: 2020, 2022, 2024 */}
                      <div className="timeline-slot slot-left">
                        {isLeft && (
                          <div className="timeline-card">
                            <span className="timeline-year-text">{item.year}</span>
                            <h4 className="timeline-step-title">{item.title}</h4>
                            <p className="timeline-step-desc">{item.description}</p>
                          </div>
                        )}
                      </div>

                      {/* Center Slot: Fixed Width & Centered Dot On Spine */}
                      <div className="timeline-slot slot-center">
                        <div className="timeline-dot" />
                      </div>

                      {/* Right Slot: 2021, 2023 */}
                      <div className="timeline-slot slot-right">
                        {!isLeft && (
                          <div className="timeline-card">
                            <span className="timeline-year-text">{item.year}</span>
                            <h4 className="timeline-step-title">{item.title}</h4>
                            <p className="timeline-step-desc">{item.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Naruto Sketch Artwork */}
            <div className="milestones-art-column">
              <div className="milestones-art-card">
                <img
                  src="/images/naruto_milestones_clean.png"
                  alt="Naruto Milestones - Same Passion Bigger Horizons"
                  className="milestones-art-img"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 6. CUTTING EDGE TECH BANNER (DARK CINEMATIC BLOCK) */}
        <section id="tech-banner" className="about-tech-block">
          <div className="tech-banner-card">
            <div className="tech-banner-content">
              <div className="tech-eyebrow">
                <span className="eyebrow-dash">—</span>
                <span>CUTTING-EDGE TECHNOLOGY</span>
              </div>
              <h2 className="tech-banner-title">
                Built for the <span className="highlight-yellow">Next Generation</span>
              </h2>
              <p className="tech-banner-desc">
                We leverage the latest in cloud computing, AI, and streaming technology to deliver
                low-latency gaming experiences. Our proprietary compression algorithms and global
                CDN ensure smooth gameplay regardless of your location.
              </p>
              <div className="tech-pills-grid">
                {techFeatures.map((feat, idx) => (
                  <div key={idx} className="tech-feature-pill">
                    <span className="pill-icon">{feat.icon}</span>
                    <span className="pill-text">{feat.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="tech-banner-art-wrap">
              <img
                src="/images/tech_jinwoo_avatar.png"
                alt="Sung Jin-Woo Cutting Edge Technology"
                className="tech-jinwoo-img"
              />
            </div>
          </div>
        </section>

        {/* 7. COMMUNITY CTA BANNER */}
        <section className="about-community-cta">
          <div className="community-cta-card">
            <div className="cta-left-group">
              <div className="cta-heart-icon-box">
                <FaHeart />
              </div>
              <div className="cta-text-wrap">
                <h2 className="cta-headline">Be Part of Our Journey</h2>
                <p className="cta-subtext">
                  Join millions of anime and gaming lovers worldwide.
                </p>
              </div>
            </div>
            <button
              className="btn-join-yellow"
              onClick={() => (onNavigate ? onNavigate('login') : null)}
            >
              Join GHSnapflix <FaArrowRight />
            </button>
          </div>
        </section>

        {/* 8. TERMS OF SERVICE & PRIVACY POLICY SECTION */}
        <section className="about-legal-section">
          <div className="legal-header">
            <div className="legal-eyebrow">
              <span className="eyebrow-dash">—</span>
              <span>TRANSPARENCY & LEGAL</span>
              <span className="eyebrow-dash">—</span>
            </div>
            <h2 className="legal-title">Terms of Service & Privacy</h2>
            <p className="legal-subtitle">
              Everything you need to know about your rights, privacy protection, and platform rules.
            </p>

            <div className="legal-tab-switcher">
              <button
                className={`legal-tab-btn ${activeTermsTab === 'terms' ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveTermsTab('terms');
                  setExpandedTerm(0);
                }}
              >
                <FaFileContract /> Terms of Service
              </button>
              <button
                className={`legal-tab-btn ${activeTermsTab === 'privacy' ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveTermsTab('privacy');
                  setExpandedTerm(0);
                }}
              >
                <FaLock /> Privacy Policy
              </button>
            </div>
          </div>

          <div className="legal-accordion-list">
            {currentLegalArticles.map((art, idx) => {
              const isExpanded = expandedTerm === idx;
              return (
                <div
                  key={idx}
                  className={`legal-accordion-card ${isExpanded ? 'is-expanded' : ''}`}
                  onClick={() => setExpandedTerm(isExpanded ? null : idx)}
                >
                  <div className="legal-accordion-header">
                    <div className="header-left">
                      <FaCircleCheck className="check-icon" />
                      <span className="article-title">{art.title}</span>
                    </div>
                    <div className="accordion-toggle-icon">
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="legal-accordion-body">
                      <p>{art.content}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
