import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

const DisplayDuration = () => {
  const [seconds, setSeconds] = useState<number>(0)

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevTime) => prevTime + 60)
    }, 60 * 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <Box>
      <Typography sx={{ fontSize: 20 }}>
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
      </Typography>
    </Box>
  )
}

export default DisplayDuration
