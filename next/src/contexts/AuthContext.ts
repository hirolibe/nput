import { createContext } from 'react'

export interface AuthContextState {
  idToken: string | null | undefined
  isAuthLoading: boolean
}

export const AuthContext = createContext<AuthContextState | undefined>(
  undefined,
)
