import React, { useState } from 'react';
import './LoginModal.css';
import { useTranslation } from '../contexts/TranslationContext';
import { NOTIFICATION_MESSAGES } from '../constants/notifications';
import { buildMsisdn, COUNTRY_CODE, isValidLocalPhoneInput, PHONE_INPUT_MAX_LENGTH, sanitizeLocalPhoneInput, } from '../constants/phone';
import { FaLock } from 'react-icons/fa6';
const LoginModal = ({ hidePhoneInput = false, onSubmit, onNotify, onClose, }) => {
    const { t } = useTranslation();
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handlePhoneChange = (e) => {
        setPhone(sanitizeLocalPhoneInput(e.target.value));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hidePhoneInput && !isValidLocalPhoneInput(phone)) {
            return;
        }
        const msisdn = hidePhoneInput ? '' : buildMsisdn(phone);
        setIsLoading(true);
        try {
            await onSubmit(msisdn);
        }
        catch {
            onNotify(NOTIFICATION_MESSAGES.ERROR_GENERIC, 'error');
        }
        finally {
            setIsLoading(false);
        }
    };
    const isSubmitDisabled = isLoading || (!hidePhoneInput && !isValidLocalPhoneInput(phone));
    return (<div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} type="button">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="modal-header">
          <div className="modal-logo-custom">
            <div className="modal-play-icon" style={{ background: '#f5c518', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#0c0d12" style={{ marginLeft: 2 }}>
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="modal-logo-text" style={{ textAlign: 'center', marginBottom: 6 }}>
              <span style={{ color: '#f5c518', fontSize: '1.4rem', fontWeight: 900, letterSpacing: '0.5px' }}>GHSNAPFLIX</span>
            </div>
          </div>
          <h1 className="modal-title">{t('login.welcome')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {!hidePhoneInput && (<div className="input-group">
              <label className="input-label">{t('login.phone.label')}</label>
              <div className="phone-input-wrapper">
                <span className="phone-prefix">+{COUNTRY_CODE}</span>
                <input type="tel" inputMode="numeric" value={phone} onChange={handlePhoneChange} className="phone-input" placeholder="241234567" maxLength={PHONE_INPUT_MAX_LENGTH} disabled={isLoading} autoComplete="tel-national"/>
              </div>
            </div>)}

          <button type="submit" className={`send-otp-button ${isLoading ? 'loading' : ''}`} disabled={isSubmitDisabled} style={{
            background: 'linear-gradient(135deg, #ffd21f 0%, #f5c518 100%)',
            color: '#0c0d12',
            fontWeight: 800,
            opacity: isSubmitDisabled ? 0.6 : 1,
        }}>
            {isLoading ? (<>
                <span className="button-spinner" aria-hidden="true"/>
                <span>Please wait...</span>
              </>) : (<>
                <span>{t('login.proceed.subscribe')}</span>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10L16 10M10 4L16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>)}
          </button>
        </form>

        <div className="security-notice">
          <div className="security-icon"><FaLock /></div>
          <span>{t('login.security')}</span>
        </div>
      </div>
    </div>);
};
export default LoginModal;
