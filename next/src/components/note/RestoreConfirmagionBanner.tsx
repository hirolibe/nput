import { Box, Button, Typography } from '@mui/material'
import { useParams } from 'next/navigation'
import { useState, Dispatch, SetStateAction } from 'react'
import { RestoreConfirmDialog } from './RestoreConfirmDialog'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface RestoreConfirmationBannerProps {
  openSidebar: boolean
  content: string
  setContent: Dispatch<SetStateAction<string>>
  restoreContent: string
  setRestoreContent: Dispatch<SetStateAction<string>>
}

export const RestoreConfirmationBanner = ({
  openSidebar,
  content,
  setContent,
  restoreContent,
  setRestoreContent,
}: RestoreConfirmationBannerProps) => {
  const params = useParams()
  const slug = params?.slug
  const noteSlug = typeof slug === 'string' ? slug : undefined
  const { removeSavedContent } = useLocalStorage(noteSlug || '')

  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false)

  const onConfirm = () => {
    setOpenConfirmDialog(true)
  }

  const onClose = () => {
    setOpenConfirmDialog(false)
  }

  const onRestore = () => {
    setContent(restoreContent)
    setRestoreContent('')
    onClose()
  }

  const onReject = () => {
    removeSavedContent()
    setRestoreContent('')
    onClose()
  }

  const buttonStyles = {
    fontSize: { xs: 12, sm: 14 },
    fontWeight: 'bold',
    color: 'text.light',
    boxShadow: 'none',
    borderRadius: 50,
    backgroundColor: 'white',
    width: '90px',
    height: '30px',
    '&:hover': {
      boxShadow: 'none',
      backgroundColor: 'backgroundColor.hover',
    },
  }

  return (
    <Box sx={{ backgroundColor: 'secondary.main' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60px',
          pl: 2,
          pr: openSidebar ? 4 : 2,
          py: 2,
          mb: { xs: 1, sm: 3 },
        }}
      >
        <Box
          sx={{
            display: { sm: 'flex' },
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: 14,
              fontWeight: 'bold',
              color: 'text.light',
              mr: { xs: 0, sm: 3 },
              mb: { xs: 1, sm: 0 },
            }}
          >
            保存されていないデータがあります
          </Typography>
          <Box sx={{ textAlign: { xs: 'center', sm: undefined } }}>
            <Button
              onClick={onReject}
              variant="contained"
              sx={{ ...buttonStyles, mr: 2 }}
            >
              削除する
            </Button>
            <Button onClick={onConfirm} variant="contained" sx={buttonStyles}>
              確認する
            </Button>
          </Box>
        </Box>
      </Box>

      <RestoreConfirmDialog
        open={openConfirmDialog}
        onReject={onReject}
        onRestore={onRestore}
        onClose={onClose}
        currentContent={content}
        restoreContent={restoreContent}
      />
    </Box>
  )
}
