import axios from 'axios';
import authStore from '../store/userAuth.store.js';

const axiosInstance=axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials:true
})

let logoutInProgress = false;

axiosInstance.interceptors.response.use
(
    (response) => {
      return response;}
      ,
    async (error) => {
        const requestUrl = error.config?.url || "";
        const isAuthRequest = /\/users\/(login|signup|logout)(?:\?|$)/.test(requestUrl);
        const message = error.response?.data?.message?.toLowerCase() || "";
        const isAuthenticationFailure =
            message.includes("token") ||
            message.includes("unauthorised") ||
            message.includes("unauthorized") ||
            message.includes("user is not found");

        if (
            error.response?.status === 401 &&
            !isAuthRequest &&
            isAuthenticationFailure &&
            !logoutInProgress
        ) {
            logoutInProgress = true;
            authStore.getState().clearSession();
            // The auth state change lets the existing routes navigate to /login.
            // Keep the app mounted while the server clears the expired cookie.
            axiosInstance.post("/users/logout")
                .catch(() => {})
                .finally(() => {
                    logoutInProgress = false;
                });
        }
        return Promise.reject(error);
    }
)

export default axiosInstance

