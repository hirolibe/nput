import { Box, Button, Card, Container } from '@mui/material'
import type { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Loading from '@/components/common/Loading'
import SettingTabs from '@/components/user/SettingTabs'
import useEnsureAuth from '@/hooks/useEnsureAuth'
import { styles } from '@/styles'

const SetAccount: NextPage = () => {
  const isAuthorized = useEnsureAuth()

  const router = useRouter()
  const [tabIndex, setTabIndex] = useState<number>(0)

  const handleDelete = () => {
    router.push('/settings/delete_account')
  }

  if (!isAuthorized) {
    return (
      <Box
        css={styles.pageMinHeight}
        sx={{ display: 'flex', justifyContent: 'center' }}
      >
        <Loading />
      </Box>
    )
  }

  return (
    <>
      {/* タブの表示 */}
      <HelmetProvider>
        <Helmet>
          <title>アカウント設定 | Nput</title>
        </Helmet>
      </HelmetProvider>

      <Box
        css={styles.pageMinHeight}
        sx={{
          backgroundColor: 'backgroundColor.page',
          pb: 5,
        }}
      >
        <Container maxWidth="md" sx={{ pt: 5, px: { xs: 2, md: 4 } }}>
          <Card>
            <SettingTabs tabIndex={tabIndex} setTabIndex={setTabIndex} />
            <Box
              sx={{
                px: { xs: 4, sm: 12, md: 20 },
                pt: 4,
                pb: 5,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  onClick={handleDelete}
                  color="error"
                  variant="contained"
                  sx={{
                    color: 'white',
                    fontSize: { xs: 14, sm: 16 },
                    borderRadius: 2,
                    boxShadow: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  アカウントを削除する
                </Button>
              </Box>
            </Box>
          </Card>
        </Container>
      </Box>
    </>
  )
}

export default SetAccount
