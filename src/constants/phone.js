export const COUNTRY_CODE = '233';
export const PHONE_INPUT_MAX_LENGTH = 9;
export const buildMsisdn = (localNumber) => `${COUNTRY_CODE}${localNumber}`;
export const formatMsisdnForDisplay = (msisdn) => {
    if (msisdn.startsWith(COUNTRY_CODE)) {
        return `+${COUNTRY_CODE} ${msisdn.slice(COUNTRY_CODE.length)}`;
    }
    return `+${msisdn}`;
};
export const sanitizeLocalPhoneInput = (value) => value.replace(/\D/g, '').slice(0, PHONE_INPUT_MAX_LENGTH);
export const isValidLocalPhoneInput = (value) => value.length === PHONE_INPUT_MAX_LENGTH && /^\d+$/.test(value);
