import { Box, TextField, Typography } from '@mui/material'
import {
  RefObject,
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react'
import { ControllerFieldState, ControllerRenderProps } from 'react-hook-form'
import MarkdownText from '@/components/note/MarkdownText'
import { NoteFormData } from '@/pages/dashboard/notes/[slug]/edit'

interface ContentBoxProps {
  isPreviewActive: boolean
  openSidebar: boolean
  field: ControllerRenderProps<NoteFormData, 'content'>
  fieldState: ControllerFieldState
  textareaRef: RefObject<HTMLTextAreaElement>
  content: string
  handleContentChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  boxRef: RefObject<HTMLDivElement>
  setScrollPosition: Dispatch<SetStateAction<number>>
}

const ContentBox = ({
  isPreviewActive,
  openSidebar,
  field,
  fieldState,
  textareaRef,
  content,
  handleContentChange,
  boxRef,
  setScrollPosition,
}: ContentBoxProps) => {
  const [textFieldHeight, setTextFieldHeight] = useState<number>(516)
  const [textFieldRows, setTextFieldRows] = useState<number>(21)

  const handleScroll = useCallback(() => {
    if (!boxRef.current) return
    setScrollPosition(boxRef.current.scrollTop)
  }, [boxRef, setScrollPosition])

  useEffect(() => {
    const calculateRows = () => {
      const lineHeight = 23
      const margin = 230

      const calculatedHeight = window.innerHeight - margin
      const minHeight = 516
      const height = Math.max(calculatedHeight, minHeight)
      setTextFieldHeight(height)

      const padding = 33
      const calculatedRows = Math.floor((height - padding) / lineHeight)
      const minRows = 21
      const rows = Math.max(calculatedRows, minRows)
      setTextFieldRows(rows)
    }

    // 初回レンダリング時に計算
    calculateRows()

    // ウィンドウリサイズ時にも再計算
    window.addEventListener('resize', calculateRows)

    return () => window.removeEventListener('resize', calculateRows)
  }, [])

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        width: '100%',
        px: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: textFieldHeight,
        }}
      >
        <Box
          sx={{
            width: {
              xs: isPreviewActive ? 0 : '100%',
              md: openSidebar
                ? isPreviewActive
                  ? 0
                  : '100%'
                : isPreviewActive
                  ? '50%'
                  : '100%',
            },
            height: '100%',
          }}
        >
          <TextField
            {...field}
            type="textarea"
            error={fieldState.invalid}
            helperText={fieldState.error?.message}
            multiline
            fullWidth
            placeholder="本文を入力してください（マークダウン記法）"
            inputRef={textareaRef}
            value={content}
            onChange={(e) => {
              field.onChange(e)
              handleContentChange(e)
            }}
            rows={textFieldRows}
            sx={{
              '& .MuiInputBase-input': {
                fontSize: { xs: 14, md: 16 },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
          />
        </Box>
        <Box
          sx={{
            borderLeft: {
              md: !isPreviewActive || openSidebar ? 0 : '0.5px solid',
            },
            borderLeftColor: { md: 'divider' },
            width: {
              xs: isPreviewActive ? '100%' : 0,
              md: isPreviewActive ? (openSidebar ? '100%' : '50%') : 0,
            },
            height: '100%',
            px: isPreviewActive ? '14px' : 0,
            py: '16.5px',
          }}
        >
          <Box
            ref={boxRef}
            onScroll={handleScroll}
            sx={{
              fontSize: { xs: 14, md: 16 },
              height: '100%',
              overflow: 'auto',
            }}
          >
            {content ? (
              <MarkdownText content={content} />
            ) : (
              <Typography sx={{ color: 'text.placeholder' }}>
                No content
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ContentBox
