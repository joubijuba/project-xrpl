import {
  NFTokenAcceptOffer,
  NFTokenBurn,
  NFTokenCreateOffer,
  NFTokenMint,
  NFTokenMintFlags,
  convertStringToHex,
} from "xrpl"
import { PinataPinOptions } from "@pinata/sdk"
import { xrplClient, pinataClient } from "../utils/clients"
import { UploadedFile } from "express-fileupload"
import fs from "fs"
import {
  CreateNftOfferProps,
  NFTokenAcceptOfferprops,
  NFTokenBurnprops,
  TxnOptions,
} from "../dtos/xrpl-models.dto"
import path from "path"
import { NFTDatasDto } from "../dtos/nft-models.dto"
import { ResponseDto } from "../dtos/response.dto"
import { WALLET_1 } from "../utils/wallet.utils"

/* SERVICE CONTAINING ALL NFT LOGIC */

export default class NFTService {
  private imageFilePath: string

  constructor() {
    this.imageFilePath = path.resolve(__dirname, "../assets/generated_nft.jpg")
  }

  private async saveFileIntoDir(uploadedImage: UploadedFile): Promise<ResponseDto<any>> {
    try {
      await fs.promises.writeFile(this.imageFilePath, uploadedImage.data)
      return ResponseDto.SuccessResponse(undefined, fs.createReadStream(this.imageFilePath))
    } catch (err: any) {
      return ResponseDto.ErrorResponse("Can't save or retrieve image to/from dir")
    }
  }

  private async pinToIPFS(NFTDatas: NFTDatasDto): Promise<ResponseDto<string>> {
    try {
      const ipfsGatewayUrl: string = "https://ipfs.io/ipfs/"
      const { companyName, KBIS, minimumProfit, nftImage } = NFTDatas
      const options: PinataPinOptions = {
        pinataMetadata: {
          name: "MobirentNFT",
        },
        pinataOptions: {
          cidVersion: 0,
        },
      }
      const savedFileRes = await this.saveFileIntoDir(NFTDatas.nftImage)
      if (savedFileRes.error) {
        return savedFileRes
      }
      const result = await pinataClient.pinFileToIPFS(savedFileRes.data, options)
      const jsonResult = await pinataClient.pinJSONToIPFS(
        {
          // description: "Mobirent hybrid Fleet 001 NFT",
          image: result.IpfsHash,
          // name: "MBR_Hybrid_001_NFT",
          companyName,
          KBIS,
          minimumProfit,
        },
        options
      )
      const ipfsURI = ipfsGatewayUrl + jsonResult.IpfsHash
      return ResponseDto.SuccessResponse(undefined, ipfsURI) /// Must return exact ipfs URL to be used as parameter in mintNFT
    } catch (error: any) {
      return ResponseDto.ErrorResponse(error.toString())
    }
  }

  async mintNFT(NFTDatas: NFTDatasDto): Promise<ResponseDto<string>> {
    try {
      const pinFileRes = await this.pinToIPFS(NFTDatas)

      // error handling, if pinata is sending an error
      if (pinFileRes.error) {
        return pinFileRes
      }

      const nftMintTxn: NFTokenMint = {
        NFTokenTaxon: 0,
        Flags: NFTokenMintFlags.tfTransferable,
        URI: convertStringToHex(pinFileRes.data ?? ""),
        Account: WALLET_1.address,
        TransactionType: "NFTokenMint",
      }

      await xrplClient.connect()
      const prepared = await xrplClient.autofill(nftMintTxn)
      const signed = WALLET_1.sign(prepared)
      const response = await xrplClient.submitAndWait(signed.tx_blob)
      await xrplClient.disconnect()

      return ResponseDto.SuccessResponse(`SUCCESSFULLY MINTED ${response.result.hash}`)
    } catch (err: any) {
      return ResponseDto.ErrorResponse(err.toString())
    }
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
