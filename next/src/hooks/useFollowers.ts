import { useRouter } from 'next/router'
import useSWR, { SWRResponse } from 'swr'
import { PagenatedUsersData } from './useFollowings'
import { fetcher } from '@/utils/fetcher'

export const useFollowers = (page: number) => {
  const router = useRouter()
  const { name } = router.query
  const userName = typeof name === 'string' ? name : undefined

  const url = page
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${userName}/followers/?page=${page}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${userName}/followers`

  const {
    data: followersData,
    error: followersError,
    isLoading: isFollowersLoading,
  }: SWRResponse<PagenatedUsersData> = useSWR([url, undefined], fetcher)

  return {
    followersData,
    followersError,
    isFollowersLoading,
  }
}
