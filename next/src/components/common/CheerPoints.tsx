import { Box, Typography } from '@mui/material'
import { CheerIcon } from '../note/CheerIcon'
import { useProfileContext } from '@/hooks/useProfileContext'

type CheerPointsProps = {
  addedCheerPoints?: number
  size?: number
}

const CheerPoints = (props: CheerPointsProps) => {
  const { addedCheerPoints, size } = props
  const { cheerPoints } = useProfileContext()

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '60px' }}>
      <CheerIcon
        isCheered={
          (cheerPoints ?? 0) + (addedCheerPoints ?? 0) >= 360 ? true : false
        }
        size={size}
      />
      {(cheerPoints ?? 0) + (addedCheerPoints ?? 0) >= 3600 && (
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 'bold',
            ml: 0.5,
          }}
        >
          Max
        </Typography>
      )}
      {(cheerPoints ?? 0) + (addedCheerPoints ?? 0) < 3600 && (
        <Typography sx={{ ml: 0.5 }}>
          × {Math.floor(((cheerPoints ?? 0) + (addedCheerPoints ?? 0)) / 360)}
        </Typography>
      )}
    </Box>
  )
}

export default CheerPoints
