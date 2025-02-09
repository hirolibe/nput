import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined'
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
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import axios from 'axios'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import Error from '@/components/common/Error'
import Loading from '@/components/common/Loading'
import MarkdownText from '@/components/note/MarkdownText'
import { MarkdownToolbar } from '@/components/note/MarkdownToolbar'
import { NoteEditorToolbar } from '@/components/note/NoteEditorToolbar'
import { RestoreConfirmDialog } from '@/components/note/RestoreConfirmDialog'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useDuration } from '@/hooks/useDuration'
import useEnsureAuth from '@/hooks/useEnsureAuth'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useMyNote } from '@/hooks/useMyNote'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { useTags } from '@/hooks/useTags'
import { styles } from '@/styles'
import { handleError } from '@/utils/handleError'

interface NoteFormData {
  title: string
  description: string
  content: string
  status?: string
  tags: string[]
}

const EditNote: NextPage = () => {
  const isAuthorized = useEnsureAuth()

  const [, setSnackbar] = useSnackbarState()
  const { idToken } = useAuthContext()
  const router = useRouter()
  const { slug } = router.query
  const noteSlug = typeof slug === 'string' ? slug : undefined
  const { noteData, noteError } = useMyNote()

  const { tagsData } = useTags()

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

  const { getElapsedSeconds } = useDuration()
  const [previousSeconds, setPreviousSeconds] = useState<number>(0)

  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] =
    useState<boolean>(false)
  const [noteSlugToDelete, setNoteSlugToDelete] = useState<string | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  const handleContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = e.target.value
    setContent(newValue)
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

  const [imageSignedIds, setImageSignedIds] = useState<
    string | string[] | undefined
  >(undefined)

  const note: NoteFormData | undefined = useMemo(() => {
    if (noteData === undefined) return

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

  const { handleSubmit, control, reset, formState } = useForm<NoteFormData>({
    defaultValues: note,
  })
  const { isDirty } = formState
  const [isChanged, setIsChanged] = useState<boolean>(false)
  useEffect(() => {
    setIsChanged(isDirty)
  }, [setIsChanged, isDirty])

  const initializedRef = useRef(false)

  useEffect(() => {
    if (!note || initializedRef.current) return

    reset(note)
    setContent(note.content)
    setStatusChecked(note.status == '公開中')
    setInputTags(note.tags)
    setIsFetched(true)
    initializedRef.current = true
  }, [note, reset])

  const boxRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState<number>(0)

  const handleScroll = useCallback(() => {
    if (!boxRef.current) return
    setScrollPosition(boxRef.current.scrollTop)
  }, [])

  const togglePreviewDisplay = async () => {
    await setIsPreviewActive(!isPreviewActive)

    if (!boxRef.current) return
    boxRef.current.scrollTop = scrollPosition
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

    // URL
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/my_notes/${slug}`

    // 送信するデータ
    const status = statusChecked ? 'published' : 'draft'
    const currentSeconds = getElapsedSeconds()
    const workDuration = currentSeconds - previousSeconds

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

    // ヘッダー
    const headers = { Authorization: `Bearer ${idToken}` }

    try {
      const res = await axios.patch(url, patchData, { headers })

      setPreviousSeconds(currentSeconds)

      setSnackbar({
        message: res.data.message,
        severity: 'success',
        pathname: router.pathname,
      })

      setIsChanged(false)
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

  if (!isAuthorized || !isFetched) {
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
          <NoteEditorToolbar
            openSidebar={openSidebar}
            statusChecked={statusChecked}
            isLoading={isLoading}
            isChanged={isChanged}
            setStatusChecked={setStatusChecked}
          />
        </AppBar>

        <Box sx={{ backgroundColor: 'backgroundColor.page', height: '64px' }} />

        {/* ローカルストレージのデータ復元 */}
        {restoreContent && (
          <Box
            sx={{
              backgroundColor: 'secondary.main',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minheight: '60px',
                pl: 2,
                pr: openSidebar ? 4 : 2,
                py: 2,
                mb: { xs: 1, sm: 3 },
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

        <RestoreConfirmDialog
          open={openRestoreConfirmDialog}
          onReject={handleRejectRestore}
          onRestore={handleRestore}
          onClose={handleCloseRestoreConfirmDialog}
          currentContent={content}
          restoreContent={loadSavedContent()}
        />

        {/* ノート */}
        <Fade in={true} timeout={{ enter: 1000 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              pl: 2,
              pr: openSidebar ? 4 : 2,
              pb: 3,
            }}
          >
            {/* コンテンツ */}
            <Stack sx={{ alignItems: 'center', width: '100%' }}>
              {/* タイトル */}
              <Box
                sx={{ width: '90%', maxWidth: '1200px', mb: { xs: 1, sm: 3 } }}
              >
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
                        content={content}
                        onContentChange={(newContent: string) => {
                          setContent(newContent)
                          field.onChange(newContent)
                        }}
                        setImageSignedIds={setImageSignedIds}
                        saveContent={saveContent}
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
                                rows={28}
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
                                  borderLeft: { md: '0.5px solid' },
                                  borderLeftColor: { md: 'divider' },
                                  width: { xs: '100%', md: '50%' },
                                  height: '677px',
                                  px: '14px',
                                  py: '16.5px',
                                }}
                              >
                                {content ? (
                                  <Box
                                    ref={boxRef}
                                    onScroll={handleScroll}
                                    sx={{
                                      fontSize: { xs: 14, md: 16 },
                                      height: '100%',
                                      overflow: 'auto',
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
                                    rows={28}
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
                              <Box
                                sx={{
                                  height: '677px',
                                  px: '14px',
                                  py: '15.5px',
                                }}
                              >
                                {content ? (
                                  <Box
                                    ref={boxRef}
                                    onScroll={handleScroll}
                                    sx={{
                                      fontSize: { xs: 14, md: 16 },
                                      height: '100%',
                                      overflow: 'auto',
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
          </Box>
        </Fade>

        {/* ノート削除の確認画面 */}
        <ConfirmDialog
          open={openDeleteConfirmDialog}
          onClose={handleCloseDeleteConfirmDialog}
          onConfirm={handleDeleteConfirm}
          message={'ノートを削除しますか？'}
          confirmText="実行"
        />

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
