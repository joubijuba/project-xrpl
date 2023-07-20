import Contract from "web3/eth/contract";
import { web3 } from "./clients/Web3Client";
import artifact from "./contracts/SubmissionsStorage.json";

let ownerAcc: string;
let contract: Contract;

export const getWeb3Variables = async () => {
  if (ownerAcc! || contract!) {
    const { abi } = artifact;
    if (artifact) {
      try {
        ownerAcc = (await web3.eth.requestAccounts())[0];
        let contractAddress: string;
        // 144002 : XRPL sidechain chain ID
        contractAddress = artifact.networks["1440002"].address;
        contract = new Contract(abi, contractAddress);
      } catch {
        console.log(
          "something is probably wrong with the ABI or the network ID"
        );
      }
    }
  }
  return { ownerAcc, contract };
};