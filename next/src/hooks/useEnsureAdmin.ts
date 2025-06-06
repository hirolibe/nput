import { useRouter } from 'next/navigation'
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
        pathname: '/',
      })
      router.push('/')
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
        pathname: '/',
      })
      router.push('/')
      return
    }

    setIsAdmin(true)
  }, [router, userRoleData, userRoleError, setSnackbar])

  return isAdmin
}

export default useEnsureAdmin
