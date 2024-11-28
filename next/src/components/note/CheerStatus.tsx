import { Box } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/useAuth'
import { useCheerStatus } from '@/hooks/useCheerStatus'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

const CheerStatus = ({ noteId }: { noteId: number }) => {
  const { idToken, isAuthLoading } = useAuth()
  const { data, error, isLoading } = useCheerStatus(
    noteId,
    idToken || undefined,
  )
  const [, setSnackbar] = useSnackbarState()
  const router = useRouter()

  if (error) {
    const errorMessage = handleError(error)
    setSnackbar({
      message: `${errorMessage}`,
      severity: 'error',
      pathname: `${router.pathname}`,
    })
  }

  return (
    <>
      {error && (
        <Image
          src={'/megaphone-outlined.svg'}
          alt="Cheer Icon"
          width={16}
          height={16}
        />
      )}
      {(isAuthLoading || isLoading) && <Box sx={{ width: 16 }} />}
      {!isAuthLoading && !isLoading && !data && (
        <Image
          src="/megaphone-outlined.svg"
          alt="Cheer Icon"
          width={16}
          height={16}
        />
      )}
      {data && (
        <Image
          src={
            data.hasCheered
              ? '/megaphone-filled.svg'
              : '/megaphone-outlined.svg'
          }
          alt="Cheer Icon"
          width={16}
          height={16}
        />
      )}
    </>
  )
}

export default CheerStatus
