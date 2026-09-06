import React, { useState, useMemo, useEffect } from 'react';
import './UnsubscribePage.css';
import { loadAppSession } from '../utils/sessionStorage';
import {
  FaMoneyBillWave,
  FaMobileScreen,
  FaWrench,
  FaArrowsRotate,
  FaTv,
  FaEnvelope,
  FaPause,
  FaCircleQuestion,
  FaCircleCheck,
  FaCircleInfo,
  FaTriangleExclamation,
  FaArrowLeft,
  FaArrowRight,
  FaHeadset,
  FaCircleQuestion as FaHelpIcon,
  FaSpinner,
  FaXmark,
  FaShieldHalved,
  FaCrown,
} from 'react-icons/fa6';

const UnsubscribePage = ({ onNavigate = () => {}, onLogout = () => {} }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).get('step') === 'confirm';
    } catch {
      return false;
    }
  });
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).get('step') === 'success';
    } catch {
      return false;
    }
  });
  const [logoutCountdown, setLogoutCountdown] = useState(5);

  // Load real application session
  const session = useMemo(() => loadAppSession(), []);

  // Format real subscription dates and plan details
  const subscriptionDetails = useMemo(() => {
    const plan = '1-Day Access Pass';
    const price = '1 GHS / day (24 hours)';

    const nextBillingRaw = session.subscription?.expiresAt
      ? new Date(session.subscription.expiresAt)
      : new Date(Date.now() + 24 * 60 * 60 * 1000);

    const nextBillingStr = nextBillingRaw.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const todayStr = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return {
      plan,
      price,
      nextBilling: nextBillingStr,
      today: todayStr,
      status: 'Active',
    };
  }, [session]);

  const unsubscribeReasons = [
    { id: 'too-expensive', label: 'Too expensive', icon: <FaMoneyBillWave /> },
    { id: 'not-using', label: 'Not using the service', icon: <FaMobileScreen /> },
    { id: 'technical-issues', label: 'Technical issues', icon: <FaWrench /> },
    { id: 'found-alternative', label: 'Found a better alternative', icon: <FaArrowsRotate /> },
    { id: 'content-not-interesting', label: 'Content not interesting', icon: <FaTv /> },
    { id: 'too-many-emails', label: 'Too many emails/notifications', icon: <FaEnvelope /> },
    { id: 'temporary', label: 'Taking a break (temporary)', icon: <FaPause /> },
    { id: 'other', label: 'Other reason', icon: <FaCircleQuestion /> },
  ];

  const handleOpenConfirm = () => {
    if (!selectedReason) return;
    setShowConfirmModal(true);
  };

  const handleConfirmCancellation = async () => {
    setIsUnsubscribing(true);

    // Simulate cancellation API request
    setTimeout(() => {
      setIsUnsubscribing(false);
      setShowConfirmModal(false);
      setIsUnsubscribed(true);

      // Start countdown for graceful logout
      const countdownInterval = setInterval(() => {
        setLogoutCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            onLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1500);
  };

  const handleStaySubscribed = () => {
    if (onNavigate) {
      onNavigate('subscription-management');
    }
  };

  // =========================================================================
  // 11. SUCCESS STATE
  // =========================================================================
  if (isUnsubscribed) {
    return (
      <div className="ghsnapflix-unsub-page">
        <div className="unsub-main-container">
          <div className="unsub-card success-card-view">
            <div className="unsub-success-icon-badge">
              <FaCircleCheck />
            </div>

            <h1 className="unsub-success-title">Your subscription has been cancelled</h1>
            <p className="unsub-success-subtitle">
              You'll continue to enjoy Premium benefits until <strong>{subscriptionDetails.nextBilling}</strong>.
            </p>

            <div className="unsub-success-details-box">
              <div className="success-detail-row">
                <span className="s-detail-label">CANCELLATION DATE</span>
                <span className="s-detail-val">{subscriptionDetails.today}</span>
              </div>
              <div className="success-detail-row">
                <span className="s-detail-label">PREMIUM ACCESS UNTIL</span>
                <span className="s-detail-val">{subscriptionDetails.nextBilling}</span>
              </div>
              <div className="success-detail-row">
                <span className="s-detail-label">FUTURE CHARGES</span>
                <span className="s-detail-val s-highlight">No further billing will occur</span>
              </div>
            </div>

            <div className="unsub-logout-notice">
              <p>You will be automatically logged out in <strong>{logoutCountdown}</strong> seconds.</p>
            </div>

            <div className="unsub-mind-changed-box">
              <span className="mind-changed-label">Changed your mind?</span>
              <div className="success-actions-cluster">
                <button
                  type="button"
                  className="unsub-btn-primary-yellow"
                  onClick={handleStaySubscribed}
                >
                  <span>Resubscribe →</span>
                </button>
                <button
                  type="button"
                  className="unsub-btn-outline-neutral"
                  onClick={() => onNavigate('home')}
                >
                  <span>Continue to Home</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN CANCELLATION FLOW
  // =========================================================================
  return (
    <div className="ghsnapflix-unsub-page">
      <div className="unsub-main-container">
        {/* ===================================================================
            2. PAGE HERO
            =================================================================== */}
        <header className="unsub-hero-header">
          <button
            type="button"
            className="unsub-back-btn"
            onClick={() => onNavigate('subscription-management')}
            title="Return to Subscription Management"
          >
            <FaArrowLeft className="back-arrow-icon" />
            <span>Back to Membership</span>
          </button>

          <span className="unsub-hero-eyebrow">MEMBERSHIP</span>
          <h1 className="unsub-hero-title">
            Thinking of <span className="highlight-yellow">Leaving?</span>
          </h1>
          <p className="unsub-hero-subtitle">
            We're sorry to see you go. Before you leave, we'd love to understand how we can improve
            your GHSNAPFLIX experience.
          </p>
        </header>

        {/* Hero Illustration + Form Container */}
        <div className="unsub-layout-wrapper">
          {/* ===================================================================
              3. CANCELLATION CARD
              =================================================================== */}
          <main className="unsub-card" aria-label="Cancellation Form">
            <div className="unsub-card-header">
              <div className="unsub-header-icon-bubble">
                <FaShieldHalved />
              </div>
              <h2 className="unsub-card-heading">Help Us Improve</h2>
              <p className="unsub-card-subheading">What's the main reason you're cancelling?</p>
            </div>

            {/* =================================================================
                4. & 5. REASON SELECTION & MODERN RADIO BUTTONS
                ================================================================= */}
            <div className="unsub-reasons-grid">
              {unsubscribeReasons.map((reason) => {
                const isSelected = selectedReason === reason.id;
                return (
                  <label
                    key={reason.id}
                    className={`reason-card-item ${isSelected ? 'is-selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="cancel-reason"
                      value={reason.id}
                      checked={isSelected}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="hidden-radio-input"
                    />
                    {/* Custom Radio Button */}
                    <span className="custom-radio-indicator">
                      <span className="radio-inner-dot" />
                    </span>
                    <span className="reason-icon-wrap">{reason.icon}</span>
                    <span className="reason-text-label">{reason.label}</span>
                  </label>
                );
              })}
            </div>

            {/* =================================================================
                6. ADDITIONAL FEEDBACK
                ================================================================= */}
            <div className="unsub-feedback-section">
              <label htmlFor="unsub-feedback-input" className="feedback-label-group">
                <span className="feedback-label-title">Anything else you'd like us to know?</span>
                <span className="feedback-label-subtitle">Optional — your feedback helps us improve.</span>
              </label>
              <textarea
                id="unsub-feedback-input"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about your experience or what we could improve..."
                className="unsub-textarea"
                rows={3}
              />
            </div>

            {/* =================================================================
                7. SUBSCRIPTION INFORMATION ("Before you go")
                ================================================================= */}
            <div className="unsub-info-banner">
              <div className="info-banner-header">
                <FaCircleInfo className="info-icon" />
                <h3 className="info-banner-title">Before you go</h3>
              </div>
              <ul className="info-bullet-list">
                <li>
                  <span className="check-bullet">✓</span>
                  <span>
                    Your Premium access continues until the end of your current billing period (
                    <strong>{subscriptionDetails.nextBilling}</strong>).
                  </span>
                </li>
                <li>
                  <span className="check-bullet">✓</span>
                  <span>You won't be charged again after cancellation.</span>
                </li>
                <li>
                  <span className="check-bullet">✓</span>
                  <span>Your account and saved watchlist content remain available.</span>
                </li>
                <li>
                  <span className="check-bullet">✓</span>
                  <span>You can resubscribe anytime to regain full 4K streaming.</span>
                </li>
              </ul>
            </div>

            {/* =================================================================
                8. CURRENT PLAN SUMMARY
                ================================================================= */}
            <div className="unsub-current-plan-strip">
              <div className="plan-strip-left">
                <span className="strip-label">CURRENT PLAN</span>
                <span className="strip-plan-name">{subscriptionDetails.plan}</span>
              </div>
              <div className="plan-strip-mid">
                <span className="strip-price">{subscriptionDetails.price}</span>
                <span className="strip-next-date">Next billing: {subscriptionDetails.nextBilling}</span>
              </div>
              <div className="plan-strip-right">
                <span className="strip-status-pill">
                  <span className="status-dot" />
                  {subscriptionDetails.status}
                </span>
              </div>
            </div>

            {/* =================================================================
                9. ACTION AREA
                ================================================================= */}
            <div className="unsub-actions-area">
              <button
                type="button"
                className="unsub-btn-primary-yellow"
                onClick={handleStaySubscribed}
              >
                <span>Keep My Subscription →</span>
              </button>

              <button
                type="button"
                className="unsub-btn-destructive-outline"
                onClick={handleOpenConfirm}
                disabled={!selectedReason || isUnsubscribing}
                title={!selectedReason ? 'Please select a cancellation reason first' : 'Continue cancellation'}
              >
                <span>Continue Cancellation</span>
              </button>
            </div>
          </main>

          {/* Character Artwork Aside (Desktop) */}
          <aside className="unsub-character-aside" aria-hidden="true">
            <div className="character-art-wrapper">
              <img
                src="/images/profile_anime_creator_transparent.png"
                alt="Anime Creator"
                className="creator-character-img"
                loading="lazy"
              />
            </div>
          </aside>
        </div>

        {/* ===================================================================
            12. SUPPORT OPTION
            =================================================================== */}
        <section className="unsub-support-card" aria-label="Customer Support">
          <div className="support-card-content">
            <div className="support-icon-bubble">
              <FaHeadset />
            </div>
            <div className="support-text-wrap">
              <h3 className="support-card-title">Need help instead?</h3>
              <p className="support-card-desc">
                If you're cancelling because something isn't working as expected, our support team is
                here to help resolve any technical or playback issues.
              </p>
            </div>
          </div>
          <div className="support-actions-wrap">
            <button
              type="button"
              className="support-link-btn"
              onClick={() => onNavigate('subscription-management')}
            >
              <span>Back to Pass →</span>
            </button>
            <button
              type="button"
              className="support-link-btn"
              onClick={() => onNavigate('home')}
            >
              <span>Return Home →</span>
            </button>
          </div>
        </section>
      </div>

      {/* =====================================================================
          10. CONFIRMATION STEP (MODAL)
          ===================================================================== */}
      {showConfirmModal && (
        <div
          className="unsub-modal-backdrop"
          onClick={() => !isUnsubscribing && setShowConfirmModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="unsub-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => !isUnsubscribing && setShowConfirmModal(false)}
              disabled={isUnsubscribing}
              aria-label="Close dialog"
            >
              <FaXmark />
            </button>

            <div className="modal-icon-bubble-warning">
              <FaTriangleExclamation />
            </div>

            <h3 className="modal-title">Cancel Premium Membership?</h3>
            <p className="modal-subtitle">
              Your Premium benefits will remain active until the end of your current billing period.
            </p>

            <div className="modal-plan-recap-box">
              <div className="recap-plan-row">
                <span className="recap-plan-name">{subscriptionDetails.plan}</span>
                <span className="recap-plan-price">{subscriptionDetails.price}</span>
              </div>
              <div className="recap-date-row">
                <span>Access until:</span>
                <strong>{subscriptionDetails.nextBilling}</strong>
              </div>
            </div>

            <div className="modal-actions-cluster">
              <button
                type="button"
                className="modal-keep-btn"
                onClick={() => setShowConfirmModal(false)}
                disabled={isUnsubscribing}
              >
                Keep Premium
              </button>

              <button
                type="button"
                className="modal-confirm-cancel-btn"
                onClick={handleConfirmCancellation}
                disabled={isUnsubscribing}
              >
                {isUnsubscribing ? (
                  <>
                    <FaSpinner className="spin-icon" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Confirm Cancellation</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnsubscribePage;
