import { useState, useEffect } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { useAuthContext } from './useAuthContext'
import { useAuthError } from './useAuthError'
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

  const { authError: cheerStatusError } = useAuthError({
    error,
  })

  return {
    cheerStatusData: cheerStatusData?.hasCheered,
    cheerStatusError,
    isCheerStatusLoading,
  }
}
