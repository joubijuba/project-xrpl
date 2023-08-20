import z from "zod"
import { isValidAddress } from "xrpl"
import { ResponseDto } from "./response.dto"

const _isValidAddress = (address: string) => {
  if (isValidAddress(address)) {
    return address
  }
  return ResponseDto.ErrorResponse("Invalid address")
}

// export const SellOrdersInstructionSchema = z.object({
//   // totalSellOrders: z.number().int(),
//   txHash: z.string(),
//   amountForSale: z.number().int(),
//   sellOrderPrice: z.number().int(),
//   tokenTicker: z.string(),
// })

// export type SellOrdersInstructionDto = z.infer<typeof SellOrdersInstructionSchema>

export const TokenMintDataSchema = z.object({
  tokenTicker: z.string(),
  tokenSupply: z.string(),
})

export type TokenMintDataDto = z.infer<typeof TokenMintDataSchema>

export const BuyOrderDataSchema = z.object({
  userToken: z.string(),
  userAddress: z.string().refine((userAddress) => _isValidAddress(userAddress)),
  amountInXrp: z.number().int(),
  tokenTicker: z.string().min(2).max(5),
  tokensAmount: z.string()
})

export type BuyOrderDataDto = z.infer<typeof BuyOrderDataSchema>

export interface UserParticipationDataDto {
  address: string,
  amountBought: number,
  tokenTicker: string // foreign key referring to presales table
}