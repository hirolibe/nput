import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import { IconButton, Tooltip } from '@mui/material'
import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction } from 'react'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

export interface UploadImagesButtonProps {
  setImageSignedIds: Dispatch<SetStateAction<string | string[] | undefined>>
  setContent?: Dispatch<SetStateAction<string>>
  preCursorText?: string
  postCursorText?: string
  setIsChanged?: Dispatch<SetStateAction<boolean>>
  saveContent?: (content: string) => void
}

export const UploadImagesButton = (props: UploadImagesButtonProps) => {
  const router = useRouter()
  const [, setSnackbar] = useSnackbarState()
  const { idToken } = useAuthContext()
  const {
    setImageSignedIds,
    setContent,
    preCursorText,
    postCursorText,
    setIsChanged,
    saveContent,
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

          const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/rails/active_storage/blobs/redirect/${imageSignedId}/${image.name}`
          const imgTag = `<img src="${imageUrl}" alt="image" width=700 />`
          imageTagList.push(imgTag)
        } catch (err) {
          const { errorMessage } = handleError(err)
          setSnackbar({
            message: errorMessage,
            severity: 'error',
            pathname: router.pathname,
          })
          return
        }
      })
      await Promise.all(promises)

      if (imageSignedIdList.length === 0) return

      setImageSignedIds(imageSignedIdList)

      if (setContent) insertImageTagsAtCursor(imageTagList)
      if (setIsChanged) setIsChanged(true)

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

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/image_uploads/upload`
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
    saveContent?.(newContent)
  }

  return (
    <Tooltip title="画像">
      <IconButton
        onClick={handleUploadImages}
        sx={{
          width: '46px',
          height: '46px',
          '&:hover': { backgroundColor: 'backgroundColor.hover' },
        }}
      >
        <AddPhotoAlternateOutlinedIcon
          sx={{
            fontSize: '25px',
            color: 'text.light',
          }}
        />
      </IconButton>
    </Tooltip>
  )
}
