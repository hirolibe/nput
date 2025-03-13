import { useRouter, usePathname } from 'next/navigation'
import { useEffect, Dispatch, SetStateAction } from 'react'
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
  }, [profileError, router, setSnackbar])

  useEffect(() => {
    if (profileError || profileData === undefined) return

    if (profileData) {
      setSnackbar({
        message: 'ログインに成功しました！',
        severity: 'success',
        pathname: pathname,
      })

      setTimeout(() => {
        setIsOpen(false)
      }, 0)
    } else {
      // アカウント未登録の場合は登録ページにリダイレクト
      router.push('/auth/init')
      return
    }
  }, [profileError, setSnackbar, profileData, router, pathname, setIsOpen])

  return <></>
}

export default AuthRedirect
