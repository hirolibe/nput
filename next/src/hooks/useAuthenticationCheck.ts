import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSnackbarState } from './useSnackbarState'
import { useAuthContext } from '@/hooks/useAuthContext'

const useEnsureAuth = () => {
  const router = useRouter()
  const { idToken, isAuthLoading } = useAuthContext()
  const [, setSnackbar] = useSnackbarState()

  useEffect(() => {
    if (!isAuthLoading && !idToken) {
      setSnackbar({
        message: 'ログインしてください',
        severity: 'error',
        pathname: '/auth/login',
      })
      router.push('/auth/login')
    }
  }, [isAuthLoading, idToken, setSnackbar, router])
}

export default useEnsureAuth
