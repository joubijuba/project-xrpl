import { getServer } from "../getServer"
import { Express, Request, Response } from "express"
import UsersService from "../services/UsersService"

export default class UsersController {
  usersService: UsersService
  expressServer: Express

  constructor() {
    this.usersService = new UsersService()
    this.expressServer = getServer()

    this.expressServer.post("/newSubscription", async (req: Request, res: Response) => {
      await this.addNewSubscription(req, res)
    })
  }

  async addNewSubscription(req: Request, res: Response): Promise<Response> {
    try {
      const datas = req.body
      const response = await this.usersService.addNewSubscription(datas)
      let status = !response.error ? 200 : 400;
      return res.status(status).json(response)
    } catch (err: any) {
      return res.status(400).json({
        status: err.toString(),
        error: true,
      })
    }
  }
}
