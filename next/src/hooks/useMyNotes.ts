import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { useAuthContext } from './useAuthContext'
import { PagenatedNotesData } from './useNotes'
import { fetcher } from '@/utils/fetcher'

export const useMyNotes = () => {
  const { idToken, isAuthLoading } = useAuthContext()

  const searchParams = useSearchParams()
  const page = searchParams.get('page') || '1'

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

  const [notesError, setNotesError] = useState<Error | undefined>(undefined)
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setNotesError(error)
      }, 10000)
      return () => clearTimeout(timer)
    } else {
      setNotesError(undefined)
    }
  }, [error])

  return {
    notesData,
    notesError,
    isNotesLoading,
  }
}
