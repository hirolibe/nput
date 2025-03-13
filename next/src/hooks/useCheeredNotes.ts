import { useParams } from 'next/navigation'
import useSWR, { SWRResponse } from 'swr'
import { PagenatedNotesData } from './useNotes'
import { fetcher } from '@/utils/fetcher'

export const useCheeredNotes = (page: number) => {
  const params = useParams()
  const name = params?.name
  const userName = typeof name === 'string' ? name : undefined

  const url = page
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${userName}/cheered_notes/?page=${page}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${userName}/cheered_notes`

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
