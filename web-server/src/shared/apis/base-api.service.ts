import { ResponseDto } from "../models/ResponseDto";
import { getAxiosInstance } from "./axios/axios";
// import { ResponseDto } from "../models/ResponseDto"
import { AxiosError, AxiosInstance, AxiosResponse } from "axios";

export abstract class BaseApi {
  axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = getAxiosInstance();
  }

  async getReq<R = any>(url: string, config?: any): Promise<ResponseDto<R>> {
    try {
      const { axiosInstance } = this;
      const res = await axiosInstance.get(url, config);
      return res.data;
    } catch (err: any) {
      return err.response.data;
    }
  }

  async postReq<R = any>(url: string, params?: any): Promise<ResponseDto<R>> {
    try {
      const { axiosInstance } = this;
      const res = await axiosInstance.post(url, params);
      return res.data;
    } catch (err: any) {
      return err.response.data;
    }
  }

  async putReq<R = any>(url: string, params?: any): Promise<ResponseDto<R>> {
    try {
      const { axiosInstance } = this;
      const res = await axiosInstance.put(url, params);
      return res.data;
    } catch (err: any) {
      return err.response.data;
    }
  }

  async deleteReq<R = any>(url: string, params?: any): Promise<ResponseDto<R>> {
    try {
      const { axiosInstance } = this;
      const res = await axiosInstance.delete(url, params);
      return res.data;
    } catch (err: any) {
      return err.response.data;
    }
  }
}
