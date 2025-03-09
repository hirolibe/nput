import { LoadingButton } from '@mui/lab'
import { signIn } from 'aws-amplify/auth'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState } from 'react'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

export interface AuthRedirectProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const GuestLoginButton = (props: AuthRedirectProps) => {
  const { setIsOpen } = props
  const [, setSnackbar] = useSnackbarState()
  const router = useRouter()

  const [isGuestLoggingIn, setIsGuestLoggingIn] = useState(false)

  const handleGuestLogin = async () => {
    setIsGuestLoggingIn(true)
    try {
      await signIn({
        username: process.env.NEXT_PUBLIC_GUEST_USERNAME ?? '',
        password: process.env.NEXT_PUBLIC_GUEST_PASSWORD ?? '',
      })
      localStorage.removeItem('previousPath')
      setSnackbar({
        message: 'ゲストログインに成功しました！',
        severity: 'success',
        pathname: router.pathname,
      })
      setIsOpen(false)
    } catch (err) {
      const { errorMessage } = handleError(err)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: router.pathname,
      })
    } finally {
      setIsGuestLoggingIn(false)
    }
  }

  return (
    <LoadingButton
      onClick={handleGuestLogin}
      loading={isGuestLoggingIn}
      variant="outlined"
      sx={{ fontSize: 16, fontWeight: 'bold', mb: '11px' }}
    >
      ゲストログイン
    </LoadingButton>
  )
}

export default GuestLoginButton
