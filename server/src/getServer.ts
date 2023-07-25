import express, { Express } from "express"
import cors from 'cors';
import bodyParser from "body-parser"
import fileUpload from 'express-fileupload';

let expressServer: Express;

export const getServer = (): Express => {
  if (!expressServer){
    expressServer = express();
    // expressServer.set("case sensitive routing", true)

    /// ::: MIDDLEWARES ::: ///
    expressServer.use(cors({
      origin:["http://localhost:3000"]
    }))
    expressServer.use(bodyParser.json())
    expressServer.use(fileUpload());

    expressServer.listen(8080, () => {
      console.log("Express server running on port 8080")
    })
  }
  return expressServer;
}