import { Collection, Db, InsertOneResult, MongoClient } from "mongodb"
import { mongoClient } from "../clients/mongoClient"
import { SubscriptionDataDto } from "../dtos/models"

export default class UsersService {
  mongoClient: MongoClient
  collection: Collection

  constructor() {
    this.mongoClient = mongoClient
    this.collection = this.mongoClient.db("mobirent").collection("subscription")
  }

  async addNewSubscription(datas: Omit<SubscriptionDataDto, "status">): Promise<string> {
    try {
      const exists =
        this.collection.find({ mailAddress: datas.mailAddress }) ??
        this.collection.find({ mailAddress: datas.mailAddress })
      if (exists) {
        throw new Error("ITEM ALREADY EXISTS");
      }
      const newRecord: SubscriptionDataDto = {
        ...datas,
        status: "UNPROCESSED",
      }
      const res = await this.collection.insertOne(newRecord)
      if (res) {
        return "CREATE : ITEM ADDED WITH SUCCESS"
      }
      throw new Error("ITEM ALREADY EXISTS");
    } catch (err: any) {
      return err
    }
  }
}