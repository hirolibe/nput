import {
  Box,
  Card,
  Container,
  Grid,
  Pagination,
  Typography,
} from '@mui/material'
import { GetStaticProps, NextPage } from 'next'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Error from '@/components/common/Error'
import DescriptionModal from '@/components/note/DescriptionModal'
import NoteCard from '@/components/note/NoteCard'
import NoteCardSkeleton from '@/components/note/NoteCardSkeleton'
import { useAuthContext } from '@/hooks/useAuthContext'
import {
  BasicNoteData,
  PageData,
  PagenatedNotesData,
  useNotes,
} from '@/hooks/useNotes'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { styles } from '@/styles'
import { fetchNotesData } from '@/utils/fetchNotesData'
import { handleError } from '@/utils/handleError'

// ISRによるノートデータ取得
export const getStaticProps: GetStaticProps = async () => {
  const { notes, meta } = await fetchNotesData()
  return {
    props: { notes, meta },
    revalidate: 60, // 1分間キャッシュする
  }
}

const PublicNotes: NextPage<PagenatedNotesData> = (props) => {
  const { notes: initialNotes, meta: initialMeta } = props

  const router = useRouter()
  const { notesData: pagenatedNotesData, notesError } = useNotes()
  const searchParams = useSearchParams()
  const page = searchParams.get('page') || '1'

  const [notesData, setNotesData] = useState<BasicNoteData[] | undefined>(
    undefined,
  )
  const [meta, setMeta] = useState<PageData>(initialMeta)

  const [isLoading, setIsLoading] = useState(true)

  const [, setSnackbar] = useSnackbarState()
  const { idToken } = useAuthContext()
  useEffect(() => {
    const signOut = localStorage.getItem('signOut')

    if (idToken || !signOut) return

    setSnackbar({
      message: 'ログアウトしました',
      severity: 'success',
      pathname: '/',
    })

    localStorage.removeItem('signOut')
  }, [setSnackbar, idToken])

  useEffect(() => {
    if (!router.isReady) return

    if (page === '1') {
      setNotesData(initialNotes)
      setMeta(initialMeta)
      setIsLoading(false)
      return
    }

    if (!pagenatedNotesData) return

    setNotesData(pagenatedNotesData.notes)
    setMeta(pagenatedNotesData.meta)
    setIsLoading(false)
  }, [router.isReady, page, initialNotes, initialMeta, pagenatedNotesData])

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string | undefined>(undefined)
  const [description, setDescription] = useState<string | undefined>(undefined)

  const handleOpenDescription = (slug: string) => {
    const note = notesData?.find((note) => note.slug === slug)
    setTitle(note?.title)
    setDescription(note?.description)
    setIsOpen(true)
  }

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setIsLoading(true)
    router.push(`/?page=${value}`)
  }

  if (notesError) {
    const { statusCode, errorMessage } = handleError(notesError)
    return <Error statusCode={statusCode} errorMessage={errorMessage} />
  }

  return (
    <>
      {/* タブの表示 */}
      <HelmetProvider>
        <Helmet>
          <title>Nput</title>
        </Helmet>
      </HelmetProvider>

      <Box
        css={styles.pageMinHeight}
        sx={{ backgroundColor: 'backgroundColor.page' }}
      >
        <Container maxWidth="md" sx={{ pt: 4 }}>
          <Typography
            component={'h1'}
            sx={{
              textAlign: 'center',
              fontSize: { xs: 18, sm: 24 },
              fontWeight: 'bold',
              mb: 3,
            }}
          >
            新着ノート一覧
          </Typography>
          <Grid container spacing={4}>
            {isLoading &&
              Array.from({ length: 10 }).map((_, i) => (
                <Grid item key={i} xs={12}>
                  <NoteCardSkeleton key={i} />
                </Grid>
              ))}
            {!isLoading &&
              notesData?.map((note: BasicNoteData, i: number) => (
                <Grid item key={i} xs={12}>
                  <Card>
                    <NoteCard
                      id={note.id}
                      title={note.title}
                      description={note.description}
                      fromToday={note.fromToday}
                      cheersCount={note.cheersCount}
                      slug={note.slug}
                      totalDuration={note.totalDuration}
                      user={note.user}
                      tags={note.tags.map((tag) => ({
                        id: tag.id,
                        name: tag.name,
                      }))}
                      handleOpenDescription={handleOpenDescription}
                    />
                  </Card>
                </Grid>
              ))}
          </Grid>

          <DescriptionModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={title ?? ''}
            description={description ?? ''}
          />

          {!!meta?.totalPages && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <Pagination
                count={meta?.totalPages}
                page={meta?.currentPage}
                onChange={handleChange}
              />
            </Box>
          )}
        </Container>
      </Box>
    </>
  )
}

export default PublicNotes
