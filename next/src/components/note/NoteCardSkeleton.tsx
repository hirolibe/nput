import { Card, CardContent, Skeleton, Stack, Box, Avatar } from '@mui/material'

const NoteCardSkeleton = () => {
  return (
    <Card>
      <CardContent sx={{ '&:last-child': { pb: 2 }, px: 4 }}>
        <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              variant="rectangular"
              width={60}
              height={32}
              sx={{ borderRadius: '16px' }}
              key={i}
            />
          ))}
        </Stack>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
          </Avatar>
          <Stack>
            <Skeleton variant="text" width="80px" height={24} />
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ color: 'gray' }}
            >
              <Skeleton variant="text" width={30} height={18} />
              <Skeleton variant="text" width={50} height={18} />
              <Skeleton variant="text" width={30} height={18} />
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}

export default NoteCardSkeleton
