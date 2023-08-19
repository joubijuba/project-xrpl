import { getServer } from "../getServer"
import { Express, Request, Response } from "express"
import { _responseBuilder, _reqBodyChecker } from "../utils/express.utils"
import TransactionService from "../services/TransactionService"
import {
  BuyOrderDataDto,
  BuyOrderDataSchema,
  TokenMintDataSchema,
} from "../dtos/transactions-models.dto"
import {
  _setFetchedOnGoingPresales,
  _setHasUserSubmittedATx,
  _setOnGoingPresales,
  fetchedOnGoingPresales,
  hasUserSubmittedATx,
  onGoingPresales,
} from "../utils/presales.utils"
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
      _reqBodyChecker(BuyOrderDataSchema.omit({ tokensAmount: true })),
      async (req: Request, res: Response) => {
        const response = await this.buyTokens(req.body)
        return _responseBuilder(response, res)
      }
    )
  }

  private async buyTokens(buyOrderData: BuyOrderDataDto): Promise<ResponseDto<string>> {
    let _amountInXrp: number
    let res: any
    const { userAddress, amountInXrp, tokenTicker } = buyOrderData

    if (hasUserSubmittedATx.get(userAddress)) {
      return ResponseDto.ErrorResponse("You already submitted a transaction")
    }
    // To avoid 'reentrancy'
    hasUserSubmittedATx.set(userAddress, true)

    if (!fetchedOnGoingPresales) {
      res = await this.transactionService.fetchOnGoingPresales()
      if (res.error) {
        return ResponseDto.ErrorResponse(res.status!)
      }
      _setOnGoingPresales(res.data!)
      _setFetchedOnGoingPresales(true)
    }

    const presaleData = onGoingPresales.get(tokenTicker)
    if (!presaleData) {
      return ResponseDto.ErrorResponse("There is no ongoing presale for this token")
    }
    const { totalTokensForSale, totalTokensSold, pricePerToken, limitPerAddress } = presaleData

    res = await this.transactionService.getUserAmountBought(userAddress)
    if (res.error) {
      hasUserSubmittedATx.set(userAddress, false)
      return ResponseDto.ErrorResponse(
        "UNABLE TO PROCEED THE TRANSACTION AS SERVER UNABLE TO FETCH USERS CONTRIBUTION"
      )
    }

    // If no more tokens to sell
    if (totalTokensSold === totalTokensForSale) {
      return ResponseDto.ErrorResponse("THE LIMIT HAS BEEN REACHED FOR THIS PRESALE")
    }

    // Now define how much the user can buy
    const userAmountBought = res.data!
    if (userAmountBought === limitPerAddress) {
      return ResponseDto.ErrorResponse("YOU REACHED THE MAX CAP PER USER")
    }
    if (userAmountBought === 0) {
      _amountInXrp = amountInXrp > limitPerAddress ? limitPerAddress : amountInXrp
    } else if (userAmountBought + amountInXrp <= limitPerAddress) {
      _amountInXrp = amountInXrp
    } else {
      _amountInXrp = limitPerAddress - userAmountBought
    }

    // Amount of tokens to be transferred to the buyer address
    const tokensAmount = (_amountInXrp / pricePerToken).toString()

    res = await this.transactionService.buyTokens({
      ...buyOrderData,
      amountInXrp: _amountInXrp * 1000000,
      tokensAmount,
    })

    if (res.error!) {
      _setHasUserSubmittedATx(userAddress, false)
      return res
    }
    await this.transactionService.updateUserAmountBought(
      userAddress,
      _amountInXrp + userAmountBought
    )

    // TO DO : Update onGoingPresales in order to avoid going above totalTokensForSale

    return res
  }
}
