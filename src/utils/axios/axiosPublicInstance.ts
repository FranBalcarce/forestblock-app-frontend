import axios from 'axios';

const rawBaseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL || // por si te quedó la otra en algún lado
  'http://localhost:5000';

const baseURL = rawBaseURL.replace(/\/$/, '');

export const axiosPublicInstance = axios.create({
  baseURL,
  timeout: 180000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// import axios from "axios";

// export const axiosPublicInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//   timeout: 180000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
