import CloseIcon from '@mui/icons-material/Close'
import { Box, Divider, Modal, Pagination, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import NoteCard from '../note/NoteCard'
import { BasicNoteData, pageData } from '@/hooks/useNotes'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { useUserNotes } from '@/hooks/useUserNotes'
import { handleError } from '@/utils/handleError'

const UserNotes = () => {
  const router = useRouter()

  const [page, setPage] = useState<number>(1)
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const { notesData, notesError, isNotesLoading } = useUserNotes(page)

  const [notes, setNotes] = useState<BasicNoteData[] | undefined>(undefined)
  const [meta, setMeta] = useState<pageData | undefined>(undefined)

  useEffect(() => {
    setNotes(notesData?.notes)
  }, [setNotes, notesData?.notes])

  useEffect(() => {
    setMeta(notesData?.meta)
  }, [setMeta, notesData?.meta])

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

  const [, setSnackbar] = useSnackbarState()

  useEffect(() => {
    if (notesError) {
      const { errorMessage } = handleError(notesError)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: router.pathname,
      })
    }
  }, [notesError, router.pathname, setSnackbar])

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
            tags={note.tags.map((tag) => ({
              id: tag.id,
              name: tag.name,
            }))}
            handleOpenDescription={handleOpenDescription}
          />
          <Divider />
        </Box>
      ))}

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
          <Typography sx={{ fontSize: 18, fontWeight: 'bold', px: 3, mb: 1 }}>
            {title}
          </Typography>
          <Divider sx={{ mx: 3, mb: 3 }} />
          <Typography sx={{ px: 4, mb: 2 }}>{description}</Typography>
        </Box>
      </Modal>

      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <Pagination
          count={meta?.totalPages}
          page={meta?.currentPage}
          onChange={handleChange}
        />
      </Box>
    </Box>
  )
}

export default UserNotes
