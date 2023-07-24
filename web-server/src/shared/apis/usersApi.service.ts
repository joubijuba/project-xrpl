import { ResponseDto } from "../models/ResponseDto";
import { SubscriptionDataDto } from "../models/dtos";
import { BaseApi } from "./base-api.service";

export class UsersApi extends BaseApi {

  public async queryTest(
    subscriptionData : SubscriptionDataDto
  ): Promise<ResponseDto<string>> {
    return this.postReq('/newSubscription', subscriptionData);
  }
}

export const usersApi = new UsersApi();