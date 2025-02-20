import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import CodeBlock from './CodeBlock'
import styles from '@/styles/MarkdownText.module.css'

interface MarkdownTextProps {
  content: string
  className?: string
}

const MarkdownText = ({ content, className = '' }: MarkdownTextProps) => {
  const customComponents: Components = {
    code: CodeBlock,
    img({ src, alt = 'image', width }) {
      if (!src) return null
      if (typeof width !== 'number') return null

      return (
        <Image
          src={src}
          alt={alt}
          width={Number(width)}
          height={1}
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: 2,
            margin: '16px 0',
          }}
          unoptimized
        />
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
