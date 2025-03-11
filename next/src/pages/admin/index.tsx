import { Delete } from '@mui/icons-material'
import {
  Box,
  Button,
  Container,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import axios from 'axios'
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
import { styles } from '@/styles'
import { handleError } from '@/utils/handleError'

const ManageUsers: NextPage = () => {
  const isAdmin = useEnsureAdmin()

  const router = useRouter()
  const [, setSnackbar] = useSnackbarState()
  const { idToken } = useAuthContext()

  const { usersData, usersError } = useUsers()

  const meta = usersData?.meta

  const [users, setUsers] = useState<UserSystemData[] | undefined>(undefined)
  useEffect(() => {
    setUsers(usersData?.users)
  }, [usersData])

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(`admin/?page=${value}`)
  }

  const [openDeleteUser, setOpenDeleteUser] = useState<boolean>(false)
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null)

  const handleDeleteUser = (userId: number) => {
    if (!userId) return
    setUserIdToDelete(userId)
    setOpenDeleteUser(true)
  }

  const handleConfirmDeleteUser = async () => {
    if (!userIdToDelete) return

    setIsLoading(true)

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/${userIdToDelete}`
    const headers = { Authorization: `Bearer ${idToken}` }

    try {
      const res = await axios.delete(url, { headers })
      setUsers(users?.filter((user) => user.id !== userIdToDelete))
      setSnackbar({
        message: res.data.message,
        severity: 'success',
        pathname: router.pathname,
      })
    } catch (err) {
      const { errorMessage } = handleError(err)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: router.pathname,
      })
    } finally {
      setIsLoading(false)
      setOpenDeleteUser(false)
    }
  }

  const handleClose = () => {
    setOpenDeleteUser(false)
  }

  if (usersError) {
    const { statusCode, errorMessage } = handleError(usersError)
    return <Error statusCode={statusCode} errorMessage={errorMessage} />
  }

  if (!isAdmin || usersData === undefined) {
    return (
      <Box
        css={styles.pageMinHeight}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Loading />
      </Box>
    )
  }

  return (
    <>
      {/* タブの表示 */}
      <HelmetProvider>
        <Helmet>
          <title>管理画面 | Nput</title>
        </Helmet>
      </HelmetProvider>

      <Box
        css={styles.pageMinHeight}
        sx={{ backgroundColor: 'backgroundColor.page' }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4 } }}>
          <Box sx={{ width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: 18, sm: 24 },
                  fontWeight: 'bold',
                }}
              >
                ユーザー管理
              </Typography>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 2, p: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      ユーザー名
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      メールアドレス
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>権限</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">
                      アクション
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell sx={{ py: 1 }}>{user.id}</TableCell>
                      <TableCell sx={{ py: 1 }}>{user.name}</TableCell>
                      <TableCell sx={{ py: 1 }}>{user.email}</TableCell>
                      <TableCell sx={{ py: 1 }}>{user.role}</TableCell>
                      <TableCell align="right" sx={{ py: 1 }}>
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

            {!!meta?.totalPages && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <Pagination
                  count={meta?.totalPages}
                  page={meta?.currentPage}
                  onChange={handleChange}
                />
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* アカウント削除の確認画面 */}
      <ConfirmDialog
        open={openDeleteUser}
        onClose={handleClose}
        onConfirm={handleConfirmDeleteUser}
        message={'アカウントを削除しますか？'}
        confirmText="実行"
        isLoading={isLoading}
      />
    </>
  )
}

export default ManageUsers
