import { Box, Grid, Container, Pagination } from '@mui/material'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Error from '@/components/common/Error'
import NoteCard from '@/components/note/NoteCard'
import NoteCardSkeleton from '@/components/note/NoteCardSkeleton'
import { useNotes } from '@/hooks/useNotes'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/requests/utils/handleError'

type NoteIndexProps = {
  id: number
  title: string
  fromToday: string
  cheersCount: number
  totalDuration: string
  user: {
    id: number
    profile: {
      nickname: string
      avatarUrl: string
    }
  }
  tags: {
    id: number
    name: string
  }[]
}

const Index: NextPage = () => {
  const router = useRouter()
  const page = 'page' in router.query ? Number(router.query.page) : 1
  const { data, error, isLoading } = useNotes(page)
  const [, setSnackbar] = useSnackbarState()

  if (error) {
    const errorMessage = handleError(error)
    setSnackbar({
      message: `${errorMessage}`,
      severity: 'error',
      pathname: `${router.pathname}`,
    })

    return <Error />
  }

  if (isLoading)
    return (
      <Box sx={{ backgroundColor: '#e6f2ff', minHeight: '100vh' }}>
        <Container maxWidth="md" sx={{ pt: 6 }}>
          <Grid container spacing={4}>
            {Array.from({ length: 10 }).map((_, i) => (
              <Grid item key={i} xs={12}>
                <NoteCardSkeleton key={i} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    )

  const notes = data?.notes
  const meta = data?.meta

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(`/?page=${value}`)
  }

  return (
    <Box sx={{ backgroundColor: '#e6f2ff', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ pt: 6 }}>
        <Grid container spacing={4}>
          {notes?.map((note: NoteIndexProps, i: number) => (
            <Grid item key={i} xs={12}>
              <Link href={`/notes/${note.id}`}>
                <NoteCard
                  id={note.id}
                  title={note.title}
                  fromToday={note.fromToday}
                  cheersCount={note.cheersCount}
                  totalDuration={note.totalDuration}
                  userId={note.user.id}
                  userName={note.user.profile.nickname}
                  avatarUrl={note.user.profile.avatarUrl}
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
