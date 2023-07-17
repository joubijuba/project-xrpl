import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";

require("dotenv").config();

const provider = new HDWalletProvider(
  `${process.env.MNEMONIC}`,
  `${process.env.RPC_URL}`
);

export const web3 = new Web3(provider as any);