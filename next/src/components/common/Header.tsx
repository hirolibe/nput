import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import DashboardIcon from '@mui/icons-material/Dashboard'
import EditIcon from '@mui/icons-material/Edit'
import Logout from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import SearchIcon from '@mui/icons-material/Search'
import SettingsIcon from '@mui/icons-material/Settings'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Fade,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import axios from 'axios'
import { signOut } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import AuthLinks from '../auth/AuthLinks'
import CheerPoints from './CheerPoints'
import Logo from './Logo'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useProfile } from '@/hooks/useProfile'
import { useProfileContext } from '@/hooks/useProfileContext'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { useUserRole } from '@/hooks/useUserRole'
import { destroyCookieToken } from '@/utils/destroyCookieToken'
import auth from '@/utils/firebaseConfig'
import { handleError } from '@/utils/handleError'

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const router = useRouter()
  const [, setSnackbar] = useSnackbarState()
  const { idToken, isAuthLoading } = useAuthContext()
  const { profileData, profileError, isProfileLoading } = useProfile()
  const { avatarUrl } = useProfileContext()

  useEffect(() => {
    if (profileError) {
      const { errorMessage } = handleError(profileError)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: router.pathname,
      })
    }
  }, [profileError, router.pathname, setSnackbar])

  const { userRoleData, userRoleError } = useUserRole()
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  useEffect(() => {
    if (userRoleError) {
      setIsAdmin(false)
      const { errorMessage } = handleError(userRoleError)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: router.pathname,
      })
      return
    }

    if (userRoleData !== 'admin') {
      setIsAdmin(false)
      return
    }

    setIsAdmin(true)
  }, [userRoleError, setSnackbar, router, userRoleData])

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
      await router.push('/')
      await signOut(auth)
      destroyCookieToken()
    } catch (err) {
      const { errorMessage } = handleError(err)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: '/',
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
        height: { xs: '56px', sm: '64px' },
        py: { xs: 1, sm: '12px' },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '40px',
          }}
        >
          <Logo />
          {((!isAuthLoading &&
            idToken === null &&
            !isProfileLoading &&
            profileData === null) ||
            profileError) && <AuthLinks />}
          {profileData && (
            <Fade in={true} timeout={1000}>
              <Box sx={{ display: 'flex' }}>
                <Link href="/search">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '100%',
                      mr: 1.5,
                    }}
                  >
                    <SearchIcon sx={{ fontSize: 26, color: 'text.light' }} />
                  </Box>
                </Link>
                <IconButton onClick={handleClick} sx={{ p: 0, mr: 2 }}>
                  <Avatar
                    alt={profileData.nickname || profileData.user.name}
                    src={avatarUrl}
                  />
                </IconButton>
                <CheerPoints size={26} />
                <Box sx={{ display: { xs: 'none', sm: 'block' }, ml: 2 }}>
                  <Button
                    onClick={handleAddNewNote}
                    variant="contained"
                    sx={{
                      textAlign: 'center',
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
                  {/* 管理者用メニュー */}
                  {isAdmin && (
                    <>
                      <Link href="/admin">
                        <MenuItem>
                          <ListItemIcon>
                            <DashboardIcon fontSize="small" />
                          </ListItemIcon>
                          管理画面
                        </MenuItem>
                      </Link>
                      <Divider />
                    </>
                  )}

                  {/* ログインユーザー用メニュー */}
                  <Link href={`/${profileData?.user.name}`}>
                    <MenuItem>
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      マイページ
                    </MenuItem>
                  </Link>
                  <Box
                    onClick={handleAddNewNote}
                    sx={{ display: { xs: 'block', sm: 'none' } }}
                  >
                    <MenuItem>
                      <ListItemIcon>
                        <EditIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography
                        sx={{
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        ノートを新規作成
                      </Typography>
                    </MenuItem>
                  </Box>
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
            </Fade>
          )}
        </Box>
      </Container>
    </AppBar>
  )
}

export default Header
