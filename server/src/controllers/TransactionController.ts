import { getServer } from "../getServer"
import { Express, Request, Response } from "express"
import { _responseBuilder, _reqBodyChecker } from "../utils/express.utils"
import TransactionService from "../services/TransactionService"
import {
  BuyOrderDataDto,
  BuyOrderDataSchema,
  TokenMintDataSchema,
} from "../dtos/transactions-models.dto"
import { _setFetchedOnGoingSales, _setOnGoingSales, fetchedOnGoingSales, onGoingSales } from "../utils/sales.utils"
import { ResponseDto } from "../dtos/response.dto"

export default class TransactionController {
  transactionService: TransactionService
  expressServer: Express

  constructor() {
    this.transactionService = new TransactionService()
    this.expressServer = getServer()

    this.expressServer.post(
      "/mintTokens",
      _reqBodyChecker(TokenMintDataSchema),
      async (req: Request, res: Response) => {
        const response = await this.transactionService.mintTokens(req.body)
        return _responseBuilder(response, res)
      }
    )

    this.expressServer.get(
      "/buyTokens",
      _reqBodyChecker(BuyOrderDataSchema),
      async (req: Request, res: Response) => {
        const response = await this.buyTokens(req.body)
        return _responseBuilder(response, res)
      }
    )
  }

  private async buyTokens(buyOrderData: BuyOrderDataDto): Promise<ResponseDto<string>> {
    if (!fetchedOnGoingSales) {
      const res = await this.transactionService.fetchOnGoingSales()
      if (res.error) {
        return ResponseDto.ErrorResponse(res.status!)
      }
      _setOnGoingSales(res.data!)
      _setFetchedOnGoingSales(true)
    }
    const tokenSaleData = onGoingSales.get(buyOrderData.tokenTicker)
    if (!tokenSaleData) {
      return ResponseDto.ErrorResponse("There is no ongoing presale for this token")
    }
    const response = await this.transactionService.buyTokens(buyOrderData)
    return response
  }
}
