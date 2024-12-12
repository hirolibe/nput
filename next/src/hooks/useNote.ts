import useSWR, { SWRResponse } from 'swr'
import { fetcher } from '@/utils/fetcher'

export interface UseNoteParams {
  authorName?: string
  noteId?: string | number
}

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
  content?: string
  statusJp: '未保存' | '下書き' | '公開中'
  publishedDate?: string
  updatedDate: string
  cheersCount: number
  totalDuration: string
  comments?: CommentData[]
  tags?: {
    id: number
    name: string
  }[]
  user: {
    name: string
    profile: {
      nickname?: string
      bio?: string
      xLink?: string
      githubLink?: string
      avatarUrl?: string
    }
  }
}

export const useNote = ({ authorName, noteId }: UseNoteParams) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${authorName}/notes/${noteId}`

  const {
    data: noteData,
    error: noteError,
    isLoading: isNoteLoading,
  }: SWRResponse<NoteData> = useSWR(
    authorName && noteId ? [url, undefined] : null,
    fetcher,
  )

  return {
    noteData,
    noteError,
    isNoteLoading,
  }
}
