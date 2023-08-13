// todo: create and export the wallets from .env
//require("dotenv").config()
import * as dotenv from "dotenv"
import { Wallet } from "xrpl"

dotenv.config()

const WALLET_1_SEED = process.env.WALLET_1_SEED ?? ""
const WALLET_2_SEED = process.env.WALLET_2_SEED ?? ""

export const WALLET_1 = Wallet.fromSeed(WALLET_1_SEED)
export const WALLET_2 = Wallet.fromSeed(WALLET_2_SEED)