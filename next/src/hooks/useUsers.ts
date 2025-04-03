import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { useAuthContext } from './useAuthContext'
import { PageData } from './useNotes'
import { fetcher } from '@/utils/fetcher'
import { useAuthError } from './useAuthError'

export interface UserSystemData {
  id: number
  name: string
  email: string
  role: string
  guest: boolean
}

export interface PagenatedUsersSystemData {
  users: UserSystemData[]
  meta: PageData
}

export const useUsers = () => {
  const { idToken, isAuthLoading } = useAuthContext()
  const searchParams = useSearchParams()
  const page = searchParams.get('page') || '1'

  const url = page
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/?page=${page}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users`

  const {
    data,
    error,
    isLoading: isUsersLoading,
  }: SWRResponse<PagenatedUsersSystemData> = useSWR(
    idToken ? [url, idToken] : null,
    fetcher,
  )

  const [usersData, setUsersData] = useState<
    PagenatedUsersSystemData | null | undefined
  >(undefined)

  useEffect(() => {
    if (!isAuthLoading && !isUsersLoading && data) {
      setUsersData(data)
    } else if (!isAuthLoading && !idToken) {
      setUsersData(null)
    }
  }, [isAuthLoading, isUsersLoading, data, idToken])

  const { authError: usersError } = useAuthError({
    error,
  })

  return {
    usersData,
    usersError,
    isUsersLoading,
  }
}
