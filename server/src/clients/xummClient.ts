import { XummSdk } from "xumm-sdk"
require("dotenv").config();

let xummClient: XummSdk

export const getXummClient = () => {
  if (!xummClient) {
    xummClient = new XummSdk(process.env.API_KEY, process.env.API_SECRET)
    return xummClient
  }
  return xummClient
}