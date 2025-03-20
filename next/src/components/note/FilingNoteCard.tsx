import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import EditIcon from '@mui/icons-material/Edit'
import { Box, CardContent, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { CheerIcon } from './CheerIcon'
import { FileButton } from './FileButton'
import { useFileStatus } from '@/hooks/useFileStatus'
import { BasicNoteData } from '@/hooks/useNotes'
import { omit } from '@/utils/omit'

export interface FilingNoteCardProps {
  note: BasicNoteData
  folderSlug?: string
  setNotes: Dispatch<SetStateAction<BasicNoteData[] | null | undefined>>
}

export const FilingNoteCard = (props: FilingNoteCardProps) => {
  const {
    note: { title, fromToday, cheersCount, slug, totalDuration, user },
  } = props

  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/${user.name}/notes/${slug}`)
  }

  const [isFiled, setIsFiled] = useState<boolean | undefined>(false)
  const fileState = { isFiled, setIsFiled }
  const { fileStatusData } = useFileStatus(props)

  useEffect(() => {
    setIsFiled(fileStatusData)
  }, [fileStatusData])

  return (
    <Box onClick={handleCardClick} sx={{ cursor: 'pointer' }}>
      <CardContent
        sx={{
          height: '100%',
          px: 4,
          pt: 1,
          '&:last-child': {
            pb: 1,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
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
                {omit(title)(36)('...')}
              </Typography>
            </Box>
            <Box sx={{ display: { md: 'flex' }, mb: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mr: 5,
                  mb: { xs: 2, md: 0 },
                }}
              >
                <Stack>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ color: 'gray' }}
                  >
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <CalendarTodayIcon sx={{ fontSize: 16 }} />
                      <Typography sx={{ fontSize: { xs: 10, sm: 12 } }}>
                        {fromToday}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <EditIcon sx={{ fontSize: 16 }} />
                      <Typography sx={{ fontSize: { xs: 10, sm: 12 } }}>
                        {totalDuration}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Box
                        gap={0.5}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '30px',
                        }}
                      >
                        <CheerIcon isCheered={false} size={16} />
                        <Typography sx={{ fontSize: { xs: 10, sm: 12 } }}>
                          {cheersCount}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          </Box>
          <Box onClick={(e) => e.stopPropagation()}>
            <FileButton {...props} fileState={fileState} />
          </Box>
        </Box>
      </CardContent>
    </Box>
  )
}
