import { Box, Divider, Pagination, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { BasicNoteData } from '@/hooks/useNotes'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'
import { styles } from '@/styles'
import Loading from '../common/Loading'
import Error from '../common/Error'
import NoteCard from './NoteCard'
import { useUserFiledNotes } from '@/hooks/useUserFiledNotes'
import { usePathname } from 'next/navigation'

interface FiledNotesProps {
  folderSlug: string
}

const FiledNotes = (props: FiledNotesProps) => {
  const pathname = usePathname()

  const [page, setPage] = useState<number>(1)
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const { notesData, notesError } = useUserFiledNotes(props.folderSlug, page)
  const [filedNotes, setFiledNotes] = useState<BasicNoteData[] | null | undefined>(undefined)
  useEffect(() => {
    if (notesData === undefined) return

    setFiledNotes(notesData?.notes ?? null)
  }, [notesData])
  const meta = notesData?.meta

  const [, setSnackbar] = useSnackbarState()

  useEffect(() => {
    if (notesError) {
      const { errorMessage } = handleError(notesError)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: pathname,
      })
    }
  }, [notesError, pathname, setSnackbar])

  if (notesError) {
    const { statusCode, errorMessage } = handleError(notesError)
    return <Error statusCode={statusCode} errorMessage={errorMessage} />
  }

  if (notesData === undefined) {
    return (
      <Box
        css={styles.pageMinHeight}
        sx={{ display: 'flex', justifyContent: 'center' }}
      >
        <Loading />
      </Box>
    )
  }

  if (!filedNotes?.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '448px',
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 14, sm: 16 },
            color: 'text.placeholder',
          }}
        >
          ノートがありません
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      {filedNotes?.map((note: BasicNoteData, i: number) => (
        <Box key={i} sx={{ border: 'none', mx: { xs: 0, sm: 6 } }}>
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
          />
          <Divider />
        </Box>
      ))}

      {!!meta?.totalPages && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <Pagination
            count={meta?.totalPages}
            page={meta?.currentPage}
            onChange={handleChange}
          />
        </Box>
      )}
    </Box>
  )
}

export default FiledNotes
