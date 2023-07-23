import express, { Express } from "express"
import cors from 'cors';
import bodyParser from "body-parser"

let expressServer: Express;

export const getServer = (): Express => {
  if (!expressServer){
    expressServer = express();
    // expressServer.set("case sensitive routing", true)

    /// ::: MIDDLEWARES ::: ///
    expressServer.use(cors({
      origin:["*"]
    }))
    expressServer.use(bodyParser.json())

    expressServer.listen(3000, () => {
      console.log("Express server running on port 3000")
    })
  }
  return expressServer;
}