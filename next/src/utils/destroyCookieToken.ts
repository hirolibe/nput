export const destroyCookieToken = async () => {
  const response = await fetch('/api/destroyCookie', {
    method: 'POST',
  })

  if (!response.ok) {
    console.error('クッキーの削除に失敗しました')
  }
}
