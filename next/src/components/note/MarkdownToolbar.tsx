import Code from '@mui/icons-material/Code'
import FormatBold from '@mui/icons-material/FormatBold'
import FormatListBulleted from '@mui/icons-material/FormatListBulleted'
import TableChart from '@mui/icons-material/TableChart'
import FormatHeader from '@mui/icons-material/Title'
import { IconButton, Stack, Tooltip, useMediaQuery } from '@mui/material'
import React from 'react'
import {
  UploadImagesButton,
  UploadImagesButtonProps,
} from '../common/UploadImagesButton'
import LinkFormatter from './LinkFormatter'

interface MarkdownToolbarProps extends UploadImagesButtonProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>
  onContentChange: (newContent: string) => void
  content: string
}

const MarkdownToolbar = (props: MarkdownToolbarProps) => {
  const { textareaRef, onContentChange, content } = props
  const isSmScreen = useMediaQuery('(max-width:600px)')

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end)

    onContentChange(newText)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const formatters = [
    {
      title: '見出し',
      icon: <FormatHeader />,
      action: () => insertMarkdown('# ', ''),
    },
    {
      title: '太字',
      icon: <FormatBold />,
      action: () => insertMarkdown('**', '**'),
    },
    {
      title: 'リスト',
      icon: <FormatListBulleted />,
      action: () => insertMarkdown('- '),
    },
  ]

  if (!isSmScreen) {
    formatters.push(
      {
        title: 'コード',
        icon: <Code />,
        action: () => insertMarkdown('```\n', '\n```'),
      },
      {
        title: 'テーブル',
        icon: <TableChart />,
        action: () =>
          insertMarkdown(
            '| Header 1 | Header 2 | Header 3 |\n| --------- | --------- | --------- |\n| Row 1    | Row 1    | Row 1    |\n',
          ),
      },
    )
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        position: 'sticky',
        top: 64,
        zIndex: 10,
        backgroundColor: 'white',
        borderBottom: 0.5,
        borderColor: 'divider',
        px: 2,
        py: 1,
      }}
    >
      {formatters.map((formatter) => (
        <Tooltip key={formatter.title} title={formatter.title}>
          <IconButton
            size="small"
            onClick={formatter.action}
            sx={{
              width: '46px',
              height: '46px',
              '&:hover': {
                backgroundColor: 'backgroundColor.hover',
              },
            }}
          >
            {formatter.icon}
          </IconButton>
        </Tooltip>
      ))}
      <LinkFormatter insertMarkdown={insertMarkdown} />
      <UploadImagesButton {...props} />
    </Stack>
  )
}

export default MarkdownToolbar
