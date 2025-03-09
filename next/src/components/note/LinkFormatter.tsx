import Link from '@mui/icons-material/Link'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
} from '@mui/material'
import { useState } from 'react'
import { MarkdownToolbarProps } from './MarkdownToolbar'
import { insertMarkdown } from '@/utils/insertMarkdown'

const LinkFormatter = (props: MarkdownToolbarProps) => {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')

  const handleClickOpen = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
    setUrl('')
  }

  const handleInsert = () => {
    if (url) {
      insertMarkdown(props, '[', `](${url})`)
    }
    onClose()
  }

  return (
    <>
      <Tooltip title="リンク">
        <IconButton
          size="small"
          onClick={handleClickOpen}
          sx={{
            width: '46px',
            height: '46px',
            '&:hover': {
              backgroundColor: 'backgroundColor.hover',
            },
          }}
        >
          <Link />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={onClose} disableScrollLock={true} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pt: 3, pb: 1 }}>リンクを挿入</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL"
            type="url"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            pt: 0,
            px: 6,
            pb: 3,
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              width: '105px',
              color: 'text.light',
              borderColor: 'text.light',
            }}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleInsert}
            variant="contained"
            color="primary"
            sx={{ fontWeight: 'bold', color: 'white', width: '105px' }}
          >
            挿入
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default LinkFormatter
