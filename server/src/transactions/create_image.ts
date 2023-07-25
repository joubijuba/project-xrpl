import { createCanvas, registerFont } from "canvas"

interface NFTData {
  tokenName: string
  supply: string
}

export function generateNFTImage(nftData: NFTData): string {
  const canvas = createCanvas(200, 100)
  const ctx = canvas.getContext("2d")

  ctx.fillStyle = "#000000"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = "#FFFFFF"
  ctx.font = "20px sans-serif"
  ctx.fillText(`Nom Token: ${nftData.tokenName}`, 20, 50)
  ctx.fillText(`Supply: ${nftData.supply}`, 20, 100)

  // Convertir le contenu du canvas en une URL de l'image
  const imageURI = canvas.toDataURL()
  // Renvoyer l'URI de l'image générée
  return imageURI
}

// Autres propriétés du NFT...

/*
const generatedImageURI = generateNFTImage(nftData)
console.log(generatedImageURI)
*/
