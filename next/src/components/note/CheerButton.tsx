import { Avatar, Box, IconButton, Typography } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useState, Dispatch, SetStateAction } from 'react'
import AnimatedIconWrapper from './AnimatedIconWrapper'
import { CheerIcon } from './CheerIcon'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import { useAuth } from '@/hooks/useAuth'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

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
  const [nameString, idString] = [name, id].map((value) =>
    typeof value === 'string' ? value : undefined,
  )
  const { idToken, isAuthLoading } = useAuth()
  const [, setSnackbar] = useSnackbarState()
  const [isAnimated, setIsAnimated] = useState(false)
  const [open, setOpen] = useState(false)
  const { isCheered, setIsCheered, cheersCount, setCheersCount } = cheerState

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${nameString}/notes/${idString}/cheer`
  const headers = { Authorization: `Bearer ${idToken}` }

  const handleCheer = async () => {
    if (isAuthLoading) return

    if (!idToken) {
      setSnackbar({
        message: 'ログインしてください',
        severity: 'error',
        pathname: router.pathname,
      })
    }

    if (!isCheered) {
      try {
        await axios.post(url, null, { headers })
        setIsCheered?.(true)
        setCheersCount?.((prev) => (prev ?? 0) + 1)
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
      handleOpen()
    }
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
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
      setOpen(false)
    }
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

      <ConfirmationDialog
        open={open}
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
