import useSWR, { SWRResponse } from 'swr'
import { fetcher } from '@/utils/fetcher'

export interface TagData {
  id: number
  name: string
  notesCount: number
}

export const useTags = () => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/tags`

  const {
    data: tagsData,
    error: tagsError,
    isLoading: isTagsLoading,
  }: SWRResponse<TagData[]> = useSWR([url, undefined], fetcher)

  return {
    tagsData: tagsData ?? [],
    tagsError,
    isTagsLoading,
  }
}
