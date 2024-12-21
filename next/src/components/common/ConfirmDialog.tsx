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

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = 'ご確認ください',
  message = '実行してよろしいですか？',
  confirmText = 'はい',
  cancelText = 'キャンセル',
  confirmColor = 'error',
}) => {
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
          pb: 2,
          justifyContent: 'space-between',
          px: 6,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          sx={{ width: '105px' }}
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
