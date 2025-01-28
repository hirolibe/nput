import { onIdTokenChanged, User } from 'firebase/auth'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'
import { ReactNode, useEffect, useState, useCallback } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { destroyCookieToken } from '@/utils/destroyCookieToken'
import auth from '@/utils/firebaseConfig'
import { handleError } from '@/utils/handleError'
import { setCookieToken } from '@/utils/setCookieToken'

export interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [idToken, setIdToken] = useState<string | null | undefined>(undefined)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [, setSnackbar] = useSnackbarState()
  const router = useRouter()

  useEffect(() => {
    const cookies = parseCookies()
    if (cookies.firebase_auth_token) {
      setIdToken(cookies.firebase_auth_token)
    }
  }, [])

  const fetchToken = useCallback(
    async (user: User) => {
      try {
        const token = await user.getIdToken(true)
        setCookieToken(token)
        setIdToken(token)
      } catch (error) {
        const { errorMessage } = handleError(error)
        setSnackbar({
          message: errorMessage,
          severity: 'error',
          pathname: router.pathname,
        })
      }
    },
    [router.pathname, setSnackbar],
  )

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        await fetchToken(user)
      } else {
        destroyCookieToken()
        setIdToken(null)
      }
      setIsAuthLoading(false)
    })

    return () => unsubscribe()
  }, [fetchToken])

  useEffect(() => {
    const handleOnlineStatus = async () => {
      if (auth.currentUser) {
        await fetchToken(auth.currentUser)
      } else {
        destroyCookieToken()
        setIdToken(null)
      }
      setIsAuthLoading(false)
    }

    window.addEventListener('online', handleOnlineStatus)
    return () => {
      window.removeEventListener('online', handleOnlineStatus)
    }
  }, [fetchToken])

  useEffect(() => {
    const refreshToken = setInterval(
      async () => {
        const currentUser = auth.currentUser
        if (currentUser) {
          await fetchToken(currentUser)
        } else {
          destroyCookieToken()
          setIdToken(null)
        }
        setIsAuthLoading(false)
      },
      55 * 60 * 1000,
    )

    return () => clearInterval(refreshToken)
  }, [fetchToken])

  return (
    <AuthContext.Provider
      value={{
        idToken,
        setIdToken,
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
