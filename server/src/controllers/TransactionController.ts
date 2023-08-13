import { getServer } from "../getServer"
import { Express, Request, Response } from "express"
import { _responseBuilder, _reqBodyChecker } from "../utils/express.utils"
import { NFTDatasSchema } from "../dtos/nft-models.dto"
import TransactionService from "src/services/TransactionService"

export default class NFTController {
  transactionService: TransactionService
  expressServer: Express

  constructor() {
    this.transactionService = new TransactionService()
    this.expressServer = getServer()

    this.expressServer.post(
      "/mintTokens",
      _reqBodyChecker(NFTDatasSchema),
      async (req: Request, res: Response) => {
        // await setIssuerAccount()
      }
    )
  }

}