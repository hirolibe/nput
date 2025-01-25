import { Box, Typography } from '@mui/material'

interface TimeTrackerProps {
  seconds: number
}

const TimeTracker = ({ seconds }: TimeTrackerProps) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  return (
    <Box>
      <Typography sx={{ fontSize: 20 }}>
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
      </Typography>
    </Box>
  )
}

export default TimeTracker
