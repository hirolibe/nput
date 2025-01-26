export const setCookieToken = async (token: string) => {
  const response = await fetch('/api/setCookie', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  })

  if (!response.ok) {
    console.error('クッキーの保存に失敗しました')
  }
}
