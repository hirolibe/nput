const getDocumentVersion = async () => {
  const isServer = typeof window === 'undefined'
  const baseUrl = isServer ? process.env.NEXT_PUBLIC_FRONTEND_BASE_URL : ''

  const response = await fetch(`${baseUrl}/api/document-version`)

  if (!response.ok) {
    throw new Error('バージョン情報の取得に失敗しました')
  }

  return await response.json()
}

export default getDocumentVersion
