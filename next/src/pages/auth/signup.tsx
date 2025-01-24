import { LoadingButton } from '@mui/lab'
import {
  Box,
  Checkbox,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInAnonymously,
  updateProfile,
  User,
} from 'firebase/auth'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import Logo from '@/components/common/Logo'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import auth from '@/utils/firebaseConfig'
import { handleError } from '@/utils/handleError'

interface SignUpFormData {
  name: string
  email: string
  password: string
  terms: boolean
  privacy: boolean
}

const SignUp: NextPage = () => {
  const { setIdToken } = useAuthContext()

  const [isTermsChecked, setIsTermsChecked] = useState<boolean>(false)
  const [isPrivacyChecked, setIsPrivacyChecked] = useState<boolean>(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isGuestLoggingIn, setIsGuestLoggingIn] = useState(false)
  const [, setSnackbar] = useSnackbarState()
  const router = useRouter()
  const { previousPath } = router.query
  const redirectPath = typeof previousPath === 'string' ? previousPath : '/'

  const [termsLatestVersion, setTermsLatestVersion] = useState<string>('')
  const [privacyLatestVersion, setPrivacyLatestVersion] = useState<string>('')

  useEffect(() => {
    const fetchLatestVersion = async () => {
      try {
        const response = await fetch('/api/getVersion')

        if (!response.ok) {
          throw new Error('ディレクトリの読み込みに失敗しました')
        }

        const data = await response.json()
        setTermsLatestVersion(data.termsVersion)
        setPrivacyLatestVersion(data.privacyVersion)
      } catch (err) {
        const { errorMessage } = handleError(err)
        setSnackbar({
          message: errorMessage,
          severity: 'error',
          pathname: router.pathname,
        })
      }
    }

    fetchLatestVersion()
  }, [setSnackbar, router.pathname])

  const { handleSubmit, control } = useForm<SignUpFormData>({
    defaultValues: { name: '', email: '', password: '' },
  })

  const validationRules = {
    name: {
      required: 'ユーザー名を入力してください',
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

  const verifyIdToken = async (user: User, url: string) => {
    const token = await user?.getIdToken()
    const headers = {
      Authorization: `Bearer ${token}`,
    }

    const res = await axios.post(
      url,
      {
        name: user.displayName,
        terms_version: termsLatestVersion,
        privacy_version: privacyLatestVersion,
      },
      { headers },
    )
    return res.data.message
  }

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    setIsRegistering(true)
    try {
      setIdToken(undefined)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      )

      const createdUser = userCredential.user
      await updateProfile(createdUser, { displayName: data.name })
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/registration`
      const message = await verifyIdToken(createdUser, url)

      setSnackbar({
        message: message,
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
      setIdToken(null)
    } finally {
      setIsRegistering(false)
    }
  }

  const handleGuestLogin = async () => {
    setIsGuestLoggingIn(true)
    try {
      setIdToken(undefined)
      const userCredential = await signInAnonymously(auth)
      const guestUser = userCredential.user
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/guest_registration`
      const message = await verifyIdToken(guestUser, url)

      setSnackbar({
        message: message,
        severity: 'success',
        pathname: redirectPath,
      })
      await router.push(redirectPath)
    } catch (err) {
      const { errorMessage } = handleError(err)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: '/auth/signup',
      })
      setIdToken(null)
    } finally {
      setIsGuestLoggingIn(false)
    }
  }

  return (
    <>
      {/* タブの表示 */}
      <HelmetProvider>
        <Helmet>
          <title>新規登録 | Nput</title>
        </Helmet>
      </HelmetProvider>

      <Container maxWidth="md" sx={{ pt: 6 }}>
        <Box sx={{ px: 2 }}>
          <Logo />
        </Box>
        <Container maxWidth="sm">
          <Box sx={{ textAlign: { xs: 'center', sm: 'start' }, mb: 4, pt: 4 }}>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 24, sm: 32 },
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              Nput へようこそ！
            </Typography>
          </Box>
          <Stack
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            spacing={3}
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
            <Stack>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={isTermsChecked}
                  onChange={(e) => setIsTermsChecked(e.target.checked)}
                />
                <Link href={`/terms/terms-v${termsLatestVersion}.md`}>
                  <Typography
                    sx={{
                      textDecoration: 'underline',
                      '&:hover': { fontWeight: 'bold' },
                    }}
                  >
                    利用規約
                  </Typography>
                </Link>
                <Typography>に同意する</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={isPrivacyChecked}
                  onChange={(e) => setIsPrivacyChecked(e.target.checked)}
                  sx={{ py: 0 }}
                />
                <Link href={`/privacy/privacy-v${privacyLatestVersion}.md`}>
                  <Typography
                    sx={{
                      textDecoration: 'underline',
                      '&:hover': { fontWeight: 'bold' },
                    }}
                  >
                    プライバシーポリシー
                  </Typography>
                </Link>
                <Typography>に同意する</Typography>
              </Box>
            </Stack>
            <LoadingButton
              variant="contained"
              type="submit"
              disabled={!isTermsChecked || !isPrivacyChecked}
              loading={isRegistering}
              sx={{
                fontSize: { xs: 14, sm: 16 },
                fontWeight: 'bold',
                color: 'white',
                width: '170px',
                borderRadius: 2,
              }}
            >
              新規登録する
            </LoadingButton>
          </Stack>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <LoadingButton
              variant="outlined"
              type="submit"
              onClick={handleGuestLogin}
              loading={isGuestLoggingIn}
              sx={{
                fontSize: { xs: 14, sm: 16 },
                fontWeight: 'bold',
                width: '170px',
                border: '2px solid',
                borderRadius: 2,
                height: { xs: '36.5px', sm: '40px' },
                mt: 3,
              }}
            >
              ゲストログイン
            </LoadingButton>

            <Box sx={{ display: { sm: 'flex' }, mt: 3 }}>
              <Typography>アカウントをお持ちの場合は</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Link href="/auth/login">
                  <Typography
                    sx={{
                      textDecoration: 'underline',
                      '&:hover': { fontWeight: 'bold' },
                    }}
                  >
                    ログイン
                  </Typography>
                </Link>
                <Typography>から</Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Container>
    </>
  )
}

export default SignUp
