import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import EditIcon from '@mui/icons-material/Edit'
import {
  Avatar,
  Box,
  CardContent,
  Chip,
  Fade,
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
import { omit } from '@/utils/omit'

interface NoteCardProps extends BasicNoteData {
  handleOpenDescription: (slug: string) => void
}

const NoteCard = (props: NoteCardProps) => {
  const { cheerStatusData, cheerStatusError } = useCheerStatus({
    authorName: props.user.name,
    noteSlug: props.slug,
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

  const handleCardClick = () => {
    router.push(`/${props.user.name}/notes/${props.slug}`)
  }

  return (
    <Box onClick={handleCardClick} sx={{ cursor: 'pointer' }}>
      <CardContent sx={{ px: 4, pt: 3, height: '100%' }}>
        <Box sx={{ display: { md: 'flex' }, mb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mr: 5,
              mb: { xs: 2, md: 0 },
            }}
          >
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
                  <Typography sx={{ fontSize: { xs: 10, sm: 12 } }}>
                    {props.fromToday}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <EditIcon sx={{ fontSize: 16 }} />
                  <Typography sx={{ fontSize: { xs: 10, sm: 12 } }}>
                    {props.totalDuration}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  {isCheered === undefined ? (
                    <Box sx={{ width: '30px' }}></Box>
                  ) : (
                    <Fade in={true} timeout={{ enter: 1000 }}>
                      <Box
                        gap={0.5}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '30px',
                        }}
                      >
                        <CheerIcon isCheered={isCheered} size={16} />
                        <Typography sx={{ fontSize: { xs: 10, sm: 12 } }}>
                          {props.cheersCount}
                        </Typography>
                      </Box>
                    </Fade>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Box>
          <Box sx={{ mt: 1 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
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
          </Box>
        </Box>

        <Box
          sx={{
            display: { md: 'flex' },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            component="h3"
            sx={{
              fontSize: { xs: 16, sm: 20 },
              fontWeight: 'bold',
              lineHeight: '40px',
            }}
          >
            {omit(props.title)(36)('...')}
          </Typography>
          {props.description && (
            <Box onClick={(e) => e.stopPropagation()}>
              <Typography
                sx={{
                  display: 'block',
                  textAlign: { md: 'end' },
                  fontSize: 14,
                  fontWeight: 'bold',
                  lineHeight: '40px',
                  color: 'text.light',
                  width: '100px',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
                onClick={(e) => {
                  props.handleOpenDescription(props.slug)
                  e.stopPropagation()
                }}
              >
                概要を読む
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Box>
  )
}

export default NoteCard
