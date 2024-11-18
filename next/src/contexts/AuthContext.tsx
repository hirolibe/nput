import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

interface AuthContextProps {
  idToken: string | null
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextProps>({ idToken: null })

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [idToken, setIdToken] = useState<string | null>(null)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken()
        setIdToken(token)
      } else {
        setIdToken(null)
      }
    })
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ idToken }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
