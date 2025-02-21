import { MutableRefObject } from 'react'
import generateHeadingId from '@/utils/generateHeadingId'

export interface HeadingCounts {
  [level: number]: { [text: string]: number }
}

export interface HeadingProps {
  children?: React.ReactNode
  level: number
  headingCounts: MutableRefObject<HeadingCounts>
}

export const Heading = ({ children, level, headingCounts }: HeadingProps) => {
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

export const H1 = (props: Omit<HeadingProps, 'level'>) => (
  <Heading {...props} level={1} />
)

export const H2 = (props: Omit<HeadingProps, 'level'>) => (
  <Heading {...props} level={2} />
)
