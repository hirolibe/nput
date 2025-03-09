import CloseIcon from '@mui/icons-material/Close'
import { Box, Divider, Modal, Typography } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'

interface DescriptionModalProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  title: string
  description: string
}

const DescriptionModal = (props: DescriptionModalProps) => {
  const { isOpen, setIsOpen, title, description } = props

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <Modal open={isOpen} onClose={handleClose} disableScrollLock={true}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          px: 3,
          pt: 2,
          pb: 3,
          borderRadius: 2,
          boxShadow: 24,
          width: '600px',
          maxWidth: '90%',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CloseIcon
            onClick={handleClose}
            sx={{
              cursor: 'pointer',
              opacity: 0.7,
              '&:hover': { opacity: 1 },
            }}
          />
        </Box>
        <Typography sx={{ fontSize: 18, fontWeight: 'bold', px: 3, mb: 1 }}>
          {title}
        </Typography>
        <Divider sx={{ mx: 3, mb: 3 }} />
        <Typography sx={{ px: 4, mb: 2 }}>{description}</Typography>
      </Box>
    </Modal>
  )
}

export default DescriptionModal
