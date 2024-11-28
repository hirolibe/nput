import useSWR, { SWRResponse } from 'swr'
import { CheerResponse } from '@/types/cheer'
import { fetcher } from '@/utils/fetcher'

export const useCheerStatus = (noteId: number, idToken?: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/notes/${noteId}/cheer`

  const { data, error, isLoading }: SWRResponse<CheerResponse> = useSWR(
    idToken && [url, idToken],
    fetcher,
  )

  return {
    data,
    error,
    isLoading,
  }
}
