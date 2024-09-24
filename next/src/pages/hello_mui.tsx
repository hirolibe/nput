import { Button } from '@mui/material'
import type { NextPage } from 'next'

const HelloMui: NextPage = () => {
  return (
    <>
      <Button
        variant="contained"
        sx={{ p: 6, ml: 2, mt: 3, color: 'white', textTransform: 'none' }}
      >
        Hello Mui@v5!
      </Button>
    </>
  )
}

export default HelloMui
