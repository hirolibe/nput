import { useParams } from 'next/navigation'
import useSWR, { SWRResponse } from 'swr'
import { PagenatedFoldersData } from './useFolders'
import { fetcher } from '@/utils/fetcher'

export const useUserFolders = (page: number) => {
  const params = useParams()
  const name = params?.name
  const userName = typeof name === 'string' ? name : undefined

  const url = page
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${userName}/folders/?page=${page}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${userName}/folders`

  const {
    data: foldersData,
    error: foldersError,
    isLoading: isFoldersLoading,
  }: SWRResponse<PagenatedFoldersData> = useSWR([url, undefined], fetcher)

  return {
    foldersData,
    foldersError,
    isFoldersLoading,
  }
}
