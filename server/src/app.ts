import MongoController from "./controllers/MongoController"
import NFTController from "./controllers/NFTController"
import TransactionController from "./controllers/TransactionController"

const main = () => {
  let mongoController = new MongoController()
  let nftController = new NFTController()
  let transactionController = new TransactionController()
}

main()
