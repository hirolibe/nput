import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Divider,
  IconButton,
  Modal,
  Pagination,
  Tooltip,
  Typography,
} from '@mui/material'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Error from '@/components/common/Error'
import Loading from '@/components/common/Loading'
import MyFilingNotes from '@/components/note/MyFilingNotes'
import useEnsureAuth from '@/hooks/useEnsureAuth'
import { useMyFiledNotes } from '@/hooks/useMyFiledNotes'
import { useMyFolder } from '@/hooks/useMyFolder'
import { BasicNoteData } from '@/hooks/useNotes'
import { styles } from '@/styles'
import { handleError } from '@/utils/handleError'
import { omit } from '@/utils/omit'

const MyFiledNotes: NextPage = () => {
  const isAuthorized = useEnsureAuth()

  const { folderData, folderError } = useMyFolder()
  const folderName = folderData?.name ?? ''

  const router = useRouter()
  const { notesData, notesError } = useMyFiledNotes()
  const [notes, setNotes] = useState<BasicNoteData[] | null | undefined>(
    undefined,
  )
  useEffect(() => {
    if (notesData === undefined) return

    setNotes(notesData?.notes || null)
  }, [notesData])
  const meta = notesData?.meta

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(`/dashboard/?page=${value}`)
  }

  const onBackClick = () => {
    router.push('/dashboard/folders')
  }

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleOpenModal = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  if (folderError) {
    const { statusCode, errorMessage } = handleError(notesError)

    return <Error statusCode={statusCode} errorMessage={errorMessage} />
  }

  if (notesError) {
    const { statusCode, errorMessage } = handleError(notesError)

    return <Error statusCode={statusCode} errorMessage={errorMessage} />
  }

  if (!isAuthorized || notesData === undefined) {
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
          <title>{`フォルダ「${folderName}」のノート一覧 | Nput`}</title>
        </Helmet>
      </HelmetProvider>

      <Box
        css={styles.pageMinHeight}
        sx={{ backgroundColor: 'backgroundColor.page' }}
      >
        <Container maxWidth="md" sx={{ pt: 4, pb: 5 }}>
          <Typography
            component="h1"
            sx={{
              textAlign: 'center',
              fontSize: { xs: 18, sm: 24 },
              fontWeight: 'bold',
              mb: 3,
            }}
          >
            {`フォルダ「${folderName}」のノート一覧`}
          </Typography>
          <Card
            sx={{
              minHeight: '530px',
              px: 4,
              pt: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Box sx={{ width: 90 }}>
                <IconButton onClick={onBackClick}>
                  <ArrowBackSharpIcon />
                </IconButton>
              </Box>
              <Button
                onClick={handleOpenModal}
                variant="contained"
                sx={{
                  textAlign: 'center',
                  color: 'white',
                  fontSize: { xs: 8, sm: 12 },
                  borderRadius: 2,
                  boxShadow: 'none',
                  fontWeight: 'bold',
                }}
              >
                ノート整理
              </Button>
            </Box>

            {!notes?.length && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                  minHeight: '250px',
                  mt: 26,
                }}
              >
                <Typography sx={{ fontSize: 18, color: 'text.placeholder' }}>
                  ノートがありません
                </Typography>
              </Box>
            )}
            {notes?.map((note: BasicNoteData, i: number) => (
              <>
                <Box
                  key={i}
                  sx={{
                    display: { sm: 'flex' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: 80,
                    mx: { xs: 2, md: 8 },
                  }}
                >
                  <Link
                    href={`/${note.user.name}/notes/${note.slug}`}
                    css={styles.noUnderline}
                    style={{ display: 'block', width: '100%' }}
                  >
                    <Box sx={{ width: '100%', pr: { sm: 3 }, mb: 1 }}>
                      <Typography
                        component="h3"
                        sx={{
                          fontSize: { xs: 16, sm: 18 },
                          color: note.title ? 'black' : 'text.placeholder',
                          fontWeight: 'bold',
                          width: '100%',
                          mb: 1,
                        }}
                      >
                        {note.title ? omit(note.title)(35)('...') : 'No title'}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: 10, sm: 12 },
                          color: 'text.light',
                          width: '100%',
                        }}
                      >
                        作成日：{note.fromToday} &nbsp;&nbsp;&nbsp;&nbsp;
                        作成時間：{note.totalDuration}
                      </Typography>
                    </Box>
                  </Link>
                  <Box
                    sx={{
                      minWidth: 140,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: { xs: 1, sm: 0 },
                    }}
                  >
                    <Box
                      sx={{
                        textAlign: 'center',
                        fontSize: 12,
                        border:
                          note.statusJp == 'インプット'
                            ? '1px solid'
                            : '2px solid',
                        borderColor:
                          note.statusJp == 'インプット'
                            ? 'text.light'
                            : 'primary.main',
                        borderRadius: 2,
                        color:
                          note.statusJp == 'インプット'
                            ? 'text.light'
                            : 'primary.main',
                        fontWeight: 'bold',
                        width: '90px',
                        p: '4px',
                      }}
                    >
                      {note.statusJp}
                    </Box>
                    <Link href={`/dashboard/notes/${note.slug}/edit/`}>
                      <Avatar>
                        <Tooltip title="編集する">
                          <IconButton
                            sx={{ backgroundColor: 'backgroundColor.icon' }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </Avatar>
                    </Link>
                  </Box>
                </Box>
                <Divider sx={{ mb: 1 }} />
              </>
            ))}
            {!notes?.length ? (
              <></>
            ) : (
              meta && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                  <Pagination
                    count={meta?.totalPages}
                    page={meta?.currentPage}
                    onChange={handleChange}
                  />
                </Box>
              )
            )}
          </Card>
        </Container>

        <Modal
          open={isOpen}
          onClose={handleClose}
          disableScrollLock={true}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: 24,
              maxWidth: '600px',
              width: '90%',
              maxHeight: 'calc(100vh - 100px)', // ウィンドウ高さに基づく最大値
              height: 'auto',
              overflowY: 'auto',
            }}
          >
            <Box sx={{ position: 'relative', my: 2 }}>
              <CloseIcon
                onClick={handleClose}
                sx={{
                  cursor: 'pointer',
                  position: 'absolute',
                  right: '30px',
                  textAlign: 'end',
                  opacity: 0.7,
                  '&:hover': { opacity: 1 },
                }}
              />
              <Typography
                sx={{
                  textAlign: 'center',
                  fontSize: { xs: 16, sm: 18 },
                  fontWeight: 'bold',
                }}
              >
                {`フォルダ「${folderName}」の整理`}
              </Typography>
            </Box>
            <Divider sx={{ mx: 3 }} />
            <MyFilingNotes setNotes={setNotes} />
          </Box>
        </Modal>
      </Box>
    </>
  )
}

export default MyFiledNotes
