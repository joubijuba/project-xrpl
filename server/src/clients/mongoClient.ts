import { MongoClient, ServerApiVersion } from "mongodb"

require("dotenv").config()

const { MONGO_DB_URL, MONGO_USERNAME, MONGO_PASSWORD } = process.env
const uri: string = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_DB_URL}/?retryWrites=true&w=majority`

export const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})
