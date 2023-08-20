import { getServer } from "../getServer"
import { Express, Request, Response } from "express"
import MongoService from "../services/MongoService"
import { _responseBuilder, _reqBodyChecker } from "../utils/express.utils"
import { _setOnGoingPresales, fetchedOnGoingPresales } from "../utils/presales.utils"
import {
  ApplicationDataSchema,
  PresaleDataSchema,
  PresaleDataDto,
} from "../dtos/mongo-models.dto"
import { ResponseDto } from "../dtos/response.dto"

export default class MongoController {
  mongoService: MongoService
  expressServer: Express

  constructor() {
    this.mongoService = new MongoService()
    this.expressServer = getServer()

    this.expressServer.post(
      "/newApplication",
      _reqBodyChecker(ApplicationDataSchema.omit({ status: true })),
      async (req: Request, res: Response) => {
        const response = await this.mongoService.addNewApplication(req.body)
        return _responseBuilder(response, res)
      }
    )

    this.expressServer.get("/admin/pendingApplications", async (req: Request, res: Response) => {
      const response = await this.mongoService.getPendingApplications()
      return _responseBuilder(response, res)
    })

    this.expressServer.put(
      "/admin/updateApplication/mailAddress/:mailAddress",
      async (req: Request, res: Response) => {
        const response = await this.mongoService.processApplication(req.params.mailAddress)
        return _responseBuilder(response, res)
      }
    )

    this.expressServer.get(
      "/admin/getApplication/mailAddress/:mailAddress",
      async (req: Request, res: Response) => {
        const response = await this.mongoService.getApplication(req.params.mailAddress)
        return _responseBuilder(response, res)
      }
    )

    this.expressServer.delete(
      "/admin/deleteApplication/mailAddress/:mailAddress",
      async (req: Request, res: Response) => {
        const response = await this.mongoService.deleteApplication(req.params.mailAddress)
        return _responseBuilder(response, res)
      }
    )

    this.expressServer.post(
      "/admin/addNewTokenSale",
      _reqBodyChecker(PresaleDataSchema.omit({ onGoing: true, totalTokensSold: true })),
      async (req: Request, res: Response) => {
        const response = await this.addNewPresale(req.body)
        return _responseBuilder(response, res)
      }
    )
  }

  private async addNewPresale(
    presaleData: Omit<PresaleDataDto, "onGoing" | "totalTokensSold">
  ): Promise<ResponseDto<string>> {
    const tokenSale = {
      ...presaleData,
      totalTokensSold: 0,
      onGoing: true,
    }
    const res = await this.mongoService.addNewPresale(tokenSale)
    if (res.error) {
      return res
    }
    if (fetchedOnGoingPresales) {
      _setOnGoingPresales([tokenSale])
    }
    return res
  }
}
