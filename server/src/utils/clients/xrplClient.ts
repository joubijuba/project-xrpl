import { Client } from "xrpl"

const networks = {
    RIPPLE_TESTNET : "wss://testnet.xrpl-labs.com/"
}

export const xrplClient = new Client(networks.RIPPLE_TESTNET)