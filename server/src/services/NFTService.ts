import {
  NFTokenAcceptOffer,
  NFTokenBurn,
  NFTokenCreateOffer,
  NFTokenMint,
  NFTokenMintFlags,
  Transaction,
  TxResponse,
  convertStringToHex,
} from "xrpl"
import { PinataPinOptions } from "@pinata/sdk"
import { xrplClient, pinataClient } from "../utils/clients"
import { UploadedFile } from "express-fileupload"
import fs from "fs"
import {
  CreateNftOfferProps,
  MintNftProps,
  NFTokenAcceptOfferprops,
  NFTokenBurnprops,
  TxnOptions,
} from "../dtos/xrpl-models.dto"

/* SERVICE CONTAINING ALL NFT LOGIC */

export default class NFTService {
  private async saveFileIntoDir(uploadedImage: UploadedFile) {
    const imageFilePath = "../assets/generated_nft.jpg"
    await fs.promises.writeFile(imageFilePath, uploadedImage.data)
  }

  private async pinToIPFS(): Promise<string> {
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
      const result = await pinataClient.pinFileToIPFS(readableStreamForFile, options)
      const body = {
        description: "Mobirent hybrid Fleet 001 NFT",
        image: result.IpfsHash,
        name: "MBR_Hybrid_001_NFT",
      }
      const jsonResult = await pinataClient.pinJSONToIPFS(body, options)
      return result.IpfsHash /// Must return exact ipfs URL to be used as parameter in mintNFT
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'image sur IPFS :", error)
      throw error
    }
  }

  async mintNFT(
    { URI, NFTokenTaxon = 0, ...rest }: MintNftProps,
    { wallet }: TxnOptions
  ): Promise<TxResponse<Transaction>> {
    //Prepare
    const nftMintTxn: NFTokenMint = {
      ...rest,
      NFTokenTaxon: 0,
      Flags: NFTokenMintFlags.tfTransferable,
      URI: convertStringToHex(URI ?? ""),
      Account: wallet.address,
      TransactionType: "NFTokenMint",
    }
    const prepared = await xrplClient.autofill(nftMintTxn)

    //Sign
    const signed = wallet.sign(prepared)

    //Submit and wait
    const response = await xrplClient.submitAndWait(signed.tx_blob)
    return response
  }

  async createNftOffer(props: CreateNftOfferProps, { wallet }: TxnOptions) {
    //Prepare
    const offerTxn: NFTokenCreateOffer = {
      ...props,
      Account: wallet.address,
      TransactionType: "NFTokenCreateOffer",
    }

    //Joiting  autofill, sign and submit wait
    const result = await xrplClient.submitAndWait(offerTxn, {
      autofill: true,
      wallet,
    })

    console.log(result)
    return result
  }

  async acceptNftOffer(props: NFTokenAcceptOfferprops, { wallet }: TxnOptions) {
    //Prepare
    const acceptTxn: NFTokenAcceptOffer = {
      ...props,
      TransactionType: "NFTokenAcceptOffer",
      Account: wallet.address,
    }
    //Autofill, Sign and submit wait
    const result = await xrplClient.submitAndWait(acceptTxn, {
      autofill: true,
      wallet,
    })

    console.log(result)
    return result
  }

  async burnNft(prop: NFTokenBurnprops, { wallet }: TxnOptions) {
    //Prepare
    const burnTxn: NFTokenBurn = {
      ...prop,
      TransactionType: "NFTokenBurn",
      Account: wallet.address,
      NFTokenID: "00080000CC0E1F88224B66C059898BE505430197BF9A38562DCBAB9D00000002",
    }
    //Autofill, Sign and submit wait
    const result = await xrplClient.submitAndWait(burnTxn, {
      autofill: true,
      wallet,
    })

    console.log(result)
    return result
  }
}
