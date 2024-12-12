import { Box } from '@mui/material'
import Image from 'next/image'

const Loading = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image src="/loading.svg" width={150} height={150} alt="loading..." />
    </Box>
  )
}

export default Loading
