import { getServer } from "../getServer"
import { Express, Request, Response } from "express"
import AdminService from "src/services/AdminService"

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
      const datas = await this.adminService.getPendingSubscriptions()
      return res.status(200).json(datas)
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
      return res.status(200).json(response)
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
      if (!response.error && response.status) {
        return res.status(200).json(response)
      }
      if (response.error) {
        return res.status(400).json({ error: response.status.toString() })
      }
      return res.status(200).json(response)
    } catch (err: any) {
      return res.status(400).json({
        error: err.toString(),
      })
    }
  }
}
