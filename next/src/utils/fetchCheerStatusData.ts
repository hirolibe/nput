import { CheerStatusData } from '@/hooks/useCheerStatus'
import { fetcher } from '@/utils/fetcher'
import { handleError } from '@/utils/handleError'

export const fetchCheerStatusData = async (
  baseUrl: string,
  name: string,
  slug: string,
  idToken: string,
): Promise<CheerStatusData | null> => {
  try {
    const url = `${baseUrl}/${name}/notes/${slug}/cheer`
    return await fetcher([url, idToken])
  } catch (err) {
    handleError(err)
    return null
  }
}
