import { Box, Typography } from '@mui/material'
import { useEffect } from 'react'
import { Dispatch, SetStateAction } from 'react'

interface TimeTrackerProps {
  seconds: number
}

const TimeTracker = ({ seconds }: TimeTrackerProps) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor(seconds % 3600 / 60)

    return (
      <Typography sx={{ fontSize: 20 }}>
        {String(hours).padStart(2, '0')}:
        {String(minutes).padStart(2, '0')}
      </Typography>
    )
  }

  return (
    <Box>
      <Typography sx={{ fontSize: 50 }}>{formatTime(seconds)}</Typography>
    </Box>
  )
}

export default TimeTracker
