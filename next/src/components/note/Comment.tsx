import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Avatar, Box, Divider, IconButton, Typography } from '@mui/material'
import axios from 'axios'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import ConfirmDialog from '../common/ConfirmDialog'
import CommentForm from './CommentForm'
import MarkdownText from './MarkdownText'
import { useAuthContext } from '@/hooks/useAuthContext'
import { CommentData, NoteData } from '@/hooks/useNotes'
import { ProfileData } from '@/hooks/useProfile'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

interface CommentProps {
  name?: string
  slug?: string
  profileData?: ProfileData | null
  noteData?: NoteData
}

const Comment = ({ name, slug, profileData, noteData }: CommentProps) => {
  const { idToken } = useAuthContext()
  const [open, setOpen] = useState(false)
  const [, setSnackbar] = useSnackbarState()
  const pathname = usePathname()
  const currentUserName = profileData?.user.name

  const [comments, setComments] = useState<CommentData[]>(
    noteData?.comments || [],
  )
  const [commentIdToDelete, setCommentIdToDelete] = useState<number | null>(
    null,
  )

  const handleDeleteComment = (commentId: number) => {
    setCommentIdToDelete(commentId)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = async () => {
    if (!commentIdToDelete) return

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${name}/notes/${slug}/comments/${commentIdToDelete}`
    const headers = { Authorization: `Bearer ${idToken}` }

    try {
      await axios.delete(url, { headers })
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentIdToDelete),
      )
    } catch (err) {
      const { errorMessage } = handleError(err)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: pathname,
      })
    } finally {
      setOpen(false)
    }
  }

  const addComment = (newComment: CommentData) => {
    setComments((prevComments) => [...prevComments, newComment])
  }

  return (
    <Box
      sx={{
        boxShadow: 'none',
        borderRadius: 2,
        backgroundColor: 'white',
        p: 5,
      }}
    >
      {/* コメントタイトル */}
      <Typography sx={{ fontSize: 20, fontWeight: 'bold', mb: 1 }}>
        コメント
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* コメント一覧 */}
      {comments.map((comment: CommentData, i: number) => {
        const {
          user: {
            name: commenterName,
            profile: {
              nickname: commenterNickname,
              avatarUrl: commenterAvatarUrl,
            },
          },
        } = comment
        return (
          <Box key={i}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              {/* コメント投稿者のプロフィール・投稿日 */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* プロフィール */}
                <Box sx={{ mr: 2 }}>
                  <Avatar
                    alt={commenterNickname || commenterName}
                    src={commenterAvatarUrl}
                  />
                </Box>
                <Typography sx={{ fontWeight: 'bold', mr: 1 }}>
                  <Link href={`/${commenterName}`}>
                    {commenterNickname || commenterName}
                  </Link>
                </Typography>

                {/* 投稿日 */}
                <Typography sx={{ fontSize: 12, color: 'text.light' }}>
                  {comment.fromToday}
                </Typography>
              </Box>

              {/* コメント削除ボタン */}
              {commenterName === currentUserName && (
                <IconButton onClick={() => handleDeleteComment(comment.id)}>
                  <DeleteOutlineIcon />
                </IconButton>
              )}
            </Box>

            {/* コメント内容 */}
            <Box sx={{ fontSize: { xs: '14px', sm: '16px' } }}>
              <MarkdownText content={comment.content} />
            </Box>
            <Divider sx={{ my: 5 }} />
          </Box>
        )
      })}

      {/* コメント削除の確認画面 */}
      <ConfirmDialog
        open={open}
        onClose={handleClose}
        onConfirm={handleConfirm}
        message={'コメントを削除しますか？'}
        confirmText="実行"
      />

      {/* コメント入力フォーム */}
      <CommentForm
        name={name}
        slug={slug}
        profileData={profileData}
        addComment={addComment}
      />
    </Box>
  )
}

export default Comment
