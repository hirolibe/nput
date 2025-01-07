import { Box, Container, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Footer = () => {
  const router = useRouter()

  const hideHeaderPathnames = [
    '/auth/signup',
    '/auth/login',
    '/dashboard/notes/[slug]/edit',
  ]
  if (hideHeaderPathnames.includes(router.pathname)) return

  return (
    <Box component="footer" sx={{ p: 4 }}>
      <Container maxWidth="md">
        <Box
          sx={{
            display: { sm: 'flex' },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* ロゴ */}
          <Box sx={{ mb: { xs: 2, sm: 0 } }}>
            <Link href="/">
              <Image src="/logo.png" width={90} height={40} alt="logo" />
            </Link>
          </Box>

          {/* リンク */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Link href="/terms">利用規約</Link>
            <Link href="/privacy">プライバシーポリシー</Link>
          </Box>
        </Box>

        {/* コピーライト */}
        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="text.light">
            © {new Date().getFullYear()} HiroLibe.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
