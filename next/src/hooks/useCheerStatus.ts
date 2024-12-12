import { useState, useEffect } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { fetcher } from '@/utils/fetcher'

export interface UseCheerStatusParams {
  authorName: string | undefined
  noteId: string | number | undefined
  idToken?: string | null
}

export interface CheerStatusData {
  hasCheered: boolean
}

export const useCheerStatus = ({
  authorName,
  noteId,
  idToken,
}: UseCheerStatusParams) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${authorName}/notes/${noteId}/cheer`
  const {
    data: cheerStatusData,
    error,
    isLoading: isCheerStatusLoading,
  }: SWRResponse<CheerStatusData> = useSWR(
    authorName && noteId && idToken ? [url, idToken] : null,
    fetcher,
  )

  const [cheerStatusError, setCheerStatusError] = useState<Error | undefined>(
    undefined,
  )

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setCheerStatusError(error)
      }, 10000)
      return () => clearTimeout(timer)
    } else {
      setCheerStatusError(undefined)
    }
  }, [error])

  return {
    cheerStatusData,
    cheerStatusError,
    isCheerStatusLoading,
  }
}
