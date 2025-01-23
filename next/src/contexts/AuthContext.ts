import { createContext, Dispatch, SetStateAction } from 'react'

export interface AuthContextState {
  idToken: string | null | undefined
  isAuthLoading: boolean
  setIsAuthLoading: Dispatch<SetStateAction<boolean>>
}

export const AuthContext = createContext<AuthContextState | undefined>(
  undefined,
)
