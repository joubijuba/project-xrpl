import { getServer } from "../getServer"
import { Express, Request, Response } from "express"
import { _responseBuilder, _reqBodyChecker } from "../utils/express.utils"
import NFTService from "../services/NFTService"
import { NFTDatasDto, NFTDatasSchema } from "../dtos/nft-models.dto"
import { ResponseDto } from "../dtos/response.dto"
import fileUpload, { UploadedFile } from "express-fileupload"
import MongoService from "src/services/MongoService"

export default class NFTController {
  nftService: NFTService
  mongoService: MongoService
  expressServer: Express

  constructor() {
    this.nftService = new NFTService()
    this.mongoService = new MongoService()
    this.expressServer = getServer()

    this.expressServer.post(
      "/mintNFT",
      // _reqBodyChecker(NFTDatasSchema),
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

    const response = await this.nftService.mintNFT(nftDatas)
    if (response.error){
      return _responseBuilder(response, res)
    }
    return _responseBuilder(await this.mongoService.addNftUri(response.data!.tokenUri), res)
  }
}
