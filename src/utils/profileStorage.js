const PROFILE_STORAGE_KEY = 'ghsnapflix_profile';
const PREFERENCES_STORAGE_KEY = 'ghsnapflix_preferences';

export const DEFAULT_PREFERENCES = {
  autoplay: true,
  hdStreaming: true,
  emailNotifications: false,
  soundEffects: true,
};

export function getStoredProfile(activePhone = '') {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        name: parsed.name || (activePhone ? `MTN User (${activePhone.slice(-4)})` : 'Anime Explorer'),
        email: parsed.email || (activePhone ? `${activePhone.replace(/\D/g, '')}@ghsnapflix.com` : 'fan@ghsnapflix.com'),
        phone: parsed.phone || activePhone || '+233 24 000 0000',
        language: parsed.language || 'English',
      };
    }
  } catch (err) {
    console.error('Failed to parse stored profile:', err);
  }

  return {
    name: activePhone ? `MTN User (${activePhone.slice(-4)})` : 'Anime Explorer',
    email: activePhone ? `${activePhone.replace(/\D/g, '')}@ghsnapflix.com` : 'fan@ghsnapflix.com',
    phone: activePhone || '+233 24 000 0000',
    language: 'English',
  };
}

export function saveStoredProfile(profile) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event('profileUpdated'));
    return true;
  } catch (err) {
    console.error('Failed to save profile:', err);
    return false;
  }
}

export function getStoredPreferences() {
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('Failed to parse stored preferences:', err);
  }
  return DEFAULT_PREFERENCES;
}

export function saveStoredPreferences(prefs) {
  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
    window.dispatchEvent(new Event('preferencesUpdated'));
    return true;
  } catch (err) {
    console.error('Failed to save preferences:', err);
    return false;
  }
}

