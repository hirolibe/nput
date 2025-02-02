import { Box, Container, Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Logo from './Logo'

const Footer = () => {
  const router = useRouter()

  const hideHeaderPathnames = [
    '/auth/signup',
    '/auth/login',
    '/dashboard/notes/[slug]/edit',
    '/admin',
  ]
  if (hideHeaderPathnames.includes(router.pathname)) return

  return (
    <Box component="footer" sx={{ p: 4 }}>
      <Container maxWidth="md">
        <Box
          sx={{
            display: { sm: 'flex' },
            justifyContent: 'space-between',
          }}
        >
          {/* ロゴ */}
          <Box sx={{ mb: { xs: 2, sm: 0 } }}>
            <Logo />
          </Box>

          <Box sx={{ display: 'flex', gap: 4 }}>
            {/* Guides */}
            <Box>
              <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Guides</Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  fontSize: 14,
                }}
              >
                <Link href="/manual">使い方</Link>
              </Box>
            </Box>

            {/* Legal */}
            <Box>
              <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Legal</Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  fontSize: 14,
                }}
              >
                <Link href="/terms">利用規約</Link>
                <Link href="/privacy">プライバシーポリシー</Link>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* コピーライト */}
        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="text.light">
            © {new Date().getFullYear()} HiroLibe. Licensed under MIT License.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
