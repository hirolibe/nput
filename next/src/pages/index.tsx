import { Box, Grid, Container, Pagination } from '@mui/material'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Error from '@/components/common/Error'
import NoteCard from '@/components/note/NoteCard'
import NoteCardSkeleton from '@/components/note/NoteCardSkeleton'
import { useNotes, BasicNoteData } from '@/hooks/useNotes'
import { styles } from '@/styles'
import { handleError } from '@/utils/handleError'

const Index: NextPage = () => {
  const router = useRouter()
  const page = 'page' in router.query ? String(router.query.page) : 1
  const { data, error } = useNotes(page)

  if (error) {
    const { statusCode, errorMessage } = handleError(error)

    return <Error statusCode={statusCode} errorMessage={errorMessage} />
  }

  if (!data)
    return (
      <Box css={styles.pageMinHeight} sx={{ backgroundColor: '#e6f2ff' }}>
        <Container maxWidth="md" sx={{ pt: 6 }}>
          <Grid container spacing={4}>
            {Array.from({ length: 10 }).map((_, i) => (
              <Grid item key={i} xs={12}>
                <NoteCardSkeleton key={i} />
              </Grid>
            ))}
          </Grid>
        </Container>
        <Box sx={{ height: '128px' }}></Box>
      </Box>
    )

  const notes = data?.notes
  const meta = data?.meta

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(`/?page=${value}`)
  }

  return (
    <Box css={styles.pageMinHeight} sx={{ backgroundColor: '#e6f2ff' }}>
      <Container maxWidth="md" sx={{ pt: 6 }}>
        <Grid container spacing={4}>
          {notes?.map((note: BasicNoteData, i: number) => (
            <Grid item key={i} xs={12}>
              <Link
                href={`/${note.user.name}/notes/${note.id}`}
                css={styles.noUnderline}
              >
                <NoteCard
                  id={note.id}
                  title={note.title}
                  fromToday={note.fromToday}
                  cheersCount={note.cheersCount}
                  totalDuration={note.totalDuration}
                  user={note.user}
                  tags={note.tags.map((tag) => ({
                    id: tag.id,
                    name: tag.name,
                  }))}
                />
              </Link>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <Pagination
            count={meta?.totalPages}
            page={meta?.currentPage}
            onChange={handleChange}
          />
        </Box>
      </Container>
    </Box>
  )
}

export default Index
