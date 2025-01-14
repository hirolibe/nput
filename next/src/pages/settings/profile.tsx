import { LoadingButton } from '@mui/lab'
import { Box, Card, Container, Stack, TextField } from '@mui/material'
import axios from 'axios'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import Error from '@/components/common/Error'
import Loading from '@/components/common/Loading'
import SettingTabs from '@/components/user/SettingTabs'
import UploadAvatarButton from '@/components/user/UploadAvatarButton'
import { useAuthContext } from '@/hooks/useAuthContext'
import useEnsureAuth from '@/hooks/useAuthenticationCheck'
import { useProfile } from '@/hooks/useProfile'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { styles } from '@/styles'
import { handleError } from '@/utils/handleError'

type ProfileFormData = {
  nickname: string
  bio: string
  x_username: string
  github_username: string
}

const EditProfile: NextPage = () => {
  useEnsureAuth()

  const [, setSnackbar] = useSnackbarState()
  const { idToken } = useAuthContext()
  const router = useRouter()
  const { profileData, profileError } = useProfile()

  const [isFetched, setIsFetched] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [tabIndex, setTabIndex] = useState<number>(1)

  const { handleSubmit, control, reset } = useForm<ProfileFormData>({
    defaultValues: { ...profileData },
  })

  const validationRules = {
    nickname: {
      maxLength: {
        value: 30,
        message: '30文字以内で入力してください',
      },
    },
    bio: {
      maxLength: {
        value: 120,
        message: '120文字以内で入力してください',
      },
    },
  }

  useEffect(() => {
    if (profileData === undefined) return

    const profile = {
      nickname: profileData?.nickname,
      bio: profileData?.bio,
      x_username: profileData?.xUsername,
      github_username: profileData?.githubUsername,
    }
    reset(profile)

    setIsFetched(true)
  }, [profileData, reset, setIsFetched])

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    setIsLoading(true)

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`
    const patchData = { profile: { ...data } }
    const headers = { Authorization: `Bearer ${idToken}` }

    try {
      const res = await axios.patch(url, patchData, { headers })
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
    }
  }

  if (profileError) {
    const { statusCode, errorMessage } = handleError(profileError)
    return <Error statusCode={statusCode} errorMessage={errorMessage} />
  }

  if (!idToken || !isFetched) {
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
          <title>プロフィールの編集 | Nput</title>
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
          <Card>
            <SettingTabs tabIndex={tabIndex} setTabIndex={setTabIndex} />
            <Box
              sx={{
                px: { xs: 2, sm: 8, md: 15 },
                pt: 4,
                pb: 5,
              }}
            >
              {/* アバター画像 */}
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <UploadAvatarButton />
              </Box>

              <Stack
                component="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                spacing={4}
                sx={{ alignItems: 'center' }}
              >
                <Controller
                  name="nickname"
                  control={control}
                  rules={validationRules.nickname}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      type="text"
                      label="ニックネーム"
                      error={fieldState.invalid}
                      helperText={fieldState.error?.message}
                      sx={{
                        backgroundColor: 'white',
                        width: '100%',
                      }}
                    />
                  )}
                />
                <Controller
                  name="bio"
                  control={control}
                  rules={validationRules.bio}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      type="textarea"
                      label="自己紹介"
                      error={fieldState.invalid}
                      helperText={fieldState.error?.message}
                      multiline
                      minRows={1}
                      sx={{ width: '100%' }}
                    />
                  )}
                />
                <Stack direction={'row'} spacing={2} sx={{ width: '100%' }}>
                  <Controller
                    name="x_username"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        type="text"
                        label="X(Twitter)ユーザー名"
                        error={fieldState.invalid}
                        helperText={fieldState.error?.message}
                        sx={{ width: '100%' }}
                      />
                    )}
                  />
                  <Controller
                    name="github_username"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        type="text"
                        label="GitHubユーザー名"
                        error={fieldState.invalid}
                        helperText={fieldState.error?.message}
                        sx={{ width: '100%' }}
                      />
                    )}
                  />
                </Stack>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  loading={isLoading}
                  sx={{
                    fontWeight: 'bold',
                    borderRadius: 2,
                    color: 'white',
                    width: '30%',
                    minWidth: '200px',
                  }}
                >
                  更新する
                </LoadingButton>
              </Stack>
            </Box>
          </Card>
        </Container>
      </Box>
    </>
  )
}

export default EditProfile
