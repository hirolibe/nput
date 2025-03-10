import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSnackbarState } from './useSnackbarState'
import { useAuthContext } from '@/hooks/useAuthContext'

const useEnsureAuth = () => {
  const router = useRouter()
  const [, setSnackbar] = useSnackbarState()
  const { idToken, isAuthLoading } = useAuthContext()
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false)

  useEffect(() => {
    if (isAuthLoading) {
      setIsAuthorized(false)
      return
    }

    if (!idToken) {
      setIsAuthorized(false)
      setSnackbar({
        message: 'ログインしてください',
        severity: 'error',
        pathname: '/auth/login',
      })
      router.push('/auth/login')
      return
    }

    setIsAuthorized(true)
  }, [isAuthLoading, idToken, setSnackbar, router])

  return isAuthorized
}

export default useEnsureAuth
