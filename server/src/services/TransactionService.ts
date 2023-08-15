import {
  AccountSet,
  AccountSetAsfFlags,
  AccountSetTfFlags,
  Payment,
  TrustSet,
  TxResponse,
  Wallet,
} from "xrpl"
import { xrplClient, xummClient } from "../utils/clients"
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
  private async _submitTx(tx: any, wallet: Wallet): Promise<TxResponse> {
    const prepared = await xrplClient.autofill(tx)
    const signed = wallet.sign(prepared)
    return await xrplClient.submitAndWait(signed.tx_blob)
  }

  private async _setIssuerAccount(): Promise<ResponseDto<string>> {
    try {
      const accountSet: AccountSet = {
        TransactionType: "AccountSet",
        Account: WALLET_2.address,
        TransferRate: 0,
        TickSize: 5,
        Domain: "6578616D706C652E636F6D", // "example.com"
        SetFlag: AccountSetAsfFlags.asfDefaultRipple,
        Flags: AccountSetTfFlags.tfDisallowXRP | AccountSetTfFlags.tfRequireDestTag,
      }

      const txResponse = await this._submitTx(accountSet, WALLET_2)

      if (txResponse.result.validated) {
        console.log("hahaha")
        return ResponseDto.SuccessResponse("SUCESSFULLY SET ISSUER ACCOUNT")
      }

      return ResponseDto.ErrorResponse("TX DIDNT GO THROUGHT")
    } catch (err: any) {
      return ResponseDto.ErrorResponse(err.toString())
    }
  }

  private async _setHotWallet(): Promise<ResponseDto<string>> {
    try {
      const hot_settings_tx: AccountSet = {
        TransactionType: "AccountSet",
        Account: WALLET_1.address,
        TransferRate: 0,
        TickSize: 5,
        Domain: "6578616D706C652E636F6D", // "example.com"
        SetFlag: AccountSetAsfFlags.asfDefaultRipple,
        Flags: AccountSetTfFlags.tfDisallowXRP | AccountSetTfFlags.tfRequireDestTag,
      }

      const txResponse = await this._submitTx(hot_settings_tx, WALLET_1)

      if (txResponse.result.validated) {
        console.log("hahaha")
        return ResponseDto.SuccessResponse("SUCESSFULLY SET HOT WALLET")
      }

      return ResponseDto.SuccessResponse("TX DIDNT GO THROUGHT")
    } catch (err: any) {
      return ResponseDto.ErrorResponse(err.toString())
    }
  }

  //Trustline from hot to cold address
  private async _setTrustline(tokenMintData: TokenMintDataDto): Promise<ResponseDto<string>> {
    try {
      const trust_set_tx: TrustSet = {
        TransactionType: "TrustSet",
        Account: WALLET_1.address,
        LimitAmount: {
          currency: tokenMintData.tokenTicker,
          issuer: WALLET_2.address,
          value: "10000000000",
        },
        Flags: 2147483648,
      }

      const txResponse = await this._submitTx(trust_set_tx, WALLET_1)

      if (txResponse.result.validated) {
        console.log("hahaha")
        return ResponseDto.SuccessResponse("SUCESSFULLY SET TRUST LINE")
      }

      return ResponseDto.ErrorResponse("TX DIDNT GO THROUGHT")
    } catch (err: any) {
      return ResponseDto.ErrorResponse(err.toString())
    }
  }

  private async _fromColdToHotWallet(
    tokenMintData: TokenMintDataDto
  ): Promise<ResponseDto<string>> {
    try {
      const send_token_tx: Payment = {
        TransactionType: "Payment",
        Account: WALLET_2.address,
        Amount: {
          currency: tokenMintData.tokenTicker,
          value: tokenMintData.tokenSupply,
          issuer: WALLET_2.address,
        },
        Destination: WALLET_1.address,
        DestinationTag: 1,
        Flags: 2147483648,
      }

      const txResponse = await this._submitTx(send_token_tx, WALLET_2)

      if (txResponse.result.validated) {
        console.log("hahaha")
        return ResponseDto.SuccessResponse(
          `You successfully minted ${tokenMintData.tokenSupply} ${tokenMintData.tokenTicker}`
        )
      }

      return ResponseDto.ErrorResponse("TX DIDNT GO THROUGHT")
    } catch (err: any) {
      return ResponseDto.ErrorResponse(err.toString())
    }
  }

  async mintTokens(tokenMintData: TokenMintDataDto): Promise<ResponseDto<string>> {
    await xrplClient.connect()

    /// Need to make sequential requests as we need to strictly respect the below order
    const res1 = await this._setIssuerAccount()
    if (res1.error) {
      return res1
    }
    const res2 = await this._setHotWallet()
    if (res2.error) {
      return res2
    }
    const res3 = await this._setTrustline(tokenMintData)
    if (res3.error) {
      return res3
    }
    const res = await this._fromColdToHotWallet(tokenMintData)

    xrplClient.disconnect()

    return res
  }

  private async sendXRPToPresaleWallet(
    buyOrderData: BuyOrderDataDto
  ): Promise<ResponseDto<string>> {
    try {
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

      // need to see if this corresponds to a successful tx or just a signed tx (successful or not)
      if (!resolveData.signed) {
        return ResponseDto.ErrorResponse("TX hasn't been signed in the app")
      }

      const result = await xummClient.payload.get(resolveData.payload_uuidv4)

      return ResponseDto.SuccessResponse("Successfully bought tokens", result!.response.txid!)
    } catch (err: any) {
      return ResponseDto.ErrorResponse(err.toString())
    }
  }

  private async sendTokensToBuyer(buyOrderData: BuyOrderDataDto): Promise<ResponseDto<string>> {
    try {
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

      await xrplClient.connect()

      const txResponse = await this._submitTx(payment, WALLET_1)

      await xrplClient.disconnect()

      if (!txResponse.result.validated) {
        return ResponseDto.ErrorResponse("The server didn't manage to send tokens to your address")
      }
      return ResponseDto.SuccessResponse(txResponse.result.hash)
    } catch (err: any) {
      return ResponseDto.ErrorResponse(err.toString())
    }
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
