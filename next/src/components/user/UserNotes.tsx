import { Box, Divider, Pagination, Typography } from '@mui/material'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import DescriptionModal from '../note/DescriptionModal'
import NoteCard from '../note/NoteCard'
import { BasicNoteData } from '@/hooks/useNotes'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { useUserNotes } from '@/hooks/useUserNotes'
import { handleError } from '@/utils/handleError'

const UserNotes = () => {
  const pathname = usePathname()

  const [page, setPage] = useState<number>(1)
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const { notesData, notesError, isNotesLoading } = useUserNotes(page)
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

  if (notesError || (!isNotesLoading && !notes?.length)) {
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
          {notesError
            ? 'データを取得できませんでした'
            : '投稿したノートがありません'}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      {notes?.map((note: BasicNoteData, i: number) => (
        <Box key={i} sx={{ border: 'none', mx: { xs: 0, sm: 6, lg: 15 } }}>
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
          <Divider />
        </Box>
      ))}

      <DescriptionModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={title ?? ''}
        description={description ?? ''}
      />

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

export default UserNotes
