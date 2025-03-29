import { LoadingButton } from '@mui/lab'
import {
  Box,
  Checkbox,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { deleteUser } from 'aws-amplify/auth'
import axios from 'axios'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { mutate } from 'swr'
import Loading from '@/components/common/Loading'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useProfile } from '@/hooks/useProfile'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { styles } from '@/styles'
import getDocumentVersion from '@/utils/getDocumentVersion'
import { handleError } from '@/utils/handleError'

interface SignUpFormData {
  name: string
}

const Init: NextPage = () => {
  const { idToken } = useAuthContext()

  const [isChecked, setIsChecked] = useState<boolean>(false)

  const [isRegistering, setIsRegistering] = useState(false)
  // const [isCanceling, setIsCanceling] = useState(false)

  const [, setSnackbar] = useSnackbarState()
  const router = useRouter()
  const { profileData, profileError } = useProfile()
  const [redirectPath, setRedirectPath] = useState<string | undefined>(
    undefined,
  )

  useEffect(() => {
    const storedPath = localStorage.getItem('previousPath') || '/'
    setRedirectPath(storedPath)
  }, [])

  useEffect(() => {
    if (profileError) {
      const { errorMessage } = handleError(profileError)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: '/',
      })
      router.push('/')
      return
    }
  }, [profileError, router, setSnackbar])

  useEffect(() => {
    if (profileError || !profileData || redirectPath === undefined) return

    setSnackbar({
      message: 'ログインに成功しました！',
      severity: 'success',
      pathname: redirectPath,
    })

    setTimeout(() => {
      router.push(redirectPath)
    }, 0)
  }, [profileError, setSnackbar, profileData, router, redirectPath])

  const { handleSubmit, control } = useForm<SignUpFormData>({
    defaultValues: { name: '' },
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
  }

  const createAccount = async (data: SignUpFormData) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/registration`

    const name = data.name
    const { termsVersion, privacyVersion } = await getDocumentVersion()
    const consentDate = new Date()

    const headers = { Authorization: `Bearer ${idToken}` }

    await axios.post(
      url,
      {
        name,
        terms_version: termsVersion,
        privacy_version: privacyVersion,
        consent_date: consentDate,
      },
      { headers },
    )
  }

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    if (redirectPath === undefined) return
    setIsRegistering(true)

    try {
      await createAccount(data)

      // SWRのキャッシュを強制再検証
      const profileUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`
      mutate([profileUrl, idToken])

      setSnackbar({
        message: '新規登録に成功しました！',
        severity: 'success',
        pathname: redirectPath,
      })

      router.push(redirectPath)
    } catch (err) {
      const { errorMessage } = handleError(err)

      setSnackbar({
        message: `${errorMessage} 登録し直してください`,
        severity: 'error',
        pathname: '/auth/init',
      })
    } finally {
      setIsRegistering(false)
    }
  }

  // const handleCancel = async () => {
  //   if (redirectPath === undefined) return
  //   setIsCanceling(true)

  //   try {
  //     await deleteUser()
  //     router.push(redirectPath)
  //   } catch (err) {
  //     const { errorMessage } = handleError(err)
  //     setSnackbar({
  //       message: errorMessage,
  //       severity: 'error',
  //       pathname: '/auth/init',
  //     })
  //   } finally {
  //     setIsCanceling(false)
  //   }
  // }

  if (profileData !== null) {
    return (
      <Box
        css={styles.pageMinHeight}
        sx={{ display: 'flex', justifyContent: 'center' }}
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
          <title>新規登録 | Nput</title>
        </Helmet>
      </HelmetProvider>

      <Container maxWidth="sm" sx={{ pt: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 4, pt: 4 }}>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 24, sm: 32 },
              fontWeight: 'bold',
              mb: 6,
            }}
          >
            Nput へようこそ！
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 16, sm: 20 },
            }}
          >
            ユーザー名を登録して利用を開始しましょう
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
          <Typography sx={{ color: 'text.light' }}>新規登録には、利用規約とプライバシーポリシーへの同意が必要です。</Typography>
          <Stack>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <Link href={'/terms'} target="_blank" rel="noopener noreferrer">
                <Typography
                  sx={{
                    textDecoration: 'underline',
                    '&:hover': { fontWeight: 'bold' },
                  }}
                >
                  利用規約
                </Typography>
              </Link>
              <Typography>と</Typography>
              <Link href={'/privacy'} target="_blank" rel="noopener noreferrer">
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
            disabled={!isChecked}
            loading={isRegistering}
            sx={{
              fontSize: { xs: 14, sm: 16 },
              fontWeight: 'bold',
              color: 'white',
              width: '170px',
              borderRadius: 2,
              '&.Mui-disabled': {
                backgroundColor: '#50A0B4',
                opacity: 0.6,
                color: 'white',
              }
            }}
          >
            新規登録する
          </LoadingButton>
          {/* <LoadingButton
            onClick={handleCancel}
            variant="outlined"
            type="submit"
            loading={isCanceling}
            sx={{
              fontSize: { xs: 14, sm: 16 },
              fontWeight: 'bold',
              color: 'text.placeholder',
              width: '170px',
              border: 'none',
              borderRadius: 2,
            }}
          >
            登録をキャンセル
          </LoadingButton> */}
        </Stack>
      </Container>
    </>
  )
}

export default Init
