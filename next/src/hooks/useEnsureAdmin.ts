import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSnackbarState } from './useSnackbarState'
import { useUserRole } from './useUserRole'
import { handleError } from '@/utils/handleError'

const useEnsureAdmin = () => {
  const router = useRouter()
  const [, setSnackbar] = useSnackbarState()
  const { userRoleData, userRoleError } = useUserRole()
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  useEffect(() => {
    if (userRoleError) {
      setIsAdmin(false)
      const { errorMessage } = handleError(userRoleError)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: '/auth/login',
      })
      router.push('/auth/login')
      return
    }

    if (userRoleData === undefined) {
      setIsAdmin(false)
      return
    }

    if (userRoleData?.role !== 'admin') {
      setIsAdmin(false)
      setSnackbar({
        message: 'アクセス権限がありません',
        severity: 'error',
        pathname: '/auth/login',
      })
      router.push('/auth/login')
      return
    }

    setIsAdmin(true)
  }, [router, userRoleData, userRoleError, setSnackbar])

  return isAdmin
}

export default useEnsureAdmin
