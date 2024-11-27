import useSWR, { SWRResponse } from 'swr'
import { ProfileResponse } from '@/requests/types/profileResponse'
import { fetcher } from '@/requests/utils/fetcher'
import { useState, useEffect } from 'react'

export const useProfile = (idToken?: string | null) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`

  const { data, error }: SWRResponse<ProfileResponse> = useSWR(
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
