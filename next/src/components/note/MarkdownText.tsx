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
  className?: string
  children?: React.ReactNode
}

const MarkdownText = ({ content, className = '' }: MarkdownTextProps) => {
  const customComponents: Components = {
    code(props: CustomCodeProps) {
      const { className, children } = props
      const isInline = !String(children).includes('\n')
      if (isInline) {
        return <code className={className}>{children}</code>
      }

      const match = /language-(\w+)/.exec(className || '')
      if (!match) {
        return (
          <SyntaxHighlighter style={oneDark} language={'plaintext'}>
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        )
      }

      return (
        <SyntaxHighlighter style={oneDark} language={match[1]}>
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
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
              borderRadius: 2,
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
