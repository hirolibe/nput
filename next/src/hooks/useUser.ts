import { useRouter } from 'next/router'
import useSWR, { SWRResponse } from 'swr'
import { fetcher } from '@/utils/fetcher'

export interface UserData {
  name?: string
  cheerPoints?: number
  cheersCount?: number
  followingsCount?: number
  followersCount?: number
  dailyDurations?: number[]
  weeklyDurations?: number[]
  monthlyDurations?: number[]
  totalDuration?: number
  profile: {
    nickname?: string
    bio?: string
    xLink?: string
    githubLink?: string
    avatarUrl?: string
  }
}

export const useUser = () => {
  const router = useRouter()
  const { name } = router.query
  const userName = typeof name === 'string' ? name : undefined

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${userName}`

  const {
    data: userData,
    error: userError,
    isLoading: isUserLoading,
  }: SWRResponse<UserData> = useSWR([url, undefined], fetcher)

  return {
    userData,
    userError,
    isUserLoading,
  }
}
