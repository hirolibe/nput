import { useCallback } from 'react'
import { handleError } from '@/utils/handleError'

export const useLocalStorage = (key: string) => {
  // 入力内容を保存
  const saveContent = (content: string) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, content)
      }
    } catch (err) {
      handleError(err)
    }
  }

  // 保存した内容を読み込み
  const loadSavedContent = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key) || ''
      }
    } catch (error) {
      handleError(error)
    }
    return ''
  }, [key])

  // 保存した内容を削除
  const removeSavedContent = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key)
      }
    } catch (err) {
      handleError(err)
    }
  }

  return { saveContent, loadSavedContent, removeSavedContent }
}
