import { useSearchParams } from 'next/navigation'
import useSWR, { SWRResponse } from 'swr'
import { fetcher } from '@/utils/fetcher'

export interface CommentData {
  id: number
  content: string
  fromToday: string
  user: {
    name: string
    profile: {
      nickname?: string
      avatarUrl?: string
    }
  }
}

export interface NoteData {
  id: number
  title?: string
  description?: string
  content?: string
  statusJp: '未保存' | '下書き' | '公開中'
  publishedDate?: string
  updatedDate: string
  cheersCount: number
  slug: string
  totalDuration: number
  comments?: CommentData[]
  tags?: {
    id: number
    name: string
  }[]
  user: {
    name: string
    cheerPoints: number
    profile: {
      nickname?: string
      bio?: string
      xLink?: string
      githubLink?: string
      avatarUrl?: string
    }
  }
}

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

export interface PageData {
  totalPages: number
  currentPage: number
}

export interface PagenatedNotesData {
  notes: BasicNoteData[]
  meta: PageData
}

export const useNotes = () => {
  const searchParams = useSearchParams()
  const page = searchParams.get('page') || '1'

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
