import { AccountSet, NFTokenMint, Payment } from "xrpl";

export interface SubscriptionDataDto {
  mailAddress: string;
  phoneNumber: string;
  name: string;
  kbis: string;
  description: string;
  status: string;
}

export type AccountProps = Omit<AccountSet, "TransactionType" | "Account">

export type PaymentProps = Omit<Payment, "TransactionType" | "Account">

export type MintNftProps = Omit<NFTokenMint, "TransactionType" | "Account" | "Flags">