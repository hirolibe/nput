import {
  Box,
  CardContent,
  Divider,
  Pagination,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import UserCard from '../note/UserCard'
import { BasicUserData } from '@/hooks/useFollowings'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { useSupporters } from '@/hooks/useSupporters'
import { handleError } from '@/utils/handleError'

const Supporters = () => {
  const router = useRouter()
  const [, setSnackbar] = useSnackbarState()

  const [page, setPage] = useState<number>(1)
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const { supportersData, supportersError, isSupportersLoading } =
    useSupporters(page)
  const supporters = supportersData?.users
  const meta = supportersData?.meta

  useEffect(() => {
    if (supportersError) {
      const { errorMessage } = handleError(supportersError)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: router.pathname,
      })
    }
  }, [supportersError, router.pathname, setSnackbar])

  if (supportersError) {
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

  if (!isSupportersLoading && !supporters?.length) {
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
            エールしたユーザーがまだいません
          </Typography>
        </Box>
      </CardContent>
    )
  }

  return (
    <>
      {supporters?.map((user: BasicUserData, i: number) => (
        <Box key={i} sx={{ border: 'none', mx: { xs: 0, sm: 3 } }}>
          <UserCard {...user} />
          <Divider />
        </Box>
      ))}
      {meta && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            my: 2,
          }}
        >
          <Pagination
            count={meta?.totalPages}
            page={meta?.currentPage}
            onChange={handleChange}
          />
        </Box>
      )}
    </>
  )
}

export default Supporters
