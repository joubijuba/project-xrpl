import { Wallet, AccountSet, NFTokenMint, Payment, NFTokenCreateOffer, NFTokenAcceptOffer, NFTokenBurn } from "xrpl"

export type AccountProps = Omit<AccountSet, "TransactionType" | "Account">

export type PaymentProps = Omit<Payment, "TransactionType" | "Account">

export type MintNftProps = Omit<NFTokenMint, "TransactionType" | "Account" | "Flags">

export type CreateNftOfferProps = Omit<NFTokenCreateOffer, "TransactionType" | "Account">

export type NFTokenAcceptOfferprops = Omit<NFTokenAcceptOffer, "TransactionType" | "Account">

export type NFTokenBurnprops = Omit<NFTokenBurn, "TransactionType" | "Account" | "NFTokenID">

export type TxnOptions = {
  wallet: Wallet
  showLogs?: boolean
  multiSign?: boolean
}