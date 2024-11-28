import { isAxiosError, AxiosError } from 'axios'
import { FirebaseError } from 'firebase/app'

const handleAxiosError = (err: AxiosError): string => {
  type ErrorData = { message?: string; error?: string }

  const isErrorData = (data: unknown): data is ErrorData => {
    return (
      typeof data === 'object' &&
      data !== null &&
      ('message' in data || 'error' in data)
    )
  }

  if (err.response) {
    const { data, status } = err.response
    if (isErrorData(data)) {
      return (
        data.message ||
        `Error: ${status} ${data.error || '不明なエラーが発生しました'}`
      )
    }
    return `Error: ${status} サーバーから予期しない応答がありました`
  }

  if (err.request) {
    return 'ネットワークエラーが発生しました　ネットワーク接続を確認してください'
  }

  return 'リクエストの設定に問題があります'
}

const handleFirebaseError = (err: FirebaseError): string => {
  if (err.code === 'auth/invalid-credential') {
    return '認証情報が無効です'
  }

  return `Firebaseエラー: ${err.message}`
}

export const handleError = (err: unknown): string => {
  if (isAxiosError(err)) {
    console.error(err)
    return handleAxiosError(err)
  }

  if (err instanceof FirebaseError) {
    console.error(err)
    return handleFirebaseError(err)
  }

  if (err instanceof Error) {
    console.error(err.message)
    return err.message
  }

  console.error(String(err))

  return '不明なエラーが発生しました　サポートにお問い合わせください'
}
