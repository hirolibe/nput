import { Box, Container, Divider, Grid, Stack, Typography } from '@mui/material'
import { GetStaticProps, NextPage } from 'next'
import Image from 'next/image'
import LoginButton from '@/components/auth/LoginButton'
import { useProfile } from '@/hooks/useProfile'

// SSGによるAboutページのmeta情報取得
export const getStaticProps: GetStaticProps = async () => {
  // _app.tsxへpagePropsとして渡す
  const headData = {
    title: `Nputとは？ | プログラミング学習の支援サービス`,
    description:
      'Nputはプログラミング初学者がモチベーションを高めながら学習を継続し、効率的に知識を深められるように支援します。',
    url: 'https://n-put.com/about',
    type: 'website',
    twitterCard: 'summary',
  }

  return {
    props: { headData },
    revalidate: 60 * 60 * 24 * 365, // 1年間キャッシュする
  }
}

const About: NextPage = () => {
  const { profileData } = useProfile()

  const features = [
    {
      title: '記録する',
      description:
        '学習内容と学習時間を簡単に記録できます。充実したノートエディタと自動タイマー機能により、あなたの学習を効率的にサポートします。',
      image: '/record.svg',
      alt: '記録機能',
    },
    {
      title: '共有する',
      description:
        '学習ノートをアウトプットしてコミュニティに貢献しましょう。フィードバックによってあなた自身の学びも深化します。',
      image: '/share.svg',
      alt: '共有機能',
    },
    {
      title: '応援する',
      description:
        '同じ道を歩む仲間たちを応援しましょう。あなたのエールが学習継続と成長の支えになります。',
      image: '/cheer.svg',
      alt: '応援機能',
    },
  ]

  return (
    <>
      {/* ヒーローセクション */}
      <Box
        sx={{
          py: { xs: 8, md: 14 },
          mb: 10,
          backgroundImage: 'url("/hero.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4} alignItems="center" sx={{ textAlign: 'center' }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 32, sm: 40, md: 48 },
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              Bridge Input and Output
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                maxWidth: 'md',
                fontSize: { xs: 16, md: 18 },
                color: 'white',
                px: 2,
              }}
            >
              あなたの学びに付加価値を。
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* 機能一覧セクション */}
      <Container maxWidth="md" sx={{ px: { xs: 4, sm: 20, md: 0 }, mb: 10 }}>
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            fontSize: { xs: 24, md: 32 },
            fontWeight: 'bold',
            mb: { xs: 6 },
          }}
        >
          学習サポート機能
        </Typography>

        <Stack spacing={{ xs: 6, md: 10 }}>
          {features.map((feature, index) => (
            <Grid
              key={index}
              container
              spacing={{ xs: 0, md: 4 }}
              alignItems="center"
              sx={{
                flexDirection: {
                  xs: 'column', // xs (モバイル)サイズでは常に column方向
                  md: index % 2 === 0 ? 'row' : 'row-reverse', // md以上のサイズでは index によって row または row-reverse
                },
              }}
            >
              <Grid item xs={12} md={8}>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: { xs: 24, md: 28 },
                      fontWeight: 'bold',
                      mb: 2,
                      color: 'primary.main',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: { xs: 4, md: 0 } }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: 180,
                    height: 180,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    src={feature.image}
                    width={200}
                    height={200}
                    alt={feature.alt}
                    quality={90}
                  />
                </Box>
              </Grid>
            </Grid>
          ))}
        </Stack>
      </Container>
      {profileData && <Divider />}

      {/* CTAセクション */}
      {!profileData && (
        <Box
          sx={{
            backgroundColor: 'backgroundColor.cta',
            py: { xs: 6, md: 8 },
          }}
        >
          <Container maxWidth="md">
            <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center' }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: 24, md: 32 },
                  fontWeight: 'bold',
                }}
              >
                Join Nput
              </Typography>
              <Typography sx={{ maxWidth: 'sm', px: { xs: 4, sm: 0 } }}>
                Nputコミュニティで、仲間と共に学び、成長する喜びを体験しましょう！
              </Typography>
              <LoginButton text={'今すぐはじめる'} />
            </Stack>
          </Container>
        </Box>
      )}
    </>
  )
}

export default About
