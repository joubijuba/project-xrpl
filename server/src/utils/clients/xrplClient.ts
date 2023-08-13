import { Client } from "xrpl"

const networks = {
    RIPPLE_TESTNET : "wss://s.altnet.rippletest.net:51233/"
}

export const xrplClient = new Client(networks.RIPPLE_TESTNET)