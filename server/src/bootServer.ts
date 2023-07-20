import express from "express"
import cors from 'cors';

let expressServer: any;

export const getServer = () => {
  if (!expressServer){
    expressServer = express();
    expressServer.set("case sensitive routing", true)
    expressServer.use(cors({
      origin:["*"]
    }))
    expressServer.listen(3000, () => {
      console.log("Express server running on port 3000")
    })
  }
  return expressServer;
}