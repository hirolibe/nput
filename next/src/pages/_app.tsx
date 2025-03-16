import { Authenticator } from '@aws-amplify/ui-react'
import { CacheProvider, EmotionCache } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { Amplify } from 'aws-amplify'
import { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
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

outputs.auth.oauth.domain =
  process.env.NEXT_PUBLIC_COGNITO_DOMAIN ?? 'auth.n-put.com'
outputs.auth.oauth.scopes = ['email', 'openid']
Amplify.configure(outputs)

const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps): JSX.Element {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const ogpImageUrl = `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/twitter-card-logo.png`

  return (
    <>
      <DefaultSeo
        defaultTitle="Nput | プログラミング学習の支援サービス"
        description="Nputはプログラミング初学者がモチベーションを高めながら学習を継続し、効率的に知識を深められるように支援します。"
        openGraph={{
          type: 'website',
          title: 'Nput',
          description:
            'Nputはプログラミング初学者がモチベーションを高めながら学習を継続し、効率的に知識を深められるように支援します。',
          site_name: 'Nput',
          url: 'https://n-put.com',
          images: [
            {
              url: `${ogpImageUrl}`,
              width: 300,
              height: 300,
              alt: 'Nputのロゴ',
              type: 'image/png',
            },
          ],
        }}
        twitter={{
          handle: '@hirolibe0930',
          site: '@hirolibe0930',
          cardType: 'summary',
        }}
      />
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
    </>
  )
}
