import { Box, Fade, Typography } from '@mui/material'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CheerIcon } from '../note/CheerIcon'
import { useCheerPointsContext } from '@/hooks/useCheerPointsContext'

interface CheerPointsProps {
  size?: number
}

const CheerPoints = (props: CheerPointsProps) => {
  const { size } = props
  const { cheerPoints } = useCheerPointsContext()

  const pathname = usePathname()
  const [addPoints, setAddPoints] = useState<number>(0)
  const [totalPoints, setTotalPoints] = useState<number>(0)

  useEffect(() => {
    if (pathname !== '/dashboard/notes/[slug]/edit') return

    const timer = setInterval(
      () => {
        if (totalPoints >= 3600) return
        setAddPoints((prevPoints) => prevPoints + 360)
      },
      6 * 60 * 1000,
    )

    return () => clearInterval(timer)
  }, [pathname, totalPoints])

  useEffect(() => {
    setTotalPoints(cheerPoints + addPoints)
  }, [cheerPoints, addPoints])

  return (
    <Fade in={true} timeout={{ enter: 100 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '60px',
        }}
      >
        <CheerIcon isCheered={totalPoints >= 360 ? true : false} size={size} />
        {totalPoints >= 3600 && (
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
        {totalPoints < 3600 && (
          <Typography sx={{ ml: 0.5 }}>
            × {Math.floor(totalPoints / 360)}
          </Typography>
        )}
      </Box>
    </Fade>
  )
}

export default CheerPoints
