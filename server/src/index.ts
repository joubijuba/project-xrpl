import { mintNft, creatNftOffer, acceptNftOffer, BurnNft } from "./transactions/nfts"
import { sendPayment } from "./transactions/payments"
import { NFTokenCreateOfferFlags } from "xrpl"
import { WALLET_1, WALLET_2 } from "./wallet"
import { getClient } from "./xrpl-clients"
import { CreatToken } from "./transactions/AccountSet"
import { generateNFTImage } from "./transactions/create_image"
import { Transaction } from "mongodb"
import { Canvas } from "canvas"
import fs from "fs"
import { uploadImageToIPFS } from "./transactions/Export_ipfs"
const client = getClient()

const nftData = {
  tokenName: "Mon Token",
  supply: "100",
  // Autres propriétés du NFT...
}
const main = async () => {
  await client.connect()

  const imagePath = "../server/src/Wallpaper_lake.jpg" // Remplacez par le chemin d'accès de l'image générée
  try {
    const imageCID = await uploadImageToIPFS(imagePath)
    const uri= "https://ipfs.io/ipfs/"+imageCID

    await mintNft(
      {
        URI: uri,
        NFTokenTaxon: 1,
      },
      { wallet: WALLET_1 }
    )

    console.log("NFT créé avec l'image générée sur IPFS : ", uri)
  } catch (error) {
    console.error("Erreur :", error)
  }
  await client.disconnect()
}
main()
