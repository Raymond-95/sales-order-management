import axios, { type AxiosInstance } from 'axios';

// Create an Axios instance for common baseURL and settings
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Base URL from the .env file
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Set a timeout for requests
});

export default apiClient;
