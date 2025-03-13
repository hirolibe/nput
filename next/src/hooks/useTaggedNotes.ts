import { useParams, useSearchParams } from 'next/navigation'
import useSWR, { SWRResponse } from 'swr'
import { PagenatedNotesData } from './useNotes'
import { fetcher } from '@/utils/fetcher'

export const useTaggedNotes = () => {
  const params = useParams()
  const name = params?.name
  const tagName = typeof name === 'string' ? name : undefined
  const searchParams = useSearchParams()
  const page = searchParams.get('page') || '1'

  const url = page
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/tags/${tagName}/tagged_notes/?page=${page}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/tags/${tagName}/tagged_notes`

  const {
    data: notesData,
    error: notesError,
    isLoading: isNotesLoading,
  }: SWRResponse<PagenatedNotesData> = useSWR([url, undefined], fetcher)

  return {
    notesData,
    notesError,
    isNotesLoading,
  }
}
