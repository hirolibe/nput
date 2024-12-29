import { useRouter } from 'next/router'
import useSWR, { SWRResponse } from 'swr'
import { fetcher } from '@/utils/fetcher'
import { PagenatedUsersData } from './useFollowings'

export const useFollowers = () => {
  const router = useRouter()
  const { name } = router.query
  const userName = typeof name === 'string' ? name : undefined

  const page = 'page' in router.query ? String(router.query.page) : 1

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
