import { useState, useEffect } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { useAuth } from './useAuth'
import { fetcher } from '@/utils/fetcher'

export interface ProfileData {
  id: number
  nickname?: string
  bio?: string
  xLink?: string
  githubLink?: string
  avatarUrl?: string
  user: {
    name: string
  }
}

export const useProfile = () => {
  const { idToken, isAuthLoading } = useAuth()
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`

  const {
    data,
    error,
    isLoading: isProfileLoading,
  }: SWRResponse<ProfileData | null> = useSWR(
    idToken && [url, idToken],
    fetcher,
  )

  const [profileError, setProfileError] = useState<Error | undefined>(undefined)
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setProfileError(error)
      }, 10000)
      return () => clearTimeout(timer)
    } else {
      setProfileError(undefined)
    }
  }, [error])

  return {
    profileData:
      !isAuthLoading && !isProfileLoading && data
        ? data
        : !isAuthLoading && !isProfileLoading && !data
          ? null
          : undefined,
    profileError,
    isProfileLoading,
  }
}
