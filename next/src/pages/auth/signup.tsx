import { LoadingButton } from '@mui/lab'
import { Box, Container, Stack, TextField, Typography } from '@mui/material'
import axios from 'axios'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser,
  User,
} from 'firebase/auth'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import auth from '@/utils/firebaseConfig'
import { handleError } from '@/utils/handleError'

type SignUpFormData = {
  name: string
  email: string
  password: string
}

const SignUp: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [, setSnackbar] = useSnackbarState()
  const router = useRouter()
  const { previousPath } = router.query
  const redirectPath = typeof previousPath === 'string' ? previousPath : '/'

  const { handleSubmit, control } = useForm<SignUpFormData>({
    defaultValues: { name: '', email: '', password: '' },
  })

  const validationRules = {
    name: {
      required: 'ユーザー名を入力してください',
      minLength: {
        value: 3,
        message: 'ユーザー名は3文字以上で入力してください',
      },
      maxLength: {
        value: 20,
        message: 'ユーザー名は20文字以内で入力してください',
      },
      pattern: {
        value: /^[a-zA-Z0-9_](?:[a-zA-Z0-9_-]*[a-zA-Z0-9_])?$/,
        message:
          'ユーザー名は半角英数字と記号（ _ と - ）のみ使用可能で、- は先頭と末尾に使用できません',
      },
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

    const res = await axios.post(
      url,
      { name: createdUser.displayName },
      { headers },
    )
    return res.data.message
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

      setSnackbar({
        message: '新規登録に成功しました',
        severity: 'success',
        pathname: redirectPath,
      })
      await router.push(redirectPath)
    } catch (err) {
      const { errorMessage } = handleError(err)

      if (auth.currentUser) {
        await deleteUser(auth.currentUser)
      }

      setSnackbar({
        message: `${errorMessage} 登録し直してください`,
        severity: 'error',
        pathname: '/auth/signup',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ pt: 6 }}>
      <Box>
        <Link href="/">
          <Image src="/logo.png" width={90} height={40} alt="logo" />
        </Link>
      </Box>
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
            }}
          >
            新規登録する
          </LoadingButton>
          <Typography>
            アカウントをお持ちの場合は
            <Typography component="span" sx={{ textDecoration: 'underline' }}>
              <Link href="/auth/login">ログイン</Link>
            </Typography>
            から
          </Typography>
        </Stack>
      </Container>
    </Container>
  )
}

export default SignUp
