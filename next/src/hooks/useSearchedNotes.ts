import { useSearchParams } from 'next/navigation'
import useSWR, { SWRResponse } from 'swr'
import { BasicNoteData } from './useNotes'
import { fetcher } from '@/utils/fetcher'

export interface SearchedPageData {
  totalPages: number
  currentPage: number
  notesCount: number
}

export interface PagenatedSearchedNotesData {
  notes: BasicNoteData[]
  meta: SearchedPageData
}

export const useSearchedNotes = () => {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const page = searchParams.get('page') || '1'

  const url = query
    ? page
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/searched_notes/?q=${query}&page=${page}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/searched_notes/?q=${query}`
    : page
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/searched_notes/?page=${page}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/searched_notes`

  const {
    data: notesData,
    error: notesError,
    isLoading: isNotesLoading,
  }: SWRResponse<PagenatedSearchedNotesData | null | undefined> = useSWR(
    [url, undefined],
    fetcher,
  )

  return {
    notesData,
    notesError,
    isNotesLoading,
  }
}
