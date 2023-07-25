import {
  AccountSet,
  Client,
  NFTokenMint,
  NFTokenMintFlags,
  Payment,
  Transaction,
  TxResponse,
  convertStringToHex,
} from "xrpl"
import pinataSDK, { PinataPinOptions } from "@pinata/sdk"
import { getClient } from "../clients/xrplClient"
import { pinataClient } from "../clients/pinataClient"
import { UploadedFile } from "express-fileupload"
import fs from "fs"
import { AccountProps, MintNftProps, PaymentProps } from "src/dtos/models"
import { TxnOptions } from "src/dtos/txn-options"

/* SERVICE CONTAINING ALL NFT LOGIC */

export class NFTService {
  xrplClient: Client
  pinataClient: pinataSDK

  constructor() {
    this.xrplClient = getClient()
    this.pinataClient = pinataClient
  }

  async saveFileIntoDir(uploadedImage: UploadedFile) {
    const imageFilePath = "../assets/generated_nft.jpg"
    await fs.promises.writeFile(imageFilePath, uploadedImage.data)
  }

  async pinToIPFS(): Promise<string> {
    const readableStreamForFile = fs.createReadStream("../assets/generated_nft.jpg")
    const options: PinataPinOptions = {
      pinataMetadata: {
        name: "MobirentNFT",
      },
      pinataOptions: {
        cidVersion: 0,
      },
    }
    try {
      const result = await this.pinataClient.pinFileToIPFS(readableStreamForFile, options)
      const body = {
        description: "Mobirent hybrid Fleet 001 NFT",
        image: result.IpfsHash,
        name: "MBR_Hybrid_001_NFT",
      }
      const jsonResult = await this.pinataClient.pinJSONToIPFS(body, options)
      return result.IpfsHash /// Must return exact ipfs URL to be used as parameter in mintNFT
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'image sur IPFS :", error)
      throw error
    }
  }

  async mintNFT({ URI, NFTokenTaxon = 0, ...rest }: MintNftProps, { wallet }: TxnOptions): Promise<TxResponse<Transaction>> {
    //Prepare
    const nftMintTxn: NFTokenMint = {
      ...rest,
      NFTokenTaxon: 0,
      Flags: NFTokenMintFlags.tfTransferable,
      URI: convertStringToHex(URI ?? ""),
      Account: wallet.address,
      TransactionType: "NFTokenMint",
    }
    const prepared = await this.xrplClient.autofill(nftMintTxn)

    //Sign
    const signed = wallet.sign(prepared)

    //Submit and wait
    const response = await this.xrplClient.submitAndWait(signed.tx_blob)
    return response
  }
}