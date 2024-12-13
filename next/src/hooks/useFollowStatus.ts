import useSWR, { SWRResponse } from 'swr'
import { useAuth } from './useAuth'
import { fetcher } from '@/utils/fetcher'

export interface UseFollowStatusParams {
  authorName: string | undefined
}

export interface FollowStatusData {
  hasFollowed: boolean
}

export const useFollowStatus = ({ authorName }: UseFollowStatusParams) => {
  const { idToken, isAuthLoading } = useAuth()
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${authorName}/relationship`
  const {
    data,
    error: followStatusError,
    isLoading: isFollowStatusLoading,
  }: SWRResponse<FollowStatusData> = useSWR(
    authorName && idToken ? [url, idToken] : null,
    fetcher,
  )

  return {
    followStatusData:
      !isAuthLoading && !isFollowStatusLoading && data
        ? data
        : { hasFollowed: false },
    followStatusError,
    isFollowStatusLoading,
  }
}
