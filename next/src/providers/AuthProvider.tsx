import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState, useCallback } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

export interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [idToken, setIdToken] = useState<string | null | undefined>(undefined)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [, setSnackbar] = useSnackbarState()
  const pathname = usePathname()

  const fetchToken = useCallback(async () => {
    try {
      const session = await fetchAuthSession()
      const token = session.tokens?.idToken?.toString()
      setIdToken(token)
    } catch (err) {
      const { errorMessage } = handleError(err)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: pathname,
      })
      setIdToken(null)
    } finally {
      setIsAuthLoading(false)
    }
  }, [pathname, setSnackbar])

  const setupAuth = useCallback(async () => {
    try {
      await getCurrentUser()
      await fetchToken()
    } catch (err) {
      setIdToken(null)
      setIsAuthLoading(false)
    }
  }, [fetchToken])

  // 初回マウント時のトークン取得
  useEffect(() => {
    setupAuth()
  }, [setupAuth])

  // トークンの定期更新（55分ごと）
  useEffect(() => {
    const refreshToken = setInterval(setupAuth, 55 * 60 * 1000)

    return () => clearInterval(refreshToken)
  }, [setupAuth])

  // 画面フォーカス時のトークン取得
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setupAuth()
      }
    }

    window.addEventListener('online', setupAuth)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('online', setupAuth)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [setupAuth])

  // 認証状態変更時の処理
  useEffect(() => {
    const unsubscribe = Hub.listen('auth', async (data) => {
      const { payload } = data

      if (payload.event === 'signedIn') {
        await fetchToken()
      } else if (
        payload.event === 'signedOut' ||
        payload.event === 'tokenRefresh_failure'
      ) {
        setIdToken(null)
        setIsAuthLoading(false)
      }
    })

    return () => unsubscribe()
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
