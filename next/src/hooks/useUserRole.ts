import { useState, useEffect } from 'react'
import useSWR, { SWRResponse } from 'swr'
import { useAuthContext } from './useAuthContext'
import { useAuthError } from './useAuthError'
import { fetcher } from '@/utils/fetcher'

interface UserRoleData {
  role: string
}

export const useUserRole = () => {
  const { idToken, isAuthLoading } = useAuthContext()
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/role`

  const {
    data,
    error,
    isLoading: isUserRoleLoading,
  }: SWRResponse<UserRoleData | null | undefined> = useSWR(
    idToken ? [url, idToken] : null,
    fetcher,
  )

  const [userRoleData, setUserRoleData] = useState<
    UserRoleData | null | undefined
  >(undefined)
  useEffect(() => {
    if (!isAuthLoading && !isUserRoleLoading && data) {
      setUserRoleData(data)
    } else if (!isAuthLoading && !idToken) {
      setUserRoleData(null)
    }
  }, [isAuthLoading, isUserRoleLoading, data, idToken])

  const { authError: userRoleError } = useAuthError({
    error,
  })

  return {
    userRoleData,
    userRoleError,
    isUserRoleLoading,
  }
}
