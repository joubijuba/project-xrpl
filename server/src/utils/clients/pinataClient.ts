import pinataSDK from "@pinata/sdk"
require("dotenv").config()

const { PINATA_KEY, PINATA_SECRET } = process.env

export const pinataClient = new pinataSDK(PINATA_KEY, PINATA_SECRET)