import {
  Box,
  CardContent,
  Divider,
  Pagination,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, Dispatch, SetStateAction } from 'react'
import UserCard from '../note/UserCard'
import { useFollowings, BasicUserData } from '@/hooks/useFollowings'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

type FollowingsProps = {
  setChangedFollowingsCount: Dispatch<SetStateAction<number | undefined>>
}

const Followings = (props: FollowingsProps) => {
  const router = useRouter()
  const { name } = router.query
  const userName = typeof name === 'string' ? name : undefined

  const { followingsData, followingsError, isFollowingsLoading } =
    useFollowings()
  const users = followingsData?.users
  const meta = followingsData?.meta

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(`/${userName}/?page=${value}`)
  }

  const [, setSnackbar] = useSnackbarState()

  useEffect(() => {
    if (followingsError) {
      const { errorMessage } = handleError(followingsError)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: router.pathname,
      })
    }
  }, [followingsError, router.pathname, setSnackbar])

  if (followingsError) {
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

  if (!isFollowingsLoading && !users?.length) {
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
            フォローしているユーザーがいません
          </Typography>
        </Box>
      </CardContent>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      {users?.map((user: BasicUserData, i: number) => (
        <Box key={i} sx={{ border: 'none', mx: { xs: 0, sm: 6, lg: 15 } }}>
          <UserCard
            {...user}
            setChangedFollowingsCount={props.setChangedFollowingsCount}
          />
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

export default Followings
