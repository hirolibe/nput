import { fetchAuthSession } from 'aws-amplify/auth'
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

  const fetchToken = async (forceRefresh = false) => {
    const session = await fetchAuthSession({ forceRefresh })
    return session.tokens?.idToken?.toString()
  }

  const setToken = useCallback(
    async (forceRefresh = false) => {
      try {
        const token = await fetchToken(forceRefresh)
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
    },
    [pathname, setSnackbar],
  )

  // 初回マウント時のトークン取得
  useEffect(() => {
    setToken()
  }, [setToken])

  const periodicallysetToken = useCallback(async () => {
    setToken(true)
  }, [setToken])

  // トークンの定期更新（55分ごと）
  useEffect(() => {
    const refreshToken = setInterval(periodicallysetToken, 55 * 60 * 1000)

    return () => clearInterval(refreshToken)
  }, [periodicallysetToken])

  useEffect(() => {
    // オンライン復帰時のトークン取得
    const handleOnline = () => {
      setToken() // オンラインに戻った時も強制的に更新
    }

    // 画面フォーカス時のトークン取得
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setToken()
      }
    }

    window.addEventListener('online', handleOnline)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('online', handleOnline)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [setToken])

  // 認証状態変更時の処理
  useEffect(() => {
    const unsubscribe = Hub.listen('auth', async (data) => {
      const { payload } = data

      if (payload.event === 'signedIn') {
        await setToken()
      } else if (
        payload.event === 'signedOut' ||
        payload.event === 'tokenRefresh_failure'
      ) {
        setIdToken(null)
        setIsAuthLoading(false)
      }
    })

    return () => unsubscribe()
  }, [setToken])

  return (
    <AuthContext.Provider
      value={{
        idToken,
        setIdToken,
        isAuthLoading,
        fetchToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
