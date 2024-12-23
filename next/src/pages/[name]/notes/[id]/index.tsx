import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Error from '@/components/common/Error'
import NoteDetail from '@/components/note/NoteDetail'
import { useNote } from '@/hooks/useNote'
import { handleError } from '@/utils/handleError'

const PublicNoteDetail: NextPage = () => {
  const router = useRouter()
  const { name, id } = router.query
  const [nameString, idString] = [name, id].map((value) =>
    typeof value === 'string' ? value : undefined,
  )

  const { noteData, noteError } = useNote({
    authorName: nameString,
    noteId: idString,
  })

  if (noteError) {
    const { statusCode, errorMessage } = handleError(noteError)
    return <Error statusCode={statusCode} errorMessage={errorMessage} />
  }

  if (!noteData) return <></>

  return <NoteDetail noteData={noteData} />
}

export default PublicNoteDetail
