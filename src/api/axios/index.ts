// import { appConfig } from '@/config/appConfig'
import axios, { AxiosInstance } from 'axios'

// Create a new Axios instance
export const InstanceAxios: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

