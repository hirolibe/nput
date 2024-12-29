import { useRouter } from 'next/router'
import useSWR, { SWRResponse } from 'swr'
import { fetcher } from '@/utils/fetcher'
import { PagenatedNotesData } from './useNotes'

export interface BasicNoteData {
  id: number
  title: string
  description?: string
  fromToday: string
  statusJp?: '未保存' | '下書き' | '公開中'
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
