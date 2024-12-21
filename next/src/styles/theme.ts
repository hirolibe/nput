import { red } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface PaletteOptions {
    backgroundColor: {
      page: string
      icon: string
      hover: string
    }
  }
  interface TypeText {
    light: string
    placeholder: string
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#3EA8FF',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    divider: '#acbcc7',
    backgroundColor: {
      page: '#e6f2ff',
      icon: '#EDF2F7',
      hover: '#E0E0E0',
    },
    text: {
      light: '#6E7B85',
      placeholder: '#9E9E9E',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1300, // デフォルト1536px
    },
  },
})

export default theme
