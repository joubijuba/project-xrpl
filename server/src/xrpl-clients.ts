// todo: write the client
import { Client } from "xrpl"
const networks = {
    RIPPLE_TESTNET : "wss://testnet.xrpl-labs.com/"
}

let client: Client

// Function to get the client
export const getClient  = () => {
    if (!client) {
        client = new Client(networks.RIPPLE_TESTNET)
    }
    // Otherwise retuen existing object
    return client
}