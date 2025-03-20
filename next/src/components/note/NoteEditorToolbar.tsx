import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp'
import { LoadingButton } from '@mui/lab'
import { Toolbar, Box, Fade, Stack, Typography, Switch } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { useRouter } from 'next/navigation'
import { useState, Dispatch, SetStateAction } from 'react'
import ConfirmDialog from '../common/ConfirmDialog'
import CheerPoints from '@/components/common/CheerPoints'
import DisplayDuration from '@/components/note/DisplayDuration'

interface NoteEditorToolbarProps {
  openSidebar: boolean
  statusChecked: boolean
  isLoading: boolean
  isChanged: boolean
  setStatusChecked: Dispatch<SetStateAction<boolean>>
}

export const NoteEditorToolbar = ({
  openSidebar,
  statusChecked,
  isLoading,
  isChanged,
  setStatusChecked,
}: NoteEditorToolbarProps) => {
  const [openBackConfirmDialog, setOpenBackConfirmDialog] =
    useState<boolean>(false)

  const router = useRouter()

  const onBackClick = () => {
    if (isChanged) {
      setOpenBackConfirmDialog(true)
      return
    }
    router.push('/dashboard')
  }

  const handleBackConfirm = () => {
    setOpenBackConfirmDialog(false)
    router.push('/dashboard')
  }

  const handleCloseBackConfirmDialog = () => {
    setOpenBackConfirmDialog(false)
  }

  const onStatusChange = () => {
    setStatusChecked(!statusChecked)
  }

  return (
    <Toolbar
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'margin 0.2s',
        marginRight: openSidebar ? '385px' : 0,
      }}
    >
      <Box sx={{ maxWidth: 35 }}>
        <IconButton onClick={onBackClick}>
          <ArrowBackSharpIcon />
        </IconButton>
      </Box>
      <Fade in={true} timeout={{ enter: 100 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box>
            <Stack direction={'row'} spacing={2} sx={{ mr: 2 }}>
              <Box
                sx={{
                  display: {
                    xs: 'none',
                    md: openSidebar ? 'none' : 'flex',
                  },
                  alignItems: 'center',
                }}
              >
                <CheerPoints />
              </Box>
              <Box
                sx={{
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 'bold',
                    my: 0.7,
                  }}
                >
                  作成時間
                </Typography>
                <DisplayDuration />
              </Box>
            </Stack>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                alignItems: 'center',
                textAlign: 'center',
                width: '78px',
                mr: 2,
                mt: 1,
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 'bold' }}>
                {statusChecked ? 'アウトプット' : 'インプット'}
              </Typography>
              <Switch checked={statusChecked} onChange={onStatusChange} />
            </Box>
            <LoadingButton
              variant={statusChecked ? 'contained' : 'outlined'}
              type="submit"
              loading={isLoading}
              sx={{
                color: statusChecked ? 'white' : 'primary',
                fontWeight: 'bold',
                fontSize: { xs: 14, md: 16 },
                border: statusChecked ? 'none' : '2px solid',
                borderRadius: 2,
                width: { xs: '105px', md: '110px' },
                height: '40px',
              }}
            >
              {statusChecked ? '公開する' : '記録する'}
            </LoadingButton>
          </Box>
        </Box>
      </Fade>

      {/* 変更内容破棄の確認画面 */}
      <ConfirmDialog
        open={openBackConfirmDialog}
        onClose={handleCloseBackConfirmDialog}
        onConfirm={handleBackConfirm}
        message={'変更内容を保存せずに編集を終了しますか？'}
        confirmText="終了"
      />
    </Toolbar>
  )
}
