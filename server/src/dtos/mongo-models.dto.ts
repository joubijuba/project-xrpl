import { z } from "zod"

/// Zod schema
export const ApplicationDataSchema = z.object({
  mailAddress: z.string().email(),
  phoneNumber: z.string().length(10),
  name: z.string().min(2),
  kbis: z.string().length(9),
  description: z.string().min(50).max(300),
  status: z.string(),
})

export type ApplicationDataDto = z.infer<typeof ApplicationDataSchema>

export const PresaleDataSchema = z.object({
  tokenTicker: z.string().min(2).max(5),
  totalTokensForSale: z.number().int(),
  totalTokensSold: z.number(),
  pricePerToken: z.number(), // in XRP
  limitPerAddress: z.number().int(), // in tokens or in XRP ?
  onGoing: z.boolean()
})

export type PresaleDataDto = z.infer<typeof PresaleDataSchema>