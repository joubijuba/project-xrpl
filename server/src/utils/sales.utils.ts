import { TokenSaleDataDto } from "../dtos/mongo-models.dto"

/**
 * to avoid refetching ongoing tokens sales from mongoDb over and over
 */

export let onGoingSales = new Map<string, TokenSaleDataDto>()

export const _setOnGoingSales = (tokenSaleDatas: TokenSaleDataDto[]) => {
  for (let tokenSaleData of tokenSaleDatas) {
    onGoingSales.set(tokenSaleData.tokenTicker, tokenSaleData)
  }
}

export let fetchedOnGoingSales: boolean

export const _setFetchedOnGoingSales = (bool: boolean) => {
  fetchedOnGoingSales = bool
}
