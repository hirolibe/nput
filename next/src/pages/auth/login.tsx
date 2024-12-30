import { LoadingButton } from '@mui/lab'
import { Box, Container, TextField, Typography, Stack } from '@mui/material'
import { signInWithEmailAndPassword } from 'firebase/auth'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import auth from '@/utils/firebaseConfig'
import { handleError } from '@/utils/handleError'

type LogInFormData = {
  email: string
  password: string
}

const LogIn: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [, setSnackbar] = useSnackbarState()

  const router = useRouter()
  const { previousPath } = router.query
  const redirectPath = typeof previousPath === 'string' ? previousPath : '/'

  const { handleSubmit, control } = useForm<LogInFormData>({
    defaultValues: { email: '', password: '' },
  })

  const validationRules = {
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

  const onSubmit: SubmitHandler<LogInFormData> = async (data) => {
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
      setSnackbar({
        message: 'ログインに成功しました',
        severity: 'success',
        pathname: redirectPath,
      })
      await router.push(redirectPath)
    } catch (err) {
      const { errorMessage } = handleError(err)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: '/auth/login',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ pt: 6 }}>
      <Box sx={{ px: 2 }}>
        <Link href="/">
          <Image src="/logo.png" width={90} height={40} alt="logo" />
        </Link>
      </Box>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: { xs: 'center', sm: 'start' }, mb: 4, pt: 4 }}>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 28, sm: 32 },
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            Nput にログイン
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
              fontSize: { xs: 14, sm: 16 },
              fontWeight: 'bold',
              color: 'white',
              width: '170px',
              textTransform: 'none',
            }}
          >
            Nput にログイン
          </LoadingButton>
          <Typography sx={{ fontSize: { xs: 14, sm: 16 } }}>
            アカウントをお持ちでない場合は
            <Typography
              component="span"
              sx={{ fontSize: { xs: 14, sm: 16 }, textDecoration: 'underline' }}
            >
              <Link href="/auth/signup">新規登録</Link>
            </Typography>
            から
          </Typography>
        </Stack>
      </Container>
    </Container>
  )
}

export default LogIn
