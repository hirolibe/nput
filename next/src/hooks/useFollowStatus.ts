import { useState, useEffect } from 'react'
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
    error,
    isLoading: isFollowStatusLoading,
  }: SWRResponse<FollowStatusData | undefined> = useSWR(
    authorName && idToken ? [url, idToken] : null,
    fetcher,
  )

  const [followStatusData, setFollowStatusData] = useState<
    FollowStatusData | undefined
  >(undefined)
  useEffect(() => {
    if (!isAuthLoading && !isFollowStatusLoading && data) {
      setFollowStatusData(data)
    } else if (!isAuthLoading && !idToken) {
      setFollowStatusData({ hasFollowed: false })
    }
  }, [isAuthLoading, isFollowStatusLoading, data, idToken])

  const [followStatusError, setFollowStatusError] = useState<Error | undefined>(
    undefined,
  )
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setFollowStatusError(error)
      }, 10000)
      return () => clearTimeout(timer)
    } else {
      setFollowStatusError(undefined)
    }
  }, [error])

  return {
    followStatusData: followStatusData?.hasFollowed,
    followStatusError,
    isFollowStatusLoading,
  }
}
