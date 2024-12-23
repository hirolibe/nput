import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Error from '@/components/common/Error'
import NoteDetail from '@/components/note/NoteDetail'
import { useMyNote } from '@/hooks/useMyNote'
import { handleError } from '@/utils/handleError'

const MyNoteDetail: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const idString = typeof id === 'string' ? id : undefined

  const { noteData, noteError } = useMyNote({
    noteId: idString,
  })

  if (noteError) {
    const { statusCode, errorMessage } = handleError(noteError)
    return <Error statusCode={statusCode} errorMessage={errorMessage} />
  }

  if (!noteData) return <></>

  return (
    <NoteDetail noteData={noteData} isDraft={noteData.statusJp === '下書き'} />
  )
}

export default MyNoteDetail
