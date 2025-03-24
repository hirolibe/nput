import { Box, Modal } from '@mui/material'
import Image from 'next/image'
import { useRef, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import CodeBlock from './CodeBlock'
import { H1, H2 } from './Heading'
import styles from '@/styles/MarkdownText.module.css'

interface MarkdownTextProps {
  content: string
  className?: string
}

interface HeadingCounts {
  [level: number]: { [text: string]: number }
}

const MarkdownText = ({ content, className = '' }: MarkdownTextProps) => {
  const headingCounts = useRef<HeadingCounts>({}) // 同じ文字列の出現回数を管理
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{
    src: string
    alt: string
  } | null>(null)

  const handleImageClick = (src: string, alt: string) => {
    setSelectedImage({ src, alt })
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const customComponents: Components = useMemo(
    () => ({
      code: CodeBlock,
      img: ({ src, alt = 'image', width }) => {
        if (!src) return null

        return (
          <Box sx={{ cursor: 'pointer' }}>
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
    }),
    [],
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
        {content}
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
