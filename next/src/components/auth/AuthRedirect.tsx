import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

const AuthRedirect = () => {
  const router = useRouter()
  const { profileData, profileError } = useProfile()
  const [, setSnackbar] = useSnackbarState()
  const [redirectPath, setRedirectPath] = useState<string | undefined>(
    undefined,
  )

  useEffect(() => {
    const storedPath = localStorage.getItem('previousPath') || '/'
    setRedirectPath(storedPath)
  }, [])

  useEffect(() => {
    if (profileError) {
      const { errorMessage } = handleError(profileError)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: '/',
      })
      router.push('/')
      return
    }

    if (profileData === undefined) return

    if (profileData === null) {
      router.push('/auth/init')
      return
    }

    if (redirectPath === undefined) return

    router.push(redirectPath)
  }, [profileError, setSnackbar, profileData, router, redirectPath])

  return <></>
}

export default AuthRedirect
