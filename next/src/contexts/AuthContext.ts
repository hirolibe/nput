import { createContext, Dispatch, SetStateAction } from 'react'

export interface AuthContextState {
  idToken: string | null | undefined
  setIdToken: Dispatch<SetStateAction<string | null | undefined>>
  isAuthLoading: boolean
  fetchToken: (forceRefresh?: boolean) => Promise<string | null | undefined>
}

export const AuthContext = createContext<AuthContextState | undefined>(
  undefined,
)
