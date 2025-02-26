import { AppBar, Box, Fade, Stack, TextField } from '@mui/material'
import axios from 'axios'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState, useRef } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import Error from '@/components/common/Error'
import Loading from '@/components/common/Loading'
import ContentBox from '@/components/note/ContentBox'
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
import { useProfile } from '@/hooks/useProfile'
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

  const { profileData } = useProfile()

  // ローカルストレージからのcontentデータ取得
  const router = useRouter()
  const { slug } = router.query
  const noteSlug = typeof slug === 'string' ? slug : undefined
  const { loadSavedContent, saveContent, removeSavedContent } = useLocalStorage(
    noteSlug || '',
  )
  const loadedContent = useMemo(() => loadSavedContent(), [loadSavedContent])
  const [restoreContent, setRestoreContent] = useState<string>('')
  useEffect(() => {
    if (loadedContent) setRestoreContent(loadedContent)
  }, [loadedContent, setRestoreContent])

  // ノートデータの取得
  const { noteData, noteError } = useMyNote()
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

  // 初回レンダリング時のノートデータ反映処理
  const { handleSubmit, control, reset, formState } = useForm<NoteFormData>()
  const initializedRef = useRef(false)
  const [content, setContent] = useState<string>('')
  const [statusChecked, setStatusChecked] = useState<boolean>(false)
  const [inputTags, setInputTags] = useState<string[]>([])
  const [isFetched, setIsFetched] = useState<boolean>(false)
  useEffect(() => {
    if (!note || initializedRef.current) return

    reset(note)
    setContent(note.content)
    setStatusChecked(note.status == '公開中')
    setInputTags(note.tags)
    setIsFetched(true)
    initializedRef.current = true
  }, [note, reset])

  // 編集有無のチェック
  const { isDirty } = formState
  const [isChanged, setIsChanged] = useState<boolean>(false)
  useEffect(() => {
    setIsChanged(isDirty)
  }, [setIsChanged, isDirty])

  // content入力内容の反映とローカルストレージへの保存
  const handleContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = e.target.value
    setContent(newValue)
    if (!restoreContent) saveContent(newValue)
  }

  // プレビュー画面の表示切り替え
  const [isPreviewActive, setIsPreviewActive] = useState<boolean>(false)
  const boxRef = useRef<HTMLDivElement>(null) // ContentBoxのプレビュー画面のRef
  const [scrollPosition, setScrollPosition] = useState<number>(0) // プレビュー画面のスクロール位置の状態管理
  const togglePreviewDisplay = async () => {
    await setIsPreviewActive(!isPreviewActive)

    if (!boxRef.current) return
    boxRef.current.scrollTop = scrollPosition // プレビュー画面のスクロール位置復元処理
  }

  // サイドバー（タグ・概要入力フィールド）の表示切り替え
  const [openSidebar, setOpenSidebar] = useState<boolean>(false)
  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar)
  }

  // マークダウンテキスト編集用の状態管理
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // バリデーションルール
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

  // ノート保存処理
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [, setSnackbar] = useSnackbarState()
  const { idToken } = useAuthContext()
  const { getElapsedSeconds } = useDuration()
  const [previousSeconds, setPreviousSeconds] = useState<number>(0)
  const [imageSignedIds, setImageSignedIds] = useState<
    string | string[] | undefined
  >(undefined)
  const onSubmit: SubmitHandler<NoteFormData> = async (data) => {
    setIsLoading(true)

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/my_notes/${slug}`
    const headers = { Authorization: `Bearer ${idToken}` }

    // 送信するデータ
    const status = statusChecked ? 'published' : 'draft'
    const currentSeconds = getElapsedSeconds()
    const workDuration = currentSeconds - previousSeconds
    const patchData = {
      note: {
        ...data,
        content: content,
        status: status,
      },
      image_signed_ids: imageSignedIds,
      tag_names: inputTags,
      duration: workDuration,
    }

    try {
      const res = await axios.patch(url, patchData, { headers })
      setPreviousSeconds(currentSeconds)
      setIsChanged(false)
      removeSavedContent()
      setRestoreContent('')
      reset(data)

      // ステータスが下書きの場合、ノート詳細データを再検証
      if (status === 'draft') {
        await axios.post('/api/revalidate', {
          path: `/${profileData?.user.name}/notes/${slug}`,
        })
      }

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
        {/* ヘッダー表示（矢印・エールポイント・公開設定・保存ボタン） */}
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
                      {/* マークダウン挿入ボタン */}
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

                      {/* 本文編集・プレビュー画面 */}
                      <ContentBox
                        isPreviewActive={isPreviewActive}
                        openSidebar={openSidebar}
                        field={field}
                        fieldState={fieldState}
                        textareaRef={textareaRef}
                        content={content}
                        handleContentChange={handleContentChange}
                        boxRef={boxRef}
                        setScrollPosition={setScrollPosition}
                      />
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

        {/* サイドバー（タグ・概要） */}
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
