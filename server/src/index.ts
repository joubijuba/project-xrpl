import { mintNft,creatNftOffer,acceptNftOffer,BurnNft } from "./transaction/nfts"
import { sendPayment } from "./transaction/payments"
import { NFTokenCreateOfferFlags } from "xrpl"
import { WALLET_1,WALLET_2 } from "./wallet"
import { getClient } from "./xrpl-client"
import { CreatToken } from "./transaction/AccountSet"


 const client = getClient()

const main = async () => {
  await client.connect()



  await mintNft({
      URI: "./imagetest.png",
      NFTokenTaxon: 1,
      },
  {wallet: WALLET_1}
  )

  //await CreatToken(
   // {
      // Propriétés spécifiques de la brûlure (burn) d'NFT, si nécessaire
   // },
   /// { wallet: WALLET_1 }
//  );

  
  await client.disconnect()

};
main()
