import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import EditIcon from '@mui/icons-material/Edit'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import StopPropagationLink from '../common/StopPropagationLink'
import { CheerIcon } from './CheerIcon'
import { useCheerStatus } from '@/hooks/useCheerStatus'
import { BasicNoteData } from '@/hooks/useNotes'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

const NoteCard = (props: BasicNoteData) => {
  const omit = (text: string) => (len: number) => (ellipsis: string) =>
    text.length >= len ? text.slice(0, len - ellipsis.length) + ellipsis : text

  const { cheerStatusData, cheerStatusError } = useCheerStatus({
    authorName: props.user.name,
    noteId: props.id,
  })
  const [isCheered, setIsCheered] = useState<boolean | undefined>(undefined)
  const router = useRouter()
  const [, setSnackbar] = useSnackbarState()

  useEffect(() => {
    if (cheerStatusError) {
      const { errorMessage } = handleError(cheerStatusError)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: router.pathname,
      })
    }
  }, [cheerStatusError, router.pathname, setSnackbar])

  useEffect(() => {
    setIsCheered(cheerStatusData)
  }, [cheerStatusData])

  return (
    <Card>
      <CardContent sx={{ '&:last-child': { pb: 2 }, px: 4 }}>
        <Typography
          component="h3"
          sx={{
            mb: 1,
            fontSize: { xs: 16, sm: 20 },
            fontWeight: 'bold',
            lineHeight: 1.5,
          }}
        >
          {omit(props.title)(40)('...')}
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            mb: 1,
          }}
        >
          {props.tags.map((tag, i: number) => (
            <StopPropagationLink key={i} href={`/tags/${tag.name}`}>
              <Chip
                label={tag.name}
                variant="outlined"
                sx={{
                  '&:hover': {
                    backgroundColor: 'backgroundColor.hover',
                  },
                  fontSize: '0.75rem',
                }}
              />
            </StopPropagationLink>
          ))}
        </Stack>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StopPropagationLink href={`/${props.user.name}`}>
            <Avatar
              alt={props.user.profile.nickname || props.user.name}
              src={props.user.profile.avatarUrl}
              sx={{ mr: 2 }}
            />
          </StopPropagationLink>
          <Stack>
            <Typography sx={{ fontSize: 12 }}>
              <StopPropagationLink href={`/${props.user.name}`}>
                {props.user.profile.nickname || props.user.name}
              </StopPropagationLink>
            </Typography>
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
                {isCheered === undefined ? (
                  <Box sx={{ width: 16 }}></Box>
                ) : (
                  <CheerIcon isCheered={isCheered} size={16} />
                )}
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
