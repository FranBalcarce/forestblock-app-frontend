import axios from 'axios';

const rawBaseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://localhost:5000';

const baseURL = rawBaseURL.replace(/\/$/, '');

export const axiosPublicInstance = axios.create({
  baseURL,
  timeout: 180000,
  headers: {
    'Content-Type': 'application/json',
    // ✅ fuerza a que NO use 304/ETag cacheado
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
});

// ✅ cache-buster por si algún proxy/CDN insiste con 304
axiosPublicInstance.interceptors.request.use((config) => {
  config.params = { ...(config.params ?? {}), _ts: Date.now() };
  return config;
});

// import axios from 'axios';

// const rawBaseURL =
//   process.env.NEXT_PUBLIC_API_BASE_URL ||
//   process.env.NEXT_PUBLIC_BACKEND_URL || // por si te quedó la otra en algún lado
//   'http://localhost:5000';

// const baseURL = rawBaseURL.replace(/\/$/, '');

// export const axiosPublicInstance = axios.create({
//   baseURL,
//   timeout: 180000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// import axios from "axios";

// export const axiosPublicInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//   timeout: 180000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
