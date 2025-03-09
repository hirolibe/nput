import { Box, Container, Divider, Paper, Typography } from '@mui/material'
import { GetStaticProps, NextPage } from 'next'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Error from '@/components/common/Error'
import MarkdownText from '@/components/note/MarkdownText'
import { styles } from '@/styles'
import getDocumentText from '@/utils/getDocumentText'
import { handleError } from '@/utils/handleError'

interface TermsProps {
  termsText: string
  error?: {
    statusCode: number | null
    errorMessage: string | null
  }
}

// ISRによる利用規約のバージョン取得
export const getStaticProps: GetStaticProps = async () => {
  try {
    const { termsText } = await getDocumentText()

    return {
      props: { termsText },
      revalidate: 60 * 60 * 24 * 365, // 1年間キャッシュする
    }
  } catch (err) {
    const { statusCode, errorMessage } = handleError(err)

    return {
      props: {
        termsText: '',
        error: { statusCode, errorMessage },
      },
    }
  }
}

const Terms: NextPage<TermsProps> = (props) => {
  const { termsText, error } = props

  if (error) {
    const { statusCode, errorMessage } = error
    return <Error statusCode={statusCode} errorMessage={errorMessage} />
  }

  return (
    <>
      {/* タブの表示 */}
      <HelmetProvider>
        <Helmet>
          <title>利用規約 | Nput</title>
        </Helmet>
      </HelmetProvider>

      <Box
        css={styles.pageMinHeight}
        sx={{ backgroundColor: 'backgroundColor.page' }}
      >
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper sx={{ p: { xs: 4, sm: 6 } }}>
            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                fontSize: { xs: 22, sm: 28 },
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              利用規約
            </Typography>
            <Divider sx={{ mb: 4 }} />
            <MarkdownText content={termsText} />
          </Paper>
        </Container>
      </Box>
    </>
  )
}

export default Terms
