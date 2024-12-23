import { useEffect, useState } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { useAuth } from './useAuth'
import { UseNoteParams, NoteData } from './useNote'
import { fetcher } from '@/utils/fetcher'

export const useMyNote = ({ noteId }: UseNoteParams) => {
  const { idToken, isAuthLoading } = useAuth()
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/my_notes/${noteId}`

  const {
    data,
    error,
    isLoading: isNoteLoading,
  }: SWRResponse<NoteData> = useSWR(
    idToken && noteId ? [url, idToken] : null,
    fetcher,
  )

  const [noteData, setNoteData] = useState<NoteData | null | undefined>(
    undefined,
  )
  useEffect(() => {
    if (!isAuthLoading && !isNoteLoading && data) {
      setNoteData(data)
    } else if (!isAuthLoading && !idToken) {
      setNoteData(null)
    }
  }, [isAuthLoading, isNoteLoading, data, idToken])

  const [noteError, setNoteError] = useState<Error | undefined>(undefined)

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setNoteError(error)
      }, 10000)
      return () => clearTimeout(timer)
    } else {
      setNoteError(undefined)
    }
  }, [error])

  return {
    noteData,
    noteError,
    isNoteLoading,
  }
}
