import { apiClient } from '../api/axiosClient';
import { API_CONFIG } from '../config/api';
export async function fetchSubscriptionStatus() {
    const { data } = await apiClient.get(API_CONFIG.endpoints.subscriptionStatus);
    return data.subscription ?? null;
}
