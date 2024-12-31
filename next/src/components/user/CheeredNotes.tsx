import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  CardContent,
  Divider,
  Modal,
  Pagination,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import NoteCard from '../note/NoteCard'
import { useCheeredNotes } from '@/hooks/useCheeredNotes'
import { BasicNoteData } from '@/hooks/useNotes'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

const CheeredNotes = () => {
  const router = useRouter()
  const { name } = router.query
  const userName = typeof name === 'string' ? name : undefined

  const { notesData, notesError, isNotesLoading } = useCheeredNotes()
  const notes = notesData?.notes
  const meta = notesData?.meta

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string | undefined>(undefined)
  const [description, setDescription] = useState<string | undefined>(undefined)

  const handleOpenDescription = (id: number) => {
    const note = notes?.find((note) => note.id === id)
    setTitle(note?.title)
    setDescription(note?.description)
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(`/${userName}/?page=${value}`)
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

  if (notesError) {
    return (
      <CardContent
        sx={{
          mx: { xs: 0, md: 10 },
          py: { xs: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 14, sm: 16 },
              color: 'text.placeholder',
              my: 0.5,
            }}
          >
            データを取得できませんでした
          </Typography>
        </Box>
      </CardContent>
    )
  }

  if (!isNotesLoading && !notes?.length) {
    return (
      <CardContent
        sx={{
          mx: { xs: 0, md: 10 },
          py: { xs: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 14, sm: 16 },
              color: 'text.placeholder',
              my: 0.5,
            }}
          >
            エールしたノートがありません
          </Typography>
        </Box>
      </CardContent>
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

export default CheeredNotes
