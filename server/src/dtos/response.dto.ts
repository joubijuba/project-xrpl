export class ResponseDto<R> {
  data?: R
  status: string
  error: boolean

  constructor(status: string, error: boolean) {
    this.status = status;
    this.error = error;
  }

  static ErrorResponse <R>(status: string): ResponseDto<R> {
    return new ResponseDto(
      status, true
    )
  }

  static SuccessResponse <R>(status : string, data?: R): ResponseDto<R> {
    const response = new ResponseDto(status, false)
    if (data){
      response.data = data;
    }
    return response as ResponseDto<R>;
  }
}