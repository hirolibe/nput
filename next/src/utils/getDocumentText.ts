import axios from 'axios'
import getDocumentVersion from './getDocumentVersion'

const getDocumentText = async () => {
  // バージョン情報を取得
  const versionData = await getDocumentVersion()
  const { termsVersion, privacyVersion } = versionData

  // 利用規約のテキストを取得
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || ''
  const termsResponse = await axios.post(`${baseUrl}/api/document-text`, {
    documentName: 'terms',
    version: termsVersion,
  })

  // プライバシーポリシーのテキストを取得
  const privacyResponse = await axios.post(`${baseUrl}/api/document-text`, {
    documentName: 'privacy',
    version: privacyVersion,
  })

  // レスポンスデータを返す
  return {
    termsText: termsResponse.data.text,
    privacyText: privacyResponse.data.text,
  }
}

export default getDocumentText
