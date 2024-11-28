import { createContext } from 'react'
import { AuthContextProps } from '@/types/auth'

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
)
