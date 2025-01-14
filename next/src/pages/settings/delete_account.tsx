import { LoadingButton } from '@mui/lab'
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import {
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useProfileContext } from '@/hooks/useProfileContext'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { styles } from '@/styles'
import auth from '@/utils/firebaseConfig'
import { handleError } from '@/utils/handleError'

type DeleteAccountFormData = {
  password: string
}

const DeleteAccount: NextPage = () => {
  const router = useRouter()
  const { idToken } = useAuthContext()
  const [, setSnackbar] = useSnackbarState()
  const [isLoading, setIsLoading] = useState(false)

  const { currentUserName, currentUserNickname, avatarUrl } =
    useProfileContext()

  const { handleSubmit, control } = useForm<DeleteAccountFormData>({
    defaultValues: { password: '' },
  })

  const validationRules = {
    password: {
      required: 'パスワードを入力してください',
    },
  }

  const handleDeleteUser = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${currentUserName}`
    const headers = {
      Authorization: `Bearer ${idToken}`,
    }

    const res = await axios.delete(url, { headers })
    return res.data.message
  }

  const onSubmit: SubmitHandler<DeleteAccountFormData> = async (data) => {
    setIsLoading(true)
    try {
      const user = auth.currentUser
      if (!user || !user?.email) {
        throw new Error('ユーザー情報を取得できませんでした')
      }
      const email = user.email

      const credential = EmailAuthProvider.credential(email, data.password)
      await reauthenticateWithCredential(user, credential)

      const message = await handleDeleteUser()
      await deleteUser(user)
      setSnackbar({
        message: message,
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
              minHeight: '578px',
              px: { xs: 2, md: 6 },
              pt: 4,
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography
                component="h2"
                sx={{
                  textAlign: 'center',
                  fontSize: 24,
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
                    alignItems: 'center',
                    justifyContent: 'center',
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
                component="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
                <Typography sx={{ fontSize: 18, fontWeight: 'bold', mb: 1 }}>
                  パスワードを入力してください
                </Typography>
                <Controller
                  name="password"
                  control={control}
                  rules={validationRules.password}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      type="text"
                      error={fieldState.invalid}
                      helperText={fieldState.error?.message}
                      sx={{ width: '100%', mb: 3 }}
                    />
                  )}
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'end',
                    flexDirection: { xs: 'column', sm: 'row' },
                  }}
                >
                  <Button
                    onClick={() => router.push('/settings/account')}
                    variant="outlined"
                    sx={{
                      fontSize: { xs: 14, sm: 16 },
                      fontWeight: 'bold',
                      color: 'black',
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
                    color="error"
                    variant="contained"
                    type="submit"
                    loading={isLoading}
                    sx={{
                      fontSize: { xs: 14, sm: 16 },
                      fontWeight: 'bold',
                      color: 'white',
                      textTransform: 'none',
                    }}
                  >
                    アカウントを削除する
                  </LoadingButton>
                </Box>
              </Box>
            </Box>
          </Card>
        </Container>
      </Box>
    </>
  )
}

export default DeleteAccount
