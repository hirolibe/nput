import { LoadingButton } from '@mui/lab'
import { Box, Container, TextField, Typography, Stack } from '@mui/material'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { styles } from '@/styles'
import auth from '@/utils/firebaseConfig'
import { useIdToken } from 'react-firebase-hooks/auth'
import axios from 'axios'

type SignUpFormData = {
  name: string
  email: string
  password: string
}

const SignUp: NextPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [idToken] = useIdToken(auth)

  const { handleSubmit, control } = useForm<SignUpFormData>({
    defaultValues: { name: '', email: '', password: '' },
  })

  const validationRules = {
    name: {
      required: 'ユーザー名を入力してください。',
    },
    email: {
      required: 'メールアドレスを入力してください。',
      pattern: {
        value:
          /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
        message: '正しい形式のメールアドレスを入力してください。',
      },
    },
    password: {
      required: 'パスワードを入力してください。',
      minLength: {
        value: 8,
        message: 'パスワードは8文字以上にしてください。',
      },
    },
  }

  const verifyIdToken = async () => {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/auth/users'

    const headers = {
      authorization: `Bearer ${idToken}`,
    }

    try {
      const res = await axios.post(url, null, { headers })
      alert('Railsの登録に成功しました！')
      await router.push('/') // res.data.idを用いてprofileページへ遷移させる予定
    } catch (err) {
      let errorMessage = 'An unknown error occurred';
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const errorData = err.response.data
          errorMessage = errorData.message || `Error: ${err.response.status} ${err.response.statusText}`
        } else if (err.request) {
          errorMessage = 'Network error. Please check your connection.'
        }
      } else {
        errorMessage = err instanceof Error ? err.message : String(err)
      }
      console.error(errorMessage)
      alert(errorMessage)
    }
  }

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    setIsLoading(true)
    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user
        updateProfile(user, {
          displayName: data.name
        })
        alert('Firebaseの登録に成功しました！')
        router.push('/')
      })
      .catch((error) => {
        let errorMessage = '登録に失敗しました。再度お試しください。'
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'このメールアドレスはすでに使用されています。'
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'パスワードは8文字以上にしてください。'
        }
        alert(errorMessage)
        setIsLoading(false)
      })
    await verifyIdToken()
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
