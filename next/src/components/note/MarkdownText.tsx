import Image from 'next/image'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import styles from '@/styles/MarkdownText.module.css'

SyntaxHighlighter.registerLanguage('ruby', ruby)
SyntaxHighlighter.registerLanguage('yaml', yaml)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('python', python)

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
      const language = match ? match[1] : 'plaintext'

      const languageMap: { [key: string]: string } = {
        rb: 'ruby',
        ruby: 'ruby',
        yml: 'yaml',
        yaml: 'yaml',
        bash: 'bash',
        sh: 'bash',
        shell: 'bash',
        zsh: 'bash',
        ts: 'typescript',
        typescript: 'typescript',
        py: 'python',
        python: 'python',
        pyc: 'python',
      }

      const mappedLanguage = languageMap[language.toLowerCase()] || language

      return (
        <SyntaxHighlighter style={oneDark} language={mappedLanguage}>
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      )
    },
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
