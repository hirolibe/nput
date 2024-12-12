import { LoadingButton } from '@mui/lab'
import { Avatar, Box, Button, Typography, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import ImageUploadButton from '../common/ImageUploadButton'
import MarkdownText from './MarkdownText'
import { useAuth } from '@/hooks/useAuth'
import { CommentData } from '@/hooks/useNote'
import { useProfile } from '@/hooks/useProfile'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

type SignUpFormData = {
  content: string
}

const CommentForm = ({
  addComment,
}: {
  addComment: (comment: CommentData) => void
}) => {
  const router = useRouter()
  const [, setSnackbar] = useSnackbarState()
  const [isLoading, setIsLoading] = useState(false)
  const [comment, setComment] = useState('')
  const [imageSignedIds, setImageSignedIds] = useState<
    string | string[] | undefined
  >(undefined)
  const { idToken } = useAuth()
  const { profileData } = useProfile()
  const { name, id } = router.query
  const [nameString, idString] = [name, id].map((value) =>
    typeof value === 'string' ? value : undefined,
  )
  const { handleSubmit, control } = useForm<SignUpFormData>({
    defaultValues: { content: '' },
  })
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')
  const theme = useTheme()

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const textarea = textareaRef.current
  const cursorPosition = textarea?.selectionStart
  const preCursorText = comment?.slice(0, cursorPosition)
  const postCursorText = comment?.slice(cursorPosition)

  type ButtonStyles = {
    isActive: boolean
    primary: string
    textLight: string
  }

  const buttonStyles = ({ isActive, primary, textLight }: ButtonStyles) => ({
    height: { xs: '30px', sm: '40px' },
    borderRadius: '50px',
    fontSize: { xs: '10px', sm: '16px' },
    fontWeight: 'bold',
    backgroundColor: isActive ? primary : 'white',
    color: isActive ? 'white' : textLight,
    px: { xs: 1, sm: 2 },
    '&:hover': {
      backgroundColor: isActive ? primary : 'white',
      color: isActive ? 'white' : primary,
    },
  })

  const handleViewMode = (mode: 'edit' | 'preview') => {
    setViewMode(mode)
  }

  const onSubmit: SubmitHandler<SignUpFormData> = async () => {
    if (!comment.trim() || !profileData) return

    setIsLoading(true)
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${nameString}/notes/${idString}/comments`
    const headers = { Authorization: `Bearer ${idToken}` }

    try {
      const res = await axios.post(
        url,
        { content: comment, image_signed_ids: imageSignedIds },
        { headers },
      )
      const newComment = camelcaseKeys(res.data, { deep: true })
      addComment(newComment)
      setComment('')
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

  return (
    <Box>
      {/* コメント投稿ヘッダー */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          alt={profileData?.nickname || profileData?.user.name}
          src={profileData?.avatarUrl}
          sx={{ mr: 3 }}
        />
        {/* <Typography sx={{ mr: 3 }}>コメントする</Typography> */}
        {/* モード切り替えボタン */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            height: '40px',
          }}
        >
          <Button
            onClick={() => handleViewMode('edit')}
            sx={buttonStyles({
              isActive: viewMode === 'edit',
              primary: theme.palette.primary.main,
              textLight: theme.palette.text.light,
            })}
          >
            エディタ
          </Button>
          <Button
            onClick={() => handleViewMode('preview')}
            sx={buttonStyles({
              isActive: viewMode === 'preview',
              primary: theme.palette.primary.main,
              textLight: theme.palette.text.light,
            })}
          >
            プレビュー
          </Button>
        </Box>
      </Box>

      {/* コメントフォーム */}
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* 入力欄 */}
        {viewMode === 'edit' ? (
          <Controller
            name="content"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                placeholder="ノートにコメントする"
                fullWidth
                multiline
                rows={5}
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                variant="outlined"
                inputRef={textareaRef}
                onChange={(e) => {
                  field.onChange(e)
                  setComment(e.target.value)
                }}
                value={comment}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '14px', sm: '16px' },
                  },
                }}
              />
            )}
          />
        ) : (
          // プレビュー画面
          <Box
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: 'grey.400',
              borderRadius: 1,
              minHeight: '148px',
              overflowWrap: 'break-word',
            }}
          >
            {comment ? (
              <MarkdownText content={comment} />
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '114px',
                }}
              >
                <Typography
                  sx={{
                    color: 'text.light',
                    fontSize: { xs: '14px', sm: '16px' },
                  }}
                >
                  コメントが入力されていません
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* 画像追加ボタン・投稿ボタン */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <ImageUploadButton
            setImageSignedIds={setImageSignedIds}
            isMultiple={true}
            setContent={setComment}
            preCursorText={preCursorText}
            postCursorText={postCursorText}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <LoadingButton
              variant="contained"
              type="submit"
              loading={isLoading}
              disabled={!comment?.trim()}
              sx={{
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              投稿する
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default CommentForm
