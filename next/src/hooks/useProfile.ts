import useSWR, { SWRResponse } from 'swr'
import { ProfileResponse } from '@/requests/types/profileResponse'
import { fetcher } from '@/requests/utils/fetcher'

export const useProfile = (idToken?: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`

  const { data, error }: SWRResponse<ProfileResponse> = useSWR(
    idToken && [url, idToken],
    fetcher,
  )

  return {
    data,
    error,
  }
}
