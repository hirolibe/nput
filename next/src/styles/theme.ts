import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface PaletteOptions {
    backgroundColor: {
      page: string
      icon: string
      hover: string
      draft: string
      cta: string
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
      main: '#50A0B4',
    },
    secondary: {
      main: '#B9DFE7',
    },
    error: {
      main: '#E63946',
    },
    divider: '#acbcc7',
    backgroundColor: {
      page: '#E3E8F1',
      icon: '#EDF2F7',
      hover: '#E0E0E0',
      draft: '#9E9E9E',
      cta: '#E3F3F6',
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
