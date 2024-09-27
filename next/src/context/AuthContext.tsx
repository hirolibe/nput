import { User } from 'firebase/auth'
import { createContext, useContext } from 'react'
import useFirebaseAuth from '@/hooks/useFirebaseAuth'

interface AuthContext {
  currentUser: User | null
  loading: boolean
  logout: () => Promise<void>
}

type AuthProviderProps = {
  children: React.ReactNode
}

const AuthCtx = createContext({} as AuthContext)
const { currentUser, loading, logout } = useFirebaseAuth

const AuthContext: AuthContext = {
  currentUser: currentUser,
  loading: loading,
  logout: logout,
}

export function AuthContextProvider({ children }: AuthProviderProps) {
  return <AuthCtx.Provider value={AuthContext}>{children}</AuthCtx.Provider>
}

export const useAuthContext = () => {
  useContext(AuthCtx)
}
