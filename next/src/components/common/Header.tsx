import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import Logout from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@mui/material'
import axios from 'axios'
import { signOut } from 'firebase/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import StopPropagationLink from './StopPropagationLink'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import auth from '@/utils/firebaseConfig'
import { handleError } from '@/utils/handleError'

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const router = useRouter()
  const { idToken, isAuthLoading } = useAuth()
  const { profileData } = useProfile(idToken)
  const [, setSnackbar] = useSnackbarState()

  const hideHeaderPathnames = [
    '/auth/signup',
    '/auth/login',
    '/notes/[id]/edit',
  ]
  if (hideHeaderPathnames.includes(router.pathname)) return

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (err) {
      const { errorMessage } = handleError(err)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: router.pathname,
      })
    }
  }

  const addNewNote = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${profileData?.user.name}/notes`
    const headers = { Authorization: `Bearer ${idToken}` }

    try {
      const res = await axios.post(url, null, { headers })
      router.push(`/notes/${res.data.id}/edit`)
    } catch (err) {
      const { errorMessage } = handleError(err)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: router.pathname,
      })
    }
  }

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
      <Container maxWidth="lg" sx={{ px: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <StopPropagationLink href="/">
              <Image src="/logo.png" width={90} height={40} alt="logo" />
            </StopPropagationLink>
          </Box>
          {!isAuthLoading && !idToken && (
            <Box>
              <Link href="/auth/login">
                <Button
                  color="primary"
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
              </Link>
              <Link href="/auth/signup">
                <Button
                  color="primary"
                  variant="outlined"
                  sx={{
                    fontSize: 16,
                    borderRadius: 2,
                    border: '1px solid #3EA8FF',
                    ml: 2,
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  新規登録
                </Button>
              </Link>
            </Box>
          )}
          {profileData && idToken && (
            <Box sx={{ display: 'flex' }}>
              <IconButton onClick={handleClick} sx={{ p: 0 }}>
                <Avatar
                  alt={profileData.nickname || profileData.user.name}
                  src={profileData.avatarUrl}
                />
              </IconButton>
              <Box sx={{ ml: 2, display: { xs: 'none', sm: 'block' } }}>
                <Button
                  onClick={addNewNote}
                  color="primary"
                  variant="contained"
                  sx={{
                    color: 'white',
                    fontSize: 16,
                    borderRadius: 2,
                    width: 120,
                    boxShadow: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  ノート作成
                </Button>
              </Box>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
              >
                <Link href={`/${profileData?.user.name}`}>
                  <MenuItem>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    マイページ
                  </MenuItem>
                </Link>
                <Link href="/dashboard">
                  <MenuItem>
                    <ListItemIcon>
                      <AutoStoriesIcon fontSize="small" />
                    </ListItemIcon>
                    ノートの管理
                  </MenuItem>
                </Link>
                <Divider />
                <Link href="/">
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    ログアウト
                  </MenuItem>
                </Link>
              </Menu>
            </Box>
          )}
        </Box>
      </Container>
    </AppBar>
  )
}

export default Header
