import { MongoClient, ServerApiVersion } from "mongodb";

require("dotenv").config();

const { MONGODB_USERNAME, MONGODB_PASSWORD } = process.env;
const uri: string = `mongodb+srv://${MONGODB_USERNAME}:<${MONGODB_PASSWORD}>@mobirent-v0-db.at8cghd.mongodb.net/?retryWrites=true&w=majority`;

export const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})