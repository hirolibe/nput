import { NoteData } from '@/hooks/useNotes'
import { fetcher } from '@/utils/fetcher'

export const fetchNoteData = async (
  baseUrl: string,
  name: string,
  slug: string,
  idToken?: string,
  userName?: string,
): Promise<NoteData> => {
  const urlPath =
    userName === name ? `my_notes/${slug}` : `${name}/notes/${slug}`
  const url = `${baseUrl}/${urlPath}`
  return await fetcher([url, idToken])
}
