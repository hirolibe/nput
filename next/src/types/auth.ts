import { ReactNode } from 'react'

export interface AuthContextProps {
  idToken: string | null
  isAuthLoading: boolean
  setIsAuthLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export interface AuthProviderProps {
  children: ReactNode
}
