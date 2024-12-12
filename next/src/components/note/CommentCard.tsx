import { Avatar, Box, Card, Divider, Typography } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'
import CommentForm from './CommentForm'
import MarkdownText from './MarkdownText'
import { CommentData, NoteData } from '@/hooks/useNote'

const CommentCard = ({ noteData }: { noteData: NoteData }) => {
  const [comments, setComments] = useState<CommentData[]>(
    noteData?.comments || [],
  )

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
      {comments?.map((comment: CommentData, i: number) => (
        <Box key={i}>
          {/* コメント投稿者のプロフィール・投稿日 */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {/* プロフィール */}
            <Box sx={{ mr: 2 }}>
              <Avatar
                alt={comment.user.profile.nickname || comment.user.name}
                src={comment.user.profile.avatarUrl}
              />
            </Box>
            <Typography sx={{ fontWeight: 'bold', mr: 1 }}>
              <Link href={`/${comment?.user.name}`}>
                {comment.user.profile.nickname || comment.user.name}
              </Link>
            </Typography>

            {/* 投稿日 */}
            <Typography sx={{ fontSize: 12, color: '#8F9FAA' }}>
              {comment.fromToday}
            </Typography>
          </Box>

          {/* コメント内容 */}
          <MarkdownText content={comment.content} />
          <Divider sx={{ my: 5 }} />
        </Box>
      ))}

      {/* コメント入力フォーム */}
      <CommentForm addComment={addComment} />
    </Card>
  )
}

export default CommentCard
