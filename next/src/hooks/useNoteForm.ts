import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { useLocalStorage } from './useLocalStorage'

interface NoteFormData {
  title: string
  description: string
  content: string
  status?: string
  tags: string[]
}

export interface UseNoteForm {
  form: UseFormReturn<NoteFormData>
  content: string
  setContent: (content: string) => void
  isChanged: boolean
  restoreContent: string
  handleContentChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  handleRestore: () => void
  handleRejectRestore: () => void
}

export const useNoteForm = (initialData?: NoteFormData) => {
  const router = useRouter()
  const { slug } = router.query
  const noteSlug = typeof slug === 'string' ? slug : undefined

  const [content, setContent] = useState<string>(initialData?.content || '')
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [restoreContent, setRestoreContent] = useState<string>('')

  const { saveContent, loadSavedContent } = useLocalStorage(noteSlug ?? '')

  const form = useForm<NoteFormData>({
    defaultValues: initialData,
  })

  const {
    formState: { isDirty },
  } = form

  useEffect(() => {
    const savedContent = loadSavedContent()
    if (savedContent) {
      setRestoreContent(savedContent)
    }
  }, [loadSavedContent])

  useEffect(() => {
    setIsChanged(isDirty)
  }, [isDirty])

  const handleContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = e.target.value
    setContent(newValue)
    if (!restoreContent) {
      saveContent(newValue)
    }
  }

  return {
    form,
    content,
    setContent,
    isChanged,
    restoreContent,
    handleContentChange,
  }
}
