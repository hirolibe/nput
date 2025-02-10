import { FollowStatusData } from '@/hooks/useFollowStatus'
import { fetcher } from '@/utils/fetcher'
import { handleError } from '@/utils/handleError'

export const fetchFollowStatusData = async (
  baseUrl: string,
  name: string,
  idToken: string,
): Promise<FollowStatusData | null> => {
  try {
    const url = `${baseUrl}/${name}/relationship`
    return await fetcher([url, idToken])
  } catch (err) {
    handleError(err)
    return null
  }
}
