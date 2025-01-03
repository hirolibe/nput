import { createContext, Dispatch, SetStateAction } from 'react'

export interface CheerPointsContextState {
  cheerPoints: number
  setCheerPoints: Dispatch<SetStateAction<number>>
}

export const CheerPointsContext = createContext<
  CheerPointsContextState | undefined
>(undefined)
