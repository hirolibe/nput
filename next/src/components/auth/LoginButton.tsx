import { Box, Button } from '@mui/material'
import { useState } from 'react'
import { CustomAuthenticator } from './CustomAuthenticator'

interface LoginButtonProps {
  text?: string
}

const LoginButton = (props: LoginButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleOpenModal = () => {
    setIsOpen(true)
  }

  return (
    <Box>
      <Button
        onClick={handleOpenModal}
        variant="contained"
        sx={{
          color: 'white',
          fontSize: { xs: 12, sm: 16 },
          borderRadius: 2,
          boxShadow: 'none',
          fontWeight: 'bold',
        }}
      >
        {props.text || 'ログイン'}
      </Button>

      <CustomAuthenticator isOpen={isOpen} setIsOpen={setIsOpen} />
    </Box>
  )
}

export default LoginButton
