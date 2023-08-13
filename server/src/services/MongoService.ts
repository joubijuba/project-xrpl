import { Collection, Document, WithId } from "mongodb"
import { mongoClient } from "../utils/clients"
import { ResponseDto } from "../dtos/response.dto"
import { ApplicationDataDto } from "../dtos/mongo-models.dto"

export default class MongoService {
  collection: Collection

  constructor() {
    this.collection = mongoClient.db("mobirent").collection("subscription")
  }

  async addNewApplication(
    datas: Omit<ApplicationDataDto, "status">
  ): Promise<ResponseDto<string>> {
    try {
      const exists =
        (await this.collection.find({ mailAddress: datas.mailAddress }).toArray()) ??
        (await this.collection.find({ phoneNumber: datas.phoneNumber }).toArray())
      if (exists.length !== 0) {
        return ResponseDto.ErrorResponse("ERROR : EMAIL/PHONE ALREADY SUBMITTED AN APPLICATION")
      }
      const newRecord: ApplicationDataDto = {
        ...datas,
        status: "UNPROCESSED",
      }
      const res = await this.collection.insertOne(newRecord)
      if (res.acknowledged) {
        return ResponseDto.SuccessResponse("APPLICATION ADDED WITH SUCCESS")
      }
      return ResponseDto.ErrorResponse("ERROR : SOMETHING WENT WRONG")
    } catch (err: any) {
      return ResponseDto.ErrorResponse(`ERROR : ${err.toString()}`)
    }
  }

  async getPendingApplications(): Promise<ResponseDto<WithId<Document>[]>> {
    try {
      const records = await this.collection.find({ status: "UNPROCESSED" }).toArray()
      if (!records.length) {
        return ResponseDto.ErrorResponse("NO PENDING APPLICATIONS")
      }
      return ResponseDto.SuccessResponse("SUCCESSFULLY FETCHED ONGOING REGISTRATIONS", records)
    } catch (err: any) {
      return ResponseDto.ErrorResponse(`ERROR : ${err.toString()}`)
    }
  }

  async processApplication(mailAddress: string): Promise<ResponseDto<string>> {
    try {
      const record = await this.collection.find({ mailAddress }).toArray()
      if (record.length === 0) {
        return ResponseDto.ErrorResponse(`ERROR : ${mailAddress} DOESNT EXIST`)
      }
      if (record[0].status !== "UNPROCESSED") {
        return ResponseDto.ErrorResponse(`ERROR : APPLICATION ALREADY ${record[0].status}`)
      }
      const updatedRecord = await this.collection.updateOne(
        { mailAddress },
        { $set: { status: "PROCESSED" } }
      )
      if (updatedRecord.acknowledged) {
        return ResponseDto.SuccessResponse(`${mailAddress} APPLICATION ACCEPTED`)
      }
      return ResponseDto.ErrorResponse("ERROR : SOMETHING WENT WRONG, UNABLE TO PROCESS APPLICATION")
    } catch (err: any) {
      return ResponseDto.ErrorResponse(`ERROR : ${err.toString()}`)
    }
  }

  async getApplication(mailAddress: string): Promise<ResponseDto<Document>> {
    try {
      const record = await this.collection.find({ mailAddress }).toArray()
      if (record.length === 0) {
        return ResponseDto.ErrorResponse(`ERROR : ${mailAddress} DOESNT EXIST`)
      }
      return ResponseDto.SuccessResponse(undefined, record)
    }
    catch (err: any){
      return ResponseDto.ErrorResponse(`ERROR : ${err.toString()}`)
    }
  }

  async deleteApplication(mailAddress: string): Promise<ResponseDto<string>> {
    try {
      const record = await this.collection.find({ mailAddress }).toArray()
      if (record.length === 0) {
        return ResponseDto.ErrorResponse(`ERROR : ${mailAddress} DOESNT EXIST`)
      }
      const deletedRecord = await this.collection.deleteOne({ mailAddress })
      if (deletedRecord.acknowledged) {
        return ResponseDto.SuccessResponse(`${mailAddress} APPLICATION DELETED WITH SUCCESS`)
      }
      return ResponseDto.ErrorResponse("ERROR : SOMETHING WENT WRONG")
    } catch (err: any) {
      return ResponseDto.ErrorResponse(`ERROR : ${err.toString()}`)
    }
  }
}