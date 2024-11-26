import useSWR, { SWRResponse } from 'swr'
import { NotesResponse } from '@/requests/types/notesResponse'
import { fetcher } from '@/requests/utils/fetcher'

export const useNotes = (page: number) => {
  const url = page
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/notes`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/notes/?page=${page}`

  const { data, error, isLoading }: SWRResponse<NotesResponse> = useSWR(
    [url, undefined],
    fetcher,
  )

  return {
    data,
    error,
    isLoading,
  }
}
