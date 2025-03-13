import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined'
import { Box, IconButton, Tooltip } from '@mui/material'
import axios from 'axios'
import { useRouter, usePathname, useParams } from 'next/navigation'
import { useState } from 'react'
import ConfirmDialog from '../common/ConfirmDialog'
import { useAuthContext } from '@/hooks/useAuthContext'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { handleError } from '@/utils/handleError'

interface NoteEditorButtonsProps {
  isPreviewActive: boolean
  togglePreviewDisplay: () => void
  toggleSidebar: () => void
  name?: string
}

const NoteEditorButtons = ({
  isPreviewActive,
  togglePreviewDisplay,
  toggleSidebar,
  name,
}: NoteEditorButtonsProps) => {
  const [, setSnackbar] = useSnackbarState()
  const { idToken } = useAuthContext()

  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const slug = params?.slug
  const noteSlug = typeof slug === 'string' ? slug : undefined

  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] =
    useState<boolean>(false)
  const [noteSlugToDelete, setNoteSlugToDelete] = useState<string | null>(null)

  const handleDeleteNote = (noteSlug?: string) => {
    if (!noteSlug) return

    setNoteSlugToDelete(noteSlug)
    setOpenDeleteConfirmDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!noteSlugToDelete) return

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/my_notes/${noteSlug}`
    const headers = { Authorization: `Bearer ${idToken}` }

    try {
      const res = await axios.delete(url, { headers })
      const message = res.data.message

      // ノート詳細データを再検証
      await axios.post('/api/revalidate', {
        path: `/${name}/notes/${slug}`,
      })

      setSnackbar({
        message: message,
        severity: 'success',
        pathname: '/dashboard',
      })

      router.push('/dashboard')
    } catch (err) {
      const { errorMessage } = handleError(err)

      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: pathname,
      })
    } finally {
      setOpenDeleteConfirmDialog(false)
    }
  }

  const handleCloseDeleteConfirmDialog = () => {
    setOpenDeleteConfirmDialog(false)
  }

  const buttonStyles = {
    backgroundColor: 'white',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    width: '46px',
    height: '46px',
    '&:hover': {
      backgroundColor: 'backgroundColor.hover',
    },
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        position: 'fixed',
        width: '300px',
        bottom: '30px',
        transition: '0.2s',
        zIndex: 1000,
      }}
    >
      <Tooltip
        title={!isPreviewActive ? 'プレビューを表示' : 'エディタのみ表示'}
      >
        <IconButton
          onClick={togglePreviewDisplay}
          sx={{
            ...buttonStyles,
            backgroundColor: !isPreviewActive ? 'white' : 'primary.main',
          }}
        >
          <PlayArrowOutlinedIcon
            sx={{
              fontSize: 30,
              color: !isPreviewActive ? undefined : 'white',
            }}
          />
        </IconButton>
      </Tooltip>

      <Tooltip title="タグ・概要を登録">
        <IconButton onClick={toggleSidebar} sx={buttonStyles}>
          <SellOutlinedIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="ノートを削除">
        <IconButton
          onClick={() => handleDeleteNote(noteSlug)}
          sx={buttonStyles}
        >
          <DeleteOutlineIcon sx={{ color: '#f28b82' }} />
        </IconButton>
      </Tooltip>

      {/* ノート削除の確認画面 */}
      <ConfirmDialog
        open={openDeleteConfirmDialog}
        onClose={handleCloseDeleteConfirmDialog}
        onConfirm={handleDeleteConfirm}
        message={'ノートを削除しますか？'}
        confirmText="実行"
      />
    </Box>
  )
}

export default NoteEditorButtons
