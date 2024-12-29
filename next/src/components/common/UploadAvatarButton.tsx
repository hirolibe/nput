import { Avatar, Box, Button, Typography } from '@mui/material'
import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'
import { useRouter } from 'next/router'
import { useState, Dispatch, SetStateAction, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

type UploadAvatarButtonProps = {
  nickname?: string
  avatarUrl?: string
  userName?: string
  setImageSignedId?: Dispatch<SetStateAction<string | undefined>>
}

const UploadAvatarButton = (props: UploadAvatarButtonProps) => {
  const router = useRouter()
  const [, setSnackbar] = useSnackbarState()
  const { idToken } = useAuth()

  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    setAvatarUrl(props.avatarUrl)
  }, [setAvatarUrl, props.avatarUrl])

  const handleUploadAvatar = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/png, image/jpg, image/jpeg, image/gif'
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
        const imageUrl = `http://localhost:3000/rails/active_storage/blobs/redirect/${imageSignedId}/${image.name}`

        props.setImageSignedId?.(imageSignedId)
        setAvatarUrl(imageUrl)

        setSnackbar({
          message: 'アップロードが完了しました',
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

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/image_uploads`
    const headers = {
      Authorization: `Bearer ${idToken}`,
    }
    const res = await axios.post(url, formData, { headers })
    const data = camelcaseKeys(res.data, { deep: true })
    const signedId = data.signedId
    return signedId
  }

  return (
    <Button
      onClick={handleUploadAvatar}
      variant={'outlined'}
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
          alt={props.nickname || props.userName}
          src={avatarUrl}
          sx={{
            width: 90,
            height: 90,
            mb: 1,
          }}
        />
        <Typography sx={{ fontWeight: 'bold' }}>画像を変更する</Typography>
      </Box>
    </Button>
  )
}

export default UploadAvatarButton
