import useSWR from 'swr'

interface snackbarStateType {
  message: null | string
  severity: null | 'success' | 'error' | 'info'
  pathname: null | string
  autoHideDuration?: null | number
}

export const useSnackbarState = () => {
  const fallbackData: snackbarStateType = {
    message: null,
    severity: null,
    pathname: null,
    autoHideDuration: 4000,
  }
  const { data: snackbar, mutate: setSnackbar } = useSWR('snackbar', null, {
    fallbackData: fallbackData,
  })
  return [snackbar, setSnackbar] as [
    snackbarStateType,
    (value: snackbarStateType) => void,
  ]
}
