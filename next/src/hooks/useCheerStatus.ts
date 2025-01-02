import { useState, useEffect } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { useAuthContext } from './useAuthContext'
import { fetcher } from '@/utils/fetcher'

export interface UseCheerStatusParams {
  authorName: string | undefined
  noteSlug: string | number | undefined
}

export interface CheerStatusData {
  hasCheered: boolean
}

export const useCheerStatus = ({
  authorName,
  noteSlug,
}: UseCheerStatusParams) => {
  const { idToken, isAuthLoading } = useAuthContext()
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${authorName}/notes/${noteSlug}/cheer`
  const {
    data,
    error,
    isLoading: isCheerStatusLoading,
  }: SWRResponse<CheerStatusData | undefined> = useSWR(
    authorName && noteSlug && idToken ? [url, idToken] : null,
    fetcher,
  )

  const [cheerStatusData, setCheerStatusData] = useState<
    CheerStatusData | undefined
  >(undefined)
  useEffect(() => {
    if (!isAuthLoading && !isCheerStatusLoading && data) {
      setCheerStatusData(data)
    } else if (!isAuthLoading && !idToken) {
      setCheerStatusData({ hasCheered: false })
    }
  }, [isAuthLoading, isCheerStatusLoading, data, idToken])

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
    cheerStatusData: cheerStatusData?.hasCheered,
    cheerStatusError,
    isCheerStatusLoading,
  }
}
