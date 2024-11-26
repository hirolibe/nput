import { LoadingButton } from '@mui/lab'
import { Box, Container, TextField, Typography, Stack } from '@mui/material'
import axios from 'axios'
import { FirebaseError } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser,
  User,
} from 'firebase/auth'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/requests/utils/handleError'
import { styles } from '@/styles'
import auth from '@/utils/firebaseConfig'

type SignUpFormData = {
  name: string
  email: string
  password: string
}

const SignUp: NextPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [, setSnackbar] = useSnackbarState()

  const { handleSubmit, control } = useForm<SignUpFormData>({
    defaultValues: { name: '', email: '', password: '' },
  })

  const validationRules = {
    name: {
      required: 'ユーザー名を入力してください',
    },
    email: {
      required: 'メールアドレスを入力してください',
      pattern: {
        value:
          /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
        message: '正しい形式のメールアドレスを入力してください',
      },
    },
    password: {
      required: 'パスワードを入力してください',
      minLength: {
        value: 8,
        message: 'パスワードは8文字以上にしてください',
      },
    },
  }

  const verifyIdToken = async (createdUser: User) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/registration`
    const idToken = await createdUser?.getIdToken()
    const headers = {
      Authorization: `Bearer ${idToken}`,
    }

    try {
      const res = await axios.post(url, null, { headers })
      setSnackbar({
        message: `${res.data.message}`,
        severity: 'success',
        pathname: '/',
      })
      await router.push('/')
    } catch (err) {
      const errorMessage = handleError(err)
      await deleteUser(createdUser)
      setSnackbar({
        message: `${errorMessage}`,
        severity: 'error',
        pathname: '/auth/signup',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    setIsLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      )
      const createdUser = userCredential.user
      await updateProfile(createdUser, { displayName: data.name })
      await verifyIdToken(createdUser)
    } catch (err) {
      let errorMessage =
        '不明なエラーが発生しました　サポートにお問い合わせください'

      if (err instanceof FirebaseError) {
        if (err.code === 'auth/email-already-in-use') {
          errorMessage = 'このメールアドレスはすでに使用されています'
        } else if (err.code === 'auth/weak-password') {
          errorMessage = 'パスワードは8文字以上にしてください'
        }
      }
      alert(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <Box
      css={styles.pageMinHeight}
      sx={{
        backgroundColor: '#EDF2F7',
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ mb: 4, pt: 4 }}>
          <Typography
            component="h2"
            sx={{ fontSize: 32, color: 'black', fontWeight: 'bold' }}
          >
            Nput へようこそ！
          </Typography>
        </Box>
        <Stack
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          spacing={4}
          sx={{ alignItems: 'center' }}
        >
          <Controller
            name="name"
            control={control}
            rules={validationRules.name}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="text"
                label="ユーザー名"
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                sx={{ backgroundColor: 'white', width: '100%' }}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={validationRules.email}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="text"
                label="メールアドレス"
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                sx={{ backgroundColor: 'white', width: '100%' }}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={validationRules.password}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="password"
                label="パスワード"
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                sx={{ backgroundColor: 'white', width: '100%' }}
              />
            )}
          />
          <LoadingButton
            variant="contained"
            type="submit"
            loading={isLoading}
            sx={{
              fontWeight: 'bold',
              color: 'white',
              width: '30%',
              textTransform: 'none',
            }}
          >
            登録する
          </LoadingButton>
        </Stack>
      </Container>
    </Box>
  )
}

export default SignUp
