import { getServer } from "../getServer";
import { Express, Request, Response } from "express";
import UsersService from "../services/UsersService";

export default class UsersController {
  usersService: UsersService;
  expressServer: Express;

  constructor() {
    this.usersService = new UsersService();
    this.expressServer = getServer();

    this.expressServer.post(
      "/newSubscription",
      async (req: Request, res: Response) => {
        await this.processNewSubscription(req, res);
      }
    );
  }

  async processNewSubscription(req: Request, res: Response): Promise<Response> {
    try {
      const datas = req.body
      const response = await this.usersService.processNewSubscription(datas);
      return res.status(200).json(response);
    } catch (err: any) {
      return res.status(400).json({
        error: err.toString(),
      });
    }
  }
}
