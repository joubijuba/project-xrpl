import { MongoClient, ServerApiVersion } from "mongodb";

require("dotenv").config();

const { MONGODB_DB_URL, MONGODB_USERNAME, MONGODB_PASSWORD } = process.env;
const uri: string = `mongodb+srv://${MONGODB_USERNAME}:<${MONGODB_PASSWORD}>${MONGODB_DB_URL}/?retryWrites=true&w=majority`;

export const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
