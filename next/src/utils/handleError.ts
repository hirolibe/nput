import { isAxiosError, AxiosError } from 'axios'

const handleAxiosError = (
  err: AxiosError,
): { statusCode: number | null; errorMessage: string | null } => {
  interface ErrorResponse {
    error?: string
    errors?: string[]
  }

  const isErrorResponse = (data: unknown): data is ErrorResponse => {
    return (
      typeof data === 'object' &&
      data !== null &&
      ('error' in data || 'errors' in data)
    )
  }

  if (err.response) {
    const { data, status } = err.response
    if (isErrorResponse(data)) {
      const errorMessage = data.error || data.errors?.join(' ')

      return {
        statusCode: status,
        errorMessage: errorMessage || null,
      }
    }

    return {
      statusCode: status,
      errorMessage: `サーバーから予期しない応答がありました`,
    }
  }

  if (err.request) {
    return {
      statusCode: 0,
      errorMessage: 'ネットワークエラーが発生しました',
    }
  }

  return {
    statusCode: 500,
    errorMessage: '不明なエラーが発生しました',
  }
}

export const handleError = (
  err: unknown,
): { statusCode: number | null; errorMessage: string | null } => {
  if (isAxiosError(err)) {
    console.error(err)
    return handleAxiosError(err)
  }

  if (err instanceof Error) {
    console.error(err)
    return {
      statusCode: 500,
      errorMessage: err.message,
    }
  }

  console.error(String(err))

  return {
    statusCode: 500,
    errorMessage: '不明なエラーが発生しました',
  }
}
