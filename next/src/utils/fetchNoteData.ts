import { NoteData } from '@/hooks/useNotes'
import { fetcher } from '@/utils/fetcher'
import { handleError } from '@/utils/handleError'

export const fetchNoteData = async (
  baseUrl: string,
  name: string,
  slug: string,
  idToken?: string,
  userName?: string,
): Promise<NoteData | null> => {
  try {
    const urlPath =
      userName === name ? `my_notes/${slug}` : `${name}/notes/${slug}`
    const url = `${baseUrl}/${urlPath}`
    return await fetcher([url, idToken])
  } catch (err) {
    handleError(err)
    return null
  }
}
