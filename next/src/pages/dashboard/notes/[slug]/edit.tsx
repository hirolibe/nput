import { AppBar, Box, Fade, Stack, TextField, Typography } from '@mui/material'
import axios from 'axios'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import Error from '@/components/common/Error'
import Loading from '@/components/common/Loading'
import MarkdownText from '@/components/note/MarkdownText'
import { MarkdownToolbar } from '@/components/note/MarkdownToolbar'
import NoteEditorButtons from '@/components/note/NoteEditorButtons'
import NoteEditorSidebar from '@/components/note/NoteEditorSidebar'
import { NoteEditorToolbar } from '@/components/note/NoteEditorToolbar'
import { RestoreConfirmationBanner } from '@/components/note/RestoreConfirmagionBanner'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useDuration } from '@/hooks/useDuration'
import useEnsureAuth from '@/hooks/useEnsureAuth'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useMyNote } from '@/hooks/useMyNote'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { styles } from '@/styles'
import { handleError } from '@/utils/handleError'

export interface NoteFormData {
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

  const [isPreviewActive, setIsPreviewActive] = useState<boolean>(false)
  const [statusChecked, setStatusChecked] = useState<boolean>(false)
  const [isFetched, setIsFetched] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openSidebar, setOpenSidebar] = useState<boolean>(false)
  const [content, setContent] = useState<string>('')
  const [inputTags, setInputTags] = useState<string[]>([])

  const { getElapsedSeconds } = useDuration()
  const [previousSeconds, setPreviousSeconds] = useState<number>(0)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { loadSavedContent, saveContent, removeSavedContent } = useLocalStorage(
    noteSlug || '',
  )

  const loadedContent = useMemo(() => loadSavedContent(), [loadSavedContent])
  const [restoreContent, setRestoreContent] = useState<string>('')

  useEffect(() => {
    if (loadedContent) setRestoreContent(loadedContent)
  }, [loadedContent, setRestoreContent])

  const handleContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = e.target.value
    setContent(newValue)
    if (!restoreContent) saveContent(newValue)
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
          <RestoreConfirmationBanner
            openSidebar={openSidebar}
            content={content}
            setContent={setContent}
            restoreContent={restoreContent}
            setRestoreContent={setRestoreContent}
          />
        )}

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
                                md: openSidebar
                                  ? isPreviewActive
                                    ? 0
                                    : '100%'
                                  : isPreviewActive
                                    ? '50%'
                                    : '100%',
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
                          <Box
                            sx={{
                              borderLeft: {
                                md: openSidebar ? 0 : '0.5px solid',
                              },
                              borderLeftColor: { md: 'divider' },
                              width: {
                                xs: isPreviewActive ? '100%' : 0,
                                md: isPreviewActive
                                  ? openSidebar
                                    ? '100%'
                                    : '50%'
                                  : 0,
                              },
                              height: '677px',
                              px: isPreviewActive ? '14px' : 0,
                              py: '16.5px',
                            }}
                          >
                            <Box
                              ref={boxRef}
                              onScroll={handleScroll}
                              sx={{
                                fontSize: { xs: 14, md: 16 },
                                height: '100%',
                                overflow: 'auto',
                              }}
                            >
                              {content ? (
                                <MarkdownText content={content} />
                              ) : (
                                <Typography sx={{ color: 'text.placeholder' }}>
                                  No content
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  )}
                />

                {/* ボタン（プレビュー表示・タグ入力欄表示・画像追加・削除） */}
                <NoteEditorButtons
                  isPreviewActive={isPreviewActive}
                  togglePreviewDisplay={togglePreviewDisplay}
                  toggleSidebar={toggleSidebar}
                />
              </Box>
            </Stack>
          </Box>
        </Fade>

        {/* サイドバー（タグ・概要入力フィールド） */}
        <NoteEditorSidebar
          open={openSidebar}
          onClose={toggleSidebar}
          control={control}
          inputTags={inputTags}
          setInputTags={setInputTags}
          setIsChanged={setIsChanged}
          descriptionValidationRule={validationRules.description}
        />
      </Box>
    </>
  )
}

export default EditNote
