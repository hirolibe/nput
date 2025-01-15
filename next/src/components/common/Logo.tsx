import { Box } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'

const Logo = () => (
  <Box width={{ xs: '60px', sm: '90px' }}>
    <Link href="/">
      <Image
        src="/logo.png"
        alt="logo"
        layout="responsive"
        width={90}
        height={40}
      />
    </Link>
  </Box>
)

export default Logo
