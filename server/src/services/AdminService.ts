import { Collection, Db, Document, InsertOneResult, MongoClient, WithId } from "mongodb"
import { mongoClient } from "../clients/mongoClient"
import { SubscriptionDataDto } from "../dtos/models"
import { ResponseDto } from "../dtos/ResponseDto"

export default class AdminService {
  mongoClient: MongoClient
  collection: Collection

  constructor() {
    this.mongoClient = mongoClient
    this.collection = this.mongoClient.db("mobirent").collection("subscription")
  }

  async getPendingSubscriptions(): Promise<WithId<Document>[]> {
    try {
      const records = this.collection.find({ status : "UNPROCESSED"});
      console.log(records.toArray)
      return records.toArray();
    }
    catch(e: any){
      return e
    }
  }

  async processSubscription(mailAddress: string): Promise<string> {
    try {
      const record = this.collection.find({ mailAddress })
      if (record!) {
        throw new Error("ERROR : USER ALREADY EXISTS");
      }
      const updatedRecord = await this.collection.updateOne(
        { mailAddress },
        { $set: { status: "PROCESSED" } }
      )
      if (updatedRecord){
        return "UPDATE : ITEM UPDATED WITH SUCCESS";
      }
      throw new Error("ERROR : SOMETHING WENT WRONG")
    } catch (err: any) {
      return err
    }
  }

  async deleteSubscription(mailAddress: string): Promise<ResponseDto<string>> {
    try {
      const record = this.collection.find({ mailAddress })
      if (record!) {
        return ResponseDto.ErrorResponse("ERROR : USER DOESNT EXISTS")
      }
      const deletedRecord = await this.collection.deleteOne({ mailAddress })
      if (deletedRecord){
        return ResponseDto.SuccessResponse("DELETE : ITEM DELETED WITH SUCCESS", mailAddress)
      }
      return ResponseDto.ErrorResponse("ERROR : SOMETHING WENT WRONG")
    } catch (err: any) {
      return err
    }
  }
}