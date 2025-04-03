import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { useAuthContext } from './useAuthContext'
import { useAuthError } from './useAuthError'
import { PagenatedNotesData } from './useNotes'
import { fetcher } from '@/utils/fetcher'

export const useMyNotes = (pageNumber?: number) => {
  const { idToken, isAuthLoading } = useAuthContext()

  const searchParams = useSearchParams()
  const page = pageNumber || searchParams.get('page') || '1'

  const url = page
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/my_notes/?page=${page}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/my_notes`

  const {
    data,
    error,
    isLoading: isNotesLoading,
  }: SWRResponse<PagenatedNotesData> = useSWR(
    idToken ? [url, idToken] : null,
    fetcher,
  )

  const [notesData, setNotesData] = useState<
    PagenatedNotesData | null | undefined
  >(undefined)

  useEffect(() => {
    if (!isAuthLoading && !isNotesLoading && data) {
      setNotesData(data)
    } else if (!isAuthLoading && !idToken) {
      setNotesData(null)
    }
  }, [isAuthLoading, isNotesLoading, data, idToken])

  const { authError: notesError } = useAuthError({
    error,
  })

  return {
    notesData,
    notesError,
    isNotesLoading,
  }
}
