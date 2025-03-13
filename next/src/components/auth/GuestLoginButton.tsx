import { LoadingButton } from '@mui/lab'
import { signIn } from 'aws-amplify/auth'
import { usePathname, useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useState } from 'react'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

export interface GuestLoginButtonProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const GuestLoginButton = (props: GuestLoginButtonProps) => {
  const { setIsOpen } = props
  const [, setSnackbar] = useSnackbarState()
  const pathname = usePathname()
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
        pathname: pathname,
      })

      router.push(pathname)
      setIsOpen(false)
    } catch (err) {
      const { errorMessage } = handleError(err)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: pathname,
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
