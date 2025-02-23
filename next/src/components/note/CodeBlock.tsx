import CheckIcon from '@mui/icons-material/Check'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { IconButton, Tooltip, Box } from '@mui/material'
import React, { useState } from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash'
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json'
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python'
import ruby from 'react-syntax-highlighter/dist/cjs/languages/prism/ruby'
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript'
import yaml from 'react-syntax-highlighter/dist/cjs/languages/prism/yaml'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

SyntaxHighlighter.registerLanguage('ruby', ruby)
SyntaxHighlighter.registerLanguage('yaml', yaml)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('json', json)

interface CustomCodeProps {
  className?: string
  children?: React.ReactNode
}

const CodeBlock = ({ className, children }: CustomCodeProps) => {
  const [isCopied, setIsCopied] = useState(false)

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
    json: 'json',
  }

  const mappedLanguage = languageMap[language.toLowerCase()] || language

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(children))
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 3000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <Box
      sx={{
        position: 'relative',
        '&:hover .MuiIconButton-root': {
          opacity: 1,
        },
      }}
    >
      <Tooltip title={isCopied ? 'Copied!' : 'Copy code'} placement="top">
        <IconButton
          size="small"
          onClick={handleCopy}
          aria-label="copy code"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            opacity: 0,
            transition: 'opacity 0.2s',
            color: 'text.light',
            '&:hover': {
              color: 'white',
            },
          }}
        >
          {isCopied ? (
            <CheckIcon fontSize="small" />
          ) : (
            <ContentCopyIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>

      <SyntaxHighlighter style={oneDark} language={mappedLanguage}>
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </Box>
  )
}

export default CodeBlock
