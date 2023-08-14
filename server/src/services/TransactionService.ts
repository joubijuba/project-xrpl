import { AccountSet, Client, Payment, TrustSet } from "xrpl"
import { xrplClient } from "../utils/clients"
import { AccountProps, PaymentProps, TxnOptions } from "../dtos/xrpl-models.dto"
import { ResponseDto } from "../dtos/response.dto"
import { WALLET_2, WALLET_1 } from "../utils/wallet.utils"
/* SERVICE CONTAINING ALL TRANSACTION LOGIC */
const hot_wallet = WALLET_1
const cold_wallet = WALLET_2

export default class TransactionService {
  async simpleTransfer(props: PaymentProps, { wallet }: TxnOptions) {
    //Prepare the transaction JSON
    const payment: Payment = {
      ...props,
      TransactionType: "Payment",
      Account: wallet.address,
    }
    const prepared = await xrplClient.autofill(payment)

    //Sign
    const signed = wallet.sign(prepared)

    //Submit and wait for validation
    const response = await xrplClient.submitAndWait(signed.tx_blob)
  }

  async setIssuerAccount(props: AccountProps, { wallet }: TxnOptions) {
    try {
      //Prepare the transaction JSON
      const cold_settings_tx: AccountSet = {
        TransactionType: "AccountSet",
        Account: cold_wallet.address,
        TransferRate: 0,
        TickSize: 5,
        Domain: "6578616D706C652E636F6D", // "example.com"
        //SetFlag: xrpl.AccountSetAsfFlags.asfDefaultRipple,
      }
      const cst_prepared = await xrplClient.autofill(cold_settings_tx)

      //Sign
      const cst_signed = cold_wallet.sign(cst_prepared)

      //Submit and wait for validation
      const response = await xrplClient.submitAndWait(cst_signed.tx_blob)
      if (response.result.validated) {
        return ResponseDto.SuccessResponse("SUCESSFULLY SET ACCOUNT")
      }
      return ResponseDto.SuccessResponse("TX DIDNT GO THROUGHT")
    } catch (err: any) {
      return ResponseDto.ErrorResponse(err.toString())
    }
  }

  async setHotWallet(props: AccountProps, { wallet }: TxnOptions) {
    try {
      const hot_settings_tx: AccountSet = {
        TransactionType: "AccountSet",
        Account: hot_wallet.address,
        TransferRate: 0,
        TickSize: 5,
        Domain: "6578616D706C652E636F6D", // "example.com"
        //SetFlag: xrpl.AccountSetAsfFlags.asfDefaultRipple,
      }
      const hst_prepared = await xrplClient.autofill(hot_settings_tx)
      const hst_signed = hot_wallet.sign(hst_prepared)
      const response = await xrplClient.submitAndWait(hst_signed.tx_blob)
      if (response.result.validated) {
        return ResponseDto.SuccessResponse("SUCESSFULLY SET ACCOUNT")
      }
      return ResponseDto.SuccessResponse("TX DIDNT GO THROUGHT")
    } catch (err: any) {
      return ResponseDto.ErrorResponse(err.toString())
    }
  }

  //Trustline from hot to cold address
  async CreateTrustline(props: AccountProps, { wallet }: TxnOptions) {
    try {
      const currency_code = "FOO"
      const trust_set_tx: TrustSet = {
        TransactionType: "TrustSet",
        Account: hot_wallet.address,
        LimitAmount: {
          currency: currency_code,
          issuer: cold_wallet.address,
          value: "10000000000", // Large limit, arbitrarily chosen
        },
      }
      const ts_prepared = await xrplClient.autofill(trust_set_tx)
      const ts_signed = hot_wallet.sign(ts_prepared)
      const response = await xrplClient.submitAndWait(ts_signed.tx_blob)
    } catch (err: any) {
      return ResponseDto.ErrorResponse(err.toString())
    }
  }
}
