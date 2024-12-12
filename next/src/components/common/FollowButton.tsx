import { Button } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

export interface FollowButtonProps {
  followState: {
    isFollowed: boolean | undefined
    setIsFollowed: Dispatch<SetStateAction<boolean | undefined>>
  }
}

export const FollowButton = ({ followState }: FollowButtonProps) => {
  const router = useRouter()
  const { name, id } = router.query
  const [nameString] = [name, id].map((value) =>
    typeof value === 'string' ? value : undefined,
  )
  const { idToken, isAuthLoading } = useAuth()
  const [, setSnackbar] = useSnackbarState()

  const { isFollowed, setIsFollowed } = followState

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${nameString}/relationship`
  const headers = { Authorization: `Bearer ${idToken}` }

  const handleFollow = async () => {
    if (isAuthLoading) return

    if (!idToken) {
      setSnackbar({
        message: 'ログインしてください',
        severity: 'error',
        pathname: router.pathname,
      })
    }

    try {
      await axios.post(url, null, { headers })
      setIsFollowed?.(true)
    } catch (err) {
      const { errorMessage } = handleError(err)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: router.pathname,
      })
    }
  }

  const handleUnFollow = async () => {
    try {
      await axios.delete(url, { headers })
      setIsFollowed?.(false)
    } catch (err) {
      const { errorMessage } = handleError(err)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: router.pathname,
      })
    }
  }

  if (isFollowed === undefined) return

  return (
    <>
      {!isFollowed && (
        <Button
          onClick={handleFollow}
          variant="outlined"
          sx={{
            fontSize: 13,
            color: 'black',
            borderRadius: 2,
            boxShadow: 'none',
            border: '1px solid black',
            fontWeight: 'bold',
            height: '30px',
            width: '100px',
            '&:hover': {
              borderColor: 'black',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            },
            mr: 1,
          }}
        >
          フォロー
        </Button>
      )}
      {isFollowed && (
        <Button
          onClick={handleUnFollow}
          variant="contained"
          sx={{
            fontSize: 13,
            color: 'white',
            borderRadius: 2,
            boxShadow: 'none',
            fontWeight: 'bold',
            height: '30px',
            width: '100px',
            '&:hover': {
              borderColor: 'primary',
            },
            mr: 1,
          }}
        >
          フォロー中
        </Button>
      )}
    </>
  )
}
