import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'

interface LoginDialogProps {
  open: boolean
  onClose: () => void
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose }) => {
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
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Stack spacing={2} sx={{ p: 4, pt: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <DialogTitle sx={{ p: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              ログインして続ける
            </Typography>
          </DialogTitle>
          <CloseIcon
            onClick={onClose}
            sx={{
              cursor: 'pointer',
              opacity: 0.7,
              '&:hover': { opacity: 1 },
            }}
          />
        </Box>

        <Typography>メールアドレスでログイン・新規登録</Typography>

        <Stack spacing={2} sx={{ justifyContent: 'space-between' }}>
          <Button
            onClick={handleLogin}
            variant="outlined"
            sx={{ fontWeight: 'bold', width: '100%' }}
          >
            メールアドレスでログイン
          </Button>
          <Button
            onClick={handleSignup}
            variant="contained"
            sx={{ color: 'white', fontWeight: 'bold', width: '100%' }}
          >
            メールアドレスで新規登録
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default LoginDialog
