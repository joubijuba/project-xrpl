import { MongoClient } from "mongodb"
import { mongoClient } from "../clients/mongoClient"
import { SubscriptionDataDto } from "../dtos/models"

export default class UsersService {
  mongoClient: MongoClient

  constructor() {
    this.mongoClient = mongoClient
  }

  async processNewSubscription(datas: SubscriptionDataDto) {
    /// TO DO : CALL MONGOCLIENT METHODS TO CHECK IF MAIL-ADDRESS OR PHONE NUMBER MATCHING
    /// IF EXISTING : SEND ERROR MESSAGE (ALREADY EXISTING)
    /// IF NOT : ADD DATAS TO DB
  }
}
