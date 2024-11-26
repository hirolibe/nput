import useSWR from 'swr'

export const useSnackbarState = () => {
  type snackbarStateType = {
    message: null | string
    severity: null | 'success' | 'error'
    pathname: null | string
  }

  const fallbackData: snackbarStateType = {
    message: null,
    severity: null,
    pathname: null,
  }
  const { data: snackbar, mutate: setSnackbar } = useSWR('snackbar', null, {
    fallbackData: fallbackData,
  })
  return [snackbar, setSnackbar] as [
    snackbarStateType,
    (value: snackbarStateType) => void,
  ]
}
