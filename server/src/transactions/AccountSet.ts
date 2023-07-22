
//Configuration du compte emeteur des tokens qui est l'owner du site "MobiRent"

import { TxnOptions } from "../models";
import { getClient } from "../xrpl-client";

import { AccountSet } from "xrpl";

const client = getClient()

type AccountProps = Omit<AccountSet, "TransactionType" | "Account">

export const CreatToken = async (props: AccountProps, {wallet}: TxnOptions) => {
    //Prepare the transaction JSON
    const accountset: AccountSet = {
        ...props,
        TransactionType : "AccountSet",
        Account: wallet.address,
        TransferRate: 0,
        TickSize: 5,
        Domain: "6578616D706C652E636F6D", // "example.com"
        //SetFlag: xrpl.AccountSetAsfFlags.asfDefaultRipple,
    }
    const prepared = await client.autofill(accountset)

//Sign
    const signed = wallet.sign(prepared)

//Submit and wait for validation
    const response = await client.submitAndWait(signed.tx_blob)
    console.log(response)
} 