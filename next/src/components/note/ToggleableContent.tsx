import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import CodeBlock from './CodeBlock'
import styles from '@/styles/MarkdownText.module.css'

interface ToggleableContentProps {
  summary: string
  children?: React.ReactNode
  markdownContent?: string
}

export const ToggleableContent = (props: ToggleableContentProps) => {
  const { summary, children, markdownContent } = props
  const [isOpen, setIsOpen] = useState(false)

  // markdownContentが提供されている場合は、ReactMarkdownを使用して直接レンダリング
  const renderContent = () => {
    if (markdownContent) {
      return (
        <ReactMarkdown
          components={{ code: CodeBlock }}
          className={styles.markdownText}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
        >
          {markdownContent}
        </ReactMarkdown>
      )
    }
    return children
  }

  return (
    <div className="toggleable-content">
      <div
        className="toggle-summary"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          padding: '8px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          marginBottom: isOpen ? '8px' : '0',
        }}
      >
        <span style={{ marginRight: '8px' }}>{isOpen ? '▼' : '▶'}</span>
        <strong>{summary}</strong>
      </div>
      {isOpen && <div className="toggle-content">{renderContent()}</div>}
    </div>
  )
}
