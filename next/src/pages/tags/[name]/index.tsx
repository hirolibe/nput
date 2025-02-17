import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Card,
  Container,
  Divider,
  Grid,
  Modal,
  Pagination,
  Typography,
} from '@mui/material'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Error from '@/components/common/Error'
import NoteCard from '@/components/note/NoteCard'
import NoteCardSkeleton from '@/components/note/NoteCardSkeleton'
import { BasicNoteData } from '@/hooks/useNotes'
import { useTaggedNotes } from '@/hooks/useTaggedNotes'
import { styles } from '@/styles'
import { handleError } from '@/utils/handleError'

const TaggedNotes: NextPage = () => {
  const router = useRouter()
  const { name } = router.query
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

  const handleClose = () => {
    setIsOpen(false)
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
          <title>{`${tagName}のノート一覧 | Nput`}</title>
        </Helmet>
      </HelmetProvider>

      <Box
        css={styles.pageMinHeight}
        sx={{ backgroundColor: 'backgroundColor.page' }}
      >
        <Container maxWidth="md" sx={{ pt: 4 }}>
          <Typography
            component={'h2'}
            sx={{
              textAlign: 'center',
              fontSize: { xs: 18, sm: 24 },
              fontWeight: 'bold',
              mb: 3,
            }}
          >
            「{tagName}」のノート一覧
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

          <Modal open={isOpen} onClose={handleClose}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                px: 3,
                pt: 2,
                pb: 3,
                borderRadius: 2,
                boxShadow: 24,
                width: '600px',
                maxWidth: '90%',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <CloseIcon
                  onClick={handleClose}
                  sx={{
                    cursor: 'pointer',
                    opacity: 0.7,
                    '&:hover': { opacity: 1 },
                  }}
                />
              </Box>
              <Typography
                sx={{ fontSize: 18, fontWeight: 'bold', px: 3, mb: 1 }}
              >
                {title}
              </Typography>
              <Divider sx={{ mx: 3, mb: 3 }} />
              <Typography sx={{ px: 4, mb: 2 }}>{description}</Typography>
            </Box>
          </Modal>

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
