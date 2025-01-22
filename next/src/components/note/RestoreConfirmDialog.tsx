import CloseIcon from '@mui/icons-material/Close'
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
} from '@mui/material'
import { SxProps, Theme } from '@mui/material/styles'
import React from 'react'

interface DiffLine {
  currentLine: string
  savedLine: string
  isDifferent: boolean
}

const getDiffLines = (
  currentContent: string,
  savedContent: string,
): DiffLine[] => {
  const currentLines = currentContent.split('\n')
  const savedLines = savedContent.split('\n')
  const maxLength = Math.max(currentLines.length, savedLines.length)
  const diffLines: DiffLine[] = []

  for (let i = 0; i < maxLength; i++) {
    const currentLine = currentLines[i] || ''
    const savedLine = savedLines[i] || ''
    if (currentLine === '' && savedLine === '') continue
    diffLines.push({
      currentLine,
      savedLine,
      isDifferent: currentLine !== savedLine,
    })
  }

  return diffLines
}

interface DiffLineViewProps {
  line: DiffLine
}

const DiffLineView = ({ line }: DiffLineViewProps) => {
  const isSmScreen = useMediaQuery('(max-width:600px)')

  const baseStyles = {
    p: 1,
    minHeight: '1rem',
    fontSize: '0.875rem',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    flex: 1,
    position: 'relative',
  }

  const getDiffStyles = (isLeft: boolean): SxProps<Theme> => ({
    ...baseStyles,
    borderLeft: '0.5px solid',
    borderColor: 'divider',
    bgcolor: line.isDifferent
      ? isLeft
        ? '#FEE2E2'
        : '#DCFCE7'
      : 'transparent',
    pl: 3,
    py: 0.5,
  })

  const renderHighlightedContent = (
    content: string,
    comparisonContent: string,
    isLeft: boolean,
  ) => {
    const contentChars = content.split('')
    const comparisonChars = comparisonContent.split('')

    return contentChars.map((char, index) => {
      const isDifferent = char !== comparisonChars[index]
      const backgroundColor = isDifferent
        ? isLeft
          ? '#FB7185' // より濃い赤
          : '#4ADE80' // より濃い緑
        : undefined

      return (
        <Typography
          component="span"
          key={index}
          sx={{
            display: 'inline-block',
            lineHeight: '1.5rem',
            backgroundColor: backgroundColor,
            transition: 'background-color 0.2s',
          }}
        >
          {char}
        </Typography>
      )
    })
  }

  const diffLine = (
    content: string,
    comparisonContent: string,
    isLeft: boolean,
  ) => (
    <Box sx={getDiffStyles(isLeft)}>
      {line.isDifferent && (
        <Typography
          component="span"
          sx={{
            position: 'absolute',
            left: '8px',
            fontWeight: 300,
          }}
        >
          {isLeft ? '-' : '+'}
        </Typography>
      )}
      {renderHighlightedContent(content, comparisonContent, isLeft)}
    </Box>
  )

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
      }}
    >
      {diffLine(line.currentLine, line.savedLine, true)}
      {!isSmScreen
        ? diffLine(line.savedLine, line.currentLine, false)
        : line.currentLine !== line.savedLine &&
          diffLine(line.savedLine, line.currentLine, false)}
    </Box>
  )
}

interface DiffContentProps {
  diffLines: DiffLine[]
}

const DiffContent = ({ diffLines }: DiffContentProps) => {
  const isSmScreen = useMediaQuery('(max-width:600px)')

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: '#F8FAFC',
        }}
      >
        {!isSmScreen && (
          <>
            <Typography sx={{ flex: 1, p: 1 }}>
              現在のエディターの内容
            </Typography>
            <Typography
              sx={{
                flex: 1,
                borderLeft: '0.5px solid',
                borderColor: 'divider',
                p: 1,
              }}
            >
              自動保存の内容
            </Typography>
          </>
        )}
        {isSmScreen && <Typography sx={{ flex: 1, p: 1 }}>変更点</Typography>}
      </Box>
      {diffLines.map((line, index) => (
        <DiffLineView key={index} line={line} />
      ))}
    </Box>
  )
}

interface AutoSaveDialogProps {
  open: boolean
  onClose: () => void
  onReject: () => void
  onRestore: () => void
  currentContent: string
  savedContent: string
}

export const AutoSaveDialog = ({
  open,
  onClose,
  onReject,
  onRestore,
  currentContent,
  savedContent,
}: AutoSaveDialogProps) => {
  const diffLines = React.useMemo(
    () => getDiffLines(currentContent, savedContent),
    [currentContent, savedContent],
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Box
          sx={{
            border: '0.5px solid',
            borderColor: 'divider',
            width: '100%',
            mt: 4,
          }}
        >
          <DiffContent diffLines={diffLines} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 4, mb: 3 }}>
        <Button
          onClick={onReject}
          variant="outlined"
          sx={{
            fontSize: { xs: 12, sm: 14 },
            fontWeight: 'bold',
            borderRadius: 2,
            border: '2px solid',
            width: '100px',
            height: { xs: '33px', sm: '36.5px' },
            mr: 2,
          }}
        >
          削除する
        </Button>
        <Button
          onClick={onRestore}
          variant="contained"
          color="primary"
          sx={{
            fontSize: { xs: 12, sm: 14 },
            fontWeight: 'bold',
            color: 'white',
            borderRadius: 2,
            boxShadow: 'none',
            width: '100px',
          }}
        >
          復元する
        </Button>
      </DialogActions>
    </Dialog>
  )
}
