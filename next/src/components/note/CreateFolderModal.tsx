import { Modal, Box, Typography, TextField, Button, Stack } from '@mui/material'
import { useState } from 'react'

interface CreateFolderModalProps {
  isOpen: boolean
  handleClose: () => void
  onSave: (folderName: string) => Promise<void>
}

const CreateFolderModal = (props: CreateFolderModalProps) => {
  const { isOpen, handleClose, onSave } = props
  const [folderName, setFolderName] = useState('')
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!folderName.trim()) {
      setError('フォルダ名を入力してください')
      return
    }

    await onSave(folderName)

    setFolderName('')
    setError('')
    handleClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value)
  }

  return (
    <Modal
      open={isOpen}
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
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography variant="h6" component="h2" mb={2}>
          フォルダの新規作成
        </Typography>

        <TextField
          autoFocus
          fullWidth
          label="フォルダ名"
          variant="outlined"
          value={folderName}
          onChange={handleChange}
          error={!!error}
          helperText={error}
          sx={{ mb: 3 }}
        />

        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button variant="outlined" onClick={handleClose} sx={{ color: 'text.light', borderColor: 'text.light' }}>
            キャンセル
          </Button>
          <Button variant="contained" onClick={handleSave} color="primary" sx={{ color: 'white' }}>
            新規作成
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}

export default CreateFolderModal
