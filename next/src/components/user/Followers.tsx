import { Box, Divider, Pagination, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import UserCard from '../note/UserCard'
import { useFollowers } from '@/hooks/useFollowers'
import { BasicUserData } from '@/hooks/useFollowings'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

const Followers = () => {
  const router = useRouter()

  const [page, setPage] = useState<number>(1)
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const { followersData, followersError, isFollowersLoading } =
    useFollowers(page)
  const followers = followersData?.users
  const meta = followersData?.meta

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

  if (followersError || (!isFollowersLoading && !followers?.length)) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '448px',
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 14, sm: 16 },
            color: 'text.placeholder',
          }}
        >
          {followersError
            ? 'データを取得できませんでした'
            : 'フォロワーがいません'}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      {followers?.map((user: BasicUserData, i: number) => (
        <Box
          key={i}
          sx={{ border: 'none', mx: { xs: 0, sm: 5, md: 10, lg: 15 } }}
        >
          {' '}
          <UserCard {...user} />
          <Divider />
        </Box>
      ))}

      {!!meta?.totalPages && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <Pagination
            count={meta?.totalPages}
            page={meta?.currentPage}
            onChange={handleChange}
          />
        </Box>
      )}
    </Box>
  )
}

export default Followers
