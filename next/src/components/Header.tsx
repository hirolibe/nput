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
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material'
import axios from 'axios'
import { signOut } from 'firebase/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useIdToken } from 'react-firebase-hooks/auth'
import { handleError } from '@/utils/errorHandler'
import auth from '@/utils/firebaseConfig'

const Header = () => {
  const [user, loading] = useIdToken(auth)
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

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (err) {
      const errorMessage =
        '不明なエラーが発生しました　サポートにお問い合わせください'
      alert(errorMessage)
    }
  }

  const addNewArticle = async () => {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/notes'
    const idToken = await user?.getIdToken()
    const headers = {
      Authorization: `Bearer ${idToken}`,
    }

    try {
      const res = await axios.post(url, null, { headers })
      router.push('/current/notes/edit/' + res.data.id)
    } catch (err) {
      handleError(err)
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
                    border: '1px solid #3EA8FF',
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
                <Avatar alt="avatar" src={user.photoURL || undefined}>
                  {!user.photoURL && <PersonIcon />}
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
