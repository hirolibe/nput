import { useRouter } from 'next/router'
import useSWR, { SWRResponse } from 'swr'
import { PagenatedNotesData } from './useNotes'
import { fetcher } from '@/utils/fetcher'

export const useTaggedNotes = () => {
  const router = useRouter()
  const { name } = router.query
  const tagName = typeof name === 'string' ? name : undefined
  const page = 'page' in router.query ? String(router.query.page) : 1

  const url = page
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/tags/${tagName}/tagged_notes/?page=${page}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/tags/${tagName}/tagged_notes`

  const {
    data: notesData,
    error: notesError,
    isLoading: isNotesLoading,
  }: SWRResponse<PagenatedNotesData> = useSWR([url, undefined], fetcher)

  return {
    notesData,
    notesError,
    isNotesLoading,
  }
}
