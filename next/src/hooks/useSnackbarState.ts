import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import useSWR from 'swr'
import { useAuthContext } from './useAuthContext'

interface snackbarStateType {
  message: null | string
  severity: null | 'success' | 'error' | 'info'
  pathname: null | string
  autoHideDuration?: null | number
}

export const useSnackbarState = () => {
  const fallbackData: snackbarStateType = {
    message: null,
    severity: null,
    pathname: null,
    autoHideDuration: 4000,
  }
  const { data: snackbar, mutate: setSnackbar } = useSWR('snackbar', null, {
    fallbackData: fallbackData,
  })

  const pathname = usePathname()

  // トークンが有効期限切れの場合に更新
  const { fetchToken } = useAuthContext()
  useEffect(() => {
    if (
      snackbar.severity === 'error' &&
      snackbar.message?.includes('認証トークンの有効期限が切れています')
    ) {
      setSnackbar({
        message: '認証トークンを更新中･･･',
        severity: 'info',
        pathname: pathname,
        autoHideDuration: null,
      })

      fetchToken(true)
        .then(() => {
          // トークン更新成功時にメッセージを表示
          setSnackbar({
            message: '認証トークンを更新しました',
            severity: 'success',
            pathname: pathname,
          })
        })
        .catch(() => {
          // トークン更新失敗時に新しいエラーメッセージを表示
          setSnackbar({
            message: 'トークンの更新に失敗しました。ログインし直してください',
            severity: 'error',
            pathname: pathname,
          })
        })
    }
  }, [snackbar.message, snackbar.severity, setSnackbar, pathname, fetchToken])

  return [snackbar, setSnackbar] as [
    snackbarStateType,
    (value: snackbarStateType) => void,
  ]
}
