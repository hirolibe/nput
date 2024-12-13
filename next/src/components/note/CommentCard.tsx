import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import {
  Avatar,
  Box,
  Card,
  Divider,
  IconButton,
  Typography,
} from '@mui/material'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import ConfirmationDialog from '../common/ConfirmDialog'
import CommentForm from './CommentForm'
import MarkdownText from './MarkdownText'
import { useAuth } from '@/hooks/useAuth'
import { CommentData, NoteData } from '@/hooks/useNote'
import { useProfile } from '@/hooks/useProfile'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

const CommentCard = ({ noteData }: { noteData: NoteData }) => {
  const { idToken } = useAuth()
  const [open, setOpen] = useState(false)
  const [, setSnackbar] = useSnackbarState()
  const router = useRouter()
  const { name, id } = router.query
  const [nameString, idString] = [name, id].map((value) =>
    typeof value === 'string' ? value : undefined,
  )
  const { profileData } = useProfile()
  const currentUserName = profileData?.user.name

  const [comments, setComments] = useState<CommentData[]>(
    noteData?.comments || [],
  )
  const [commentIdToDelete, setCommentIdToDelete] = useState<number | null>(
    null,
  )

  const handleDeleteComment = (commentId: number) => {
    setCommentIdToDelete(commentId) // 削除対象のcommentIdを状態に保持
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = async () => {
    if (!commentIdToDelete) return

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${nameString}/notes/${idString}/comments/${commentIdToDelete}`
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
        pathname: router.pathname,
      })
    } finally {
      setOpen(false)
    }
  }

  const addComment = (newComment: CommentData) => {
    setComments((prevComments) => [...prevComments, newComment])
  }

  return (
    <Card
      sx={{
        boxShadow: 'none',
        borderRadius: '12px',
        p: 5,
        mb: 3,
      }}
    >
      {/* コメントタイトル */}
      <Typography sx={{ fontSize: 20, fontWeight: 'bold', mb: 1 }}>
        コメント
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* コメント一覧 */}
      {comments?.map((comment: CommentData, i: number) => {
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

            {/* コメント削除の確認画面 */}
            <ConfirmationDialog
              open={open}
              onClose={handleClose}
              onConfirm={handleConfirm}
              message={'コメントを削除しますか？'}
              confirmText="実行"
            />
          </Box>
        )
      })}

      {/* コメント入力フォーム */}
      <CommentForm addComment={addComment} />
    </Card>
  )
}

export default CommentCard
