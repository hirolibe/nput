import { MarkdownToolbarProps } from '@/components/note/MarkdownToolbar'

export const insertMarkdown = (
  props: MarkdownToolbarProps,
  before: string,
  after?: string,
) => {
  const { textareaRef, content, onContentChange, saveContent, setIsChanged } =
    props

  const textarea = textareaRef.current

  if (!textarea) return

  const scrollPosition = textarea.scrollTop

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = content.substring(start, end)
  const newText =
    content.substring(0, start) +
    before +
    selectedText +
    (after ?? '') +
    content.substring(end)

  onContentChange(newText)

  const newCursorPosition = end + before.length

  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(newCursorPosition, newCursorPosition)
    textarea.scrollTop = scrollPosition
  }, 0)

  saveContent?.(newText)
  setIsChanged?.(true)
}
