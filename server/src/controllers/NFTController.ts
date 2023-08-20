import { getServer } from "../getServer"
import { Express, Request, Response } from "express"
import { _responseBuilder, _reqBodyChecker } from "../utils/express.utils"
import NFTService from "../services/NFTService"
import { NFTDatasDto, NFTDatasSchema } from "../dtos/nft-models.dto"
import { ResponseDto } from "../dtos/response.dto"
import fileUpload, { UploadedFile } from "express-fileupload"

export default class NFTController {
  nftService: NFTService
  expressServer: Express

  constructor() {
    this.nftService = new NFTService()
    this.expressServer = getServer()

    this.expressServer.post(
      "/mintNFT",
      _reqBodyChecker(NFTDatasSchema),
      async (req: Request, res: Response) => {
        return await this.mintNFT(req, res)
      }
    )
  }

  private async mintNFT(req: Request, res: Response): Promise<Response> {
    if (!req.files || !req.files.nftImage) {
      return _responseBuilder(ResponseDto.ErrorResponse("No image uploaded"), res)
    }
    const nftDatas: NFTDatasDto = {
      ...req.body,
      nftImage: req.files.nftImage as UploadedFile,
    }
    return _responseBuilder(await this.nftService.mintNFT(nftDatas), res)
  }
}
