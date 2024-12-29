import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { useAuth } from './useAuth'
import { useProfile } from './useProfile'
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

export const useNote = () => {
  const { idToken, isAuthLoading } = useAuth()
  const router = useRouter()
  const { name, id } = router.query
  const [authorName, noteId] = [name, id].map((value) =>
    typeof value === 'string' ? value : undefined,
  )

  const { profileData, isProfileLoading } = useProfile()

  const urlPath =
    !authorName || authorName === profileData?.user.name
      ? `my_notes/${noteId}`
      : `${authorName}/notes/${noteId}`
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${urlPath}`

  const {
    data,
    error,
    isLoading: isNoteLoading,
  }: SWRResponse<NoteData> = useSWR(
    isAuthLoading || profileData === undefined
      ? null
      : [url, idToken ?? undefined],
    fetcher,
  )

  const [noteData, setNoteData] = useState<NoteData | null | undefined>(
    undefined,
  )
  useEffect(() => {
    if (!isAuthLoading && !isProfileLoading && !isNoteLoading) {
      setNoteData(data ?? null)
    }
  }, [isAuthLoading, isProfileLoading, isNoteLoading, data])

  const [noteError, setNoteError] = useState<Error | undefined>(undefined)

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setNoteError(error)
      }, 10000)
      return () => clearTimeout(timer)
    } else {
      setNoteError(undefined)
    }
  }, [error])

  return {
    noteData,
    noteError,
    isNoteLoading,
  }
}
