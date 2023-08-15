import z from "zod"

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
  userAddress: z.string(),
  amountInXrp: z.number().int(),
  tokenTicker: z.string().min(2).max(5)
})

export type BuyOrderDataDto = z.infer<typeof BuyOrderDataSchema>