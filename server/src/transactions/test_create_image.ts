import { createCanvas, registerFont } from "canvas"
import { writeFile } from "fs/promises" // Importer le module fs pour écrire le fichier

interface NFTData {
  tokenName: string
  supply: string
}

export function generateNFTImage(nftData: NFTData): string {
  const canvas = createCanvas(400, 200)
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

const nftData: NFTData = {
  tokenName: "Mon Token",
  supply: "100",
  // Autres propriétés du NFT...
}

const generatedImageURI = generateNFTImage(nftData)

// Enregistrer l'image générée dans le répertoire
;(async () => {
  try {
    const image = Buffer.from(generatedImageURI.split(",")[1], "base64")

    // Chemin du fichier où l'image sera enregistrée
    const imageFilePath = "./generated_nft.png"

    // Écrire le contenu de l'image dans le fichier
    await writeFile(imageFilePath, image)

    console.log(`L'image générée a été enregistrée dans le fichier : ${imageFilePath}`)
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'image :", error)
  }
})()
