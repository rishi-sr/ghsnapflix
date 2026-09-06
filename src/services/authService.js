import { apiClient } from '../api/axiosClient';
import { API_CONFIG } from '../config/api';
export async function sendOtp(msisdn) {
    const { data } = await apiClient.post(API_CONFIG.endpoints.sendOtp, { msisdn });
    return data;
}
export async function verifyOtp(msisdn, otp) {
    const { data } = await apiClient.post(API_CONFIG.endpoints.verifyOtp, { msisdn, otp });
    return data;
}
