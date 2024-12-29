import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { CheerIcon } from '../note/CheerIcon'
import { useProfile } from '@/hooks/useProfile'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

type CheerPointsProps = {
  addedCheerPoints: number
  size?: number
}

const CheerPoints = (props: CheerPointsProps) => {
  const { addedCheerPoints, size } = props

  const [, setSnackbar] = useSnackbarState()
  const router = useRouter()

  const { profileData, profileError } = useProfile()
  const cheerPoints = profileData?.user.cheerPoints

  if (profileError) {
    const { errorMessage } = handleError(profileError)
    setSnackbar({
      message: errorMessage,
      severity: 'error',
      pathname: router.pathname,
    })
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <CheerIcon
        isCheered={(cheerPoints ?? 0) + addedCheerPoints >= 360 ? true : false}
        size={size}
      />
      <Typography
        sx={{
          fontWeight:
            (cheerPoints ?? 0) + addedCheerPoints >= 3600 ? 'bold' : 'normal',
          ml: 0.5,
        }}
      >
        {(cheerPoints ?? 0) + addedCheerPoints >= 3600
          ? 'Max'
          : `× ${Math.floor(((cheerPoints ?? 0) + addedCheerPoints) / 360)}`}
      </Typography>
    </Box>
  )
}

export default CheerPoints
