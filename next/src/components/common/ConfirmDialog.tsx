import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { LoadingButton } from '@mui/lab'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material'
import React from 'react'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string | React.ReactNode
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
}

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'ご確認ください',
  message = '実行してよろしいですか？',
  confirmText = 'はい',
  cancelText = 'キャンセル',
  isLoading = false,
}: ConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableScrollLock={true}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          color: 'warning.main',
          px: 4,
        }}
      >
        <WarningAmberIcon color="warning" />
        <Typography variant="h6">{title}</Typography>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            px: 4,
          }}
        >
          <DialogContentText>{message}</DialogContentText>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: 'space-between',
          px: 6,
          pb: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            width: '105px',
            color: 'text.light',
            borderColor: 'text.light',
          }}
        >
          {cancelText}
        </Button>
        <LoadingButton
          onClick={onConfirm}
          loading={isLoading}
          variant="contained"
          color="error"
          sx={{ width: '105px' }}
        >
          {confirmText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
