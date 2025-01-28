import { useState, useEffect } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { useAuthContext } from './useAuthContext'
import { fetcher } from '@/utils/fetcher'

export const useUserRole = () => {
  const { idToken, isAuthLoading } = useAuthContext()
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/role`

  const {
    data,
    error: userRoleError,
    isLoading: isUserRoleLoading,
  }: SWRResponse<string | null | undefined> = useSWR(
    idToken ? [url, idToken] : null,
    fetcher,
  )

  const [userRoleData, setUserRoleData] = useState<
  string | null | undefined
  >(undefined)
  useEffect(() => {
    if (!isAuthLoading && !isUserRoleLoading && data) {
      setUserRoleData(data)
    } else if (!isAuthLoading && !idToken) {
      setUserRoleData(null)
    }
  }, [isAuthLoading, isUserRoleLoading, data, idToken])

  return {
    userRoleData,
    userRoleError,
    isUserRoleLoading,
  }
}
