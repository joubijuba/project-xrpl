import { Request, Response } from "express"
import { ResponseDto } from "../dtos/response.dto"
import z from "zod"

/**
 * An HTTP response builder for sugar syntax
 * @param response A responseDto object
 * @param res 
 * @returns HTTP response (with a 200 or 400 code)
 */
export function _responseBuilder(response: ResponseDto<any>, res: Response): Response {
  return res.status(!response.error ? 200 : 400).json(response)
}

/**
 * This middleware is controlling the body type of incoming POST http requests
 * @param schema a zod schema, which is defining a "type"
 * @returns an HTTP response (with code 400)
 */
export function _reqBodyChecker(schema: z.Schema<any>) {
  return (req: Request, res: Response, next: any) => {
    const body = req.body
    const isTypeOk = schema.safeParse(body)
    if (!isTypeOk.success) {
      return _responseBuilder(ResponseDto.ErrorResponse("Invalid body type / datas"), res)
    }
    next()
  }
}
