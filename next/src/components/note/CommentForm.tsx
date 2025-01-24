import { LoadingButton } from '@mui/lab'
import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
  TextField,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import AuthLinks from '../auth/AuthLinks'
import { UploadImagesButton } from '../common/UploadImagesButton'
import MarkdownText from './MarkdownText'
import { useAuthContext } from '@/hooks/useAuthContext'
import { CommentData } from '@/hooks/useNote'
import { useProfile } from '@/hooks/useProfile'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

interface CommentFormData {
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
  const { idToken } = useAuthContext()
  const { profileData } = useProfile()
  const { name, slug } = router.query
  const [authorName, noteSlug] = [name, slug].map((value) =>
    typeof value === 'string' ? value : undefined,
  )
  const { handleSubmit, control } = useForm<CommentFormData>({
    defaultValues: { content: '' },
  })
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')
  const theme = useTheme()

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [cursorPosition, setCursorPosition] = useState<number | null>(null)
  const [preCursorText, setPreCursorText] = useState<string>('')
  const [postCursorText, setPostCursorText] = useState<string>('')

  useEffect(() => {
    setPreCursorText(comment?.slice(0, cursorPosition ?? undefined))
    setPostCursorText(comment?.slice(cursorPosition ?? undefined))
  }, [comment, cursorPosition, setPreCursorText, setPostCursorText])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setComment(e.target.value)
    const position = textareaRef.current?.selectionStart || 0
    setCursorPosition(position)
  }

  const updateCursorPosition = () => {
    const position = textareaRef.current?.selectionStart || 0
    setCursorPosition(position)
  }

  const handleViewMode = (mode: 'edit' | 'preview') => {
    setViewMode(mode)
  }

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

  const onSubmit: SubmitHandler<CommentFormData> = async () => {
    if (!comment.trim()) return

    setIsLoading(true)
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${authorName}/notes/${noteSlug}/comments`
    const commentData = { content: comment, image_signed_ids: imageSignedIds }
    const headers = { Authorization: `Bearer ${idToken}` }

    try {
      const res = await axios.post(url, commentData, { headers })
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
    <>
      {!idToken && (
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <Typography
            sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.light' }}
          >
            ログインまたは新規登録してコメントする
          </Typography>
          <AuthLinks />
        </Stack>
      )}
      {idToken && (
        <Box>
          {/* コメント投稿ヘッダー */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              alt={profileData?.nickname || profileData?.user.name}
              src={profileData?.avatarUrl}
              sx={{ mr: 3 }}
            />

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
                    value={comment}
                    onChange={(e) => {
                      field.onChange(e)
                      handleChange(e)
                    }}
                    onClick={updateCursorPosition}
                    onKeyUp={updateCursorPosition}
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '14px', sm: '16px' },
                        lineHeight: '25.6px',
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              />
            ) : (
              // プレビュー画面
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'grey.400',
                  borderRadius: 2,
                  minHeight: '163px',
                  overflowWrap: 'break-word',
                  px: '13px',
                  py: '15.5px',
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
                mt: 1,
              }}
            >
              <UploadImagesButton
                setImageSignedIds={setImageSignedIds}
                setContent={setComment}
                preCursorText={preCursorText}
                postCursorText={postCursorText}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  loading={isLoading}
                  disabled={!comment?.trim()}
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    borderRadius: 2,
                  }}
                >
                  投稿する
                </LoadingButton>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}

export default CommentForm
