import Image from 'next/image'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import styles from '@/styles/MarkdownText.module.css'

interface MarkdownTextProps {
  content: string
  className?: string
}

interface CustomCodeProps {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

const MarkdownText: React.FC<MarkdownTextProps> = ({
  content,
  className = '',
}) => {
  const customComponents: Components = {
    code(props: CustomCodeProps) {
      const { inline, className, children } = props
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <SyntaxHighlighter style={oneDark} language={match[1]}>
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className}>{children}</code>
      )
    },
    img({ src, alt = 'image', width }) {
      if (!src) return null
      if (typeof width !== 'number') return null

      return (
        <div style={{ margin: '16px' }}>
          <Image
            src={src}
            alt={alt}
            width={Number(width)}
            height={1}
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px',
            }}
            unoptimized
          />
        </div>
      )
    },
    a({ href, children }) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    },
  }

  return (
    <ReactMarkdown
      components={customComponents}
      className={`${styles.markdownText} ${className}`}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
    >
      {content}
    </ReactMarkdown>
  )
}

export default MarkdownText
