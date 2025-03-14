import { Authenticator } from '@aws-amplify/ui-react'
import { CacheProvider, EmotionCache } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { Amplify } from 'aws-amplify'
import { AppProps } from 'next/app'
import { HelmetProvider } from 'react-helmet-async'
import outputs from '../../amplify_outputs.json'
import Footer from '@/components/common/Footer'
import Header from '@/components/common/Header'
import Snackbar from '@/components/common/Snackbar'
import '@/styles/destyle.css'
import { AuthProvider } from '@/providers/AuthProvider'
import { CheerPointsProvider } from '@/providers/CheerPointsProvider'
import { ProfileProvider } from '@/providers/ProfileProvider'
import createEmotionCache from '@/styles/createEmotionCache'
import theme from '@/styles/theme'
import '@aws-amplify/ui-react/styles.css'
import '@/styles/globals.css'

outputs.auth.oauth.domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN ?? ''
Amplify.configure(outputs)
console.log(outputs)

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
          <Authenticator.Provider>
            <AuthProvider>
              <ProfileProvider>
                <CheerPointsProvider>
                  <CssBaseline />
                  <Header />
                  <Component {...pageProps} />
                  <Snackbar />
                  <Footer />
                </CheerPointsProvider>
              </ProfileProvider>
            </AuthProvider>
          </Authenticator.Provider>
        </HelmetProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}
