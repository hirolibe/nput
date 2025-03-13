import { useParams } from 'next/navigation'
import useSWR, { SWRResponse } from 'swr'
import { PagenatedUsersData } from './useFollowings'
import { fetcher } from '@/utils/fetcher'

export const useSupporters = (page?: number) => {
  const params = useParams()
  const name = params?.name
  const slug = params?.slug
  const [authorName, noteSlug] = [name, slug].map((value) =>
    typeof value === 'string' ? value : undefined,
  )
  const url = page
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${authorName}/notes/${noteSlug}/supporters/?page=${page}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${authorName}/notes/${noteSlug}/supporters`

  const {
    data: supportersData,
    error: supportersError,
    isLoading: isSupportersLoading,
  }: SWRResponse<PagenatedUsersData> = useSWR([url, undefined], fetcher)

  return {
    supportersData,
    supportersError,
    isSupportersLoading,
  }
}
