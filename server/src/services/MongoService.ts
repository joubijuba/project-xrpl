import { Collection, Document, WithId } from "mongodb"
import { mongoClient } from "../utils/clients"
import { ResponseDto } from "../dtos/response.dto"
import { ApplicationDataDto, PresaleDataDto } from "../dtos/mongo-models.dto"

export default class MongoService {
  applicationsCollection: Collection
  presalesCollection: Collection

  constructor() {
    this.applicationsCollection = mongoClient.db("mobirent").collection("applications")
    this.presalesCollection = mongoClient.db("mobirent").collection("presales")
  }

  async addNewApplication(datas: Omit<ApplicationDataDto, "status">): Promise<ResponseDto<string>> {
    try {
      const exists =
        (await this.applicationsCollection.find({ mailAddress: datas.mailAddress }).toArray()) ??
        (await this.applicationsCollection.find({ phoneNumber: datas.phoneNumber }).toArray())
      if (exists.length !== 0) {
        return ResponseDto.ErrorResponse("ERROR : EMAIL/PHONE ALREADY SUBMITTED AN APPLICATION")
      }
      const newRecord: ApplicationDataDto = {
        ...datas,
        status: "UNPROCESSED",
      }
      const res = await this.applicationsCollection.insertOne(newRecord)
      if (res.acknowledged) {
        return ResponseDto.SuccessResponse("APPLICATION ADDED WITH SUCCESS")
      }
      return ResponseDto.ErrorResponse("ERROR : SOMETHING WENT WRONG")
    } catch (err: any) {
      return ResponseDto.ErrorResponse(`ERROR : ${err.toString()}`)
    }
  }

  async getPendingApplications(): Promise<ResponseDto<Document[]>> {
    try {
      const records = await this.applicationsCollection
        .find({ status: "UNPROCESSED" })
        .project({ projection: { _id: 0 } })
        .toArray()
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
      const record = await this.applicationsCollection.find({ mailAddress }).toArray()
      if (record.length === 0) {
        return ResponseDto.ErrorResponse(`ERROR : ${mailAddress} DOESNT EXIST`)
      }
      if (record[0].status !== "UNPROCESSED") {
        return ResponseDto.ErrorResponse(`ERROR : APPLICATION ALREADY ${record[0].status}`)
      }
      const updatedRecord = await this.applicationsCollection.updateOne(
        { mailAddress },
        { $set: { status: "PROCESSED" } }
      )
      if (updatedRecord.acknowledged) {
        return ResponseDto.SuccessResponse(`${mailAddress} APPLICATION ACCEPTED`)
      }
      return ResponseDto.ErrorResponse(
        "ERROR : SOMETHING WENT WRONG, UNABLE TO PROCESS APPLICATION"
      )
    } catch (err: any) {
      return ResponseDto.ErrorResponse(`ERROR : ${err.toString()}`)
    }
  }

  async getApplication(mailAddress: string): Promise<ResponseDto<Document>> {
    try {
      const record = await this.applicationsCollection.find({ mailAddress }).toArray()
      if (record.length === 0) {
        return ResponseDto.ErrorResponse(`ERROR : ${mailAddress} DOESNT EXIST`)
      }
      return ResponseDto.SuccessResponse(undefined, record)
    } catch (err: any) {
      return ResponseDto.ErrorResponse(`ERROR : ${err.toString()}`)
    }
  }

  async deleteApplication(mailAddress: string): Promise<ResponseDto<string>> {
    try {
      const record = await this.applicationsCollection.find({ mailAddress }).toArray()
      if (record.length === 0) {
        return ResponseDto.ErrorResponse(`ERROR : ${mailAddress} DOESNT EXIST`)
      }
      const deletedRecord = await this.applicationsCollection.deleteOne({ mailAddress })
      if (deletedRecord.acknowledged) {
        return ResponseDto.SuccessResponse(`${mailAddress} APPLICATION DELETED WITH SUCCESS`)
      }
      return ResponseDto.ErrorResponse("ERROR : SOMETHING WENT WRONG")
    } catch (err: any) {
      return ResponseDto.ErrorResponse(`ERROR : ${err.toString()}`)
    }
  }

  async addNewPresale(
    presaleData: PresaleDataDto
  ): Promise<ResponseDto<string>> {
    try {
      const exists = await this.presalesCollection
        .find({ tokenTicker: presaleData.tokenTicker, onGoing: true })
        .toArray()
      if (exists) {
        return ResponseDto.ErrorResponse(
          `THERE IS AN ONGOING PRESALE FOR ${presaleData.tokenTicker}`
        )
      }
      const res = await this.applicationsCollection.insertOne(presaleData)
      if (res.acknowledged) {
        return ResponseDto.SuccessResponse(
          `PRESALE FOR ${presaleData.tokenTicker} ADDED WITH SUCCESS`
        )
      }
      return ResponseDto.ErrorResponse(
        "ERROR : SOMETHING WENT WRONG UPON ADDING THIS SALE TO THE DB"
      )
    } catch (err: any) {
      return ResponseDto.ErrorResponse(err.toString())
    }
  }

}