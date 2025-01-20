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

type LinkFormatterProps = {
  insertMarkdown: (before: string, after?: string) => void
}

const LinkFormatter = ({ insertMarkdown }: LinkFormatterProps) => {
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
      insertMarkdown('[', `](${url})`)
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
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
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
            color="secondary"
            sx={{ width: '105px' }}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleInsert}
            variant="contained"
            color="secondary"
            sx={{ width: '105px' }}
          >
            挿入
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default LinkFormatter
