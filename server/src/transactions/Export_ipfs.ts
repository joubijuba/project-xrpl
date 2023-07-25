require("dotenv").config()
const key = process.env.PINATA_KEY
const secret = process.env.PINATA_SECRET
const pinataSDK = require("@pinata/sdk")
const pinata = new pinataSDK(key, secret)
const fs = require("fs")

async function uploadImageToIPFS(imagePath: string): Promise<string> {
  const readableStreamForFile = fs.createReadStream(imagePath)

  const options = {
    pinataMetadata: {
      name: "MobirentNFT",
    },
    pinataOptions: {
      cidVersion: 0,
    },
  }

  try {
    const result = await pinata.pinFileToIPFS(readableStreamForFile, options)

    const body = {
      description: "Mobirent hybrid Fleet 001 NFT",
      image: result.IpfsHash,
      name: "MBR_Hybrid_001_NFT",
    }

    const jsonResult = await pinata.pinJSONToIPFS(body, options)

    return result.IpfsHash
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'image sur IPFS :", error)
    throw error
  }
}

export { uploadImageToIPFS }
