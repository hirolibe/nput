import { useState, useEffect } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { useAuthContext } from './useAuthContext'
import { FilingNoteCardProps } from '@/components/note/FilingNoteCard'
import { fetcher } from '@/utils/fetcher'

export interface FileStatusData {
  isFiled: boolean
}

export const useFileStatus = (props: FilingNoteCardProps) => {
  const {
    note: { slug },
    folderSlug,
  } = props
  const { idToken, isAuthLoading } = useAuthContext()

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/my_folders/${folderSlug}/my_filed_notes/${slug}/file`
  const {
    data,
    error: fileStatusError,
    isLoading: isFileStatusLoading,
  }: SWRResponse<FileStatusData | undefined> = useSWR(
    folderSlug && slug && idToken ? [url, idToken] : null,
    fetcher,
  )

  const [fileStatusData, setFileStatusData] = useState<
    FileStatusData | undefined
  >(undefined)
  useEffect(() => {
    if (!isAuthLoading && !isFileStatusLoading && data) {
      setFileStatusData(data)
    } else if (!isAuthLoading && !idToken) {
      setFileStatusData({ isFiled: false })
    }
  }, [isAuthLoading, isFileStatusLoading, data, idToken])

  return {
    fileStatusData: fileStatusData?.isFiled,
    fileStatusError,
    isFileStatusLoading,
  }
}
