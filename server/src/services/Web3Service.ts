import Web3 from "web3";
import { web3 } from "../clients/Web3Client";
import { getWeb3Variables } from "../web3Variables";

export default class Web3Service {
  web3: Web3;
  web3variables: any;

  constructor() {
    this.web3 = web3;
    this.web3variables = getWeb3Variables();
  }

  async postNewSubmission(
    encryptedData: string,
    erc20Address: string
  ): Promise<string> {
    try {
      const { account, contract } = this.web3variables;
      const request = await contract.methods
        .postNewSubmission(encryptedData, erc20Address)
        .send({ from: account });
      if (request.status) {
        return "posted new subscription successfully";
      }
      return "something went wrong";
    } catch (err: any) {
      return err.message.toString();
    }
  }
}
