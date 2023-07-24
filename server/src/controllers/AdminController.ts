import { getServer } from "../getServer"
import { Express, Request, Response } from "express"
import AdminService from "../services/AdminService"

export default class UsersController {
  adminService: AdminService
  expressServer: Express

  constructor() {
    this.adminService = new AdminService()
    this.expressServer = getServer()

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

  async getPendingSubscriptions(req: Request, res: Response): Promise<Response> {
    try {
      const response = await this.adminService.getPendingSubscriptions()
      let status = !response.error ? 200 : 400
      return res.status(status).json(response)
    } catch (err: any) {
      return res.status(400).json({
        error: err.toString(),
      })
    }
  }

  async processSubscription(req: Request, res: Response): Promise<Response> {
    try {
      const datas = req.params
      const response = await this.adminService.processSubscription(datas.mailAddress)
      let status = !response.error ? 200 : 400
      return res.status(status).json(response)
    } catch (err: any) {
      return res.status(400).json({
        error: err.toString(),
      })
    }
  }

  async deleteSubscription(req: Request, res: Response): Promise<Response> {
    try {
      const datas = req.params
      const response = await this.adminService.deleteSubscription(datas.mailAddress)
      let status = !response.error ? 200 : 400
      return res.status(status).json(response)
    } catch (err: any) {
      return res.status(400).json({
        error: err.toString(),
      })
    }
  }
}
