import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { useAuthContext } from './useAuthContext'
import { PagenatedFoldersData } from './useFolders'
import { fetcher } from '@/utils/fetcher'

export const useMyFolders = () => {
  const { idToken, isAuthLoading } = useAuthContext()

  const searchParams = useSearchParams()
  const page = searchParams.get('page') || '1'

  const url = page
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/my_folders/?page=${page}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/my_folders`

  const {
    data,
    error: foldersError,
    isLoading: isFoldersLoading,
  }: SWRResponse<PagenatedFoldersData> = useSWR(
    idToken && url ? [url, idToken] : null,
    fetcher,
  )

  const [foldersData, setFoldersData] = useState<
    PagenatedFoldersData | null | undefined
  >(undefined)

  useEffect(() => {
    if (!isAuthLoading && !isFoldersLoading && data) {
      setFoldersData(data)
    } else if (!isAuthLoading && !idToken) {
      setFoldersData(null)
    }
  }, [isAuthLoading, isFoldersLoading, data, idToken])

  return {
    foldersData,
    foldersError,
    isFoldersLoading,
  }
}
