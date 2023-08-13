import { z } from "zod"

/// Zod schema
export const SuscriptionDataSchema = z.object({
  mailAddress: z.string().email(),
  phoneNumber: z.string().length(10),
  name: z.string().min(2),
  kbis: z.string().length(9),
  description: z.string().min(50).max(300),
  status: z.string(),
})

export type SubscriptionDataDto = z.infer<typeof SuscriptionDataSchema>