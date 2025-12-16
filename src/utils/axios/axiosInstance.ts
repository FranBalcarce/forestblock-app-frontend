import axios, { AxiosError, AxiosResponse } from 'axios';

const rawBaseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://localhost:5000';

const baseURL = rawBaseURL.replace(/\/$/, '');

const axiosInstance = axios.create({
  baseURL,
  timeout: 180000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // OJO: localStorage solo existe en browser
    if (typeof window !== 'undefined') {
      const jwtToken = localStorage.getItem('forestblockToken');
      if (jwtToken) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${jwtToken}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error('Error Response:', error.response);
    } else if (error.request) {
      console.error('Error Request:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// import axios, { AxiosError, AxiosResponse } from "axios";

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//   timeout: 180000,
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const jwtToken = localStorage.getItem("forestblockToken");
//     if (jwtToken) {
//       config.headers.Authorization = `Bearer ${jwtToken}`;
//     }
//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response: AxiosResponse) => {
//     return response;
//   },
//   (error: AxiosError) => {
//     if (error.response) {
//       console.error("Error Response:", error.response);
//     } else if (error.request) {
//       console.error("Error Request:", error.request);
//     } else {
//       console.error("Error:", error.message);
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
