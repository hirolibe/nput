import { Button } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState } from 'react'
import LoginDialog from '../auth/LoginDialog'
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
  const { name } = router.query
  const authorName = typeof name === 'string' ? name : undefined

  const { idToken, isAuthLoading } = useAuth()
  const [, setSnackbar] = useSnackbarState()
  const [openLoginDialog, setOpenLoginDialog] = useState(false)

  const { isFollowed, setIsFollowed } = followState

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${authorName}/relationship`
  const headers = { Authorization: `Bearer ${idToken}` }

  const handleFollow = async () => {
    if (isAuthLoading) return

    if (!idToken) {
      setOpenLoginDialog(true)
      return
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

  const handleClose = () => {
    setOpenLoginDialog(false)
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
            fontSize: 12,
            color: 'black',
            borderRadius: 2,
            boxShadow: 'none',
            border: '1px solid black',
            fontWeight: 'bold',
            height: '30px',
            width: '95px',
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
            fontSize: 12,
            color: 'white',
            borderRadius: 2,
            boxShadow: 'none',
            fontWeight: 'bold',
            height: '30px',
            width: '95px',
            '&:hover': {
              borderColor: 'primary',
            },
            mr: 1,
          }}
        >
          フォロー中
        </Button>
      )}
      <LoginDialog open={openLoginDialog} onClose={handleClose} />
    </>
  )
}
