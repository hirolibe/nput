import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined'
import { LoadingButton } from '@mui/lab'
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  Fade,
  IconButton,
  Stack,
  Switch,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import axios from 'axios'
import type { NextPage, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'
import { useEffect, useState, useRef, useMemo } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import CheerPoints from '@/components/common/CheerPoints'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import MarkdownText from '@/components/note/MarkdownText'
import MarkdownToolbar from '@/components/note/MarkdownToolbar'
import { RestoreConfirmDialog } from '@/components/note/RestoreConfirmDialog'
import TimeTracker from '@/components/note/TimeTracker'
import { useAuthContext } from '@/hooks/useAuthContext'
import useEnsureAuth from '@/hooks/useAuthenticationCheck'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { TagData, useTags } from '@/hooks/useTags'
import { NoteData } from '@/pages/[name]/notes/[slug]'
import { styles } from '@/styles'
import { fetcher } from '@/utils/fetcher'
import { handleError } from '@/utils/handleError'

interface EditNoteProps {
  initialIdToken: string
  noteData: NoteData
}

interface NoteFormData {
  title: string
  description: string
  content: string
  status?: string
  tags: string[]
}

export const getServerSideProps: GetServerSideProps<EditNoteProps> = async (
  context,
) => {
  const cookies = parseCookies(context)
  const idToken = cookies['firebase_auth_token']

  if (!idToken) {
    console.log('トークンがありません')
    return {
      notFound: true,
    }
  }

  const { slug } = context.query

  if (typeof slug !== 'string') {
    return {
      notFound: true,
    }
  }

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_INTERNAL_API_BASE_URL ?? // 開発環境ではコンテナ間通信
      process.env.NEXT_PUBLIC_API_BASE_URL // 本番環境ではALB経由

    const noteData: NoteData = await fetcher([
      `${baseUrl}/my_notes/${slug}`,
      idToken,
    ])

    if (!noteData) {
      return { notFound: true }
    }

    return { props: { initialIdToken: idToken, noteData } }
  } catch (err) {
    handleError(err)
    return { notFound: true }
  }
}

