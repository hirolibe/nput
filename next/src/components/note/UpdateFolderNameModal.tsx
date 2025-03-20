import { Modal, Box, Typography, TextField, Button, Stack } from '@mui/material'
import { Dispatch, SetStateAction, useState } from 'react'

interface UpdateFolderNameModalProps {
  isOpen: boolean
  handleClose: () => void
  onUpdate: (folderName: string) => Promise<void>
  folderName: string
  setFolderName: Dispatch<SetStateAction<string>>
}

const UpdateFolderNameModal = (props: UpdateFolderNameModalProps) => {
  const { isOpen, handleClose, onUpdate, folderName, setFolderName } = props
  const [error, setError] = useState('')

  const handleUpdate = async () => {
    if (!folderName.trim()) {
      setError('フォルダ名を入力してください')
      return
    }

    await onUpdate(folderName)

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
          フォルダ名の変更
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
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ color: 'text.light', borderColor: 'text.light' }}
          >
            キャンセル
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdate}
            color="primary"
            sx={{ color: 'white' }}
          >
            更新する
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}

export default UpdateFolderNameModal
