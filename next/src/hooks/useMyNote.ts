import { useEffect, useState } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { useAuth } from './useAuth'
import { fetcher } from '@/utils/fetcher'

export interface UseMyNoteParams {
  noteId?: string | number
}

export interface MyNoteData {
  id: number
  title?: string
  description?: string
  content?: string
  statusJp: '未保存' | '下書き' | '公開中'
  publishedDate?: string
  updatedDate: string
  totalDuration: number
  user: {
    cheerPoints: number
  }
  tags?: {
    id: number
    name: string
  }[]
}

export const useMyNote = ({ noteId }: UseMyNoteParams) => {
  const { idToken, isAuthLoading } = useAuth()
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/my_notes/${noteId}`

  const {
    data,
    error,
    isLoading: isNoteLoading,
  }: SWRResponse<MyNoteData> = useSWR(
    idToken && noteId ? [url, idToken] : null,
    fetcher,
  )

  const [noteData, setNoteData] = useState<MyNoteData | null | undefined>(
    undefined,
  )
  useEffect(() => {
    if (!isAuthLoading && !isNoteLoading && data) {
      setNoteData(data)
    } else if (!isAuthLoading && !idToken) {
      setNoteData(null)
    }
  }, [isAuthLoading, isNoteLoading, data, idToken])

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