const EditNote: NextPage<EditNoteProps> = (props) => {
  useEnsureAuth()

  const { initialIdToken, noteData } = props
  const note: NoteFormData | undefined = useMemo(() => {
    return {
      title: noteData?.title ?? '',
      description: noteData?.description ?? '',
      content: noteData?.content ?? '',
      status: noteData?.statusJp ?? '未保存',
      tags: noteData?.tags?.map((tag) => tag.name) ?? [],
    }
  }, [noteData])

  const [, setSnackbar] = useSnackbarState()
  const { idToken } = useAuthContext()

  const [token, setToken] = useState<string | null | undefined>(initialIdToken)

  useEffect(() => {
    setToken(idToken)
  }, [idToken])

  const router = useRouter()
  const { slug } = router.query
  const noteSlug = typeof slug === 'string' ? slug : undefined

  const { tagsData } = useTags()
  const [tagOptions, setTagsOptions] = useState<TagData[]>([])
  useEffect(() => {
    setTagsOptions(tagsData)
  }, [tagsData])

  const [sessionSeconds, setSessionSeconds] = useState<number>(0)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const timer = setInterval(() => {
        setSessionSeconds((prevTime) => prevTime + 1)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [])

  const [content, setContent] = useState<string>(note.content)
  const [inputTags, setInputTags] = useState<string[]>(note.tags)
  const [statusChecked, setStatusChecked] = useState<boolean>(
    note.status == '公開中',
  )
  const [isPreviewActive, setIsPreviewActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [maxLengthError, setMaxLengthError] = useState<boolean>(false)
  const [maxTagsError, setMaxTagsError] = useState<boolean>(false)
  const [formatError, setFormatError] = useState<boolean>(false)
  const [charCount, setCharCount] = useState<number>(0)
  const [openSidebar, setOpenSidebar] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')

  const [remainingSeconds, setRemainingSeconds] = useState<number>(0)
  const [previousSessionSeconds, setPreviousSessionSeconds] =
    useState<number>(0)

  const [openBackConfirmDialog, setOpenBackConfirmDialog] =
    useState<boolean>(false)
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] =
    useState<boolean>(false)
  const [noteSlugToDelete, setNoteSlugToDelete] = useState<string | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [cursorPosition, setCursorPosition] = useState<number | null>(null)
  const [preCursorText, setPreCursorText] = useState<string>('')
  const [postCursorText, setPostCursorText] = useState<string>('')

  const { saveContent, loadSavedContent, removeSavedContent } = useLocalStorage(
    noteSlug || '',
  )
  const [restoreContent, setRestoreContent] = useState<string>('')
  const loadedContent = useMemo(() => loadSavedContent(), [loadSavedContent])

  useEffect(() => {
    if (loadedContent) setRestoreContent(loadedContent)
  }, [loadedContent])

  const [openRestoreConfirmDialog, setOpenRestoreConfirmDialog] =
    useState<boolean>(false)

  const handleOpenRestoreConfirmDialog = () => {
    setOpenRestoreConfirmDialog(true)
  }

  const handleRestore = () => {
    setContent(restoreContent)
    setRestoreContent('')
    setOpenRestoreConfirmDialog(false)
  }

  const handleRejectRestore = () => {
    setRestoreContent('')
    setOpenRestoreConfirmDialog(false)
  }

  const handleCloseRestoreConfirmDialog = () => {
    setOpenRestoreConfirmDialog(false)
  }

  useEffect(() => {
    setPreCursorText(content?.slice(0, cursorPosition ?? undefined))
    setPostCursorText(content?.slice(cursorPosition ?? undefined))
  }, [content, cursorPosition, setPreCursorText, setPostCursorText])

  const handleContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = e.target.value
    setContent(newValue)
    const position = textareaRef.current?.selectionStart || 0
    setCursorPosition(position)
    if (!restoreContent) saveContent(newValue)
  }

  const handleInputChange = (newInputValue: string) => {
    setFormatError(false)
    setMaxLengthError(false)
    setMaxTagsError(false)

    if (!newInputValue) {
      setInputValue('')
      return
    }

    const formatRegex = /^[a-zA-Z0-9ａ-ｚＡ-Ｚ０-９ぁ-んァ-ン一-龯]+$/
    if (!formatRegex.test(newInputValue)) {
      setFormatError(true)
      return
    }

    const maxTagLength = 20
    if (newInputValue.length > maxTagLength) {
      setMaxLengthError(true)
      return
    }

    const maxTags = 5
    if (inputTags.length >= maxTags) {
      setMaxTagsError(true)
      return
    }

    setInputValue(newInputValue)
    setIsChanged(true)
  }

  const updateCursorPosition = () => {
    const position = textareaRef.current?.selectionStart || 0
    setCursorPosition(position)
  }

  const [imageSignedIds, setImageSignedIds] = useState<
    string | string[] | undefined
  >(undefined)

  const validationRules = {
    title: {
      maxLength: {
        value: 70,
        message: '70文字以内で入力してください',
      },
    },
    description: {
      maxLength: {
        value: 200,
        message: '200文字以内で入力してください',
      },
    },
  }

  const { handleSubmit, control, reset, watch, formState } =
    useForm<NoteFormData>({
      defaultValues: note,
    })
  const { isDirty } = formState
  const [isChanged, setIsChanged] = useState<boolean>(false)
  useEffect(() => {
    setIsChanged(isDirty)
  }, [setIsChanged, isDirty])

  useEffect(() => {
    reset(note)
  }, [note, reset])

  const togglePreviewDisplay = () => {
    setIsPreviewActive(!isPreviewActive)
  }

  const toggleStatusChecked = () => {
    setStatusChecked(!statusChecked)
  }

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar)
  }

  const onSubmit: SubmitHandler<NoteFormData> = async (data) => {
    if (statusChecked && (data.title == '' || data.content == '')) {
      return setSnackbar({
        message: 'タイトルまたは本文が入力されていません',
        severity: 'error',
        pathname: router.pathname,
      })
    }

    setIsLoading(true)

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/my_notes/${slug}`

    const status = statusChecked ? 'published' : 'draft'
    const workDuration =
      remainingSeconds + sessionSeconds - previousSessionSeconds
    const patchData = {
      note: {
        ...data,
        content: content,
        status: status,
        image_signed_ids: imageSignedIds,
      },
      tag_names: inputTags,
      duration: workDuration,
    }

    const headers = { Authorization: `Bearer ${token}` }

    try {
      const res = await axios.patch(url, patchData, { headers })

      setRemainingSeconds((sessionSeconds - previousSessionSeconds) % 60)
      setPreviousSessionSeconds(sessionSeconds)

      setSnackbar({
        message: res.data.message,
        severity: 'success',
        pathname: router.pathname,
      })

      removeSavedContent()
      setRestoreContent('')
      reset(data)
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

  const handleBackWithConfirmation = () => {
    if (isChanged) {
      setOpenBackConfirmDialog(true)
      return
    }
    router.push('/dashboard')
  }

  const handleBackConfirm = () => {
    setOpenBackConfirmDialog(false)
    router.push('/dashboard')
  }

  const handleCloseBackConfirmDialog = () => {
    setOpenBackConfirmDialog(false)
  }

  const handleDeleteNote = (noteSlug?: string) => {
    if (!noteSlug) return

    setNoteSlugToDelete(noteSlug)
    setOpenDeleteConfirmDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!noteSlugToDelete) return

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/my_notes/${noteSlug}`
    const headers = { Authorization: `Bearer ${token}` }

    try {
      await axios.delete(url, { headers })
      router.push('/dashboard')
    } catch (err) {
      const { errorMessage } = handleError(err)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: router.pathname,
      })
    } finally {
      setOpenDeleteConfirmDialog(false)
    }
  }

  const handleCloseDeleteConfirmDialog = () => {
    setOpenDeleteConfirmDialog(false)
  }

  return (
    <>
      {/* タブの表示 */}
      <HelmetProvider>
        <Helmet>
          <title>編集中 | Nput</title>
        </Helmet>
      </HelmetProvider>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          backgroundColor: 'backgroundColor.page',
          minHeight: '100vh',
          transition: 'margin 0.2s',
          mr: openSidebar ? '385px' : 0,
        }}
      >
        <AppBar
          position="fixed"
          sx={{
            color: 'black',
            backgroundColor: 'backgroundColor.page',
            boxShadow: 'none',
          }}
        >
          <Toolbar
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'margin 0.2s',
              marginRight: openSidebar ? '385px' : 0,
            }}
          >
            <Box sx={{ maxWidth: 35 }}>
              <IconButton onClick={handleBackWithConfirmation}>
                <ArrowBackSharpIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box>
                <Stack direction={'row'} spacing={3} sx={{ mr: 3 }}>
                  <Box
                    sx={{
                      display: {
                        xs: 'none',
                        md: openSidebar ? 'none' : 'flex',
                      },
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ mr: 3 }}>
                      <CheerPoints addedCheerPoints={sessionSeconds} />
                    </Box>

                    <Typography sx={{ mr: 1 }}>Total</Typography>
                    <TimeTracker
                      seconds={(noteData?.totalDuration ?? 0) + sessionSeconds}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: { xs: undefined, md: 'flex' },
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: 13, md: 15 },
                        mr: { xs: 0, md: 1 },
                        my: { xs: 0.5, md: 0 },
                      }}
                    >
                      Session
                    </Typography>
                    <TimeTracker seconds={sessionSeconds} />
                  </Box>
                </Stack>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                <Box
                  sx={{
                    display: { xs: undefined, md: 'flex' },
                    alignItems: 'center',
                    textAlign: 'center',
                    mr: 2,
                    mt: { xs: 1, md: 0 },
                  }}
                >
                  <Typography sx={{ fontSize: { xs: 13, md: 15 } }}>
                    公開設定
                  </Typography>
                  <Switch
                    checked={statusChecked}
                    onChange={toggleStatusChecked}
                  />
                </Box>
                <LoadingButton
                  variant={statusChecked ? 'contained' : 'outlined'}
                  type="submit"
                  loading={isLoading}
                  sx={{
                    color: statusChecked ? 'white' : 'primary',
                    fontWeight: 'bold',
                    fontSize: { xs: 14, md: 16 },
                    border: statusChecked ? 'none' : '2px solid',
                    borderRadius: 2,
                    width: { xs: '115px', md: '120px' },
                    height: '40px',
                  }}
                >
                  {statusChecked ? '公開する' : '下書き保存'}
                </LoadingButton>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* ローカルストレージのデータ復元 */}
        {restoreContent && (
          <Box
            sx={{
              backgroundColor: 'secondary.main',
            }}
          >
            <Box
              sx={{
                pt: 10,
                pb: 2,
                pl: 2,
                pr: openSidebar ? 4 : 2,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: { sm: 'flex' },
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    textAlign: 'center',
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: 'text.light',
                    mr: { xs: 0, sm: 3 },
                    mb: { xs: 1, sm: 0 },
                  }}
                >
                  保存されていないデータがあります
                </Typography>
                <Box sx={{ textAlign: { xs: 'center', sm: undefined } }}>
                  <Button
                    onClick={handleRejectRestore}
                    variant="contained"
                    sx={{
                      fontSize: { xs: 12, sm: 14 },
                      fontWeight: 'bold',
                      color: 'text.light',
                      boxShadow: 'none',
                      borderRadius: 50,
                      backgroundColor: 'white',
                      width: '90px',
                      height: '30px',
                      mr: 2,
                      '&:hover': {
                        boxShadow: 'none',
                        backgroundColor: 'backgroundColor.hover',
                      },
                    }}
                  >
                    削除する
                  </Button>
                  <Button
                    onClick={handleOpenRestoreConfirmDialog}
                    variant="contained"
                    sx={{
                      fontSize: { xs: 12, sm: 14 },
                      fontWeight: 'bold',
                      color: 'text.light',
                      boxShadow: 'none',
                      borderRadius: 50,
                      backgroundColor: 'white',
                      width: '90px',
                      height: '30px',
                      '&:hover': {
                        boxShadow: 'none',
                        backgroundColor: 'backgroundColor.hover',
                      },
                    }}
                  >
                    確認する
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* 復元確認のダイアログ */}
        <RestoreConfirmDialog
          open={openRestoreConfirmDialog}
          onReject={handleRejectRestore}
          onRestore={handleRestore}
          onClose={handleCloseRestoreConfirmDialog}
          currentContent={content}
          restoreContent={restoreContent}
        />

        {/* ノート */}
        <Fade in={true} timeout={{ enter: 1000 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              pt: restoreContent ? 0 : 10,
              pl: 2,
              pr: openSidebar ? 4 : 2,
              pb: 3,
            }}
          >
            {/* コンテンツ */}
            <Stack sx={{ alignItems: 'center', width: '100%' }}>
              {/* タイトル */}
              <Box sx={{ width: '90%', maxWidth: '1200px', mb: 3 }}>
                <Controller
                  name="title"
                  control={control}
                  rules={validationRules.title}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      type="text"
                      error={fieldState.invalid}
                      helperText={fieldState.error?.message}
                      variant="standard"
                      placeholder="タイトルを入力してください"
                      multiline
                      minRows={1}
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          '&:hover': {
                            borderBottom: '1px solid',
                          },
                          '&:focus-within': {
                            borderBottom: '1px solid',
                          },
                        },
                      }}
                      sx={{
                        '& .MuiInputBase-input': {
                          textAlign: 'center',
                          fontSize: { xs: 18, sm: 24, md: 36 },
                          fontWeight: 'bold',
                          lineHeight: '40px',
                        },
                      }}
                    />
                  )}
                />
              </Box>

              {/* 本文 */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                  maxWidth: '1400px',
                  mb: 8,
                }}
              >
                <Controller
                  name="content"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                      }}
                    >
                      <MarkdownToolbar
                        textareaRef={textareaRef}
                        onContentChange={(newContent) => {
                          setContent(newContent)
                          field.onChange(newContent)
                        }}
                        content={content || ''}
                        setImageSignedIds={setImageSignedIds}
                        setContent={setContent}
                        preCursorText={preCursorText}
                        postCursorText={postCursorText}
                        setIsChanged={setIsChanged}
                      />
                      <Box
                        sx={{
                          backgroundColor: 'white',
                          width: '100%',
                          minHeight: '600px',
                          px: 2,
                        }}
                      >
                        {!openSidebar && (
                          <Box
                            sx={{
                              display: 'flex',
                              width: '100%',
                              height: '100%',
                            }}
                          >
                            <Box
                              sx={{
                                width: {
                                  xs: isPreviewActive ? 0 : '100%',
                                  md: isPreviewActive ? '50%' : '100%',
                                },
                              }}
                            >
                              <TextField
                                {...field}
                                type="textarea"
                                error={fieldState.invalid}
                                helperText={fieldState.error?.message}
                                multiline
                                fullWidth
                                placeholder="本文を入力してください（マークダウン記法）"
                                inputRef={textareaRef}
                                value={content}
                                onChange={(e) => {
                                  field.onChange(e)
                                  handleContentChange(e)
                                }}
                                onClick={updateCursorPosition}
                                onKeyUp={updateCursorPosition}
                                minRows={23}
                                sx={{
                                  '& .MuiInputBase-input': {
                                    fontSize: { xs: 14, md: 16 },
                                  },
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                  },
                                }}
                              />
                            </Box>
                            {isPreviewActive && (
                              <Box
                                sx={{
                                  borderLeft: '0.5px solid',
                                  borderColor: 'divider',
                                  width: { xs: '100%', md: '50%' },
                                  minHeight: '600px',
                                  px: '14px',
                                  py: '16.5px',
                                }}
                              >
                                {content ? (
                                  <Box
                                    sx={{
                                      fontSize: { xs: 14, md: 16 },
                                      height: '100%',
                                    }}
                                  >
                                    <MarkdownText content={content} />
                                  </Box>
                                ) : (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      height: '100%',
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: { xs: 20, md: 24 },
                                        color: 'text.placeholder',
                                        fontFamily:
                                          'Roboto, Helvetica, Arial, sans-serif',
                                      }}
                                    >
                                      No content
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            )}
                          </Box>
                        )}
                        {openSidebar && (
                          <>
                            {!isPreviewActive && (
                              <Controller
                                name="content"
                                control={control}
                                render={({ field, fieldState }) => (
                                  <TextField
                                    {...field}
                                    type="textarea"
                                    error={fieldState.invalid}
                                    helperText={fieldState.error?.message}
                                    multiline
                                    fullWidth
                                    placeholder="本文を入力してください（マークダウン記法）"
                                    inputRef={textareaRef}
                                    value={content}
                                    onChange={(e) => {
                                      field.onChange(e)
                                      handleContentChange(e)
                                    }}
                                    onClick={updateCursorPosition}
                                    onKeyUp={updateCursorPosition}
                                    minRows={23}
                                    sx={{
                                      '& .MuiInputBase-input': {
                                        fontSize: { xs: 14, md: 16 },
                                      },
                                      '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none',
                                      },
                                    }}
                                  />
                                )}
                              />
                            )}
                            {isPreviewActive && (
                              <Box sx={{ px: '14px', py: '15.5px' }}>
                                {content ? (
                                  <Box
                                    sx={{
                                      fontSize: { xs: 14, md: 16 },
                                    }}
                                  >
                                    <MarkdownText content={content} />
                                  </Box>
                                ) : (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      height: '540px',
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: { xs: 20, md: 24 },
                                        color: 'text.placeholder',
                                        fontFamily:
                                          'Roboto, Helvetica, Arial, sans-serif',
                                      }}
                                    >
                                      No content
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            )}
                          </>
                        )}
                      </Box>
                    </Box>
                  )}
                />

                {/* ボタン（プレビュー表示・タグ入力欄表示・ノート削除） */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    position: 'fixed',
                    width: '300px',
                    bottom: '30px',
                    transition: '0.2s',
                    zIndex: 1000,
                  }}
                >
                  <Tooltip
                    title={
                      !isPreviewActive ? 'プレビューを表示' : 'エディタのみ表示'
                    }
                  >
                    <IconButton
                      onClick={togglePreviewDisplay}
                      sx={{
                        backgroundColor: !isPreviewActive
                          ? 'white'
                          : 'primary.main',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        '&:hover': {
                          backgroundColor: 'backgroundColor.hover',
                        },
                      }}
                    >
                      <PlayArrowOutlinedIcon
                        sx={{
                          fontSize: 30,
                          color: !isPreviewActive ? undefined : 'white',
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="タグ・概要を登録">
                    <IconButton
                      onClick={toggleSidebar}
                      sx={{
                        backgroundColor: 'white',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        width: '46px',
                        height: '46px',
                        '&:hover': {
                          backgroundColor: 'backgroundColor.hover',
                        },
                      }}
                    >
                      <SellOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="ノートを削除">
                    <IconButton
                      onClick={() => handleDeleteNote(noteSlug)}
                      sx={{
                        backgroundColor: 'white',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        width: '46px',
                        height: '46px',
                        '&:hover': {
                          backgroundColor: 'backgroundColor.hover',
                        },
                      }}
                    >
                      <DeleteOutlineIcon sx={{ color: '#f28b82' }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Stack>

            {/* 変更内容破棄の確認画面 */}
            <ConfirmDialog
              open={openBackConfirmDialog}
              onClose={handleCloseBackConfirmDialog}
              onConfirm={handleBackConfirm}
              message={'変更内容を保存せずに編集を終了しますか？'}
              confirmText="終了"
            />

            {/* ノート削除の確認画面 */}
            <ConfirmDialog
              open={openDeleteConfirmDialog}
              onClose={handleCloseDeleteConfirmDialog}
              onConfirm={handleDeleteConfirm}
              message={'ノートを削除しますか？'}
              confirmText="実行"
            />
          </Box>
        </Fade>

        <Drawer
          open={openSidebar}
          anchor="right"
          variant="persistent"
          sx={{
            borderTop: 'none',
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: { xs: '100%', md: '400px' },
              boxSizing: 'border-box',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '64px',
            }}
          >
            <IconButton onClick={toggleSidebar} sx={{ ml: 2 }}>
              <KeyboardDoubleArrowRightIcon />
            </IconButton>
            <Typography
              color={'text.light'}
              fontWeight={'bold'}
              fontSize={18}
              sx={{ ml: 1 }}
            >
              タグ・概要の登録
            </Typography>
          </Box>
          <Divider />

          <Box
            css={styles.pageMinHeight}
            style={{ width: '100%', padding: 20 }}
          >
            <Stack spacing={3}>
              {/* タグ入力フィールド */}
              <Box>
                <Typography
                  sx={{ fontWeight: 'bold', color: 'text.light', p: 1 }}
                >
                  タグ
                </Typography>
                <Box
                  sx={{
                    border: '1px solid',
                    borderRadius: 2,
                    borderColor: 'divider',
                    p: 2,
                  }}
                >
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        multiple
                        freeSolo
                        options={tagOptions?.map((tag) => tag.name)}
                        value={inputTags}
                        onChange={(_, newTagNames) => {
                          setFormatError(false)
                          setMaxLengthError(false)
                          if (maxTagsError) {
                            setMaxTagsError(false)
                            return
                          }

                          if (newTagNames.length > 5) {
                            setMaxTagsError(true)
                            return
                          }

                          setInputTags(newTagNames)
                        }}
                        renderTags={(value, getTagProps) => (
                          <Box>
                            {value.map((option, index) => {
                              const { key, ...tagProps } = getTagProps({
                                index,
                              })
                              return (
                                <Chip
                                  label={option}
                                  variant="outlined"
                                  deleteIcon={
                                    <CloseIcon
                                      sx={{ width: '16px', height: '16px' }}
                                    />
                                  }
                                  sx={{ fontSize: '12px', mr: 1 }}
                                  key={key}
                                  {...tagProps}
                                />
                              )
                            })}
                          </Box>
                        )}
                        renderOption={(props, option) => {
                          const tag = tagsData.find(
                            (tag) => tag.name === option,
                          )

                          return (
                            <li {...props}>
                              {option}{' '}
                              {tag?.notesCount ? `(${tag.notesCount})` : ''}
                            </li>
                          )
                        }}
                        inputValue={inputValue}
                        onInputChange={(_, value) => handleInputChange(value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={
                              !inputTags.length
                                ? 'タグは5つまで登録できます'
                                : ''
                            }
                            error={
                              maxTagsError || formatError || maxLengthError
                            }
                            helperText={
                              (maxTagsError &&
                                'タグは最大5つまで登録できます') ||
                              (formatError &&
                                'タグに記号とスペースは使用できません') ||
                              (maxLengthError && 'タグの最大文字数は20文字です')
                            }
                            sx={{
                              '& .MuiInputBase-root': {
                                p: 0,
                              },
                              '& .MuiOutlinedInput-input': {
                                p: 0,
                                minWidth: '200px',
                              },
                              '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                              },
                              '& .MuiFormHelperText-root': {
                                position: 'absolute',
                                top: '-52px',
                                left: '36px',
                                color: 'error',
                              },
                            }}
                          />
                        )}
                      />
                    )}
                  />
                </Box>
              </Box>

              {/* 概要入力フィールド */}
              <Box>
                <Typography
                  sx={{ fontWeight: 'bold', color: 'text.light', p: 1 }}
                >
                  概要
                </Typography>
                <Box
                  sx={{
                    border: '1px solid',
                    borderRadius: 2,
                    borderColor: 'divider',
                    p: 1,
                  }}
                >
                  <Controller
                    name="description"
                    control={control}
                    rules={validationRules.description}
                    render={({ field, fieldState }) => (
                      <>
                        <TextField
                          {...field}
                          type="textarea"
                          error={fieldState.invalid}
                          helperText={fieldState.error?.message}
                          placeholder="ノートの概要を入力してください"
                          multiline
                          fullWidth
                          rows={12}
                          onChange={(e) => {
                            field.onChange(e)
                            setCharCount(e.target.value.length)
                          }}
                          sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          color={charCount > 200 ? 'error' : 'text.light'}
                          sx={{ textAlign: 'right', display: 'block' }}
                        >
                          {charCount} / 200文字
                        </Typography>
                      </>
                    )}
                  />
                </Box>
              </Box>
            </Stack>
          </Box>
        </Drawer>
      </Box>
    </>
  )
}

export default EditNote
