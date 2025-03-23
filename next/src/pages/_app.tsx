import { Authenticator } from '@aws-amplify/ui-react'
import { CacheProvider, EmotionCache } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { Amplify } from 'aws-amplify'
import { AppProps } from 'next/app'
import Script from 'next/script'
import { DefaultSeo } from 'next-seo'
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
  const { headData, ...restPageProps } = pageProps

  const safeHeadData = {
    title: 'Nput | プログラミング学習の支援サービス',
    description:
      'Nputはプログラミング初学者がモチベーションを高めながら学習を継続し、効率的に知識を深められるように支援します。',
    url: 'https://n-put.com',
    type: 'website',
    twitterCard: 'summary',
    ...headData, // pagePropsのheadDataで上書き
  }

  const noteDescription =
    headData?.description?.replace(/\*/g, '').replace(/#/g, '') ||
    `${headData?.user.profile.nickname || headData?.user.name}さんのノート`

  const ogpImageUrl = `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/twitter-card-logo.png`

  return (
    <>
      <DefaultSeo
        defaultTitle={safeHeadData?.title}
        description={
          headData?.description ? noteDescription : safeHeadData.description
        }
        openGraph={{
          title: safeHeadData.title,
          description: headData?.description
            ? noteDescription
            : safeHeadData.description,
          url: safeHeadData?.url,
          type: safeHeadData.type,
          site_name: 'Nput',
          images: safeHeadData.images ?? [
            {
              url: `${ogpImageUrl}`,
              alt: 'Nputのロゴ',
              type: 'image/png',
            },
          ],
        }}
        twitter={{
          site: '@hirolibe0930',
          cardType: safeHeadData?.twitterCard,
        }}
      />
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <Authenticator.Provider>
            <AuthProvider>
              <ProfileProvider>
                <CheerPointsProvider>
                  <CssBaseline />
                  <Header />
                  {/* Google Analytics */}
                  <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-RLWW0VGGNE"
                    strategy="afterInteractive"
                  />
                  <Script id="google-analytics" strategy="afterInteractive">
                    {`
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', 'G-RLWW0VGGNE');
                    `}
                  </Script>
                  <Component {...restPageProps} />
                  <Snackbar />
                  <Footer />
                </CheerPointsProvider>
              </ProfileProvider>
            </AuthProvider>
          </Authenticator.Provider>
        </ThemeProvider>
      </CacheProvider>
    </>
  )
}
