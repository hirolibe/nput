import { Delete } from '@mui/icons-material'
import {
  AppBar,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material'
import axios from 'axios'
import { signOut } from 'firebase/auth'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import Error from '@/components/common/Error'
import Loading from '@/components/common/Loading'
import { useAuthContext } from '@/hooks/useAuthContext'
import useEnsureAdmin from '@/hooks/useEnsureAdmin'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { UserSystemData, useUsers } from '@/hooks/useUsers'
import { destroyCookieToken } from '@/utils/destroyCookieToken'
import auth from '@/utils/firebaseConfig'
import { handleError } from '@/utils/handleError'

const ManageUsers: NextPage = () => {
  const isAdmin = useEnsureAdmin()

  const router = useRouter()
  const [, setSnackbar] = useSnackbarState()
  const { idToken } = useAuthContext()

  const { usersData, usersError } = useUsers()
  const [users, setUsers] = useState<UserSystemData[]>([])
  useEffect(() => {
    if (!usersData) return
    setUsers(usersData)
  }, [usersData])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      destroyCookieToken()
      router.push('/auth/login')
    } catch (err) {
      const { errorMessage } = handleError(err)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: router.pathname,
      })
    }
  }

  const [open, setOpen] = useState<boolean>(false)
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null)

  const handleDeleteUser = (userId: number) => {
    if (!userId) return
    setUserIdToDelete(userId)
    setOpen(true)
  }

  const handleConfirm = async () => {
    if (!userIdToDelete) return

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/${userIdToDelete}`
    const headers = { Authorization: `Bearer ${idToken}` }

    try {
      await axios.delete(url, { headers })
      setUsers(users?.filter((user) => user.id !== userIdToDelete))
    } catch (err) {
      const { errorMessage } = handleError(err)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: router.pathname,
      })
    } finally {
      setOpen(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  if (usersError) {
    const { statusCode, errorMessage } = handleError(usersError)
    return <Error statusCode={statusCode} errorMessage={errorMessage} />
  }

  if (!isAdmin || usersData === undefined) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Loading />
      </Box>
    )
  }

  return (
    <>
      {/* タブの表示 */}
      <HelmetProvider>
        <Helmet>
          <title>編集中 | Nput</title>
        </Helmet>
      </HelmetProvider>

      <Box sx={{ minHeight: '100vh' }}>
        <AppBar
          position="fixed"
          sx={{
            color: 'black',
            backgroundColor: 'backgroundColor.page',
            boxShadow: 'none',
          }}
        >
          <Toolbar>
            <Button
              onClick={handleLogout}
              variant="outlined"
              sx={{
                fontSize: { xs: 12, sm: 16 },
                borderRadius: 2,
                border: '1px solid primary',
                ml: { xs: 1, sm: 2 },
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              ログアウト
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ width: '100%', p: 3 }}>
          <Typography variant="h4" gutterBottom>
            ユーザー管理
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>ユーザー名</TableCell>
                  <TableCell>メールアドレス</TableCell>
                  <TableCell>権限</TableCell>
                  <TableCell align="right">アクション</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell align="right">
                      <Button
                        color="error"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Delete />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* ユーザー削除の確認画面 */}
      <ConfirmDialog
        open={open}
        onClose={handleClose}
        onConfirm={handleConfirm}
        message={'ノートを削除しますか？'}
        confirmText="実行"
      />
    </>
  )
}

export default ManageUsers
