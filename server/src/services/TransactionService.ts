import { AccountSet, Client, Payment } from "xrpl"
import { xrplClient } from "../utils/clients"
import { AccountProps, PaymentProps, TxnOptions } from "../dtos/xrpl-models.dto"
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
    //Prepare the transaction JSON
    const accountset: AccountSet = {
      ...props,
      TransactionType: "AccountSet",
      Account: wallet.address,
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
  }
}
