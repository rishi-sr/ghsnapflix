import React, { useState, useMemo, useCallback } from 'react';
import './SubscriptionManagementPage.css';
import { loadAppSession } from '../utils/sessionStorage';
import { getWatchHistory, getWatchStats } from '../utils/watchHistory';
import {
  FaArrowLeft,
  FaArrowRight,
  FaCircleCheck,
  FaCrown,
  FaCreditCard,
  FaMobileScreen,
  FaDownload,
  FaClock,
  FaXmark,
  FaTriangleExclamation,
  FaTv,
  FaFilm,
  FaHeadset,
  FaBolt,
  FaReceipt,
  FaBell,
  FaShieldHalved,
  FaSpinner,
} from 'react-icons/fa6';

const SubscriptionManagementPage = ({
  onNavigate = () => {},
  phoneNumber = '',
  isSubscribed = false,
  onSubscribeClick = () => {},
  onNotify = () => {},
}) => {
  const [showCancelModal, setShowCancelModal] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).get('modal') === 'cancel';
    } catch {
      return false;
    }
  });
  const [downloadingId, setDownloadingId] = useState(null);
  const [hasPaymentMethod, setHasPaymentMethod] = useState(true);

  // Billing preferences toggles
  const [billingPrefs, setBillingPrefs] = useState({
    emailReceipts: true,
    renewalReminders: true,
    paymentAlerts: false,
  });

  // Load active application session
  const session = useMemo(() => loadAppSession(), []);
  const previewTier = useMemo(() => {
    try {
      return new URLSearchParams(window.location.search).get('tier');
    } catch {
      return null;
    }
  }, []);
  const effectiveSubscribed =
    previewTier === 'premium'
      ? true
      : previewTier === 'free'
      ? false
      : isSubscribed || session.isSubscribed;
  const activePhone = phoneNumber || session.msisdn || '+233 24 123 4567';

  // Format real subscription details
  const currentSubscription = useMemo(() => {
    const startDateRaw = session.subscription?.subscribedAt
      ? new Date(session.subscription.subscribedAt)
      : new Date();

    const nextBillingRaw = session.subscription?.expiresAt
      ? new Date(session.subscription.expiresAt)
      : new Date(Date.now() + 24 * 60 * 60 * 1000);

    const formatDateTimeStr = (date) =>
      date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

    return {
      plan: effectiveSubscribed ? '1-Day Access Pass' : 'Free Plan',
      tier: effectiveSubscribed ? '1-DAY PASS' : 'FREE',
      status: effectiveSubscribed ? 'Active (24 Hours)' : 'No Active Pass',
      startDate: formatDateTimeStr(startDateRaw),
      nextBilling: effectiveSubscribed ? formatDateTimeStr(nextBillingRaw) : 'N/A',
      amount: effectiveSubscribed ? 1 : 0,
      currency: 'GHS',
      billingCycle: effectiveSubscribed ? '24 Hours (Ends automatically)' : 'N/A',
      autoRenewal: 'None (Ends after 24 hours)',
    };
  }, [session, effectiveSubscribed]);

  // Usage statistics from real application history
  const watchStats = useMemo(() => getWatchStats(getWatchHistory()), []);
  const streamingHours = parseInt(watchStats.watchTime) || 45;
  const downloadsCount = watchStats.downloads || 15;

  const usageData = useMemo(() => ({
    devices: 2,
    maxDevices: 4,
    downloads: downloadsCount,
    maxDownloads: 100,
    streamingHours: streamingHours,
    maxHours: 100,
  }), [downloadsCount, streamingHours]);

  // Billing history records
  const [billingHistory] = useState([
    {
      id: 'inv-1',
      date: 'Today',
      description: '1-Day Access Pass (24 Hours)',
      amount: '1 GHS',
      status: 'Paid',
    },
    {
      id: 'inv-2',
      date: '15 December 2023',
      description: 'Premium Monthly Plan',
      amount: '18 GHS',
      status: 'Paid',
    },
    {
      id: 'inv-3',
      date: '15 November 2023',
      description: 'Premium Monthly Plan',
      amount: '18 GHS',
      status: 'Paid',
    },
  ]);

  // Premium benefits matching subscription configuration
  const premiumBenefits = [
    {
      id: 'b-1',
      title: 'HD & 4K Quality',
      description: 'Crystal clear Ultra HD anime video resolution with dynamic HDR profiles.',
      icon: <FaTv />,
    },
    {
      id: 'b-2',
      title: 'Unlimited Streaming',
      description: 'Binge-watch all trending anime series and episodes with zero data throttling.',
      icon: <FaFilm />,
    },
    {
      id: 'b-3',
      title: 'Multiple Devices',
      description: 'Stream seamlessly on desktop PCs, tablets, and smartphones concurrently.',
      icon: <FaMobileScreen />,
    },
    {
      id: 'b-4',
      title: 'Offline Downloads',
      description: 'Save high-res anime clips and watch anywhere without internet connectivity.',
      icon: <FaDownload />,
    },
    {
      id: 'b-5',
      title: 'Ad-Free Experience',
      description: 'Enjoy uninterrupted viewing with no ads, pop-ups, or sponsor distractions.',
      icon: <FaBolt />,
    },
    {
      id: 'b-6',
      title: 'Priority Support',
      description: 'VIP creator support and exclusive early access to community drops.',
      icon: <FaHeadset />,
    },
  ];

  // Actions
  const handleUpgradePlan = useCallback(() => {
    if (onSubscribeClick) {
      onSubscribeClick();
    } else {
      onNavigate('subscription');
    }
  }, [onSubscribeClick, onNavigate]);

  const handleDownloadInvoice = useCallback((invoiceId) => {
    setDownloadingId(invoiceId);
    setTimeout(() => {
      setDownloadingId(null);
      onNotify('Invoice downloaded successfully! 📄', 'success');
    }, 1000);
  }, [onNotify]);

  const handleTogglePref = useCallback((key) => {
    setBillingPrefs((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      onNotify('Billing preference updated', 'info');
      return updated;
    });
  }, [onNotify]);

  const handleConfirmCancel = useCallback(() => {
    setShowCancelModal(false);
    onNavigate('unsubscribe');
  }, [onNavigate]);

  return (
    <div className="ghsnapflix-sub-mgmt-page">
      <div className="sub-mgmt-container">
        {/* =================================================================
            2. PAGE HEADER
            ================================================================= */}
        <header className="sub-mgmt-header">
          <button
            type="button"
            className="sub-back-to-profile-btn"
            onClick={() => onNavigate('home')}
            title="Return to Home"
          >
            <FaArrowLeft className="back-arrow-icon" />
            <span>Back to Home</span>
          </button>

          <span className="sub-header-eyebrow">MEMBERSHIP & BILLING</span>
          <h1 className="sub-header-title">
            Subscription <span className="highlight-yellow">Management</span>
          </h1>
          <p className="sub-header-subtitle">
            Manage your GHSNAPFLIX membership, billing and payment preferences.
          </p>
        </header>

        {/* =================================================================
            3. & 4. PREMIUM PLAN HERO & PLAN ACTIONS
            ================================================================= */}
        <section className="sub-plan-hero-card" aria-label="Current Subscription Plan">
          <div className="plan-hero-main">
            {/* Left Info */}
            <div className="plan-hero-left">
              <div className="plan-badge-row">
                <span className={`plan-tier-badge ${effectiveSubscribed ? 'is-premium' : 'is-free'}`}>
                  <FaCrown className="crown-icon" />
                  {currentSubscription.tier}
                </span>
                <span className={`plan-status-pill ${effectiveSubscribed ? 'is-active' : 'is-free'}`}>
                  <span className="status-dot" />
                  {currentSubscription.status}
                </span>
              </div>

              <h2 className="plan-hero-title">{currentSubscription.plan}</h2>
              <p className="plan-hero-description">
                {effectiveSubscribed
                  ? 'Enjoy the complete GHSNAPFLIX experience with unlimited 4K streaming.'
                  : "You're on the Free Tier. Upgrade to unlock full anime streaming and exclusive perks."}
              </p>

              {/* Actions row */}
              <div className="plan-hero-actions">
                <button
                  type="button"
                  className="plan-primary-cta"
                  onClick={handleUpgradePlan}
                >
                  <span>{effectiveSubscribed ? 'Renew 1-Day Pass' : 'Get 1-Day Pass (1 GHS)'}</span>
                  <FaArrowRight className="cta-arrow" />
                </button>

                {effectiveSubscribed && (
                  <button
                    type="button"
                    className="plan-cancel-outline-btn"
                    onClick={() => setShowCancelModal(true)}
                  >
                    <span>Cancel Subscription</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Price & Anime Character Artwork */}
            <div className="plan-hero-right">
              <div className="plan-price-display">
                <span className="price-number">{currentSubscription.amount}</span>
                <span className="price-currency">{currentSubscription.currency}</span>
                <span className="price-period">/ 24 hours</span>
              </div>

              {/* Cinematic anime creator character illustration */}
              <div className="plan-hero-artwork-wrap">
                <img
                  src="/images/profile_anime_creator_transparent.png"
                  alt="Anime Creator Hub"
                  className="plan-hero-artwork-img"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* 4-Column Metadata Row */}
          <div className="plan-hero-meta-grid">
            <div className="meta-col">
              <span className="meta-label">START DATE</span>
              <span className="meta-value">{currentSubscription.startDate}</span>
            </div>
            <div className="meta-col">
              <span className="meta-label">NEXT BILLING</span>
              <span className="meta-value">{currentSubscription.nextBilling}</span>
            </div>
            <div className="meta-col">
              <span className="meta-label">BILLING CYCLE</span>
              <span className="meta-value">{currentSubscription.billingCycle}</span>
            </div>
            <div className="meta-col">
              <span className="meta-label">AUTO-RENEWAL</span>
              <span className="meta-value">
                <span className={`renewal-pill ${effectiveSubscribed ? 'is-enabled' : 'is-disabled'}`}>
                  {currentSubscription.autoRenewal}
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* =================================================================
            5. MEMBERSHIP BENEFITS
            ================================================================= */}
        <section className="sub-section-card benefits-section" aria-label="Membership Benefits">
          <div className="section-title-wrap">
            <h2 className="section-title">Your Premium Benefits</h2>
            <p className="section-subtitle">Everything included with your current membership.</p>
          </div>

          <div className="benefits-grid">
            {premiumBenefits.map((benefit) => (
              <div key={benefit.id} className="benefit-card">
                <div className="benefit-icon-bubble">
                  {benefit.icon}
                </div>
                <div className="benefit-content">
                  <div className="benefit-header-row">
                    <h3 className="benefit-title">{benefit.title}</h3>
                    <FaCircleCheck className="benefit-check-icon" />
                  </div>
                  <p className="benefit-desc">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =================================================================
            6. USAGE STATISTICS
            ================================================================= */}
        <section className="sub-section-card usage-section" aria-label="Usage Statistics">
          <div className="section-title-wrap">
            <h2 className="section-title">Your Usage</h2>
            <p className="section-subtitle">See how you're using your GHSNAPFLIX membership.</p>
          </div>

          <div className="usage-grid">
            {/* Card 1: Active Devices */}
            <div className="usage-card">
              <div className="usage-card-top">
                <div className="usage-icon-bubble">
                  <FaMobileScreen />
                </div>
                <span className="usage-tag">DEVICES</span>
              </div>
              <div className="usage-number-row">
                <span className="usage-big-val">{usageData.devices}</span>
                <span className="usage-max-val">/ {usageData.maxDevices}</span>
              </div>
              <span className="usage-metric-label">ACTIVE DEVICES</span>
              <div className="usage-progress-track">
                <div
                  className="usage-progress-bar"
                  style={{ width: `${(usageData.devices / usageData.maxDevices) * 100}%` }}
                />
              </div>
            </div>

            {/* Card 2: Downloads */}
            <div className="usage-card">
              <div className="usage-card-top">
                <div className="usage-icon-bubble">
                  <FaDownload />
                </div>
                <span className="usage-tag">STORAGE</span>
              </div>
              <div className="usage-number-row">
                <span className="usage-big-val">{usageData.downloads}</span>
                <span className="usage-max-val">/ {usageData.maxDownloads}</span>
              </div>
              <span className="usage-metric-label">DOWNLOADS</span>
              <div className="usage-progress-track">
                <div
                  className="usage-progress-bar"
                  style={{ width: `${(usageData.downloads / usageData.maxDownloads) * 100}%` }}
                />
              </div>
            </div>

            {/* Card 3: Streaming Hours */}
            <div className="usage-card">
              <div className="usage-card-top">
                <div className="usage-icon-bubble">
                  <FaClock />
                </div>
                <span className="usage-tag">STREAM TIME</span>
              </div>
              <div className="usage-number-row">
                <span className="usage-big-val">{usageData.streamingHours}</span>
                <span className="usage-max-val">hours this month</span>
              </div>
              <span className="usage-metric-label">STREAMING HOURS</span>
              <div className="usage-progress-track">
                <div
                  className="usage-progress-bar"
                  style={{ width: `${Math.min(100, (usageData.streamingHours / usageData.maxHours) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            7. & 8. BILLING HISTORY
            ================================================================= */}
        <section className="sub-section-card billing-history-section" aria-label="Billing History">
          <div className="section-title-wrap">
            <h2 className="section-title">Billing History</h2>
            <p className="section-subtitle">Your recent subscription payments.</p>
          </div>

          <div className="billing-table-container">
            {/* Desktop Table */}
            <table className="billing-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="cell-date">{invoice.date}</td>
                    <td className="cell-desc">
                      <span className="desc-text">{invoice.description}</span>
                    </td>
                    <td className="cell-amount">{invoice.amount}</td>
                    <td className="cell-status">
                      <span className={`status-tag status-${invoice.status.toLowerCase()}`}>
                        {invoice.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="cell-action text-right">
                      <button
                        type="button"
                        className="invoice-download-btn"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        disabled={downloadingId === invoice.id}
                        title="Download Invoice"
                      >
                        {downloadingId === invoice.id ? (
                          <FaSpinner className="spin-icon" />
                        ) : (
                          <FaDownload className="download-icon" />
                        )}
                        <span>{downloadingId === invoice.id ? 'Downloading...' : 'Download invoice →'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Stacked Cards */}
            <div className="billing-mobile-cards">
              {billingHistory.map((invoice) => (
                <div key={invoice.id} className="mobile-billing-card">
                  <div className="mobile-card-row-top">
                    <div>
                      <span className="mobile-invoice-desc">{invoice.description}</span>
                      <span className="mobile-invoice-date">{invoice.date}</span>
                    </div>
                    <span className={`status-tag status-${invoice.status.toLowerCase()}`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="mobile-card-row-bottom">
                    <span className="mobile-invoice-amount">{invoice.amount}</span>
                    <button
                      type="button"
                      className="invoice-download-btn mobile-btn"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                      disabled={downloadingId === invoice.id}
                    >
                      {downloadingId === invoice.id ? (
                        <FaSpinner className="spin-icon" />
                      ) : (
                        <FaDownload className="download-icon" />
                      )}
                      <span>Download Invoice</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================
            9. & 10. PAYMENT METHOD
            ================================================================= */}
        <section className="sub-section-card payment-method-section" aria-label="Payment Method">
          <div className="section-title-wrap">
            <h2 className="section-title">Payment Method</h2>
            <p className="section-subtitle">Manage the payment method used for your subscription.</p>
          </div>

          {hasPaymentMethod ? (
            <div className="payment-method-card">
              <div className="pm-left">
                <div className="pm-card-icon">
                  <FaCreditCard />
                </div>
                <div className="pm-card-info">
                  <div className="pm-card-name-row">
                    <span className="pm-card-title">Visa ending in 4242</span>
                    <span className="pm-default-badge">DEFAULT</span>
                  </div>
                  <span className="pm-card-expiry">Expires 12/25</span>
                </div>
              </div>

              <div className="pm-actions">
                <button
                  type="button"
                  className="pm-update-btn"
                  onClick={() => onNotify('Payment method update portal cued', 'info')}
                >
                  <span>Update →</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pm-empty-state">
              <div className="pm-empty-icon">
                <FaCreditCard />
              </div>
              <h3>No payment method added</h3>
              <p>Add a payment method to manage your subscription without service interruptions.</p>
              <button
                type="button"
                className="plan-primary-cta empty-cta"
                onClick={() => setHasPaymentMethod(true)}
              >
                <span>Add Payment Method →</span>
              </button>
            </div>
          )}
        </section>

        {/* =================================================================
            11. BILLING PREFERENCES
            ================================================================= */}
        <section className="sub-section-card billing-prefs-section" aria-label="Billing Preferences">
          <div className="section-title-wrap">
            <h2 className="section-title">Billing Preferences</h2>
            <p className="section-subtitle">Configure notifications and receipt delivery settings.</p>
          </div>

          <div className="billing-prefs-list">
            <div className="pref-item-row">
              <div className="pref-item-meta">
                <div className="pref-icon-bubble">
                  <FaReceipt />
                </div>
                <div>
                  <h4>Email billing receipts</h4>
                  <p>Receive monthly tax invoices and transaction receipts to your registered email</p>
                </div>
              </div>
              <label className="gh-switch" aria-label="Toggle Email billing receipts">
                <input
                  type="checkbox"
                  checked={billingPrefs.emailReceipts}
                  onChange={() => handleTogglePref('emailReceipts')}
                />
                <span className="gh-slider" />
              </label>
            </div>

            <div className="pref-item-row">
              <div className="pref-item-meta">
                <div className="pref-icon-bubble">
                  <FaBell />
                </div>
                <div>
                  <h4>Subscription renewal reminders</h4>
                  <p>Receive advance notice 3 days before your subscription renews</p>
                </div>
              </div>
              <label className="gh-switch" aria-label="Toggle Renewal reminders">
                <input
                  type="checkbox"
                  checked={billingPrefs.renewalReminders}
                  onChange={() => handleTogglePref('renewalReminders')}
                />
                <span className="gh-slider" />
              </label>
            </div>

            <div className="pref-item-row">
              <div className="pref-item-meta">
                <div className="pref-icon-bubble">
                  <FaShieldHalved />
                </div>
                <div>
                  <h4>Payment notifications</h4>
                  <p>Get immediate SMS and push notifications for successful charges or renewals</p>
                </div>
              </div>
              <label className="gh-switch" aria-label="Toggle Payment notifications">
                <input
                  type="checkbox"
                  checked={billingPrefs.paymentAlerts}
                  onChange={() => handleTogglePref('paymentAlerts')}
                />
                <span className="gh-slider" />
              </label>
            </div>
          </div>
        </section>

        {/* =================================================================
            14. PREMIUM PROMOTIONAL BANNER
            ================================================================= */}
        <section className="sub-promo-cinematic-banner" aria-label="Premium Membership Banner">
          <div className="promo-banner-content">
            <div className="promo-vip-pill">
              <FaCrown className="crown-icon" />
              <span>GHSNAPFLIX VIP</span>
            </div>

            <h3 className="promo-banner-title">
              {effectiveSubscribed
                ? "You're already getting the full experience."
                : 'Unlock the Full GHSNAPFLIX Experience'}
            </h3>

            <p className="promo-banner-subtitle">
              {effectiveSubscribed
                ? 'Enjoy unlimited 4K Ultra HD streaming, zero advertisements, multi-screen access, and priority playback.'
                : 'Get ad-free viewing, full 24-hour unlimited access, offline downloads, and instant streaming for only 1 GHS.'}
            </p>

            <div className="promo-cta-row">
              <button
                type="button"
                className="promo-action-btn"
                onClick={effectiveSubscribed ? () => onNavigate('videos') : handleUpgradePlan}
              >
                <span>{effectiveSubscribed ? 'Explore Catalog →' : 'Get 1-Day Pass (1 GHS) →'}</span>
              </button>
            </div>
          </div>

          <div className="promo-banner-artwork">
            <img
              src="/images/rewards_naruto_banner.png"
              alt="Anime VIP Community"
              className="promo-art-img"
              loading="lazy"
            />
          </div>
        </section>

        {/* =================================================================
            12. CANCELLATION AREA
            ================================================================= */}
        {effectiveSubscribed && (
          <section className="sub-cancel-restrained-card" aria-label="Cancellation">
            <div className="cancel-text-wrap">
              <h3 className="cancel-card-title">Need to leave?</h3>
              <p className="cancel-card-desc">
                Cancel your subscription at any time. Your benefits remain available until the end of
                the current billing period ({currentSubscription.nextBilling}).
              </p>
            </div>
            <button
              type="button"
              className="cancel-trigger-btn"
              onClick={() => setShowCancelModal(true)}
            >
              <span>Cancel Subscription</span>
            </button>
          </section>
        )}
      </div>

      {/* =================================================================
          13. REDESIGNED CANCELLATION MODAL
          ================================================================= */}
      {showCancelModal && (
        <div
          className="sub-modal-backdrop"
          onClick={() => setShowCancelModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="sub-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="sub-modal-close-btn"
              onClick={() => setShowCancelModal(false)}
              aria-label="Close dialog"
            >
              <FaXmark />
            </button>

            <div className="modal-icon-badge">
              <FaTriangleExclamation />
            </div>

            <h3 className="modal-heading">Cancel your subscription?</h3>
            <p className="modal-description">
              You'll continue to have Premium access until the end of your current billing period on{' '}
              <strong>{currentSubscription.nextBilling}</strong>. After this date, your plan will revert
              to the Free Tier with limited streaming.
            </p>

            <div className="modal-actions-cluster">
              <button
                type="button"
                className="modal-keep-btn"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Premium
              </button>
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={handleConfirmCancel}
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagementPage;
