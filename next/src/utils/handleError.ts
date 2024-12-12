import { isAxiosError, AxiosError } from 'axios'
import { FirebaseError } from 'firebase/app'

const handleAxiosError = (
  err: AxiosError,
): { statusCode: number | null; errorMessage: string | null } => {
  type ErrorResponse = { error?: string; errors?: string[] }

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

const handleFirebaseError = (
  err: FirebaseError,
): { statusCode: number; errorMessage: string } => {
  if (err.code === 'auth/invalid-credential') {
    return {
      statusCode: 401,
      errorMessage: '認証情報が無効です',
    }
  }

  return {
    statusCode: 400,
    errorMessage: err.message,
  }
}

export const handleError = (
  err: unknown,
): { statusCode: number | null; errorMessage: string | null } => {
  if (isAxiosError(err)) {
    console.error(err)
    return handleAxiosError(err)
  }

  if (err instanceof FirebaseError) {
    console.error(err)
    return handleFirebaseError(err)
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
