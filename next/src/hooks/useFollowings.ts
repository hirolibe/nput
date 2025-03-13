import { useParams } from 'next/navigation'
import useSWR, { SWRResponse } from 'swr'
import { fetcher } from '@/utils/fetcher'

export interface BasicUserData {
  name: string
  profile: {
    nickname: string
    bio: string
    avatarUrl: string
  }
}

export interface PagenatedUsersData {
  users: BasicUserData[]
  meta: {
    totalPages: number
    currentPage: number
  }
}

export const useFollowings = (page: number) => {
  const params = useParams()
  const name = params?.name
  const userName = typeof name === 'string' ? name : undefined

  const url = page
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${userName}/followings/?page=${page}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${userName}/followings`

  const {
    data: followingsData,
    error: followingsError,
    isLoading: isFollowingsLoading,
  }: SWRResponse<PagenatedUsersData> = useSWR([url, undefined], fetcher)

  return {
    followingsData,
    followingsError,
    isFollowingsLoading,
  }
}
