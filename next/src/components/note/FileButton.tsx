import { Button } from '@mui/material'
import axios from 'axios'
import { usePathname } from 'next/navigation'
import { Dispatch, SetStateAction, useState } from 'react'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'
import { FilingNoteCardProps } from './FilingNoteCard'
import { BasicNoteData } from '@/hooks/useNotes'

export interface FileButtonProps extends FilingNoteCardProps {
  fileState: {
    isFiled: boolean | undefined
    setIsFiled: Dispatch<SetStateAction<boolean | undefined>>
  }
}

export const FileButton = (props: FileButtonProps) => {
  const { note, folderSlug, setNotes, fileState } = props
  const pathname = usePathname()

  const { idToken, isAuthLoading } = useAuthContext()
  const [, setSnackbar] = useSnackbarState()

  const { isFiled, setIsFiled } = fileState

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/my_folders/${folderSlug}/my_filed_notes/${note.slug}/file`
  const headers = { Authorization: `Bearer ${idToken}` }

  const handleFile = async () => {
    if (isAuthLoading) return

    try {
      await axios.post(url, null, { headers })
      setIsFiled(true)
      setNotes((prevNotes) => prevNotes ? [note, ...prevNotes] : [note])
    } catch (err) {
      const { errorMessage } = handleError(err)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: pathname,
      })
    }
  }

  const retrieve = async () => {
    try {
      await axios.delete(url, { headers })
      setIsFiled(false)
      setNotes((prevNotes) =>
        prevNotes?.filter((n) => n.slug !== note.slug),
      )
    } catch (err) {
      const { errorMessage } = handleError(err)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: pathname,
      })
    }
  }

  return (
    <>
      <Button
        onClick={!isFiled ? handleFile : retrieve}
        variant={!isFiled ? 'outlined' : 'contained'}
        sx={{
          fontSize: 12,
          color: !isFiled ? 'black' : 'white',
          borderRadius: 2,
          boxShadow: 'none',
          border: !isFiled ? '1px solid black' : 'none',
          fontWeight: 'bold',
          height: '30px',
          width: '95px',
          '&:hover': {
            borderColor: !isFiled ? 'black' : 'primary',
            backgroundColor: !isFiled ? '#E0E0E0' : 'none',
          },
        }}
      >
        {!isFiled ? '追加する' : '取り出す'}
      </Button>
    </>
  )
}
