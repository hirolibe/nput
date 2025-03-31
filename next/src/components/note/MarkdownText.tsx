import { Box, Modal } from '@mui/material'
import Image from 'next/image'
import { useRef, useMemo, useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import CodeBlock from './CodeBlock'
import { H1, H2 } from './Heading'
import { ToggleableContent } from './ToggleableContent'
import styles from '@/styles/MarkdownText.module.css'

interface MarkdownTextProps {
  content: string
  className?: string
}

interface HeadingCounts {
  [level: number]: { [text: string]: number }
}

interface ToggleSection {
  summary: string
  content: string
}

const MarkdownText = ({ content, className = '' }: MarkdownTextProps) => {
  const headingCounts = useRef<HeadingCounts>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{
    src: string
    alt: string
  } | null>(null)

  const handleImageClick = useCallback((src: string, alt: string) => {
    setSelectedImage({ src, alt })
    setModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
  }, [])

  // トグルセクションの抽出と処理
  const processedContent = useMemo(() => {
    const togglePattern = /:::toggle\s+(.*?)\n([\s\S]*?):::/g
    let processedText = content
    const toggleSections: ToggleSection[] = []
    let match

    // 正規表現でトグルセクションを抽出
    while ((match = togglePattern.exec(content)) !== null) {
      const summary = match[1].trim()
      const toggleContent = match[2].trim()
      const id = `toggle-${toggleSections.length}`
      toggleSections.push({ summary, content: toggleContent })

      // トグルセクションをプレースホルダーに置き換え
      processedText = processedText.replace(match[0], `{{${id}}}`)
    }

    return { text: processedText, toggles: toggleSections }
  }, [content])

  const customComponents: Components = useMemo(
    () => ({
      code: CodeBlock,
      img: ({ src, alt = 'image', width }) => {
        if (!src) return null

        return (
          <Box
            sx={{
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Image
              src={src}
              alt={alt}
              width={Number(width) || 700}
              height={1}
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 2,
                margin: '16px 0',
              }}
              onClick={() => handleImageClick(src, alt)}
              unoptimized
            />
          </Box>
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
      p: ({ children }) => {
        // トグルセクションのプレースホルダーを検出
        if (
          typeof children === 'string' &&
          children.match(/^\{\{toggle-\d+\}\}$/)
        ) {
          const id = children.slice(2, -2)
          const index = parseInt(id.split('-')[1])
          const toggleData = processedContent.toggles[index]

          if (toggleData) {
            return (
              <ToggleableContent
                summary={toggleData.summary}
                markdownContent={toggleData.content}
              />
            )
          }
        }
        return <p>{children}</p>
      },
    }),
    [processedContent.toggles, handleImageClick],
  )

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
        {processedContent.text}
      </ReactMarkdown>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="image-modal"
        aria-describedby="fullscreen-image-view"
        onClick={handleCloseModal}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60vw',
            height: '80vh',
            bgcolor: 'background.paper',
            border: 'none',
            borderRadius: 2,
            boxShadow: 24,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {selectedImage && (
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
              width={1000}
              height={1000}
              unoptimized
            />
          )}
        </Box>
      </Modal>
    </Box>
  )
}

export default MarkdownText
