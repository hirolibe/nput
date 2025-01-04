import { useRouter } from 'next/router'
import useSWR, { SWRResponse } from 'swr'
import { PagenatedNotesData } from './useNotes'
import { fetcher } from '@/utils/fetcher'

export const useUserNotes = (page: number) => {
  const router = useRouter()
  const { name } = router.query
  const userName = typeof name === 'string' ? name : undefined

  const url = page
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${userName}/user_notes/?page=${page}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${userName}/user_notes`

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
