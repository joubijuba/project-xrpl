import { UploadedFile } from "express-fileupload"
import z from "zod"

export const NFTDatasSchema = z.object({
  companyName: z.string().min(2),
  KBIS: z.string().length(9),
  minimumProfit: z.string().regex(/^([0-9]|[1-9][0-9]|100)%$/), //% between 0 and 100
})

export type NFTDatasDto = z.infer<typeof NFTDatasSchema> & {
  nftImage: UploadedFile
}
