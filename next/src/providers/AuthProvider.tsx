import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { AuthProviderProps } from '@/types/auth'
import auth from '@/utils/firebaseConfig'
import { handleError } from '@/utils/handleError'

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

    const intervalTime = 60 * 60 * 1000
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken()
          setIdToken(token)

          const tokenRefreshInterval = setInterval(async () => {
            try {
              const refreshedToken = await user.getIdToken(true)
              setIdToken(refreshedToken)
            } catch (error) {
              handleTokenRefreshError(error)
            }
          }, intervalTime)

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
