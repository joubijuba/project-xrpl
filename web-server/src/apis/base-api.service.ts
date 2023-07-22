import { getAxiosInstance } from "./axios/axios";
import { AxiosError, AxiosInstance, AxiosResponse } from "axios";

export abstract class BaseApi {
  axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = getAxiosInstance();
  }

  async getReq<R = any>(url: string, params?: any): Promise<R> {
    try {
      const { axiosInstance } = this;
      const res = await axiosInstance.get(url, params);
      return res.data;
    } catch (err: any) {
      return err.message;
    }
  }

  async postReq<R = any>(url: string, params?: any): Promise<R> {
    try {
      const { axiosInstance } = this;
      const res = await axiosInstance.get(url, params);
      return res.data;
    } catch (err: any) {
      return err.message;
    }
  }

  async putReq<R = any>(url: string, params?: any): Promise<R> {
    try {
      const { axiosInstance } = this;
      const res = await axiosInstance.get(url, params);
      return res.data;
    } catch (err: any) {
      return err.message;
    }
  }
}
