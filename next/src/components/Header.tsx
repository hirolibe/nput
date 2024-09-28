import Logout from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material'
import axios, { AxiosResponse, AxiosError } from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAuthState, useIdToken } from 'react-firebase-hooks/auth'
import auth from '@/utils/firebaseConfig'
import { signOut } from 'firebase/auth'

const Header = () => {
  const [user, loading] = useAuthState(auth)
  const [idToken] = useIdToken(auth)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const router = useRouter()

  const hideHeaderPathnames = ['/current/notes/edit/[id]']
  if (hideHeaderPathnames.includes(router.pathname)) return <></>

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    signOut(auth)
    router.push('/')
  }

  const addNewArticle = () => {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/notes'

    const headers = {
      authorization: `Bearer ${idToken}`,
    }

    axios({ method: 'POST', url: url, headers: headers })
      .then((res: AxiosResponse) => {
        router.push('/current/notes/edit/' + res.data.id)
      })
      .catch((e: AxiosError<{ error: string }>) => {
        console.log(e.message)
      })
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
            {!loading && !user && (
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
            {user && (
              <Box sx={{ display: 'flex' }}>
                <IconButton onClick={handleClick} sx={{ p: 0 }}>
                  <Avatar>
                    {user.photoURL ? user.photoURL : <PersonIcon />}
                  </Avatar>
                </IconButton>
                <Box sx={{ ml: 2 }}>
                  <Button
                    color="primary"
                    variant="contained"
                    sx={{
                      color: 'white',
                      textTransform: 'none',
                      fontSize: 16,
                      borderRadius: 2,
                      width: 120,
                      boxShadow: 'none',
                      fontWeight: 'bold',
                    }}
                    onClick={addNewArticle}
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
                  <Link href="/current/profiles">
                    <MenuItem>
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      マイページ
                    </MenuItem>
                  </Link>
                  <Link href="/current/notes">
                    <MenuItem>
                      <ListItemIcon>
                        <AutoStoriesIcon fontSize="small" />
                      </ListItemIcon>
                      ノートの管理
                    </MenuItem>
                  </Link>
                  <Divider />
                  <Link href="/logout">
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
