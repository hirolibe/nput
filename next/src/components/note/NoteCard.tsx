import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import EditIcon from '@mui/icons-material/Edit'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import React from 'react'
import CheerStatus from './CheerStatus'

type NoteCardProps = {
  id: number
  title: string
  fromToday: string
  cheersCount: number
  totalDuration: string
  userId: number
  userName: string
  avatarUrl: string
  tags: {
    id: number
    name: string
  }[]
}

const NoteCard = (props: NoteCardProps) => {
  const omit = (text: string) => (len: number) => (ellipsis: string) =>
    text.length >= len ? text.slice(0, len - ellipsis.length) + ellipsis : text

  const stopEventPropagation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <Card>
      <CardContent sx={{ '&:last-child': { pb: 2 }, px: 4 }}>
        <Typography
          component="h3"
          sx={{
            mb: 1,
            fontSize: 20,
            fontWeight: 'bold',
            lineHeight: 1.5,
          }}
        >
          {omit(props.title)(40)('...')}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          {props.tags.map((tag, i: number) => (
            <Link
              key={i}
              href={`/tags/${tag.id}`}
              onClick={stopEventPropagation}
            >
              <Chip
                label={tag.name}
                variant="outlined"
                sx={{
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                  fontSize: '0.75rem',
                }}
              />
            </Link>
          ))}
        </Stack>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link href={`/users/${props.userId}`} onClick={stopEventPropagation}>
            <Avatar src={props.avatarUrl} sx={{ mr: 2 }} />
          </Link>
          <Stack>
            <Link
              href={`/users/${props.userId}`}
              onClick={stopEventPropagation}
              sx={{
                textDecoration: 'none',
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                  color: 'black',
                  display: 'inline',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {props.userName}
              </Typography>
            </Link>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ color: 'gray' }}
            >
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CalendarTodayIcon sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: 12 }}>{props.fromToday}</Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <EditIcon sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: 12 }}>
                  {props.totalDuration}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={0.5} alignItems="center">
                <CheerStatus noteId={props.id} />
                <Typography sx={{ fontSize: 12 }}>
                  {props.cheersCount}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}

export default NoteCard
