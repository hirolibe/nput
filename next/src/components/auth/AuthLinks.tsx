import { Box, Button } from '@mui/material'
import { useRouter } from 'next/router'

const AuthLinks = () => {
  const router = useRouter()

  const handleLogin = () => {
    const previousPath = router.asPath || '/'
    router.push({
      pathname: '/auth/login',
      query: { previousPath },
    })
  }

  const handleSignup = () => {
    const previousPath = router.asPath || '/'
    router.push({
      pathname: '/auth/signup',
      query: { previousPath },
    })
  }

  return (
    <Box>
      <Button
        onClick={handleLogin}
        variant="contained"
        sx={{
          color: 'white',
          fontSize: 16,
          borderRadius: 2,
          boxShadow: 'none',
          fontWeight: 'bold',
        }}
      >
        ログイン
      </Button>
      <Button
        onClick={handleSignup}
        variant="outlined"
        sx={{
          fontSize: 16,
          borderRadius: 2,
          border: '1px solid primary',
          ml: 2,
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        新規登録
      </Button>
    </Box>
  )
}

export default AuthLinks
