import { Avatar, Box, IconButton, Typography } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useState, Dispatch, SetStateAction } from 'react'
import LoginDialog from '../auth/LoginDialog'
import ConfirmDialog from '../common/ConfirmDialog'
import AnimatedIconWrapper from './AnimatedIconWrapper'
import { CheerIcon } from './CheerIcon'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'
import { useProfileContext } from '@/hooks/useProfileContext'

export interface CheerButtonProps {
  cheerState: {
    isCheered: boolean | undefined
    setIsCheered: Dispatch<SetStateAction<boolean | undefined>>
    cheersCount: number
    setCheersCount: Dispatch<SetStateAction<number>>
  }
  boxParams?: { flexDirection?: string; gap?: number }
  backgroundColor?: string
  cheerIconSize?: number
}

export const CheerButton = ({
  cheerState,
  boxParams,
  backgroundColor = 'backgroundColor.icon',
  cheerIconSize,
}: CheerButtonProps) => {
  const router = useRouter()
  const { name, id } = router.query
  const [authorName, noteId] = [name, id].map((value) =>
    typeof value === 'string' ? value : undefined,
  )
  const { idToken, isAuthLoading } = useAuthContext()
  const [, setSnackbar] = useSnackbarState()
  const [isAnimated, setIsAnimated] = useState(false)
  const [openLoginDialog, setOpenLoginDialog] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const { isCheered, setIsCheered, cheersCount, setCheersCount } = cheerState
  const { setCheerPoints } = useProfileContext()

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${authorName}/notes/${noteId}/cheer`
  const headers = { Authorization: `Bearer ${idToken}` }

  const handleCheer = async () => {
    if (isAuthLoading) return

    if (!idToken) {
      setOpenLoginDialog(true)
      return
    }

    if (!isCheered) {
      try {
        await axios.post(url, null, { headers })
        setIsCheered?.(true)
        setCheersCount?.((prev) => (prev ?? 0) + 1)
        setCheerPoints?.((prev) => (prev ?? 0) - 360)
        setIsAnimated?.(true)
        setTimeout(() => {
          setIsAnimated?.(false)
        }, 1000)
      } catch (err) {
        const { errorMessage } = handleError(err)
        setSnackbar({
          message: errorMessage,
          severity: 'error',
          pathname: router.pathname,
        })
      }
    } else {
      setOpenConfirmDialog(true)
    }
  }

  const handleConfirm = async () => {
    try {
      await axios.delete(url, { headers })
      setIsCheered?.(false)
      setCheersCount?.((prev) => (prev ?? 0) - 1)
    } catch (err) {
      const { errorMessage } = handleError(err)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: router.pathname,
      })
    } finally {
      setOpenConfirmDialog(false)
    }
  }

  const handleClose = () => {
    setOpenLoginDialog(false)
    setOpenConfirmDialog(false)
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: boxParams?.flexDirection || 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: boxParams?.gap || 0,
        }}
      >
        <Avatar sx={{ width: '50px', height: '50px' }}>
          <IconButton
            onClick={handleCheer}
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: backgroundColor,
              border: 'none',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: 'backgroundColor.hover',
              },
              '&:active': {
                backgroundColor: backgroundColor,
              },
            }}
          >
            {isCheered !== undefined && (
              <AnimatedIconWrapper isAnimated={isAnimated}>
                <CheerIcon isCheered={isCheered} size={cheerIconSize} />
              </AnimatedIconWrapper>
            )}
          </IconButton>
        </Avatar>
        <Typography sx={{ fontSize: 12 }}>{cheersCount}</Typography>
      </Box>

      <LoginDialog open={openLoginDialog} onClose={handleClose} />

      <ConfirmDialog
        open={openConfirmDialog}
        onClose={handleClose}
        onConfirm={handleConfirm}
        message={
          <>
            エールに使用したポイントは戻りませんが、
            <br />
            エールを取り消しますか？
          </>
        }
        confirmText="実行"
      />
    </>
  )
}
