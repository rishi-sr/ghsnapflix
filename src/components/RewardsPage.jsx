import React, { useState, useMemo } from 'react';
import './RewardsPage.scss';
import {
  FaCoins,
  FaGamepad,
  FaTrophy,
  FaFire,
  FaGift,
  FaCircleInfo,
  FaCheck,
  FaLock,
  FaArrowRight,
  FaCrown,
  FaStar,
  FaCircleCheck,
  FaXmark,
  FaPlay,
  FaSliders,
  FaEye,
  FaWandMagicSparkles,
  FaShieldHalved,
  FaFaceSmile,
  FaMedal,
} from 'react-icons/fa6';

export default function RewardsPage({ onNavigate }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [userPoints, setUserPoints] = useState(2450);
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [claimNotice, setClaimNotice] = useState(null);
  const [modalReward, setModalReward] = useState(null);

  const stats = [
    { number: userPoints.toLocaleString(), label: 'TOTAL POINTS', icon: <FaCoins />, isPoints: true },
    { number: '47', label: 'GAMES / QUESTS COMPLETED', icon: <FaGamepad /> },
    { number: '23', label: 'ACHIEVEMENTS', icon: <FaTrophy /> },
    { number: '12', label: 'DAY STREAK', icon: <FaFire /> },
  ];

  const filterTabs = [
    { id: 'all', label: 'All Rewards' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'premium', label: 'Premium' },
    { id: 'exclusive', label: 'Exclusive' },
    { id: 'social', label: 'Social' },
    { id: 'limited', label: 'Limited' },
  ];

  const rewardCards = [
    {
      id: 1,
      category: 'premium',
      badge: 'Premium',
      title: 'Premium Game Access',
      points: 500,
      desc: 'Unlock 7 days of unlimited access to premium games and special events.',
      isComingSoon: false,
      artworkType: 'crown',
    },
    {
      id: 2,
      category: 'exclusive',
      badge: 'Exclusive',
      title: 'Exclusive Avatar Frame',
      points: 200,
      desc: 'Equip a legendary glowing Super Saiyan gold avatar border on your profile.',
      isComingSoon: false,
      artworkType: 'frame',
    },
    {
      id: 3,
      category: 'gaming',
      badge: 'Gaming',
      title: 'Double XP Weekend',
      points: 300,
      desc: 'Earn 2x reward points on all anime streams and quest completions this weekend.',
      isComingSoon: false,
      artworkType: 'xp',
    },
    {
      id: 4,
      category: 'limited',
      badge: 'Limited',
      title: 'Early Access Pass',
      points: 800,
      desc: 'Get early preview access to unreleased anime edits and creator workshops.',
      isComingSoon: true,
      artworkType: 'pass',
    },
    {
      id: 5,
      category: 'social',
      badge: 'Social',
      title: 'Custom Profile Theme',
      points: 150,
      desc: 'Unlock dark cyberpunk and neon Tokyo theme accents for your dashboard.',
      isComingSoon: false,
      artworkType: 'theme',
    },
    {
      id: 6,
      category: 'premium',
      badge: 'Premium',
      title: 'VIP Support Access',
      points: 500,
      desc: 'Direct private priority queue access to our dedicated community moderation staff.',
      isComingSoon: false,
      artworkType: 'vip',
    },
    {
      id: 7,
      category: 'social',
      badge: 'Social',
      title: 'Exclusive Emoji Pack',
      points: 100,
      desc: 'Unlock 20 animated chibi anime reaction emojis in video comment sections.',
      isComingSoon: false,
      artworkType: 'emoji',
    },
    {
      id: 8,
      category: 'limited',
      badge: 'Limited',
      title: 'Legendary Badge',
      points: 1000,
      desc: 'Show off the ultimate Nine-Tails Otaku master badge in community leaderboards.',
      isComingSoon: true,
      artworkType: 'badge',
    },
  ];

  const achievements = [
    {
      id: 1,
      title: 'Perfect Score',
      desc: 'Completed 50 anime quiz challenges with 100% accuracy',
      current: 50,
      total: 50,
      status: 'Completed',
      statusType: 'completed',
      color: '#FFD21F',
    },
    {
      id: 2,
      title: 'Speed Demon',
      desc: 'Streamed 20 video edits without pausing or skipping',
      current: 16,
      total: 20,
      status: 'In Progress',
      statusType: 'in-progress',
      color: '#22A06B',
    },
    {
      id: 3,
      title: 'Rising Star',
      desc: 'Earned 1,000 community upvotes on your favorites list',
      current: 600,
      total: 1000,
      status: 'In Progress',
      statusType: 'in-progress',
      color: '#3B82F6',
    },
  ];

  const handleOpenClaimModal = (reward) => {
    if (reward.isComingSoon) return;
    if (claimedRewards.includes(reward.id)) {
      setClaimNotice(`You have already claimed ${reward.title}!`);
      setTimeout(() => setClaimNotice(null), 3000);
      return;
    }
    if (userPoints < reward.points) {
      setClaimNotice(`You need ${reward.points - userPoints} more points to claim this reward!`);
      setTimeout(() => setClaimNotice(null), 3000);
      return;
    }
    setModalReward(reward);
  };

  const handleConfirmClaim = () => {
    if (!modalReward) return;
    setUserPoints((prev) => prev - modalReward.points);
    setClaimedRewards((prev) => [...prev, modalReward.id]);
    setClaimNotice(`🎉 Successfully claimed ${modalReward.title}!`);
    setModalReward(null);
    setTimeout(() => setClaimNotice(null), 4000);
  };

  // Filter & Sorting Logic
  const filteredAndSortedRewards = useMemo(() => {
    let list = rewardCards.filter((card) => {
      if (selectedFilter === 'all') return true;
      return card.category === selectedFilter;
    });

    if (sortBy === 'points-asc') {
      list = [...list].sort((a, b) => a.points - b.points);
    } else if (sortBy === 'points-desc') {
      list = [...list].sort((a, b) => b.points - a.points);
    } else if (sortBy === 'unclaimed') {
      list = [...list].sort((a, b) => {
        const aClaimed = claimedRewards.includes(a.id);
        const bClaimed = claimedRewards.includes(b.id);
        return aClaimed === bClaimed ? 0 : aClaimed ? 1 : -1;
      });
    }

    return list;
  }, [rewardCards, selectedFilter, sortBy, claimedRewards]);

  // Artwork Renderer for Reward Cards
  const renderRewardArtwork = (item) => {
    switch (item.artworkType) {
      case 'crown':
        return (
          <div className="reward-art-graphic art-gold">
            <div className="art-glow" />
            <FaCrown className="art-icon" />
            <span className="art-subtext">VIP ACCESS</span>
          </div>
        );
      case 'frame':
        return (
          <div className="reward-art-graphic art-purple">
            <div className="art-glow" />
            <div className="art-ring">
              <FaEye className="art-icon" />
            </div>
            <span className="art-subtext">NEON BORDER</span>
          </div>
        );
      case 'xp':
        return (
          <div className="reward-art-graphic art-yellow">
            <div className="art-glow" />
            <FaGamepad className="art-icon" />
            <span className="art-subtext">2X BOOST</span>
          </div>
        );
      case 'pass':
        return (
          <div className="reward-art-graphic art-amber">
            <div className="art-glow" />
            <FaWandMagicSparkles className="art-icon" />
            <span className="art-subtext">EARLY PREVIEW</span>
          </div>
        );
      case 'theme':
        return (
          <div className="reward-art-graphic art-blue">
            <div className="art-glow" />
            <div className="art-theme-bars">
              <span className="bar b1" />
              <span className="bar b2" />
              <span className="bar b3" />
            </div>
            <span className="art-subtext">TOKYO NEON</span>
          </div>
        );
      case 'vip':
        return (
          <div className="reward-art-graphic art-emerald">
            <div className="art-glow" />
            <FaShieldHalved className="art-icon" />
            <span className="art-subtext">PRIORITY QUEUE</span>
          </div>
        );
      case 'emoji':
        return (
          <div className="reward-art-graphic art-pink">
            <div className="art-glow" />
            <FaFaceSmile className="art-icon" />
            <span className="art-subtext">20 CHIBI PACK</span>
          </div>
        );
      case 'badge':
        return (
          <div className="reward-art-graphic art-rose">
            <div className="art-glow" />
            <FaMedal className="art-icon" />
            <span className="art-subtext">NINE-TAILS SEAL</span>
          </div>
        );
      default:
        return (
          <div className="reward-art-graphic art-gold">
            <FaGift className="art-icon" />
          </div>
        );
    }
  };

  return (
    <div className="rewards-page-wrapper">
      {/* Toast Notice */}
      {claimNotice && (
        <div className="rewards-toast-notice">
          <FaCircleCheck /> <span>{claimNotice}</span>
        </div>
      )}

      {/* 1. HERO SECTION */}
      <section className="rewards-hero-section">
        <div className="rewards-hero-container">
          {/* Left Column */}
          <div className="hero-col-left">
            <div className="hero-pill-badge">
              <span className="pill-dot" />
              <span>REWARDS & ACHIEVEMENTS</span>
            </div>

            <h1 className="hero-heading">
              Earn More.
              <br />
              <span className="highlight-yellow">Unlock More.</span>
            </h1>

            <p className="hero-description">
              Earn points, unlock exclusive rewards, and showcase your achievements across the entire GHSNAPFLIX anime community.
            </p>

            <div className="hero-cta-buttons">
              <button
                type="button"
                className="btn-progress-primary"
                onClick={() => {
                  const el = document.getElementById('achievements-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>View My Progress</span>
                <FaArrowRight className="btn-arrow" />
              </button>

              <button
                type="button"
                className="btn-how-secondary"
                onClick={() => {
                  const el = document.getElementById('special-event-banner');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <FaCircleInfo className="btn-icon" />
                <span>How It Works</span>
              </button>
            </div>

            {/* Handwritten Decorative Script */}
            <div className="hero-script-left">
              <span>Anime Fuels</span>
              <span>Better People.</span>
            </div>
          </div>

          {/* Right Column: Character Artwork & Floating Card */}
          <div className="hero-col-right">
            <div className="hero-artwork-card">
              {/* Soft Brush Background Accents */}
              <div className="brush-blob blob-1" />
              <div className="brush-blob blob-2" />

              <img
                src="/images/rewards_luffy_hero.png"
                alt="Rewards & Achievements Anime Creator"
                className="hero-art-img"
              />

              {/* Handwritten Floating Decoration */}
              <div className="hero-script-right">
                <span>Play.</span>
                <span>Explore.</span>
                <span>Win.</span>
                <span>Repeat.</span>
              </div>

              {/* Small Floating White Reward Card */}
              <div className="floating-reward-card">
                <div className="card-play-btn">
                  <FaPlay />
                </div>
                <div className="card-info">
                  <span className="card-tag">SMALL REWARDS</span>
                  <span className="card-title">BIG STORIES</span>
                </div>
                <div className="card-avatars">
                  <span className="avatar av-1">👑</span>
                  <span className="avatar av-2">⭐</span>
                  <span className="avatar av-3">⚡</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. USER STATS (4 CARDS) */}
      <section className="rewards-stats-section">
        <div className="stats-cards-grid">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`stat-metric-card ${stat.isPoints ? 'stat-points-accent' : ''}`}
            >
              <div className="stat-icon-box">{stat.icon}</div>
              <div className="stat-data-wrap">
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. REWARD FILTERS & SORTING BAR */}
      <section className="rewards-filter-section">
        <div className="filter-header-bar">
          <div className="filter-pills-wrap">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`filter-pill-btn ${selectedFilter === tab.id ? 'active' : ''}`}
                onClick={() => setSelectedFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="sort-controls-wrap">
            <label htmlFor="rewards-sort" className="sort-label">
              <FaSliders className="sort-icon" /> Sort by:
            </label>
            <select
              id="rewards-sort"
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recommended">Recommended</option>
              <option value="points-asc">Points: Low to High</option>
              <option value="points-desc">Points: High to Low</option>
              <option value="unclaimed">Unclaimed First</option>
            </select>
          </div>
        </div>
      </section>

      {/* 4. AVAILABLE REWARDS GRID */}
      <section className="available-rewards-section">
        <div className="section-title-wrap">
          <div className="title-with-accent">
            <h2 className="section-heading">Available Rewards</h2>
            <span className="title-yellow-dash" />
          </div>
          <p className="section-subheading">
            Use your points to unlock exclusive GHSNAPFLIX perks and community collectibles.
          </p>
        </div>

        {filteredAndSortedRewards.length === 0 ? (
          <div className="rewards-empty-card">
            <div className="empty-icon-circle">
              <FaGift />
            </div>
            <h3 className="empty-title">No Rewards Available</h3>
            <p className="empty-desc">New rewards in this category are coming soon. Check back shortly!</p>
            <button
              type="button"
              className="btn-empty-reset"
              onClick={() => setSelectedFilter('all')}
            >
              View All Rewards
            </button>
          </div>
        ) : (
          <div className="rewards-cards-grid">
            {filteredAndSortedRewards.map((item) => {
              const isClaimed = claimedRewards.includes(item.id);
              const hasEnoughPoints = userPoints >= item.points;

              return (
                <div
                  key={item.id}
                  className={`reward-product-card ${item.isComingSoon ? 'card-locked' : ''} ${
                    isClaimed ? 'card-claimed' : ''
                  }`}
                >
                  {/* Top Artwork Area */}
                  <div className="card-artwork-frame">
                    {renderRewardArtwork(item)}
                    <span className={`category-tag tag-${item.category}`}>{item.badge}</span>
                    <span className="points-tag">
                      <FaCoins className="pts-coin" /> {item.points} PTS
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="card-body-content">
                    <h3 className="card-product-title">{item.title}</h3>
                    <p className="card-product-desc">{item.desc}</p>
                  </div>

                  {/* Card Action Footer */}
                  <div className="card-action-footer">
                    {item.isComingSoon ? (
                      <button type="button" className="btn-action-locked" disabled>
                        <FaLock className="btn-icon" /> Locked
                      </button>
                    ) : isClaimed ? (
                      <button type="button" className="btn-action-claimed" disabled>
                        <FaCheck className="btn-icon" /> Claimed
                      </button>
                    ) : !hasEnoughPoints ? (
                      <button
                        type="button"
                        className="btn-action-insufficient"
                        onClick={() => handleOpenClaimModal(item)}
                      >
                        Need {item.points - userPoints} more pts
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-action-claim"
                        onClick={() => handleOpenClaimModal(item)}
                      >
                        Claim Reward →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. SPECIAL EVENT PROMOTIONAL BANNER */}
      <section id="special-event-banner" className="special-event-banner-section">
        <div className="special-banner-box">
          <div className="banner-text-col">
            <span className="banner-pill-tag">SPECIAL EVENT</span>
            <h2 className="banner-title">
              Your Next Reward
              <br />
              <span className="highlight-yellow">Is Waiting</span>
            </h2>
            <p className="banner-description">
              Complete weekly anime challenges to unlock early rewards and limited edition profile effects.
              The more you watch, the greater your bounty!
            </p>

            <button
              type="button"
              className="btn-banner-explore"
              onClick={() => {
                setSelectedFilter('all');
                window.scrollTo({ top: 700, behavior: 'smooth' });
              }}
            >
              <span>Explore Rewards</span>
              <FaArrowRight className="arrow-icon" />
            </button>
          </div>

          <div className="banner-art-col">
            <div className="banner-image-wrap">
              <img
                src="/images/rewards_naruto_banner.png"
                alt="Special Anime Rewards Event"
                className="banner-image"
              />
              <div className="banner-script-quote">
                <span>Same Anime</span>
                <span>Different Perspective</span>
              </div>
            </div>

            <div className="banner-checklist">
              <div className="check-item">
                <FaCircleCheck className="check-gold" />
                <span>Exclusive Content</span>
              </div>
              <div className="check-item">
                <FaCircleCheck className="check-gold" />
                <span>Progressive Rewards</span>
              </div>
              <div className="check-item">
                <FaCircleCheck className="check-gold" />
                <span>Build Your Legacy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RECENT ACHIEVEMENTS SECTION */}
      <section id="achievements-section" className="recent-achievements-section">
        <div className="achievements-heading-row">
          <div>
            <h2 className="achievements-main-title">Recent Achievements</h2>
            <p className="achievements-sub-text">Track your milestones and claim new rewards.</p>
          </div>
          <button
            type="button"
            className="btn-view-all-ach"
            onClick={() => {
              setClaimNotice('Displaying all 23 community achievements!');
              setTimeout(() => setClaimNotice(null), 3000);
            }}
          >
            View All →
          </button>
        </div>

        <div className="achievements-grid-cards">
          {achievements.map((ach) => {
            const percent = Math.round((ach.current / ach.total) * 100);
            const isCompleted = ach.statusType === 'completed';

            return (
              <div key={ach.id} className="achievement-item-card">
                <div className="ach-card-header">
                  <div className={`ach-badge-icon ${isCompleted ? 'icon-gold' : 'icon-neutral'}`}>
                    {isCompleted ? <FaCrown /> : <FaStar />}
                  </div>
                  <span className={`ach-status-tag tag-${ach.statusType}`}>
                    {ach.status}
                  </span>
                </div>

                <h3 className="ach-item-title">{ach.title}</h3>
                <p className="ach-item-desc">{ach.desc}</p>

                <div className="ach-progress-container">
                  <div className="progress-track">
                    <div
                      className={`progress-fill ${isCompleted ? 'fill-gold' : ''}`}
                      style={{
                        width: `${percent}%`,
                        backgroundColor: isCompleted ? '#FFD21F' : ach.color,
                      }}
                    />
                  </div>
                  <div className="progress-numbers">
                    <span className="progress-fraction">
                      {ach.current} / {ach.total}
                    </span>
                    <span className="progress-percent">{percent}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. REDESIGNED CLAIM REWARD MODAL */}
      {modalReward && (
        <div className="claim-modal-backdrop" onClick={() => setModalReward(null)}>
          <div className="claim-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="btn-modal-close"
              onClick={() => setModalReward(null)}
              aria-label="Close modal"
            >
              <FaXmark />
            </button>

            <div className="modal-header-visual">
              {renderRewardArtwork(modalReward)}
              <span className={`modal-cat-tag tag-${modalReward.category}`}>
                {modalReward.badge}
              </span>
            </div>

            <h3 className="modal-reward-title">{modalReward.title}</h3>
            <p className="modal-reward-desc">{modalReward.desc}</p>

            <div className="modal-points-summary">
              <div className="summary-row">
                <span className="summary-label">Your Current Points:</span>
                <span className="summary-value">{userPoints.toLocaleString()} PTS</span>
              </div>
              <div className="summary-row cost-row">
                <span className="summary-label">Reward Cost:</span>
                <span className="summary-value cost-value">-{modalReward.points} PTS</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row remaining-row">
                <span className="summary-label">Points Remaining:</span>
                <span className="summary-value remaining-value">
                  {(userPoints - modalReward.points).toLocaleString()} PTS
                </span>
              </div>
            </div>

            <div className="modal-action-buttons">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setModalReward(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-modal-confirm"
                onClick={handleConfirmClaim}
              >
                Claim Reward →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. TOAST NOTIFICATION */}
      {claimNotice && (
        <div className="rewards-toast-notice">
          <span>{claimNotice}</span>
        </div>
      )}
    </div>
  );
}

