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
  Card,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Switch,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import axios from 'axios'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState, useMemo, useRef } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import CheerPoints from '@/components/common/CheerPoints'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import Error from '@/components/common/Error'
import Loading from '@/components/common/Loading'
import UploadImagesButton from '@/components/common/UploadImagesButton'
import MarkdownText from '@/components/note/MarkdownText'
import TimeTracker from '@/components/note/TimeTracker'
import { useAuthContext } from '@/hooks/useAuthContext'
import useEnsureAuth from '@/hooks/useAuthenticationCheck'
import { useNote } from '@/hooks/useNote'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { useTags } from '@/hooks/useTags'
import { useTimeTracking } from '@/hooks/useTimeTracking'
import { styles } from '@/styles'
import { handleError } from '@/utils/handleError'

type NoteProps = {
  title: string
  description: string
  content: string
  status: string
  tags: string[]
}

type NoteFormData = {
  title: string
  description: string
  content: string
  tags: string[]
}

const EditNote: NextPage = () => {
  useEnsureAuth()

  const [, setSnackbar] = useSnackbarState()
  const { idToken } = useAuthContext()
  const router = useRouter()
  const { slug } = router.query
  const noteSlug = typeof slug === 'string' ? slug : undefined
  const { noteData, noteError } = useNote()

  const { tagsData } = useTags()
  const { sessionSeconds } = useTimeTracking()

  const [isPreviewActive, setIsPreviewActive] = useState<boolean>(false)
  const [statusChecked, setStatusChecked] = useState<boolean>(false)
  const [isFetched, setIsFetched] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [maxLengthError, setMaxLengthError] = useState<boolean>(false)
  const [maxTagsError, setMaxTagsError] = useState<boolean>(false)
  const [formatError, setFormatError] = useState<boolean>(false)
  const [charCount, setCharCount] = useState<number>(0)
  const [openSidebar, setOpenSidebar] = useState<boolean>(false)
  const [content, setContent] = useState<string>('')
  const [inputTags, setInputTags] = useState<string[]>([])
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

  useEffect(() => {
    setPreCursorText(content?.slice(0, cursorPosition ?? undefined))
    setPostCursorText(content?.slice(cursorPosition ?? undefined))
  }, [content, cursorPosition, setPreCursorText, setPostCursorText])

  const handleContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setContent(e.target.value)
    const position = textareaRef.current?.selectionStart || 0
    setCursorPosition(position)
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

  const note: NoteProps = useMemo(() => {
    return {
      title: noteData?.title ?? '',
      description: noteData?.description ?? '',
      content: noteData?.content ?? '',
      status: noteData?.statusJp ?? '未保存',
      tags: noteData?.tags?.map((tag) => tag.name) ?? [],
    }
  }, [noteData])

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
    if (noteData === undefined) return

    if (note) {
      reset(note)
      setContent(note.content)
      setStatusChecked(note.status == '公開中')
      setInputTags(note.tags)

      setIsFetched(true)
    }
  }, [noteData, note, reset, setIsFetched])

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

    const headers = { Authorization: `Bearer ${idToken}` }

    try {
      const res = await axios.patch(url, patchData, { headers })

      setRemainingSeconds((sessionSeconds - previousSessionSeconds) % 60)
      setPreviousSessionSeconds(sessionSeconds)

      setSnackbar({
        message: res.data.message,
        severity: 'success',
        pathname: router.pathname,
      })

      setIsChanged(false)
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
    const headers = { Authorization: `Bearer ${idToken}` }

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

  if (noteError) {
    const { statusCode, errorMessage } = handleError(noteError)
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
          <title>編集中 | Nput</title>
        </Helmet>
      </HelmetProvider>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          backgroundColor: 'backgroundColor.page',
          minHeight: '100vh',
          pl: 2,
          pr: openSidebar ? 4 : 2,
          transition: 'margin 0.2s',
          marginRight: openSidebar ? '385px' : 0,
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

        {/* ノート */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 11,
            pb: 3,
          }}
        >
          {/* コンテンツ */}
          <Stack sx={{ alignItems: 'center', width: '100%' }}>
            {/* タイトル */}
            <Box sx={{ width: '90%', maxWidth: '1200px', mb: 3 }}>
              {!isPreviewActive && (
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
              )}
              {isPreviewActive && (
                <Box sx={{ pt: '4px', pb: { xs: '5px', md: '6px' } }}>
                  <Typography
                    component="h2"
                    sx={{
                      color: watch('title') ? 'black' : 'text.placeholder',
                      fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                      fontSize: { xs: 24, md: 36 },
                      fontWeight: 'bold',
                      textAlign: 'center',
                      lineHeight: '40px',
                    }}
                  >
                    {watch('title') ? watch('title') : 'No title'}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* 本文 */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                position: 'relative',
                width: '100%',
                maxWidth: '1400px',
              }}
            >
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 'none',
                  backgroundColor: 'white',
                  width: '100%',
                  minHeight: '600px',
                  px: 2,
                  py: '13.5px',
                  mb: 1,
                }}
              >
                {!openSidebar && (
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <Box
                      sx={{
                        width: {
                          xs: '100%',
                          md: isPreviewActive ? '50%' : '100%',
                        },
                      }}
                    >
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
                    </Box>
                    {isPreviewActive && (
                      <Box
                        sx={{
                          display: { xs: 'none', md: 'block' },
                          borderLeft: '1px solid',
                          borderColor: 'divider',
                          width: '50%',
                          px: '14px',
                          py: '16.5px',
                        }}
                      >
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
                      <Box sx={{ px: '14px', py: '16.5px' }}>
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
              </Card>

              {/* ボタン（プレビュー表示・タグ入力欄表示・画像追加・削除） */}
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
                {(!openSidebar || (openSidebar && !isPreviewActive)) && (
                  <Tooltip title="画像を追加">
                    <Box tabIndex={0}>
                      <UploadImagesButton
                        setImageSignedIds={setImageSignedIds}
                        isMultiple={true}
                        setContent={setContent}
                        preCursorText={preCursorText}
                        postCursorText={postCursorText}
                        backgroundColor={true}
                        setIsChanged={setIsChanged}
                      />
                    </Box>
                  </Tooltip>
                )}
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
                        options={tagsData?.map((tag) => tag.name)}
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
