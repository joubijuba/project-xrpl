import axios, { AxiosInstance } from "axios";

let axiosInstance: AxiosInstance;

export const getAxiosInstance = () => {
  if (!axiosInstance) {
    axiosInstance = axios.create({ baseURL: "http://localhost:8080" });
  }
  return axiosInstance;
};