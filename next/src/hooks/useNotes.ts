import { useRouter } from 'next/router'
import useSWR, { SWRResponse } from 'swr'
import { fetcher } from '@/utils/fetcher'

export interface BasicNoteData {
  id: number
  title: string
  description?: string
  fromToday: string
  statusJp?: '未保存' | '下書き' | '公開中'
  cheersCount: number
  slug: string
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

export interface pageData {
  totalPages: number
  currentPage: number
}

export interface PagenatedNotesData {
  notes: BasicNoteData[]
  meta: pageData
}

export const useNotes = () => {
  const router = useRouter()
  const page = 'page' in router.query ? String(router.query.page) : 1

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
