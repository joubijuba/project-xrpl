import { PresaleDataDto } from "../dtos/mongo-models.dto"

/**
 * to avoid refetching ongoing tokens sales from mongoDb over and over
 */

export let onGoingPresales = new Map<string, PresaleDataDto>()

export const _setOnGoingPresales = (tokenSaleDatas: PresaleDataDto[]) => {
  for (let tokenSaleData of tokenSaleDatas) {
    onGoingPresales.set(tokenSaleData.tokenTicker, tokenSaleData)
  }
}

export let fetchedOnGoingPresales: boolean

export const _setFetchedOnGoingPresales = (bool: boolean) => {
  fetchedOnGoingPresales = bool
}


/**
 * The below will help us to avoid reentrency on the "buyTokens" method
 */
export let hasUserSubmittedATx = new Map<string, boolean>()

export const _setHasUserSubmittedATx = (address: string, bool: boolean) => {
  hasUserSubmittedATx.set(address, bool)
}