import WarningAmberIcon from '@mui/icons-material/WarningAmber'
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
  confirmColor?: 'error' | 'primary' | 'secondary' | 'warning'
}

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'ご確認ください',
  message = '実行してよろしいですか？',
  confirmText = 'はい',
  cancelText = 'キャンセル',
  confirmColor = 'error',
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
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
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          sx={{ width: '105px' }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
