import { Button } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState } from 'react'
import { CustomAuthenticator } from '../auth/CustomAuthenticator'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

export interface FollowButtonProps {
  userName: string | undefined
  followState: {
    isFollowed: boolean | undefined
    setIsFollowed: Dispatch<SetStateAction<boolean | undefined>>
  }
  setChangedFollowingsCount?: Dispatch<SetStateAction<number | undefined>>
  setChangedFollowersCount?: Dispatch<SetStateAction<number | undefined>>
  width?: number
}

export const FollowButton = ({
  userName,
  followState,
  setChangedFollowingsCount,
  setChangedFollowersCount,
  width,
}: FollowButtonProps) => {
  const router = useRouter()

  const { idToken, isAuthLoading } = useAuthContext()
  const [, setSnackbar] = useSnackbarState()
  const [isOpenAuthForm, setIsOpenAuthForm] = useState<boolean>(false)

  const { isFollowed, setIsFollowed } = followState

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${userName}/relationship`
  const headers = { Authorization: `Bearer ${idToken}` }

  const handleFollow = async () => {
    if (isAuthLoading) return

    if (!idToken) {
      setIsOpenAuthForm(true)
      return
    }

    try {
      await axios.post(url, null, { headers })
      setIsFollowed?.(true)
      setChangedFollowingsCount?.((prev) => (prev ?? 0) + 1)
      setChangedFollowersCount?.((prev) => (prev ?? 0) + 1)
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
      setChangedFollowingsCount?.((prev) => (prev ?? 0) - 1)
      setChangedFollowersCount?.((prev) => (prev ?? 0) - 1)
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
      <Button
        onClick={!isFollowed ? handleFollow : handleUnFollow}
        variant={!isFollowed ? 'outlined' : 'contained'}
        sx={{
          fontSize: 12,
          color: !isFollowed ? 'black' : 'white',
          borderRadius: 2,
          boxShadow: 'none',
          border: !isFollowed ? '1px solid black' : 'none',
          fontWeight: 'bold',
          height: '30px',
          width: width ?? '95px',
          '&:hover': {
            borderColor: !isFollowed ? 'black' : 'primary',
            backgroundColor: !isFollowed ? '#E0E0E0' : 'none',
          },
        }}
      >
        {!isFollowed ? 'フォロー' : 'フォロー中'}
      </Button>

      <CustomAuthenticator
        isOpen={isOpenAuthForm}
        setIsOpen={setIsOpenAuthForm}
      />
    </>
  )
}
