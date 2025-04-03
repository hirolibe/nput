import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { useAuthContext } from './useAuthContext'
import { useAuthError } from './useAuthError'
import { NoteData } from './useNotes'
import { fetcher } from '@/utils/fetcher'

export const useMyNote = () => {
  const { idToken } = useAuthContext()
  const params = useParams()
  const slug = params?.slug
  const noteSlug = typeof slug === 'string' ? slug : undefined
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/my_notes/${noteSlug}`

  const {
    data,
    error,
    isLoading: isNoteLoading,
    mutate: refreshNote,
  }: SWRResponse<NoteData> = useSWR(!idToken ? null : [url, idToken], fetcher)

  const [noteData, setNoteData] = useState<NoteData | undefined>(undefined)

  useEffect(() => {
    if (data === undefined) return

    setNoteData(data)
  }, [data])

  const { authError: noteError } = useAuthError({
    error,
  })

  return {
    noteData,
    noteError,
    isNoteLoading,
    refreshNote,
  }
}
