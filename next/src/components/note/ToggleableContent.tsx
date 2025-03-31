import { Box, Paper, Collapse } from '@mui/material'
import React, { useState } from 'react'
import MarkdownText from './MarkdownText'
import styles from '@/styles/MarkdownText.module.css'

interface ToggleableContentProps {
  summary: string
  children?: React.ReactNode
  markdownContent?: string
}

export const ToggleableContent = (props: ToggleableContentProps) => {
  const { summary, children, markdownContent } = props
  const [isOpen, setIsOpen] = useState(false)

  // トグル内のコンテンツ
  const toggleContent = markdownContent ? (
    <MarkdownText content={markdownContent} className={styles.markdownText} />
  ) : (
    children
  )

  return (
    <Box sx={{ mb: 2 }}>
      <Paper
        elevation={0}
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          p: 1,
          backgroundColor: 'grey.100',
        }}
      >
        <Box
          sx={{
            mr: 1,
            fontFamily: 'monospace',
            fontSize: '1rem',
            lineHeight: 1,
          }}
        >
          {isOpen ? '▼' : '▶'}
        </Box>
        <Box fontWeight="bold">{summary}</Box>
      </Paper>
      <Collapse in={isOpen}>
        <Box sx={{ py: 1 }}>{toggleContent}</Box>
      </Collapse>
    </Box>
  )
}
