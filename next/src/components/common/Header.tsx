import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import Logout from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
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
  Theme,
  useMediaQuery,
} from '@mui/material'
import axios from 'axios'
import { signOut } from 'firebase/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import AuthLinks from '../auth/AuthLinks'
import CheerPoints from './CheerPoints'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useProfile } from '@/hooks/useProfile'
import { useProfileContext } from '@/hooks/useProfileContext'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import auth from '@/utils/firebaseConfig'
import { handleError } from '@/utils/handleError'

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const router = useRouter()
  const [, setSnackbar] = useSnackbarState()
  const { idToken, isAuthLoading } = useAuthContext()
  const { profileData, isProfileLoading } = useProfile()

  const { avatarUrl } = useProfileContext()

  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  )

  const hideHeaderPathnames = [
    '/auth/signup',
    '/auth/login',
    '/dashboard/notes/[slug]/edit',
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
      router.push(`/dashboard/notes/${res.data.slug}/edit`)
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
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4 } }}>
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
          {!isAuthLoading &&
            !idToken &&
            !isProfileLoading &&
            profileData === null && <AuthLinks />}
          {profileData && (
            <Box sx={{ display: 'flex' }}>
              <IconButton
                onClick={handleClick}
                sx={{ p: 0, mr: { xs: 1.5, sm: 2 } }}
              >
                <Avatar
                  alt={profileData.nickname || profileData.user.name}
                  src={avatarUrl}
                />
              </IconButton>
              <CheerPoints size={26} />
              <Box sx={{ ml: { xs: 1, sm: 2 } }}>
                <Button
                  onClick={handleAddNewNote}
                  variant="contained"
                  sx={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: { xs: 14, sm: 16 },
                    lineHeight: { xs: 1.2, sm: 28 / 16 },
                    borderRadius: 2,
                    width: { xs: 80, sm: 120 },
                    boxShadow: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  {isSmallScreen ? (
                    <>
                      ノート
                      <br />
                      作成
                    </>
                  ) : (
                    'ノート作成'
                  )}
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
                <Link href="/settings/account">
                  <MenuItem>
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    アカウント設定
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
