import { useRouter, usePathname } from 'next/navigation'
import { useEffect, Dispatch, SetStateAction } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

interface AuthRedirectProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const AuthRedirect = (props: AuthRedirectProps) => {
  const { isOpen, setIsOpen } = props

  const router = useRouter()
  const { profileData, profileError } = useProfile()
  const [snackbar, setSnackbar] = useSnackbarState()
  const pathname = usePathname()

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
    pathname,
    isOpen,
    setIsOpen,
  ])

  console.log('AuthRedirect')
  console.log(snackbar)

  return <></>
}

export default AuthRedirect
