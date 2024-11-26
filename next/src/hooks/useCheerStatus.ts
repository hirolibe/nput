import useSWR, { SWRResponse } from 'swr'
import { CheerResponse } from '@/requests/types/cheerResponse'
import { fetcher } from '@/requests/utils/fetcher'

export const useCheerStatus = (noteId: number, idToken?: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/notes/${noteId}/cheer`

  const { data, error }: SWRResponse<CheerResponse> = useSWR(
    idToken && [url, idToken],
    fetcher,
  )

  return {
    data,
    error,
  }
}
