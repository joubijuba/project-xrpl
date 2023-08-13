import { Request, Response } from "express"
import { ResponseDto } from "../dtos/response.dto"
import z from "zod"

export function _responseBuilder(response: ResponseDto<any>, res: Response): Response {
  return res.status(!response.error ? 200 : 400).json(response)
}

export function _reqBodyChecker(schema: z.Schema<any>) {
  return (req: Request, res: Response, next: any) => {
    const body = req.body
    const isTypeOk = schema.safeParse(body)
    if (!isTypeOk.success) {
      return _responseBuilder(ResponseDto.ErrorResponse("Invalid body type"), res)
    }
    next()
  }
}
