import Code from '@mui/icons-material/Code'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FormatBold from '@mui/icons-material/FormatBold'
import TableChart from '@mui/icons-material/TableChart'
import FormatHeader from '@mui/icons-material/Title'
import { IconButton, Stack, Tooltip, useMediaQuery } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { UploadImagesButton } from '../common/UploadImagesButton'
import LinkFormatter from './LinkFormatter'
import { insertMarkdown } from '@/utils/insertMarkdown'

export interface MarkdownToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>
  content: string
  onContentChange: (newContent: string) => void
  setImageSignedIds: Dispatch<SetStateAction<string | string[] | undefined>>
  saveContent?: (content: string) => void
  setIsChanged?: Dispatch<SetStateAction<boolean>>
}

export const MarkdownToolbar = (props: MarkdownToolbarProps) => {
  const isSmScreen = useMediaQuery('(max-width:600px)')

  const formatters = [
    {
      title: '見出し',
      icon: <FormatHeader />,
      action: () => insertMarkdown(props, '# ', ''),
    },
    {
      title: '太字',
      icon: <FormatBold />,
      action: () => insertMarkdown(props, '**', '**'),
    },
    {
      title: 'トグル',
      icon: <ExpandMoreIcon />,
      action: () => insertMarkdown(props, ':::toggle タイトル\n', '\n:::'),
    },
  ]

  if (!isSmScreen) {
    formatters.push(
      {
        title: 'コード',
        icon: <Code />,
        action: () => insertMarkdown(props, '```\n', '\n```'),
      },
      {
        title: 'テーブル',
        icon: <TableChart />,
        action: () =>
          insertMarkdown(
            props,
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
        backgroundColor: 'white',
        borderBottom: 0.5,
        borderBottomColor: 'divider',
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
      <LinkFormatter {...props} />
      <UploadImagesButton {...props} />
    </Stack>
  )
}
