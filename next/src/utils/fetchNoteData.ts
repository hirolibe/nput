import { NoteData } from '@/hooks/useNotes'
import { fetcher } from '@/utils/fetcher'

export const fetchNoteData = async (
  baseUrl: string,
  name: string,
  slug: string,
): Promise<NoteData> => {
  const url = `${baseUrl}/${name}/notes/${slug}`
  return await fetcher([url, undefined])
}
