import EditIcon from '@mui/icons-material/Edit'
import {
  Avatar,
  Box,
  Card,
  Chip,
  Container,
  Divider,
  IconButton,
  Pagination,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Error from '@/components/common/Error'
import Loading from '@/components/common/Loading'
import StopPropagationLink from '@/components/common/StopPropagationLink'
import DashboardTabs from '@/components/note/DashboardTabs'
import useEnsureAuth from '@/hooks/useEnsureAuth'
import { useMyNotes } from '@/hooks/useMyNotes'
import { BasicNoteData } from '@/hooks/useNotes'
import { styles } from '@/styles'
import { handleError } from '@/utils/handleError'
import { omit } from '@/utils/omit'

const Dashboard: NextPage = () => {
  const isAuthorized = useEnsureAuth()

  const router = useRouter()
  const { notesData, notesError } = useMyNotes()
  const [notes, setNotes] = useState<BasicNoteData[] | undefined>(undefined)
  useEffect(() => {
    if (notesData === undefined) return

    setNotes(notesData?.notes || [])
  }, [notesData])
  const meta = notesData?.meta

  const [tabIndex, setTabIndex] = useState<number>(0)

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(`/dashboard/?page=${value}`)
  }

  if (notesError) {
    const { statusCode, errorMessage } = handleError(notesError)

    return <Error statusCode={statusCode} errorMessage={errorMessage} />
  }

  if (!isAuthorized || notes === undefined) {
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
          <Card sx={{ minHeight: '578px' }}>
            <DashboardTabs tabIndex={tabIndex} setTabIndex={setTabIndex} />

            <Box sx={{ mx: { xs: 2, md: 8 }, mt: 2 }}>
              {!notes?.length && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    minHeight: '250px',
                    mt: 28,
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
                          {note.title
                            ? omit(note.title)(35)('...')
                            : 'No title'}
                        </Typography>
                        <Box>
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                              overflowX: 'auto',
                              whiteSpace: 'nowrap',
                              '&::-webkit-scrollbar': {
                                display: 'none',
                              },
                              mb: 1,
                            }}
                          >
                            {note.tags?.map((tag, i: number) => (
                              <StopPropagationLink
                                key={i}
                                href={`/tags/${tag.name}`}
                              >
                                <Chip
                                  label={tag.name}
                                  variant="outlined"
                                  sx={{
                                    '&:hover': {
                                      backgroundColor: 'backgroundColor.hover',
                                    },
                                    fontSize: '0.75rem',
                                  }}
                                />
                              </StopPropagationLink>
                            ))}
                          </Stack>
                        </Box>
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
            </Box>
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
      </Box>
    </>
  )
}

export default Dashboard
