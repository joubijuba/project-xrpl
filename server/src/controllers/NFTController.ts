import { getServer } from "../getServer"
import { Express, Request, Response } from "express"
import MongoService from "../services/MongoService"
import { _responseBuilder, _reqBodyChecker } from "../utils/express.utils"
import { ApplicationDataDto, ApplicationDataSchema } from "../dtos/mongo-models.dto"
import { ResponseDto } from "../dtos/response.dto"
import NFTService from "src/services/NFTService"

export default class NFTController {
  NFTService: NFTService
  expressServer: Express

  constructor() {
    this.NFTService = new NFTService()
    this.expressServer = getServer()

    this.expressServer.post(
      "/mintNFT",
      _reqBodyChecker(ApplicationDataSchema.omit({ status: true })),
      async (req: Request, res: Response) => {
        // await this.addNewSubscription(req, res)
      }
    )

  }

  // async addNewSubscription(req: Request, res: Response): Promise<Response> {
  //   const response = await this.NFTService.mintNFT(req.body)
  //   return _responseBuilder(response, res)
  // }

}
