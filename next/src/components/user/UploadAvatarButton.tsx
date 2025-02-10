import { Avatar, Box, Button, Typography } from '@mui/material'
import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'
import { useRouter } from 'next/router'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useProfile } from '@/hooks/useProfile'
import { useProfileContext } from '@/hooks/useProfileContext'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

const UploadAvatarButton = () => {
  const router = useRouter()
  const [, setSnackbar] = useSnackbarState()
  const { idToken } = useAuthContext()
  const { avatarUrl, setAvatarUrl } = useProfileContext()
  const { profileData } = useProfile()
  const currentUserName = profileData?.user.name
  const currentUserNickname = profileData?.nickname

  const handleUploadAvatar = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/png, image/jpeg, image/webp'
    input.click()

    input.addEventListener('change', async (event) => {
      const target = event.target as HTMLInputElement
      const images = target.files
      if (!images?.length) return

      setSnackbar({
        message: 'アップロード中･･･',
        severity: 'info',
        pathname: router.pathname,
        autoHideDuration: null,
      })

      const image = images[0]

      try {
        const imageSignedId = await uploadImage(image)
        const message = await attachAvatarImage(imageSignedId)

        const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/rails/active_storage/blobs/redirect/${imageSignedId}/${image.name}`
        setAvatarUrl(imageUrl)

        setSnackbar({
          message: message,
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
      }
    })
  }

  const uploadImage = async (image: File) => {
    const formData = new FormData()
    formData.append('image', image)

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/image_uploads/upload`
    const headers = { Authorization: `Bearer ${idToken}` }

    const res = await axios.post(url, formData, { headers })
    const data = camelcaseKeys(res.data, { deep: true })
    const signedId = data.signedId
    return signedId
  }

  const attachAvatarImage = async (imageSignedId: string | undefined) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/image_uploads/attach_avatar`
    const imageIdData = { image_signed_id: imageSignedId }
    const headers = { Authorization: `Bearer ${idToken}` }
    const res = await axios.post(url, imageIdData, { headers })
    return res.data.message
  }

  return (
    <Button
      onClick={handleUploadAvatar}
      variant={'outlined'}
      disableRipple
      sx={{
        color: 'text.light',
        border: 'none',
        '&:hover': {
          color: 'black',
          border: 'none',
          backgroundColor: 'white',
        },
      }}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Avatar
          alt={currentUserNickname || currentUserName}
          src={avatarUrl}
          sx={{
            width: 90,
            height: 90,
            mb: 1,
          }}
        />
        <Typography sx={{ fontSize: 14 }}>画像を変更する</Typography>
      </Box>
    </Button>
  )
}

export default UploadAvatarButton
