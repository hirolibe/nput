import { AppBar, Box, Button, Container } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthState } from 'react-firebase-hooks/auth'
import auth from '@/utils/firebaseConfig'

const Header = () => {
  const [user] = useAuthState(auth)

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'white',
        color: 'black',
        boxShadow: 'none',
        py: '12px',
      }}
    >
      <Container maxWidth="lg" sx={{ px: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Link href="/">
              <Image src="/logo.png" width={90} height={40} alt="logo" />
            </Link>
          </Box>
          {!user && (
            <Box>
              <Link href="/login">
                <Button
                  color="primary"
                  variant="contained"
                  sx={{
                    color: 'white',
                    textTransform: 'none',
                    fontSize: 16,
                    borderRadius: 2,
                    boxShadow: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  ログイン
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  color="primary"
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    fontSize: 16,
                    borderRadius: 2,
                    boxShadow: 'none',
                    border: '1.5px solid #3EA8FF',
                    ml: 2,
                    fontWeight: 'bold',
                  }}
                >
                  新規登録
                </Button>
              </Link>
            </Box>
          )}
          {user && <Box>{user.email}</Box>}
        </Box>
      </Container>
    </AppBar>
  )
}

export default Header
