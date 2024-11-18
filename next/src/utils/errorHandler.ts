import { isAxiosError } from 'axios'

export const handleError = (err: unknown) => {
  let errorMessage =
    '不明なエラーが発生しました　サポートにお問い合わせください'

  if (isAxiosError(err)) {
    if (err.response) {
      const errorData = err.response.data
      errorMessage =
        errorData.message ||
        `Error: ${err.response.status} ${err.response.data.error}`
    } else if (err.request) {
      errorMessage =
        'ネットワークエラーが発生しました　ネットワーク接続を確認してください'
    }
  } else {
    errorMessage = err instanceof Error ? err.message : String(err)
  }

  console.error(errorMessage)
}
