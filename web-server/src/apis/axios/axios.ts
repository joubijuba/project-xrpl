import axios, { AxiosInstance } from "axios";

let axiosInstance: AxiosInstance;

export const getAxiosInstance = () => {
  if (!axiosInstance) {
    axiosInstance = axios.create({ baseURL: process.env.API_ORIGIN });
  }
  return axiosInstance;
};