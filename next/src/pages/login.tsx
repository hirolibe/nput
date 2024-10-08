import { LoadingButton } from '@mui/lab'
import { Box, Container, TextField, Typography, Stack } from '@mui/material'
import { FirebaseError } from 'firebase/app'
import { signInWithEmailAndPassword } from 'firebase/auth'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { styles } from '@/styles'
import auth from '@/utils/firebaseConfig'

type LogInFormData = {
  email: string
  password: string
}

const LogIn: NextPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

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
      alert('ログインに成功しました！')
      router.push('/')
    } catch (err) {
      let errorMessage =
        '不明なエラーが発生しました　サポートにお問い合わせください'

      if (err instanceof FirebaseError) {
        if (err.code === 'auth/invalid-email') {
          errorMessage = 'メールアドレスが無効です'
        } else if (err.code === 'auth/user-not-found') {
          errorMessage =
            'このメールアドレスに対応するアカウントが見つかりません'
        } else if (err.code === 'auth/wrong-password') {
          errorMessage = 'パスワードが正しくありません'
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
              fontWeight: 'bold',
              color: 'white',
              width: '30%',
              textTransform: 'none',
            }}
          >
            Nput にログイン
          </LoadingButton>
        </Stack>
      </Container>
    </Box>
  )
}

export default LogIn
