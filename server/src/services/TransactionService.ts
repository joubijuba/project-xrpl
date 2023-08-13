import { AccountSet, Client, Payment } from "xrpl"
import { xrplClient } from "../utils/clients"
import { AccountProps, PaymentProps, TxnOptions } from "../dtos/xrpl-models.dto"
import { ResponseDto } from "../dtos/response.dto"
import { WALLET_2 } from "../utils/wallet.utils"
/* SERVICE CONTAINING ALL TRANSACTION LOGIC */

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
      const accountset: AccountSet = {
        ...props,
        TransactionType: "AccountSet",
        Account: WALLET_2.address,
        TransferRate: 0,
        TickSize: 5,
        Domain: "6578616D706C652E636F6D", // "example.com"
        //SetFlag: xrpl.AccountSetAsfFlags.asfDefaultRipple,
      }
      const prepared = await xrplClient.autofill(accountset)

      //Sign
      const signed = wallet.sign(prepared)

      //Submit and wait for validation
      const response = await xrplClient.submitAndWait(signed.tx_blob)
      if (response.result.validated) {
        return ResponseDto.SuccessResponse("SUCESSFULLY SET ACCOUNT")
      }
      return ResponseDto.SuccessResponse("TX DIDNT GO THROUGHT")
    } catch (err: any) {
      return ResponseDto.ErrorResponse(err.toString())
    }
  }
}
