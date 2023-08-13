import { XummSdk } from "xumm-sdk"
require("dotenv").config()

export const xummClient = new XummSdk(process.env.API_KEY, process.env.API_SECRET)