import { CacheProvider, EmotionCache } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { AppProps } from 'next/app'
import { HelmetProvider } from 'react-helmet-async'
import Header from '@/components/common/Header'
import Snackbar from '@/components/common/Snackbar'
import '@/styles/destyle.css'
import { AuthProvider } from '@/providers/AuthProvider'
import { ProfileProvider } from '@/providers/ProfileProvider'
import createEmotionCache from '@/styles/createEmotionCache'
import theme from '@/styles/theme'

const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps): JSX.Element {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <HelmetProvider>
          <AuthProvider>
            <ProfileProvider>
              <CssBaseline />
              <Header />
              <Component {...pageProps} />
              <Snackbar />
            </ProfileProvider>
          </AuthProvider>
        </HelmetProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}
