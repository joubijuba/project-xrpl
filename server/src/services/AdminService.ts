import { Collection, Db, Document, InsertOneResult, MongoClient, WithId } from "mongodb"
import { mongoClient } from "../clients/mongoClient"
import { ResponseDto } from "../dtos/ResponseDto"

export default class AdminService {
  mongoClient: MongoClient
  collection: Collection

  constructor() {
    this.mongoClient = mongoClient
    this.collection = this.mongoClient.db("mobirent").collection("subscription")
  }

  async getPendingSubscriptions(): Promise<ResponseDto<WithId<Document>[]>> {
    try {
      const records = await this.collection.find({ status: "UNPROCESSED" }).toArray()
      console.log(records)
      return ResponseDto.SuccessResponse("SUCCESSFUL REQUEST", records)
    } catch (e: any) {
      return e
    }
  }

  async processSubscription(mailAddress: string): Promise<ResponseDto<string>> {
    try {
      const record = await this.collection.find({ mailAddress }).toArray()
      if (record.length === 0) {
        return ResponseDto.ErrorResponse("ERROR : USER DOESNT EXIST")
      }
      const updatedRecord = await this.collection.updateOne(
        { mailAddress },
        { $set: { status: "PROCESSED" } }
      )
      if (updatedRecord) {
        return ResponseDto.SuccessResponse("UPDATE : ITEM UPDATED WITH SUCCESS")
      }
      return ResponseDto.ErrorResponse("ERROR : SOMETHING WENT WRONG")
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
      if (deletedRecord) {
        return ResponseDto.SuccessResponse("DELETE : ITEM DELETED WITH SUCCESS", mailAddress)
      }
      return ResponseDto.ErrorResponse("ERROR : SOMETHING WENT WRONG")
    } catch (err: any) {
      return err
    }
  }
}
