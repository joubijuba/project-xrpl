import { getServer } from "../getServer"
import { Express, Request, Response } from "express"
import MongoService from "../services/MongoService"
import { _responseBuilder, _typeChecker } from "../utils/express.utils"
import { SubscriptionDataDto, SuscriptionDataSchema } from "../dtos/mongo-models.dto"
import { ResponseDto } from "../dtos/response.dto"

export default class MongoController {
  mongoService: MongoService
  expressServer: Express

  constructor() {
    this.mongoService = new MongoService()
    this.expressServer = getServer()

    this.expressServer.post(
      "/newSubscription",
      _typeChecker(SuscriptionDataSchema.omit({ status: true })),
      async (req: Request, res: Response) => {
        await this.addNewSubscription(req, res)
      }
    )

    this.expressServer.get("admin/pendingSubscriptions", async (req: Request, res: Response) => {
      await this.getPendingSubscriptions(req, res)
    })

    this.expressServer.put(
      "admin/updateSubscription/mailAddress/:mailAddress",
      async (req: Request, res: Response) => {
        await this.processSubscription(req, res)
      }
    )

    this.expressServer.delete(
      "admin/updateSubscription/mailAddress/:mailAddress",
      async (req: Request, res: Response) => {
        await this.processSubscription(req, res)
      }
    )
  }

  async addNewSubscription(req: Request, res: Response): Promise<Response> {
    const response = await this.mongoService.addNewSubscription(req.body)
    return _responseBuilder(response, res)
  }

  async getPendingSubscriptions(req: Request, res: Response): Promise<Response> {
    const response = await this.mongoService.getPendingSubscriptions()
    return _responseBuilder(response, res)
  }

  async processSubscription(req: Request, res: Response): Promise<Response> {
    const response = await this.mongoService.processSubscription(req.params.mailAddress)
    return _responseBuilder(response, res)
  }

  async deleteSubscription(req: Request, res: Response): Promise<Response> {
    const response = await this.mongoService.deleteSubscription(req.params.mailAddress)
    return _responseBuilder(response, res)
  }
}
