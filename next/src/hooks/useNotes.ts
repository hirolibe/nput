import useSWR, { SWRResponse } from 'swr'
import { PagenatedNotesResponse } from '@/types/note'
import { fetcher } from '@/utils/fetcher'

export const useNotes = (page?: number) => {
  const url = page
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/notes`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/notes/?page=${page}`

  const { data, error, isLoading }: SWRResponse<PagenatedNotesResponse> =
    useSWR([url, undefined], fetcher)

  return {
    data,
    error,
    isLoading,
  }
}
