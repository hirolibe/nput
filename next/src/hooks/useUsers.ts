import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { useAuthContext } from './useAuthContext'
import { fetcher } from '@/utils/fetcher'

export interface UserSystemData {
  id: number
  name: string
  email: string
  role: string
}

export const useUsers = () => {
  const { idToken, isAuthLoading } = useAuthContext()

  const router = useRouter()
  const page = 'page' in router.query ? String(router.query.page) : 1

  const url = page
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/?page=${page}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users`

  const {
    data,
    error: usersError,
    isLoading: isUsersLoading,
  }: SWRResponse<UserSystemData[]> = useSWR(
    idToken ? [url, idToken] : null,
    fetcher,
  )

  const [usersData, setUsersData] = useState<
    UserSystemData[] | null | undefined
  >(undefined)

  useEffect(() => {
    if (!isAuthLoading && !isUsersLoading && data) {
      setUsersData(data)
    } else if (!isAuthLoading && !idToken) {
      setUsersData(null)
    }
  }, [isAuthLoading, isUsersLoading, data, idToken])

  return {
    usersData,
    usersError,
    isUsersLoading,
  }
}
