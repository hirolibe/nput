import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useEffect, useState, ReactNode } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import auth from '@/utils/firebaseConfig'
import { handleError } from '@/utils/handleError'

export interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [idToken, setIdToken] = useState<string | undefined>(undefined)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [, setSnackbar] = useSnackbarState()
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken()
          setIdToken(token)
        } catch (error) {
          await signOut(auth)
          const { errorMessage } = handleError(error)
          setSnackbar({
            message: `${errorMessage} ログインし直してください`,
            severity: 'error',
            pathname: `/auth/login`,
          })
          router.push(`/auth/login`)
        } finally {
          setIsAuthLoading(false)
        }
      } else {
        setIdToken(undefined)
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
