import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import Logout from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
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
import AuthLinks from '../auth/AuthLinks'
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
  const [, setSnackbar] = useSnackbarState()
  const { idToken, isAuthLoading } = useAuth()
  const { profileData, isProfileLoading } = useProfile()

  const hideHeaderPathnames = [
    '/auth/signup',
    '/auth/login',
    '/dashboard/notes/[id]/edit',
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

  const handleAddNewNote = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/my_notes`
    const headers = { Authorization: `Bearer ${idToken}` }

    try {
      const res = await axios.post(url, null, { headers })
      router.push(`/dashboard/notes/${res.data.id}/edit`)
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
          {!isAuthLoading &&
            !idToken &&
            !isProfileLoading &&
            profileData === null && <AuthLinks />}
          {profileData && (
            <Box sx={{ display: 'flex' }}>
              <IconButton onClick={handleClick} sx={{ p: 0 }}>
                <Avatar
                  alt={profileData.nickname || profileData.user.name}
                  src={profileData.avatarUrl}
                />
              </IconButton>
              <Box sx={{ ml: 2 }}>
                <Button
                  onClick={handleAddNewNote}
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
