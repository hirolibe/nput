import { useState, useEffect } from 'react'
import { useAuthContext } from './useAuthContext'
import { handleError } from '@/utils/handleError'

export interface UseAuthErrorParams {
  error: Error | undefined
}

export const useAuthError = ({ error }: UseAuthErrorParams) => {
  const [authError, setAuthError] = useState<Error | undefined>(undefined)
  const { setIdToken, fetchToken } = useAuthContext()

  useEffect(() => {
    if (!error) {
      setAuthError(undefined)
      return
    }

    const { errorMessage } = handleError(error)

    if (errorMessage?.includes('認証トークンの有効期限が切れています')) {
      setAuthError(undefined)

      const handleRefreshToken = async () => {
        try {
          const token = await fetchToken(true)
          if (token) {
            setIdToken(token)
          } else {
            setAuthError(new Error('トークンを更新できませんでした'))
          }
        } catch (err) {
          setAuthError(
            err instanceof Error
              ? err
              : new Error('トークン更新時に不明なエラーが発生しました'),
          )
        }
      }

      handleRefreshToken()
    } else {
      setAuthError(error)
    }
  }, [error, fetchToken, setIdToken])

  return { authError }
}
