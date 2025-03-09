import CloseIcon from '@mui/icons-material/Close'
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Modal,
  Tooltip,
  Typography,
} from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useState, Dispatch, SetStateAction } from 'react'
import { CustomAuthenticator } from '../auth/CustomAuthenticator'
import ConfirmDialog from '../common/ConfirmDialog'
import Supporters from '../user/Supporters'
import AnimatedIconWrapper from './AnimatedIconWrapper'
import { CheerIcon } from './CheerIcon'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useCheerPointsContext } from '@/hooks/useCheerPointsContext'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

export interface CheerButtonProps {
  cheerState: {
    isCheered?: boolean
    setIsCheered: Dispatch<SetStateAction<boolean | undefined>>
    cheersCount?: number
    setCheersCount: Dispatch<SetStateAction<number | undefined>>
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
  const { name, slug } = router.query
  const [authorName, noteSlug] = [name, slug].map((value) =>
    typeof value === 'string' ? value : undefined,
  )
  const { idToken, isAuthLoading } = useAuthContext()
  const [, setSnackbar] = useSnackbarState()
  const [isAnimated, setIsAnimated] = useState<boolean>(false)
  const [isOpenAuthForm, setIsOpenAuthForm] = useState<boolean>(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false)
  const { isCheered, setIsCheered, cheersCount, setCheersCount } = cheerState
  const { setCheerPoints } = useCheerPointsContext()
  const [isOpenSupportersList, setIsOpenSupportersList] =
    useState<boolean>(false)

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${authorName}/notes/${noteSlug}/cheer`
  const headers = { Authorization: `Bearer ${idToken}` }

  const handleCheer = async () => {
    if (isAuthLoading) return

    if (!idToken) {
      setIsOpenAuthForm(true)
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

  const handleOpenModal = () => {
    setIsOpenSupportersList(true)
  }

  const handleClose = () => {
    setOpenConfirmDialog(false)
    setIsOpenSupportersList(false)
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
        <Tooltip title="エールしたユーザーを表示">
          <Typography
            onClick={handleOpenModal}
            sx={{
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 'bold',
              color: 'text.light',
              '&:hover': {
                fontWeight: 'bold',
                color: 'black',
              },
            }}
          >
            {cheersCount}
          </Typography>
        </Tooltip>
      </Box>

      <Modal
        open={isOpenSupportersList}
        onClose={handleClose}
        disableScrollLock={true}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 24,
            maxWidth: '600px',
            width: '90%',
            maxHeight: 'calc(100vh - 100px)', // ウィンドウ高さに基づく最大値
            height: 'auto',
            overflowY: 'auto',
          }}
        >
          <Box sx={{ position: 'relative', my: 2 }}>
            <CloseIcon
              onClick={handleClose}
              sx={{
                cursor: 'pointer',
                position: 'absolute',
                right: '30px',
                textAlign: 'end',
                opacity: 0.7,
                '&:hover': { opacity: 1 },
              }}
            />
            <Typography
              sx={{
                textAlign: 'center',
                fontSize: { xs: 16, sm: 18 },
                fontWeight: 'bold',
              }}
            >
              ノートにエールしたユーザー
            </Typography>
          </Box>
          <Divider sx={{ mx: 3 }} />
          <Supporters />
        </Box>
      </Modal>

      <CustomAuthenticator
        isOpen={isOpenAuthForm}
        setIsOpen={setIsOpenAuthForm}
      />

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
