import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import { IconButton } from '@mui/material'
import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

interface ImageUploadButtonProps {
  setImageSignedIds: Dispatch<SetStateAction<string | string[] | undefined>>
  isMultiple?: boolean
  setContent?: Dispatch<SetStateAction<string>>
  preCursorText?: string
  postCursorText?: string
  backgroundColor?: boolean
  hoverIconColor?: boolean
}

const ImageUploadButton = (props: ImageUploadButtonProps) => {
  const router = useRouter()
  const [, setSnackbar] = useSnackbarState()
  const { idToken } = useAuth()
  const {
    setImageSignedIds,
    isMultiple = false,
    setContent,
    preCursorText,
    postCursorText,
    backgroundColor,
    hoverIconColor,
  } = props

  const handleUploadImages = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
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

      const imageSignedIdList: string[] = []
      const imageTagList: string[] = []
      const promises = Array.from(images).map(async (image: File) => {
        try {
          const imageSignedId = await uploadImage(image)
          imageSignedIdList.push(imageSignedId)

          const imageUrl = `http://localhost:3000/rails/active_storage/blobs/redirect/${imageSignedId}/${image.name}`
          const imgTag = `<img src="${imageUrl}" alt="image" width=700 />`
          imageTagList.push(imgTag)
        } catch (err) {
          const { errorMessage } = handleError(err)
          setSnackbar({
            message: errorMessage,
            severity: 'error',
            pathname: router.pathname,
          })
        }
      })
      await Promise.all(promises)

      if (isMultiple) {
        setImageSignedIds(imageSignedIdList)
      } else {
        setImageSignedIds(imageSignedIdList[0])
      }

      if (setContent) insertImageTagsAtCursor(imageTagList)

      setSnackbar({
        message: 'アップロードが完了しました',
        severity: 'success',
        pathname: router.pathname,
      })
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

  const insertImageTagsAtCursor = (imageTagList: string[]) => {
    const imageTags = imageTagList.join('\n')
    const newContent = `${preCursorText}${imageTags}${postCursorText}`
    setContent?.(newContent)
  }

  return (
    <IconButton
      onClick={handleUploadImages}
      sx={{
        backgroundColor: backgroundColor ? 'white' : undefined,
        '&:hover': {
          backgroundColor: backgroundColor
            ? 'backgroundColor.hover'
            : 'transparent',
        },
      }}
    >
      <AddPhotoAlternateOutlinedIcon
        sx={{
          fontSize: '25px',
          color: 'text.light',
          '&:hover': {
            color: hoverIconColor ? 'black' : undefined,
          },
        }}
      />
    </IconButton>
  )
}

export default ImageUploadButton
