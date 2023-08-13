import { Collection, Document, WithId } from "mongodb"
import { mongoClient } from "../utils/clients"
import { ResponseDto } from "../dtos/response.dto"
import { SubscriptionDataDto } from "../dtos/mongo-models.dto"

export default class MongoService {
  collection: Collection

  constructor() {
    this.collection = mongoClient.db("mobirent").collection("subscription")
  }

  async addNewSubscription(datas: Omit<SubscriptionDataDto, "status">): Promise<ResponseDto<any>> {
    try {
      const exists =
        (await this.collection.find({ mailAddress: datas.mailAddress }).toArray()) ??
        (await this.collection.find({ phoneNumber: datas.phoneNumber }).toArray())
      if (exists.length !== 0) {
        return ResponseDto.ErrorResponse("ERROR : USER ALREADY EXISTS")
      }
      const newRecord: SubscriptionDataDto = {
        ...datas,
        status: "UNPROCESSED",
      }
      const res = await this.collection.insertOne(newRecord)
      if (res.acknowledged) {
        return ResponseDto.SuccessResponse("SUBSCRIPTION ADDED WITH SUCCESS")
      }
      return ResponseDto.ErrorResponse("ERROR : SOMETHING WENT WRONG")
    } catch (err: any) {
      return ResponseDto.ErrorResponse(`ERROR : ${err.toString()}`)
    }
  }

  async getPendingSubscriptions(): Promise<ResponseDto<WithId<Document>[]>> {
    try {
      const records = await this.collection.find({ status: "UNPROCESSED" }).toArray()
      console.log(records)
      return ResponseDto.SuccessResponse("SUCCESSFUL REQUEST", records)
    } catch (err: any) {
      return ResponseDto.ErrorResponse(`ERROR : ${err.toString()}`)
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
        return ResponseDto.SuccessResponse("ITEM UPDATED WITH SUCCESS")
      }
      return ResponseDto.ErrorResponse("ERROR : SOMETHING WENT WRONG")
    } catch (err: any) {
      return ResponseDto.ErrorResponse(`ERROR : ${err.toString()}`)
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
        return ResponseDto.SuccessResponse("ITEM DELETED WITH SUCCESS", mailAddress)
      }
      return ResponseDto.ErrorResponse("ERROR : SOMETHING WENT WRONG")
    } catch (err: any) {
      return ResponseDto.ErrorResponse(`ERROR : ${err.toString()}`)
    }
  }
}
