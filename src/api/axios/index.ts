import { appConfig } from '@/config/appConfig'
import axios, { AxiosInstance } from 'axios'

console.log(appConfig)

// Create a new Axios instance
export const InstanceAxios: AxiosInstance = axios.create({
  baseURL: appConfig.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

