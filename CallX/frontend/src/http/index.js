import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:5500",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});



export const sendOtp = (data) => api.post('/api/send-otp', data);
export const verifyOtp = (data) => api.post('/api/verify-otp', data);
export const activate = (data) => api.post('/api/activate', data);
export const logout = () => api.post('/api/logout');
export const createRoom = (data) => api.post('/api/rooms', data);
export const getAllRooms = () => api.get('/api/rooms');
export const getRoom = (roomId) => api.get(`/api/rooms/${roomId}`);


api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (!error.response) {
            console.log('Backend not reachable / Network error');
            return Promise.reject(error);
        }


        if (
            error.response.status === 401 &&
            !originalRequest._isRetry
        ) {
            originalRequest._isRetry = true;

            try {
                await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/refresh`,
                    { withCredentials: true }
                );

                return api.request(originalRequest);
            } catch (err) {
                console.log('Refresh token expired');
            }
        }

        return Promise.reject(error);
    }
);


export default api;
