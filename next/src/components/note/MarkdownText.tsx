import { Box } from '@mui/material'
import Image from 'next/image'
import { useRef, MutableRefObject } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import CodeBlock from './CodeBlock'
import styles from '@/styles/MarkdownText.module.css'
import generateHeadingId from '@/utils/generateHeadingId'

interface MarkdownTextProps {
  content: string
  className?: string
}

interface HeadingCounts {
  [level: number]: { [text: string]: number }
}

interface HeadingProps {
  children?: React.ReactNode
  level: number
  headingCounts: MutableRefObject<HeadingCounts>
}

const Heading = ({ children, level, headingCounts }: HeadingProps) => {
  const text = children?.toString() ?? ''

  // レベルごとのカウントを初期化
  if (!headingCounts.current[level]) {
    headingCounts.current[level] = {}
  }

  // レベルごとのテキストカウントを更新
  headingCounts.current[level][text] =
    (headingCounts.current[level][text] ?? 0) + 1

  const id = generateHeadingId(text, headingCounts.current[level][text] - 1)

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

  return <HeadingTag id={id}>{children}</HeadingTag>
}

// H1とH2コンポーネント
const H1 = (props: Omit<HeadingProps, 'level'>) => (
  <Heading {...props} level={1} />
)

const H2 = (props: Omit<HeadingProps, 'level'>) => (
  <Heading {...props} level={2} />
)

const MarkdownText = ({ content, className = '' }: MarkdownTextProps) => {
  const headingCounts = useRef<HeadingCounts>({}) // 同じ文字列の出現回数を管理

  const customComponents: Components = {
    code: CodeBlock,
    img: ({ src, alt = 'image', width }) => {
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
    a: ({ href, children }) => {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    },
    h1: (props) => <H1 {...props} headingCounts={headingCounts} />,
    h2: (props) => <H2 {...props} headingCounts={headingCounts} />,
  }

  return (
    <Box
      sx={{
        '& h1, & h2': {
          scrollMarginTop: '80px',
        },
      }}
    >
      <ReactMarkdown
        components={customComponents}
        className={`${styles.markdownText} ${className}`}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
      >
        {content}
      </ReactMarkdown>
    </Box>
  )
}

export default MarkdownText
