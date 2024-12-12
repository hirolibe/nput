import useSWR, { SWRResponse } from 'swr'
import { fetcher } from '@/utils/fetcher'

export interface UseFollowStatusParams {
  authorName: string | undefined
  idToken?: string | null
}

export interface FollowStatusData {
  hasFollowed: boolean
}

export const useFollowStatus = ({
  authorName,
  idToken,
}: UseFollowStatusParams) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${authorName}/relationship`
  const { data, error, isLoading }: SWRResponse<FollowStatusData> = useSWR(
    authorName && idToken ? [url, idToken] : null,
    fetcher,
  )

  return {
    data,
    error,
    isLoading,
  }
}
