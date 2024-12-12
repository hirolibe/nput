import { createContext } from 'react'

export interface AuthContextState {
  idToken: string | undefined
  isAuthLoading: boolean
  setIsAuthLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const AuthContext = createContext<AuthContextState | undefined>(
  undefined,
)
