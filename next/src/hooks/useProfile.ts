import { useState, useEffect } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { useAuthContext } from './useAuthContext'
import { useAuthError } from './useAuthError'
import { fetcher } from '@/utils/fetcher'

export interface ProfileData {
  id?: number
  nickname?: string
  bio?: string
  xUsername?: string
  xLink?: string
  githubUsername?: string
  githubLink?: string
  avatarUrl?: string
  user: {
    name: string
    cheerPoints: number
  }
}

export const useProfile = () => {
  const { idToken, isAuthLoading } = useAuthContext()
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`

  const {
    data,
    error,
    isLoading: isProfileLoading,
  }: SWRResponse<ProfileData | null | undefined> = useSWR(
    idToken ? [url, idToken] : null,
    fetcher,
  )

  const [profileData, setProfileData] = useState<
    ProfileData | null | undefined
  >(undefined)
  useEffect(() => {
    if (isAuthLoading || isProfileLoading) return

    if (data) {
      setProfileData(data)
    } else {
      setProfileData(null)
    }
  }, [isAuthLoading, isProfileLoading, data])

  const { authError: profileError } = useAuthError({
    error,
  })

  return {
    profileData,
    profileError,
    isProfileLoading,
  }
}
