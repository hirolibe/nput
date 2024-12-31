import {
  Box,
  CardContent,
  Divider,
  Pagination,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import UserCard from '../note/UserCard'
import { useFollowers } from '@/hooks/useFollowers'
import { BasicUserData } from '@/hooks/useFollowings'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

const Followers = () => {
  const router = useRouter()
  const { name } = router.query
  const userName = typeof name === 'string' ? name : undefined

  const { followersData, followersError, isFollowersLoading } = useFollowers()
  const users = followersData?.users
  const meta = followersData?.meta

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(`/${userName}/?page=${value}`)
  }

  const [, setSnackbar] = useSnackbarState()

  useEffect(() => {
    if (followersError) {
      const { errorMessage } = handleError(followersError)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: router.pathname,
      })
    }
  }, [followersError, router.pathname, setSnackbar])

  if (followersError) {
    return (
      <CardContent
        sx={{
          mx: { xs: 0, md: 10 },
          py: { xs: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 14, sm: 16 },
              color: 'text.placeholder',
              my: 0.5,
            }}
          >
            データを取得できませんでした
          </Typography>
        </Box>
      </CardContent>
    )
  }

  if (!isFollowersLoading && !users?.length) {
    return (
      <CardContent
        sx={{
          mx: { xs: 0, md: 10 },
          py: { xs: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 14, sm: 16 },
              color: 'text.placeholder',
              my: 0.5,
            }}
          >
            フォロワーがいません
          </Typography>
        </Box>
      </CardContent>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      {users?.map((user: BasicUserData, i: number) => (
        <Box key={i} sx={{ border: 'none', mx: { xs: 0, sm: 6, lg: 15 } }}>
          <UserCard {...user} />
          <Divider />
        </Box>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <Pagination
          count={meta?.totalPages}
          page={meta?.currentPage}
          onChange={handleChange}
        />
      </Box>
    </Box>
  )
}

export default Followers
