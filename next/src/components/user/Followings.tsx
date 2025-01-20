import {
  Box,
  CardContent,
  Divider,
  Pagination,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, Dispatch, SetStateAction, useState } from 'react'
import UserCard from '../note/UserCard'
import { useFollowings, BasicUserData } from '@/hooks/useFollowings'
import { pageData } from '@/hooks/useNotes'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

type FollowingsProps = {
  setChangedFollowingsCount: Dispatch<SetStateAction<number | undefined>>
}

const Followings = (props: FollowingsProps) => {
  const router = useRouter()

  const [page, setPage] = useState<number>(1)
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const { followingsData, followingsError, isFollowingsLoading } =
    useFollowings(page)

  const [followings, setFollowings] = useState<BasicUserData[] | undefined>(
    undefined,
  )
  const [meta, setMeta] = useState<pageData | undefined>(undefined)

  useEffect(() => {
    setFollowings(followingsData?.users)
  }, [setFollowings, followingsData?.users])

  useEffect(() => {
    setMeta(followingsData?.meta)
  }, [setMeta, followingsData?.meta])

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

  if (!isFollowingsLoading && !followings?.length) {
    return (
      <CardContent
        sx={{
          mx: { xs: 0, md: 10 },
          py: { xs: 3, md: 3 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '440px',
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 14, sm: 16 },
              color: 'text.placeholder',
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
      {followings?.map((user: BasicUserData, i: number) => (
        <Box
          key={i}
          sx={{ border: 'none', mx: { xs: 0, sm: 5, md: 10, lg: 15 } }}
        >
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
