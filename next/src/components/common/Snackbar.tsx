import { Snackbar, Alert } from '@mui/material'
import Fade from '@mui/material/Fade'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSnackbarState } from '@/hooks/useSnackbarState'

const NotificationSnackbar = () => {
  const pathname = usePathname()
  const [snackbar, setSnackbar] = useSnackbarState()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (snackbar.pathname == pathname) {
      setOpen(true)
    }
  }, [snackbar, pathname])

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
    setTimeout(() => {
      setSnackbar({
        message: null,
        severity: null,
        pathname: null,
        autoHideDuration: 4000,
      })
    }, 400)
  }

  return (
    <>
      {snackbar.message && snackbar.severity && (
        <Snackbar
          open={open}
          autoHideDuration={
            snackbar.autoHideDuration === undefined
              ? 4000
              : snackbar.autoHideDuration
          }
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
      )}
    </>
  )
}

export default NotificationSnackbar
