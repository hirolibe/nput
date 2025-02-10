import { ProfileData } from '@/hooks/useProfile'
import { fetcher } from '@/utils/fetcher'
import { handleError } from '@/utils/handleError'

export const fetchProfileData = async (
  baseUrl: string,
  idToken: string,
): Promise<ProfileData | null> => {
  try {
    const url = `${baseUrl}/profile`
    return await fetcher([url, idToken])
  } catch (err) {
    handleError(err)
    return null
  }
}
