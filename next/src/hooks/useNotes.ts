import useSWR, { SWRResponse } from 'swr'
import { fetcher } from '@/utils/fetcher'

export interface BasicNoteData {
  id: number
  title: string
  fromToday: string
  cheersCount: number
  totalDuration: string
  user: {
    name: string
    profile: {
      nickname: string
      avatarUrl: string
    }
  }
  tags: {
    id: number
    name: string
  }[]
}

export interface PagenatedNotesData {
  notes: BasicNoteData[]
  meta: {
    totalPages: number
    currentPage: number
  }
}

export const useNotes = (page: string | number) => {
  const url = page
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/notes/?page=${page}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/notes`

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
