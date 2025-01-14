import { Box, Container, Paper, Typography } from '@mui/material'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import MarkdownText from '@/components/note/MarkdownText'
import { styles } from '@/styles'

const Terms: NextPage = () => {
  const [markdownContent, setMarkdownContent] = useState('')
  useEffect(() => {
    const fetchMarkdown = async () => {
      const response = await fetch('/terms/terms-v1.md')
      const text = await response.text()
      setMarkdownContent(text)
    }

    fetchMarkdown()
  }, [])

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
                mb: 4,
              }}
            >
              利用規約
            </Typography>
            <MarkdownText content={markdownContent} />
          </Paper>
        </Container>
      </Box>
    </>
  )
}

export default Terms
