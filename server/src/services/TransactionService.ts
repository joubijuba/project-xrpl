import { AccountSet, Payment, TrustSet, TxResponse, Wallet } from "xrpl"
import { xrplClient, xummClient } from "../utils/clients"
import { AccountProps, TxnOptions } from "../dtos/xrpl-models.dto"
import { ResponseDto } from "../dtos/response.dto"
import { WALLET_1, WALLET_2 } from "../utils/wallet.utils"
import { BuyOrderDataDto, TokenMintDataDto } from "../dtos/transactions-models.dto"
import { Collection } from "mongodb"
import { mongoClient } from "../utils/clients"
import { TokenSaleDataDto } from "../dtos/mongo-models.dto"

export default class TransactionService {
  presalesCollection: Collection

  constructor() {
    this.presalesCollection = mongoClient.db("mobirent").collection("presales")
  }

  /**
   * Tx submitter
   * @param tx : the transaction details
   * @param wallet : the wallet signing the tx
   * @returns
   */
  private async submitTx(tx: any, wallet: Wallet): Promise<TxResponse> {
    xrplClient.connect()
    const prepared = await xrplClient.autofill(tx)
    const signed = WALLET_2.sign(prepared)
    const response = await xrplClient.submitAndWait(signed.tx_blob)
    xrplClient.disconnect()
    return response
  }

  async setIssuerAccount() {
    try {
      const accountSet: AccountSet = {
        TransactionType: "AccountSet",
        Account: WALLET_2.address,
        TransferRate: 0,
        TickSize: 5,
        Domain: "6578616D706C652E636F6D", // "example.com"
        //SetFlag: xrpl.AccountSetAsfFlags.asfDefaultRipple,
      }

      const txResponse = await this.submitTx(accountSet, WALLET_2)

      if (txResponse.result.validated) {
        return ResponseDto.SuccessResponse("SUCESSFULLY SET ISSUER ACCOUNT")
      }

      return ResponseDto.ErrorResponse("TX DIDNT GO THROUGHT")
    } catch (err: any) {
      return ResponseDto.ErrorResponse(err.toString())
    }
  }

  async setHotWallet() {
    try {
      const hot_settings_tx: AccountSet = {
        TransactionType: "AccountSet",
        Account: WALLET_1.address,
        TransferRate: 0,
        TickSize: 5,
        Domain: "6578616D706C652E636F6D", // "example.com"
        //SetFlag: xrpl.AccountSetAsfFlags.asfDefaultRipple,
      }

      const txResponse = await this.submitTx(hot_settings_tx, WALLET_1)

      if (txResponse.result.validated) {
        return ResponseDto.SuccessResponse("SUCESSFULLY SET HOT WALLET")
      }

      return ResponseDto.SuccessResponse("TX DIDNT GO THROUGHT")
    } catch (err: any) {
      return ResponseDto.ErrorResponse(err.toString())
    }
  }

  //Trustline from hot to cold address
  async CreateTrustline(tokenMintData: TokenMintDataDto) {
    try {
      const trust_set_tx: TrustSet = {
        TransactionType: "TrustSet",
        Account: WALLET_1.address,
        LimitAmount: {
          currency: tokenMintData.tokenTicker,
          issuer: WALLET_2.address,
          value: tokenMintData.tokenSupply, // Large limit, arbitrarily chosen
        },
      }

      const txResponse = await this.submitTx(trust_set_tx, WALLET_1)

      if (txResponse.result.validated) {
        return ResponseDto.SuccessResponse("SUCESSFULLY SET HOT WALLET")
      }
    } catch (err: any) {
      return ResponseDto.ErrorResponse(err.toString())
    }
  }

  async mintTokens(tokenMintData: TokenMintDataDto): Promise<ResponseDto<string>> {
    /// TO DO : call the functions to mint the tokens
    return ResponseDto.SuccessResponse("SUCCESSFLLY MINTED TOKENS")
  }

