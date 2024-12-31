import { Card, CardContent, Skeleton, Stack, Box, Avatar } from '@mui/material'

const NoteCardSkeleton = () => {
  return (
    <Card>
      <CardContent sx={{ px: 4, pt: 3, height: '100%' }}>
        <Box sx={{ display: { md: 'flex' }, alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', mb: { xs: 2, md: 0 } }}>
            <Avatar sx={{ mr: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
            </Avatar>
            <Stack sx={{ mr: 3 }}>
              <Skeleton variant="text" width={60} height={20} />
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ color: 'gray', mr: 1 }}
              >
                <Skeleton variant="text" width={55} height={20} />
                <Skeleton variant="text" width={60} height={20} />
                <Skeleton variant="text" width={35} height={20} />
              </Stack>
            </Stack>
          </Box>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'flex-end', mt: 1 }}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                variant="rectangular"
                width={60}
                height={30}
                sx={{ borderRadius: 50 }}
                key={i}
              />
            ))}
          </Stack>
        </Box>
        <Skeleton variant="text" width="100%" height={40} />
        <Skeleton
          variant="text"
          width={70}
          height={34}
          sx={{ display: { md: 'none' }, my: 0.5 }}
        />
      </CardContent>
    </Card>
  )
}

export default NoteCardSkeleton
