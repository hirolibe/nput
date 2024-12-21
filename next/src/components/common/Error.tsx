import { Container, Link, Stack, Typography } from '@mui/material'

type ErrorProps = {
  statusCode?: number | null
  errorMessage?: string | null
}

const Error = ({ statusCode, errorMessage }: ErrorProps) => {
  return (
    <Container maxWidth="md">
      <Stack spacing={3} sx={{ p: 3, textAlign: 'center' }}>
        {statusCode !== 0 && <Typography variant="h1">{statusCode}</Typography>}
        {errorMessage && <Typography variant="h5">{errorMessage}</Typography>}
        {statusCode === 404 && (
          <Typography variant="body1">
            このページは移動もしくは削除された可能性があります。URLに間違いがないかご確認ください。
          </Typography>
        )}
        {(statusCode === 0 || statusCode === 500) && (
          <Typography variant="body1">
            現在、技術的な問題が発生しています。しばらくしてから再度お試しください。
          </Typography>
        )}
        <Link href="/" color="primary">
          トップページに戻る
        </Link>
      </Stack>
    </Container>
  )
}

export default Error
