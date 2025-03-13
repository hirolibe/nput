import { LoadingButton } from '@mui/lab'
import { Avatar, Box, Button, Card, Container, Typography } from '@mui/material'
import { deleteUser } from 'aws-amplify/auth'
import axios from 'axios'
import type { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useProfile } from '@/hooks/useProfile'
import { useProfileContext } from '@/hooks/useProfileContext'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { styles } from '@/styles'
import { handleError } from '@/utils/handleError'

const DeleteAccount: NextPage = () => {
  const router = useRouter()
  const { idToken } = useAuthContext()
  const [, setSnackbar] = useSnackbarState()
  const [isLoading, setIsLoading] = useState(false)

  const { profileData } = useProfile()
  const currentUserName = profileData?.user.name
  const currentUserNickname = profileData?.nickname
  const { avatarUrl } = useProfileContext()

  const deleteUserData = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${currentUserName}`
    const headers = {
      Authorization: `Bearer ${idToken}`,
    }

    const res = await axios.delete(url, { headers })
    return res.data.message
  }

  const handleDeleteUser = async () => {
    setIsLoading(true)
    try {
      await deleteUserData()
      await deleteUser()
      setSnackbar({
        message: 'アカウントを削除しました',
        severity: 'success',
        pathname: '/',
      })
      await router.push('/')
    } catch (err) {
      const { errorMessage } = handleError(err)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: '/settings/delete_account',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* タブの表示 */}
      <HelmetProvider>
        <Helmet>
          <title>アカウントの削除 | Nput</title>
        </Helmet>
      </HelmetProvider>

      <Box
        css={styles.pageMinHeight}
        sx={{
          backgroundColor: 'backgroundColor.page',
          pb: 5,
        }}
      >
        <Container maxWidth="md" sx={{ pt: 5, px: { xs: 2, md: 4 } }}>
          <Card
            sx={{
              px: { xs: 2, md: 6 },
              pt: 4,
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography
                component="h2"
                sx={{
                  textAlign: 'center',
                  fontSize: { xs: 18, sm: 24 },
                  fontWeight: 'bold',
                  mb: 5,
                }}
              >
                アカウントの削除
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 5,
                }}
              >
                <Avatar
                  alt={currentUserNickname || currentUserName}
                  src={avatarUrl}
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'left',
                  }}
                >
                  {currentUserNickname && (
                    <Typography
                      sx={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        mb: 1,
                      }}
                    >
                      {currentUserNickname}
                    </Typography>
                  )}
                  <Typography sx={{ fontSize: 20 }}>
                    @{currentUserName}
                  </Typography>
                </Box>
              </Box>
              <Typography sx={{ textAlign: 'center', mb: 5 }}>
                一度アカウントを削除すると、復元することはできません
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: { xs: 'column', sm: 'row' },
                  mb: 6,
                }}
              >
                <Button
                  onClick={() => router.push('/settings/account')}
                  variant="outlined"
                  sx={{
                    fontSize: { xs: 14, sm: 16 },
                    fontWeight: 'bold',
                    color: 'black',
                    borderRadius: 2,
                    borderColor: 'black',
                    textTransform: 'none',
                    mr: { xs: 0, sm: 2 },
                    mb: { xs: 2, sm: 0 },
                    '&:hover': {
                      border: '1.5px solid',
                      borderColor: 'black',
                    },
                  }}
                >
                  キャンセル
                </Button>
                <LoadingButton
                  onClick={handleDeleteUser}
                  color="error"
                  variant="contained"
                  type="submit"
                  loading={isLoading}
                  sx={{
                    fontSize: { xs: 14, sm: 16 },
                    fontWeight: 'bold',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: 2,
                  }}
                >
                  アカウントを削除する
                </LoadingButton>
              </Box>
            </Box>
          </Card>
        </Container>
      </Box>
    </>
  )
}

export default DeleteAccount
