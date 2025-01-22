import { handleError } from '@/utils/handleError'

export const useLocalStorage = (key: string) => {
  // 入力内容を保存
  const saveContent = (content: string) => {
    try {
      localStorage.setItem(key, content)
    } catch (err) {
      handleError(err)
    }
  }

  // 保存した内容を読み込み
  const loadSavedContent = (): string => {
    try {
      return localStorage.getItem(key) || ''
    } catch (err) {
      handleError(err)
      return ''
    }
  }

  // 保存した内容を削除
  const removeSavedContent = () => {
    try {
      localStorage.removeItem(key)
    } catch (err) {
      handleError(err)
    }
  }

  return { saveContent, loadSavedContent, removeSavedContent }
}
