import { useSearchParams } from 'next/navigation'
import useSWR, { SWRResponse } from 'swr'
import { fetcher } from '@/utils/fetcher'

export interface FolderData {
  id: number
  name: string
  notesCount: number
  slug: string
}

export interface PageData {
  totalPages: number
  currentPage: number
}

export interface PagenatedFoldersData {
  folders: FolderData[]
  meta: PageData
}

export const useFolders = () => {
  const searchParams = useSearchParams()
  const name = searchParams.get('name')
  const page = searchParams.get('page') || '1'

  const url = name
    ? page
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${name}/folders/?page=${page}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${name}/folders`
    : null

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
