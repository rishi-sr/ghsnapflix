import { isJwtExpired } from './jwt';
const STORAGE_KEY = 'ghsnapflix_session';
const DAY_MS = 24 * 60 * 60 * 1000;
const TOKEN_KEY = 'token';
const PAYMENT_DONE_KEY = 'payment_done';
const OFFER_CODE_KEY = 'offerCode';
const PHONE_KEY = 'phone';
const emptyStorage = () => ({
    session: null,
    subscriptionsByMsisdn: {},
});
const readStorage = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return emptyStorage();
        }
        const parsed = JSON.parse(raw);
        return {
            session: parsed.session ?? null,
            subscriptionsByMsisdn: parsed.subscriptionsByMsisdn ?? {},
        };
    }
    catch {
        return emptyStorage();
    }
};
const writeStorage = (storage) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
};
export const isSubscriptionActive = (subscription) => {
    if (!subscription) {
        return false;
    }
    return Date.now() < subscription.expiresAt;
};
export const getSubscriptionExpiry = (durationDays = 1, fromTime = Date.now()) => fromTime + (durationDays || 1) * DAY_MS;
export const loadAppSession = () => {
    const token = getAuthToken();
    if (token && isJwtExpired(token)) {
        clearLoginSession();
        return {
            msisdn: '',
            isLoggedIn: false,
            isSubscribed: false,
            subscription: null,
            accessExpired: true,
        };
    }
    const storage = readStorage();
    const session = storage.session;
    if (!session?.msisdn) {
        const phone = localStorage.getItem(PHONE_KEY) || '';
        if (token && phone && !isJwtExpired(token)) {
            return {
                msisdn: phone.replace(/\D/g, ''),
                isLoggedIn: true,
                isSubscribed: localStorage.getItem(PAYMENT_DONE_KEY) === 'true',
                subscription: null,
                accessExpired: false,
            };
        }
        return {
            msisdn: '',
            isLoggedIn: false,
            isSubscribed: false,
            subscription: null,
            accessExpired: false,
        };
    }
    let subscription = storage.subscriptionsByMsisdn[session.msisdn] ?? null;
    if (!isSubscriptionActive(subscription)) {
        if (subscription) {
            delete storage.subscriptionsByMsisdn[session.msisdn];
            if (storage.session) {
                storage.session.subscription = null;
                storage.session.isLoggedIn = false;
            }
            writeStorage(storage);
            clearLoginSession();
            return {
                msisdn: '',
                isLoggedIn: false,
                isSubscribed: false,
                subscription: null,
                accessExpired: true,
            };
        }
        subscription = null;
    }
    else if (storage.session) {
        storage.session.subscription = subscription;
        writeStorage(storage);
    }
    const isSubscribed = isSubscriptionActive(subscription) && Boolean(token) && !isJwtExpired(token);
    return {
        msisdn: session.msisdn,
        isLoggedIn: Boolean(session.isLoggedIn && token && !isJwtExpired(token) && isSubscribed),
        isSubscribed,
        subscription,
        accessExpired: false,
    };
};
export const getAuthToken = () => localStorage.getItem(TOKEN_KEY) || '';
export const saveAuthToken = (token, msisdn) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(PAYMENT_DONE_KEY, 'true');
    if (msisdn) {
        localStorage.setItem(PHONE_KEY, msisdn);
    }
};
export const saveLoginSession = (msisdn) => {
    const storage = readStorage();
    const subscription = storage.subscriptionsByMsisdn[msisdn] ?? null;
    const activeSubscription = isSubscriptionActive(subscription) ? subscription : null;
    if (subscription && !activeSubscription) {
        delete storage.subscriptionsByMsisdn[msisdn];
    }
    storage.session = {
        msisdn,
        isLoggedIn: true,
        subscription: activeSubscription,
    };
    writeStorage(storage);
};
export const saveSubscription = (msisdn, plan) => {
    const storage = readStorage();
    const subscribedAt = Date.now();
    const subscription = {
        planKey: plan.id,
        apiPlanId: plan.planId,
        subscribedAt,
        expiresAt: getSubscriptionExpiry(plan.durationDays, subscribedAt),
    };
    storage.subscriptionsByMsisdn[msisdn] = subscription;
    if (storage.session?.msisdn === msisdn) {
        storage.session.subscription = subscription;
        storage.session.isLoggedIn = true;
    }
    writeStorage(storage);
    return subscription;
};
export const clearLoginSession = () => {
    const storage = readStorage();
    if (storage.session) {
        storage.session.isLoggedIn = false;
    }
    writeStorage(storage);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PAYMENT_DONE_KEY);
    localStorage.removeItem(OFFER_CODE_KEY);
    localStorage.removeItem(PHONE_KEY);
    localStorage.removeItem('is_demo_subscription');
};
export const clearAllSessionData = () => {
    localStorage.removeItem(STORAGE_KEY);
};
export const getMsisdnSubscription = (msisdn) => {
    const storage = readStorage();
    const subscription = storage.subscriptionsByMsisdn[msisdn] ?? null;
    return isSubscriptionActive(subscription) ? subscription : null;
};
