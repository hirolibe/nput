import { useState, useEffect } from 'react'
import useSWR, { SWRResponse } from 'swr'
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

export const useProfile = (idToken?: string | null) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`

  const { data, error }: SWRResponse<ProfileData> = useSWR(
    idToken && [url, idToken],
    fetcher,
  )

  const [delayedError, setDelayedError] = useState<Error | undefined>(undefined)

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setDelayedError(error)
      }, 10000)
      return () => clearTimeout(timer)
    } else {
      setDelayedError(undefined)
    }
  }, [error])

  return {
    data,
    error: delayedError,
  }
}
