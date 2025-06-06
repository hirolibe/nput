import {
  Box,
  Card,
  Container,
  Grid,
  Pagination,
  Typography,
} from '@mui/material'
import type { NextPage } from 'next'
import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Error from '@/components/common/Error'
import DescriptionModal from '@/components/note/DescriptionModal'
import NoteCard from '@/components/note/NoteCard'
import NoteCardSkeleton from '@/components/note/NoteCardSkeleton'
import { BasicNoteData } from '@/hooks/useNotes'
import { useTaggedNotes } from '@/hooks/useTaggedNotes'
import { styles } from '@/styles'
import { handleError } from '@/utils/handleError'

const TaggedNotes: NextPage = () => {
  const router = useRouter()
  const params = useParams()
  const name = params?.name
  const tagName = typeof name === 'string' ? name : undefined

  const { notesData, notesError } = useTaggedNotes()
  const notes = notesData?.notes
  const meta = notesData?.meta

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string | undefined>(undefined)
  const [description, setDescription] = useState<string | undefined>(undefined)

  const handleOpenDescription = (slug: string) => {
    const note = notes?.find((note) => note.slug === slug)
    setTitle(note?.title)
    setDescription(note?.description)
    setIsOpen(true)
  }

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(`/tags/${tagName}/?page=${value}`)
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
          <title>{`タグ「${tagName}」のノート一覧 | Nput`}</title>
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
            タグ「{tagName}」のノート一覧
          </Typography>
          <Grid container spacing={4}>
            {!notesData &&
              Array.from({ length: 10 }).map((_, i) => (
                <Grid item key={i} xs={12}>
                  <NoteCardSkeleton key={i} />
                </Grid>
              ))}
            {notes?.map((note: BasicNoteData, i: number) => (
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
                    tags={note.tags?.map((tag) => ({
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

          {meta && (
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

export default TaggedNotes
