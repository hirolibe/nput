import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/requests/utils/handleError'
import auth from '@/utils/firebaseConfig'

interface AuthContextProps {
  idToken: string | null
  isAuthLoading: boolean
  setIsAuthLoading: React.Dispatch<React.SetStateAction<boolean>>
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [idToken, setIdToken] = useState<string | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [, setSnackbar] = useSnackbarState()
  const router = useRouter()

  useEffect(() => {
    const handleTokenRefreshError = (error: unknown) => {
      setIdToken(null)
      const errorMessage = handleError(error)
      setSnackbar({
        message: `${errorMessage} ログインし直してください`,
        severity: 'error',
        pathname: `/auth/login`,
      })
      router.push(`/auth/login`)
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken()
          setIdToken(token)

          const tokenRefreshInterval = setInterval(
            async () => {
              try {
                const refreshedToken = await user.getIdToken(true)
                setIdToken(refreshedToken)
              } catch (error) {
                handleTokenRefreshError(error)
              }
            },
            60 * 60 * 1000,
          )

          return () => clearInterval(tokenRefreshInterval)
        } catch (error) {
          handleTokenRefreshError(error)
        } finally {
          setIsAuthLoading(false)
        }
      } else {
        setIdToken(null)
        setIsAuthLoading(false)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [router, setSnackbar])

  return (
    <AuthContext.Provider
      value={{
        idToken,
        isAuthLoading,
        setIsAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