  private async sendXRPToPresaleWallet(
    buyOrderData: BuyOrderDataDto
  ): Promise<ResponseDto<string>> {
    const request: any = {
      txjson: {
        TransactionType: "Payment",
        Destination: WALLET_1.address,
        Amount: buyOrderData.amountInXrp, // drops
      },
      user_token: buyOrderData.userToken,
    }
    await xummClient.ping()

    // The callback function inside createAndSubscribe is ran asyncronously.
    // It will keep running until either the inner timeout is over OR the user signs / declines the TX inside,
    // it's watching this particular event (user signing / declining tx). Everytime that a "new event" is emitted
    // on the XUMM server side, it triggers our callback function probably thanks to a w:s that is watching
    // the event ?
    const subscription = await xummClient.payload.createAndSubscribe(request, (event) => {
      // The event data contains a property 'signed' (true or false)
      if (Object.keys(event.data).indexOf("signed") > -1) {
        return event.data
      }
    })
    const resolveData: any = await subscription.resolved /// Resolved promise

    if (!resolveData.signed) {
      return ResponseDto.ErrorResponse("TX hasn't been signed in the app")
    }

    const result = await xummClient.payload.get(resolveData.payload_uuidv4)

    return ResponseDto.SuccessResponse("Successfully bought tokens", result!.response.txid!)
  }

  private async sendTokensToBuyer(buyOrderData: BuyOrderDataDto): Promise<ResponseDto<string>> {
    const payment: Payment = {
      TransactionType: "Payment",
      Account: WALLET_1.address,
      Destination: buyOrderData.userAddress,
      Amount: {
        currency: buyOrderData.tokenTicker,
        issuer: WALLET_2.address,
        value: "ToBeCalculated",
      },
    }

    const txResponse = await this.submitTx(payment, WALLET_1)

    if (!txResponse.result.validated) {
      return ResponseDto.ErrorResponse("The server didn't manage to send tokens to your address")
    }
    return ResponseDto.SuccessResponse(txResponse.result.hash)
  }
  /// Need to write "paybackBuyer" func that will handle reimbursements in case of sendTokensToBuyer
  // fail

  async buyTokens(buyOrderData: BuyOrderDataDto): Promise<ResponseDto<string>> {
    const res = await this.sendXRPToPresaleWallet(buyOrderData)
    if (res.error) {
      return res
    }
    const res2 = await this.sendTokensToBuyer(buyOrderData)
    if (res2.error) {
      return res
    }
    return ResponseDto.SuccessResponse(
      `You successfully bought tokens, those are your tx receipts : ${res.data}, ${res2.data}`
    )
  }

  async fetchOnGoingSales(): Promise<ResponseDto<TokenSaleDataDto[]>> {
    try {
      const records = (await this.presalesCollection
        .find({ onGoing: true })
        .project({ projection: { _id: 0 } })
        .toArray()) as TokenSaleDataDto[]
      if (!records.length) {
        return ResponseDto.ErrorResponse("NO ONGOING PRESALE")
      }
      return ResponseDto.SuccessResponse("SUCCESSFULLY FETCHED ONGOING PRESALES", records)
    } catch (err: any) {
      return ResponseDto.ErrorResponse(err.toString())
    }
  }

  // async setSellOrder(
  //   sellOrdersInstruction: SellOrdersInstructionDto
  // ): Promise<ResponseDto<string>> {
  //   try {
  //     const { amountForSale, sellOrderPrice, tokenTicker } = sellOrdersInstruction
  //     const setSellOrder: OfferCreate = {
  //       TransactionType: "OfferCreate",
  //       Account: WALLET_1.address,
  //       Fee: "12",
  //       Flags: 0,
  //       LastLedgerSequence: 7108682,
  //       Sequence: 8,
  //       TakerGets: {
  //         currency: tokenTicker,
  //         issuer: WALLET_2.address,
  //         value: amountForSale.toString(), // number of tokens sold in the sell order
  //       },
  //       TakerPays: sellOrderPrice.toString(), // in drops
  //       AccountTxnID: "SomeHashTx",
  //     }

  //     xrplClient.connect()
  //     // let j = 1
  //     // while (j <= totalSellOrders) {
  //     const prepared = await xrplClient.autofill(setSellOrder)
  //     const signed = WALLET_1.sign(prepared)
  //     const response = await xrplClient.submitAndWait(signed.tx_blob)
  //     if (!response.result.validated) {
  //       return ResponseDto.ErrorResponse(
  //         // `Sell order ${j} failed, of a total of ${totalSellOrders}`
  //         "Sell order failed"
  //       )
  //     }
  //     // if (j === 2) {
  //     //   // FOR TEST : To see response content
  //     //   console.log(response)
  //     // }
  //     // }
  //     xrplClient.disconnect()
  //     return ResponseDto.SuccessResponse(undefined, "Sell order set and fullfilled")
  //   } catch (err: any) {
  //     return ResponseDto.ErrorResponse(err.toString())
  //   }
  // }
}
