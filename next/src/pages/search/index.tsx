import {
  Box,
  Card,
  Container,
  Grid,
  Pagination,
  Typography,
} from '@mui/material'
import type { NextPage } from 'next'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Error from '@/components/common/Error'
import SearchForm from '@/components/common/SearchForm'
import DescriptionModal from '@/components/note/DescriptionModal'
import NoteCard from '@/components/note/NoteCard'
import NoteCardSkeleton from '@/components/note/NoteCardSkeleton'
import { BasicNoteData } from '@/hooks/useNotes'
import { useSearchedNotes } from '@/hooks/useSearchedNotes'
import { styles } from '@/styles'
import { handleError } from '@/utils/handleError'

const SearchedNotes: NextPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const { notesData, notesError } = useSearchedNotes()
  const notes = notesData?.notes
  const meta = notesData?.meta
  const notesCount = meta?.notesCount ?? 0

  const page = meta?.currentPage ?? 1
  const ITEMS_PER_PAGE = 10
  const pageTopIndex = (page - 1) * ITEMS_PER_PAGE + 1
  const pageEndIndex = Math.min(notesCount, page * ITEMS_PER_PAGE)

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string | undefined>(undefined)
  const [description, setDescription] = useState<string | undefined>(undefined)

  const handleSearch = (keyword: string) => {
    router.push(`/search/?q=${keyword}`)
  }

  const handleOpenDescription = (slug: string) => {
    const note = notes?.find((note) => note.slug === slug)
    setTitle(note?.title)
    setDescription(note?.description)
    setIsOpen(true)
  }

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(
      query ? `/search/?q=${query}&page=${value}` : `/search/?page=${value}`,
    )
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
          <title>{query ? `「${query}」の` : ''}検索結果 | Nput</title>
        </Helmet>
      </HelmetProvider>

      <Box
        css={styles.pageMinHeight}
        sx={{ backgroundColor: 'backgroundColor.page' }}
      >
        <Container maxWidth="md" sx={{ pt: 5 }}>
          <SearchForm onSearch={handleSearch} />
          <Box sx={{ display: 'flex', m: 2 }}>
            {notes === undefined ? (
              <Box sx={{ height: '24px' }}></Box>
            ) : (
              <Typography
                sx={{
                  fontSize: { xs: 14, sm: 16 },
                  fontWeight: 'bold',
                  mr: 1,
                }}
              >
                {notes !== undefined ? `${notesCount}件の検索結果` : ''}
              </Typography>
            )}
            {!!notesCount && (
              <Typography sx={{ fontSize: { xs: 14, sm: 16 } }}>
                {pageTopIndex}~{pageEndIndex}件目を表示中
              </Typography>
            )}
          </Box>
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
          {!notes?.length && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100px',
              }}
            >
              {notes !== undefined && query && (
                <Typography
                  sx={{
                    textAlign: 'center',
                    fontSize: { xs: 14, sm: 16 },
                    color: 'text.light',
                    fontWeight: 'bold',
                    mb: 3,
                  }}
                >
                  「{query}」に一致するノートは見つかりませんでした
                </Typography>
              )}
            </Box>
          )}

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

export default SearchedNotes
