import { onIdTokenChanged } from 'firebase/auth'
import { useEffect, useState, ReactNode } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import auth from '@/utils/firebaseConfig'
import { handleError } from '@/utils/handleError'

export interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [idToken, setIdToken] = useState<string | null | undefined>(undefined)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken()
          setIdToken(token)
        } catch (error) {
          handleError(error)
        } finally {
          setIsAuthLoading(false)
        }
      } else {
        setIdToken(null)
        setIsAuthLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const refreshToken = setInterval(
      async () => {
        const currentUser = auth.currentUser
        if (currentUser) {
          const token = await currentUser.getIdToken(true)
          setIdToken(token)
        }
      },
      45 * 60 * 1000,
    )

    return () => clearInterval(refreshToken)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        idToken,
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
