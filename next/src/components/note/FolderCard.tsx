import CloseIcon from '@mui/icons-material/Close'
import { Box, CardContent, Divider, Modal, Typography } from '@mui/material'
import { useState } from 'react'
import FiledNotes from './FiledNotes'
import { FolderData } from '@/hooks/useFolders'

const FolderCard = (props: FolderData) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleCardClick = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <Box onClick={handleCardClick} sx={{ cursor: 'pointer' }}>
        <CardContent
          sx={{
            display: 'flex',
            justifyContent: 'center',
            px: 4,
            pt: 3,
            height: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Typography
              component="h3"
              sx={{
                textAlign: 'center',
                fontSize: { xs: 16, sm: 20 },
                fontWeight: 'bold',
                width: '100%',
              }}
            >
              {props.name}
            </Typography>
            <Typography
              sx={{
                textAlign: 'center',
                fontSize: { xs: 12, sm: 14 },
                color: 'text.light',
                width: '100%',
              }}
            >
              ノート数：{props.notesCount}件
            </Typography>
          </Box>
        </CardContent>
      </Box>

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
              {`フォルダ「${props.name}」のノート一覧`}
            </Typography>
          </Box>
          <Divider sx={{ mx: 3 }} />
          <FiledNotes folderSlug={props.slug} />
        </Box>
      </Modal>
    </>
  )
}

export default FolderCard
