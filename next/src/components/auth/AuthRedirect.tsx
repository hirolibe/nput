import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

interface AuthRedirectProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const AuthRedirect = (props: AuthRedirectProps) => {
  const { setIsOpen } = props
  const router = useRouter()
  const { profileData, profileError } = useProfile()
  const [, setSnackbar] = useSnackbarState()
  const [redirectPath, setRedirectPath] = useState<string | undefined>(
    undefined,
  )
  const pathname = usePathname()

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

    setSnackbar({
      message: 'ログインに成功しました！',
      severity: 'success',
      pathname: pathname,
    })

    setIsOpen(false)
  }, [
    profileError,
    setSnackbar,
    profileData,
    router,
    redirectPath,
    pathname,
    setIsOpen,
  ])

  return <></>
}

export default AuthRedirect
