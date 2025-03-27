// components/note/TableOfContents.tsx
import { Box, Link, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import generateHeadingId from '@/utils/generateHeadingId'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export const TableOfContents = (props: TableOfContentsProps) => {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // 見出しレベルごとに同じ文字列の出現回数を管理
    const headingCounts: { [level: number]: { [text: string]: number } } = {}

    const lines = props.content.split('\n') // マークダウンテキストを行に分割
    let isInCodeBlock = false // コードブロック内かどうかの判定

    // マークダウンテキストから見出しを抽出
    const headings = lines
      .filter((line) => {
        // コードブロックの開始/終了をチェック
        if (line.trim().startsWith('```')) {
          isInCodeBlock = !isInCodeBlock
          return false
        }
        if (isInCodeBlock) return false // コードブロック内の場合はreturn

        return line.startsWith('#') // 見出しを取得する
      })
      .map((line) => {
        const level = line.match(/^#+/)?.[0].length || 0 // 見出しレベルを取得
        const text = line.replace(/^#+\s/, '') // #を削除

        // 取得した見出しレベル初期化
        if (!headingCounts[level]) {
          headingCounts[level] = {}
        }
        headingCounts[level][text] = (headingCounts[level][text] || 0) + 1 // 見出しテキストをカウントする
        const id = generateHeadingId(text, headingCounts[level][text] - 1) // 文字列のIDを生成する
        return { level, text, id }
      })
      .filter((heading) => heading.level <= 2) // h1とh2のみを取得

    setToc(headings)
  }, [props.content])

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = document.querySelectorAll('h1, h2') // ページ内のh1とh2要素を全て取得する

      // 各見出しの位置情報を取得する
      const headingPositions = Array.from(headingElements).map((element) => ({
        id: element.id,
        top: element.getBoundingClientRect().top,
      }))

      const currentHeading =
        headingPositions.find((heading) => heading.top > 0) ||
        headingPositions[0]
      if (currentHeading) {
        setActiveId(currentHeading.id) // 画面内の最初の見出しをアクティブ化する
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [toc])

  if (toc.length === 0) return null

  return (
    <Box
      sx={{
        borderRadius: 2,
        backgroundColor: 'white',
        width: '100%',
        maxHeight: 'calc(100vh - 48px)',
        overflowY: 'auto',
        p: 3,
      }}
    >
      <Typography fontWeight="bold" mb={2}>
        目次
      </Typography>
      <Box component="nav">
        {toc.map((item, index) => (
          <Link
            key={index}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById(item.id)
              if (element) {
                element.scrollIntoView({
                  behavior: 'smooth',
                })
              }
            }}
            sx={{
              display: 'block',
              textDecoration: 'none',
              color: activeId === item.id ? 'primary.main' : 'text.light',
              pl: (item.level - 1) * 2,
              py: 0.5,
              fontSize: '0.9rem',
              borderLeft: activeId === item.id ? '2px solid' : 'none',
              borderColor: 'primary.main',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            {item.text}
          </Link>
        ))}
      </Box>
    </Box>
  )
}
