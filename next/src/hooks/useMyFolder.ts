import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { useAuthContext } from './useAuthContext'
import { useAuthError } from './useAuthError'
import { FolderData } from './useFolders'
import { fetcher } from '@/utils/fetcher'

export const useMyFolder = () => {
  const { idToken } = useAuthContext()

  const params = useParams()
  const slug = params?.slug
  const folderSlug = typeof slug === 'string' ? slug : undefined

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/my_folders/${folderSlug}`

  const {
    data,
    error,
    isLoading: isFolderLoading,
  }: SWRResponse<FolderData> = useSWR(!idToken ? null : [url, idToken], fetcher)

  const [folderData, setFolderData] = useState<FolderData | undefined>(
    undefined,
  )

  useEffect(() => {
    if (data === undefined) return

    setFolderData(data)
  }, [data])

  const { authError: folderError } = useAuthError({
    error,
  })

  return {
    folderData,
    folderError,
    isFolderLoading,
  }
}
