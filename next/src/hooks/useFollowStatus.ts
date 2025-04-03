import { useState, useEffect } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { useAuthContext } from './useAuthContext'
import { useAuthError } from './useAuthError'
import { fetcher } from '@/utils/fetcher'

export interface FollowStatusData {
  hasFollowed: boolean
}

export const useFollowStatus = (name: string | undefined) => {
  const { idToken, isAuthLoading } = useAuthContext()
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${name}/relationship`
  const {
    data,
    error,
    isLoading: isFollowStatusLoading,
  }: SWRResponse<FollowStatusData | undefined> = useSWR(
    name && idToken ? [url, idToken] : null,
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

  const { authError: followStatusError } = useAuthError({
    error,
  })

  return {
    followStatusData: followStatusData?.hasFollowed,
    followStatusError,
    isFollowStatusLoading,
  }
}
