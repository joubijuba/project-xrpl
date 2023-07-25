import { getClient } from "../clients/xrplClient"
import {
  NFTokenMint,
  convertStringToHex,
  NFTokenMintFlags,
  NFTokenCreateOffer,
  NFTokenAcceptOffer,
  NFTokenBurn,
} from "xrpl"
import { TxnOptions } from "../dtos/txn-options"
import { autofill } from "xrpl/dist/npm/sugar"

const client = getClient()

type MintNftProps = Omit<NFTokenMint, "TransactionType" | "Account" | "Flags">
export const mintNft = async (
  { URI, NFTokenTaxon = 0, ...rest }: MintNftProps,
  { wallet }: TxnOptions
) => {
  //Prepare

  const nftMintTxn: NFTokenMint = {
    ...rest,
    NFTokenTaxon: 0,
    Flags: NFTokenMintFlags.tfTransferable,
    URI: convertStringToHex(URI ?? ""),
    Account: wallet.address,
    TransactionType: "NFTokenMint",
  }
  const prepared = await client.autofill(nftMintTxn)

  //Sign
  const signed = await wallet.sign(prepared)

  //Submit and wait
  const response = await client.submitAndWait(signed.tx_blob)
  console.log(response)

  return response
}

type CreateNftOfferProps = Omit<NFTokenCreateOffer, "TransactionType" | "Account">
export const creatNftOffer = async (props: CreateNftOfferProps, { wallet }: TxnOptions) => {
  //Prepare
  const offerTxn: NFTokenCreateOffer = {
    ...props,
    Account: wallet.address,
    TransactionType: "NFTokenCreateOffer",
  }

  //Joiting  autofill, sign and submit wait
  const result = await client.submitAndWait(offerTxn, {
    autofill: true,
    wallet,
  })

  console.log(result)
  return result
}

type NFTokenAcceptOfferprops = Omit<NFTokenAcceptOffer, "TransactionType" | "Account">

export const acceptNftOffer = async (prop: NFTokenAcceptOfferprops, { wallet }: TxnOptions) => {
  //Prepare
  const acceptTxn: NFTokenAcceptOffer = {
    ...prop,
    TransactionType: "NFTokenAcceptOffer",
    Account: wallet.address,
  }
  //Autofill, Sign and submit wait
  const result = await client.submitAndWait(acceptTxn, {
    autofill: true,
    wallet,
  })

  console.log(result)
  return result
}

type NFTokenBurnprops = Omit<NFTokenBurn, "TransactionType" | "Account" | "NFTokenID">

// Si besoin de supprimer un nft changer l'id du NFTokentID.

export const BurnNft = async (prop: NFTokenBurnprops, { wallet }: TxnOptions) => {
  //Prepare
  const burnTxn: NFTokenBurn = {
    ...prop,
    TransactionType: "NFTokenBurn",
    Account: wallet.address,
    NFTokenID: "00080000CC0E1F88224B66C059898BE505430197BF9A38562DCBAB9D00000002",
  }
  //Autofill, Sign and submit wait
  const result = await client.submitAndWait(burnTxn, {
    autofill: true,
    wallet,
  })

  console.log(result)
  return result
}