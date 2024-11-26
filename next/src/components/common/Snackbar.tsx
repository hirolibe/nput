import { Snackbar, Alert } from '@mui/material'
import Fade from '@mui/material/Fade'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSnackbarState } from '@/hooks/useSnackbarState'

const ResultSnackbar = () => {
  const router = useRouter()
  const [snackbar, setSnackbar] = useSnackbarState()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (snackbar.pathname == router.pathname) {
      setOpen(true)
    }
  }, [snackbar, router])

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
    setTimeout(() => {
      setSnackbar({ message: null, severity: null, pathname: null })
    }, 400)
  }

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        TransitionComponent={Fade}
        transitionDuration={{
          enter: 400,
          exit: 400,
        }}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity || undefined}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ResultSnackbar
