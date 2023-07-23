import { Collection, Db, InsertOneResult, MongoClient } from "mongodb"
import { mongoClient } from "../clients/mongoClient"
import { SubscriptionDataDto } from "../dtos/models"
import { ResponseDto } from "../dtos/ResponseDto"

export default class UsersService {
  mongoClient: MongoClient
  collection: Collection

  constructor() {
    this.mongoClient = mongoClient
    this.collection = this.mongoClient.db("mobirent").collection("subscription")
  }

  async addNewSubscription(datas: Omit<SubscriptionDataDto, "status">): Promise<ResponseDto<string>> {
    try {
      const exists =
        await this.collection.find({ mailAddress: datas.mailAddress }).toArray() ??
        await this.collection.find({ phoneNumber : datas.phoneNumber }).toArray()
      if (exists.length !== 0) {
        return ResponseDto.ErrorResponse("ERROR : USER ALREADY EXISTS")
      }
      const newRecord: SubscriptionDataDto = {
        ...datas,
        status: "UNPROCESSED",
      }
      const res = await this.collection.insertOne(newRecord)
      if (res) {
        return ResponseDto.SuccessResponse("SUBSCRIPTION ADDED WITH SUCCESS")
      }
      return ResponseDto.ErrorResponse("ERROR : SOMETHING WENT WRONG");
    } catch (err: any) {
      return err
    }
  }
}