export class ResponseDto<R> {
  data?: R
  status?: string
  error: boolean

  constructor(error: boolean, status?: string, ) {
    this.status = status;
    this.error = error;
  }

  static ErrorResponse <R>(status: string): ResponseDto<R> {
    return new ResponseDto(
      true, status
    )
  }

  static SuccessResponse <R>(status? : string, data?: R): ResponseDto<R> {
    const response = new ResponseDto(false, status)
    if (data){
      response.data = data;
    }
    return response as ResponseDto<R>;
  }
}