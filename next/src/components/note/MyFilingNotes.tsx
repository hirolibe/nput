import { Box, Divider, Pagination, Typography } from '@mui/material'
import { usePathname, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { FilingNoteCard } from './FilingNoteCard'
import { useMyNotes } from '@/hooks/useMyNotes'
import { BasicNoteData } from '@/hooks/useNotes'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'
import { Dispatch, SetStateAction } from 'react'
import { styles } from '@/styles'
import Loading from '../common/Loading'
import Error from '../common/Error'

interface MyFilingNotesProps {
  setNotes: Dispatch<SetStateAction<BasicNoteData[] | null | undefined>>
}

const MyFilingNotes = (props: MyFilingNotesProps) => {
  const pathname = usePathname()
  const params = useParams()
  const slug = params?.slug
  const folderSlug = typeof slug === 'string' ? slug : undefined

  const [page, setPage] = useState<number>(1)
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const { notesData, notesError } = useMyNotes(page)
  const [myFilingNotes, setMyFilingNotes] = useState<BasicNoteData[] | null | undefined>(undefined)
  useEffect(() => {
    if (notesData === undefined) return

    setMyFilingNotes(notesData?.notes ?? null)
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

  if (!myFilingNotes?.length) {
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
          投稿したノートがありません
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      {myFilingNotes?.map((note: BasicNoteData, i: number) => (
        <Box key={i} sx={{ border: 'none', mx: { xs: 0, sm: 6 } }}>
          <FilingNoteCard
            note={note}
            folderSlug={folderSlug}
            setNotes={props.setNotes}
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

export default MyFilingNotes
