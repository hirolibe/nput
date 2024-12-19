import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp'
import CloseIcon from '@mui/icons-material/Close'
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
  Container,
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
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import Error from '@/components/common/Error'
import ImageUploadButton from '@/components/common/ImageUploadButton'
import Loading from '@/components/common/Loading'
import { CheerIcon } from '@/components/note/CheerIcon'
import MarkdownText from '@/components/note/MarkdownText'
import TimeTracker from '@/components/note/TimeTracker'
import { useAuth } from '@/hooks/useAuth'
import { useMyNote } from '@/hooks/useMyNote'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { useTags } from '@/hooks/useTags'
import { styles } from '@/styles'
import { handleError } from '@/utils/handleError'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { useTimeTracking } from '@/hooks/useTimeTracking'

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
  const [, setSnackbar] = useSnackbarState()
  const { idToken } = useAuth()
  const router = useRouter()
  const { id } = router.query
  const idString = typeof id === 'string' ? id : undefined
  const { noteData, noteError } = useMyNote({
    noteId: idString,
  })
  const { tagsData } = useTags()
  const { sessionSeconds } = useTimeTracking()

  const [isPreviewActive, setIsPreviewActive] = useState<boolean>(false)
  const [statusChecked, setStatusChecked] = useState<boolean>(false)
  const [isFetched, setIsFetched] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [maxLengthError, setMaxLengthError] = useState<boolean>(false)
  const [maxTagsError, setMaxTagsError] = useState<boolean>(false)
  const [formatError, setFormatError] = useState<boolean>(false)
  const [selectedTags, setSelectedTags] = useState<string[] | undefined>([])
  const [charCount, setCharCount] = useState<number>(0)
  const [openSidebar, setOpenSidebar] = useState<boolean>(false)
  const [content, setContent] = useState<string>('')
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0)
  const [previousSessionSeconds, setPreviousSessionSeconds] = useState<number>(0)
  const [cheerPoints, setCheersPoints] = useState<number>(0)

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [cursorPosition, setCursorPosition] = useState<number | null>(null)
  const [preCursorText, setPreCursorText] = useState<string>('')
  const [postCursorText, setPostCursorText] = useState<string>('')

  useEffect(() => {
    setPreCursorText(content?.slice(0, cursorPosition ?? undefined))
    setPostCursorText(content?.slice(cursorPosition ?? undefined))
  }, [content, cursorPosition, setPreCursorText, setPostCursorText])

  useEffect(() => {
    const updatedPoints = (noteData?.user.cheerPoints ?? 0) + Math.floor(sessionSeconds)
    setCheersPoints(updatedPoints)
  }, [noteData, sessionSeconds, setCheersPoints])

  const handleContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setContent(e.target.value)
    const position = textareaRef.current?.selectionStart || 0
    setCursorPosition(position)
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

  const { handleSubmit, control, reset, watch, formState } = useForm<NoteFormData>({
    defaultValues: note,
  })
  const { isDirty } = formState

  useEffect(() => {
    if (noteData === undefined) return

    if (note) {
      reset(note)
      setContent(note.content)
      setStatusChecked(note.status == '公開中')
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

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/my_notes/${id}`
    const headers = { Authorization: `Bearer ${idToken}` }

    const status = statusChecked ? 'published' : 'draft'
    const workDuration = remainingSeconds + sessionSeconds - previousSessionSeconds

    const patchData = {
      note: { ...data, status: status, image_signed_ids: imageSignedIds },
      tag_names: data.tags,
      duration: workDuration,
    }

    try {
      const res = await axios.patch(url, patchData, { headers })

      setRemainingSeconds((sessionSeconds - previousSessionSeconds) % 60)
      setPreviousSessionSeconds(sessionSeconds)

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

  const handleBackWithConfirmation = () => {
    if (isDirty) {
      setOpenConfirmDialog(true)
      return
    }
    router.push('/dashboard')
  }

  const handleConfirm = () => {
    setOpenConfirmDialog(false)
    router.push('/dashboard')
  }

  const handleClose = () => {
    setOpenConfirmDialog(false)
  }

  if (noteError) {
    const { statusCode, errorMessage } = handleError(noteError)

    return <Error statusCode={statusCode} errorMessage={errorMessage} />
  }

  if (!isFetched) {
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
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          backgroundColor: 'backgroundColor.page',
          minHeight: '100vh',
          pl: { xs: 2, sm: 9 },
          pr: 9,
          transition: 'margin 0.2s',
          marginRight: openSidebar ? '500px' : 0,
        }}
      >
        <AppBar
          position="fixed"
          sx={{
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
              marginRight: openSidebar ? '500px' : 0,
            }}
          >
            <Box sx={{ maxWidth: 35 }}>
              <IconButton onClick={handleBackWithConfirmation}>
                <ArrowBackSharpIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box>
                <Stack
                  direction={'row'}
                  spacing={4}
                  sx={{ mr: 4 }}
                >
                  <Box
                    sx={{
                      display: { xs: 'none', md: openSidebar ? 'none' : 'flex' },
                      alignItems: 'center',
                    }}
                  >
                    <CheerIcon
                      isCheered={
                        ((cheerPoints ?? 0) >= 360) ? true : false
                      }
                    />
                    <Typography
                      sx={{
                        fontWeight:
                          ((cheerPoints ?? 0) >= 3600) ? 'bold' : 'normal',
                        ml: 1,
                        mr: 4
                      }}
                    >
                      {Math.floor(cheerPoints ?? 0) >= 3600
                        ? 'Max'
                        : `× ${Math.floor(cheerPoints / 360)}`}
                    </Typography>

                    <Typography sx={{ mr: 1 }}>Total</Typography>
                    <TimeTracker seconds={(noteData?.totalDuration ?? 0) + sessionSeconds} />
                  </Box>
                  <Box sx={{
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
                    mr: 3,
                    mt: { xs: 1, md: 0 },
                  }}
                >
                  <Typography sx={{ fontSize: { xs: 13, md: 15 } }}>
                    公開設定
                  </Typography>
                  <Switch checked={statusChecked} onChange={toggleStatusChecked} />
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
                    width: '120px',
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
        <Container
          maxWidth="md"
          css={styles.pageMinHeight}
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
            <Box sx={{ width: '100%', maxWidth: 840, mb: 3 }}>
              {!isPreviewActive && (
                <Controller
                  name="title"
                  control={control}
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
                maxWidth: '700px',
              }}
            >
              <Card
                sx={{
                  borderRadius: '8px',
                  boxShadow: 'none',
                  backgroundColor: 'white',
                  width: '100%',
                  maxWidth: '700px',
                  minHeight: '600px',
                  px: 2,
                  py: '13.5px',
                  mb: 1,
                }}
              >
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
                        }}>
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
                            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                          }}
                        >
                          No content
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Card>

              {/* ボタン（プレビュー表示・タグ入力欄表示・画像追加） */}
              <Box
                sx={{
                  position: 'absolute',
                  height: '100%',
                  right: '-70px',
                  transition: '0.2s',
                }}
              >
                <Box
                  sx={{
                    position: 'sticky',
                    top: '150px',
                  }}
                >
                  <Stack spacing={3}>
                    <Tooltip
                      title={
                        !isPreviewActive ? 'プレビューを表示' : 'エディタに戻る'
                      }
                    >
                      <IconButton
                        onClick={togglePreviewDisplay}
                        sx={{
                          backgroundColor: !isPreviewActive
                            ? 'white'
                            : 'primary.main',
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
                          '&:hover': {
                            backgroundColor: 'backgroundColor.hover',
                          },
                        }}
                      >
                        <SellOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    {!isPreviewActive && (
                      <Tooltip title="画像を追加">
                        <ImageUploadButton
                          setImageSignedIds={setImageSignedIds}
                          isMultiple={true}
                          setContent={setContent}
                          preCursorText={preCursorText}
                          postCursorText={postCursorText}
                          backgroundColor={true}
                        />
                      </Tooltip>
                    )}
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Container>

        <Drawer
          open={openSidebar}
          anchor="right"
          variant="persistent"
          sx={{
            borderTop: 'none',
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: { xs: '100%', md: '500px' }, boxSizing: 'border-box' },
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

          <Box css={styles.pageMinHeight} style={{ width: '100%', padding: 20 }}>
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
                    borderRadius: '8px',
                    borderColor: 'divider',
                    p: 1,
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
                        value={field.value}
                        onChange={(_, newTagNames) => {
                          field.onChange(newTagNames)
                          const maxTagLength = 20
                          const formatRegex = /^[a-zA-Z0-9ぁ-んァ-ン一-龯]+$/
                          const maxTags = 5
                          const hasLongTag = newTagNames.some(
                            (tag) => tag.length > maxTagLength,
                          )
                          const ngTag = newTagNames.some(
                            (tag) => !formatRegex.test(tag),
                          )

                          if (hasLongTag) {
                            setMaxLengthError(true)
                            return
                          }
                          if (ngTag) {
                            setFormatError(true)
                            return
                          }
                          if (newTagNames.length > maxTags) {
                            setMaxTagsError(true)
                            return
                          }
                          setMaxLengthError(false)
                          setFormatError(false)
                          setMaxTagsError(false)
                        }}
                        renderTags={(value, getTagProps) => (
                          <Box>
                            {value.map((option, index) => {
                              const { key, ...tagProps } = getTagProps({ index })
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
                          const tag = tagsData.find((tag) => tag.name === option)
                          if (tag?.notesCount === 0) return
                          return (
                            <li {...props}>
                              {option} {tag ? `(${tag.notesCount})` : ''}
                            </li>
                          )
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={
                              (selectedTags?.length ?? 0) < 5
                                ? 'タグは5つまで登録できます'
                                : ''
                            }
                            error={maxLengthError || maxTagsError || formatError}
                            helperText={
                              maxLengthError
                                ? 'タグの最大文字数は20文字です'
                                : maxTagsError
                                  ? 'タグは最大5つまで登録できます'
                                  : formatError
                                    ? 'タグに記号、スペース、全角の英数字は使用できません'
                                    : ''
                            }
                            sx={{
                              '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                              },
                              '& .MuiInputBase-root': {
                                padding: 0,
                              },
                              '& .MuiOutlinedInput-input': {
                                padding: 0,
                              },
                            }}
                            disabled={(selectedTags?.length ?? 0) >= 5}
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
                    borderRadius: '8px',
                    borderColor: 'divider',
                    p: 1,
                  }}
                >
                  <Controller
                    name="description"
                    control={control}
                    rules={{
                      maxLength: {
                        value: 200,
                        message: '200文字以内で入力してください',
                      },
                    }}
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
                          rows={8}
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

      <ConfirmDialog
        open={openConfirmDialog}
        onClose={handleClose}
        onConfirm={handleConfirm}
        message={"変更内容を保存せずに編集を終了しますか？"}
        confirmText="終了"
      />
    </>
  )
}

export default EditNote
