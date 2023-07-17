import express, { Express, Request, Response } from "express";
import EncryptionService from "../services/EncryptionService";
import { web3 } from "../clients/Web3Client";
import { SubscriptionDataDto } from "../dtos/models";

export default class EncryptionController {
  expressServer: Express;
  encryptionService: EncryptionService;

  constructor(expressServer: Express) {
    this.expressServer = expressServer;
    this.encryptionService = new EncryptionService();

    /// FOR TEST
    expressServer.post("/encryptData", async (req: Request, res: Response) => {
      // const datas: SubscriptionDataDto = req.body;
      await this.encryptData(req, res);
    });

    expressServer.post(
      "/newSubscription",
      async (req: Request, res: Response) => {
        // const datas: SubscriptionDataDto = req.body;
        await this.postNewSubmission(req, res);
      }
    );
  }

  /// FOR TEST
  async encryptData(req: Request, res: Response) {
    try {
      const datas: SubscriptionDataDto = req.body;
      // const address = datas.erc20Address;
      let subscriptionData: any = {...datas};
      delete subscriptionData.erc20Address;
      const encryptedData = await this.encryptionService.encryptData(
        subscriptionData
      );
      return res.status(200).json(encryptedData);
    } catch (err: any) {
      return res.status(400).json({
        error: err.toString(),
      });
    }
  }

  async postNewSubmission(req: Request, res: Response) {
    try {
      const datas: SubscriptionDataDto = req.body;
      let subscriptionData: any = {...datas};
      delete subscriptionData.erc20Address;
      const encryptedData = await this.encryptionService.encryptData(
        subscriptionData
      );
      /// TO DO : CALL postNewSubmission func of the contract
    } catch {}
  }
}
