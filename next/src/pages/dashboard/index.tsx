import EditIcon from '@mui/icons-material/Edit'
import {
  Avatar,
  Box,
  Card,
  Container,
  Divider,
  IconButton,
  Pagination,
  Tooltip,
  Typography,
} from '@mui/material'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Error from '@/components/common/Error'
import Loading from '@/components/common/Loading'
import { useAuthContext } from '@/hooks/useAuthContext'
import useEnsureAuth from '@/hooks/useAuthenticationCheck'
import { useMyNotes } from '@/hooks/useMyNotes'
import { BasicNoteData } from '@/hooks/useNotes'
import { styles } from '@/styles'
import { handleError } from '@/utils/handleError'
import { omit } from '@/utils/omit'

const Dashboard: NextPage = () => {
  useEnsureAuth()

  const { idToken } = useAuthContext()

  const router = useRouter()
  const { notesData, notesError } = useMyNotes()
  const notes = notesData?.notes
  const meta = notesData?.meta

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(`/dashboard/?page=${value}`)
  }

  if (notesError) {
    const { statusCode, errorMessage } = handleError(notesError)

    return <Error statusCode={statusCode} errorMessage={errorMessage} />
  }

  if (!idToken || notesData === undefined) {
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
          <title>ノートの管理 | Nput</title>
        </Helmet>
      </HelmetProvider>

      <Box
        css={styles.pageMinHeight}
        sx={{
          backgroundColor: 'backgroundColor.page',
          pb: 5,
        }}
      >
        <Container maxWidth="md" sx={{ pt: 5, px: { xs: 2, md: 4 } }}>
          <Card
            sx={{
              minHeight: '578px',
              px: { xs: 2, md: 6 },
              pt: 4,
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography
                component="h2"
                sx={{
                  textAlign: 'center',
                  fontSize: { xs: 18, sm: 24 },
                  fontWeight: 'bold',
                }}
              >
                ノートの管理
              </Typography>
            </Box>

            {!notes?.length && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                  minHeight: '250px',
                  mt: 24,
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
                      minWidth: 100,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: { xs: 1, sm: 0 },
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: 12,
                        border: '1px solid',
                        borderColor:
                          note.statusJp == '下書き'
                            ? 'text.light'
                            : 'primary.main',
                        p: '4px',
                        borderRadius: 2,
                        color:
                          note.statusJp == '下書き'
                            ? 'text.light'
                            : 'primary.main',
                        fontWeight: 'bold',
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
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <Pagination
                  count={meta?.totalPages}
                  page={meta?.currentPage}
                  onChange={handleChange}
                />
              </Box>
            )}
          </Card>
        </Container>
      </Box>
    </>
  )
}

export default Dashboard
