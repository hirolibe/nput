import { Box, Button, Card, Container, Typography } from '@mui/material'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import SettingTabs from '@/components/user/SettingTabs'
import useEnsureAuth from '@/hooks/useAuthenticationCheck'
import { styles } from '@/styles'

const SetAccount: NextPage = () => {
  useEnsureAuth()

  const router = useRouter()
  const [tabIndex, setTabIndex] = useState<number>(0)

  const handleDelete = () => {
    router.push('/settings/delete_account')
  }

  return (
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
            <Typography
              sx={{ fontSize: { xs: 18, sm: 20 }, fontWeight: 'bold', mb: 3 }}
            >
              アカウントの削除
            </Typography>
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
  )
}

export default SetAccount
