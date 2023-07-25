import {
  AccountSet,
  Client,
  Payment,
} from "xrpl"
import { getClient } from "../clients/xrplClient"
import { AccountProps, PaymentProps } from "src/dtos/models"
import { TxnOptions } from "src/dtos/txn-options"

/* SERVICE CONTAINING ALL TRANSACTION LOGIC */

export class TransactionService {
  xrplClient: Client

  constructor() {
    this.xrplClient = getClient()
  }

  async simpleTransfer(props: PaymentProps, { wallet }: TxnOptions) {
    //Prepare the transaction JSON
    const payment: Payment = {
      ...props,
      TransactionType: "Payment",
      Account: wallet.address,
    }
    const prepared = await this.xrplClient.autofill(payment)

    //Sign
    const signed = wallet.sign(prepared)

    //Submit and wait for validation
    const response = await this.xrplClient.submitAndWait(signed.tx_blob)
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
    const prepared = await this.xrplClient.autofill(accountset)

    //Sign
    const signed = wallet.sign(prepared)

    //Submit and wait for validation
    const response = await this.xrplClient.submitAndWait(signed.tx_blob)
  }
}
